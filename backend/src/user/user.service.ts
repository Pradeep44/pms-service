import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcryptjs';

import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const user = new this.userModel({
      email,
      password,
      isVerified: false,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const { accessToken, refreshToken } = await this.getTokens(user._id);
    await this.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
      email: user.email,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, refreshToken } = await this.getTokens(user._id);
    await this.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: User) {
    return await this.userModel.updateOne(
      { _id: user._id },
      { refreshToken: null },
    );
  }

  async getTokens(userId) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        { userId },
        {
          expiresIn: 60 * 60 * 24,
          secret: '123',
        },
      ),
      this.jwtService.sign(
        { userId },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: '123',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async getFreshTokens(user: User) {
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(
    userId: mongoose.Types.ObjectId,
    refreshToken: string,
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await await bcrypt.hash(refreshToken, salt);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async findOneById(userId: string) {
    return this.userModel.findById(userId);
  }
}
