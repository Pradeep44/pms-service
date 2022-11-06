import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';

import { GetUser } from './getUser.decorator';

import { AccessTokenGuard, RefreshTokenGuard } from 'src/common/guards';
import { User } from './schemas/user.schema';

@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { email, password } = signupDto;
    return await this.userService.signup(email, password);
  }

  @Post('login')
  async login(@Body() loginDto: SignupDto) {
    const { email, password } = loginDto;
    return await this.userService.login(email, password);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async getFreshTokens(@GetUser() user: User) {
    return await this.userService.getFreshTokens(user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@GetUser() user: User) {
    return await this.userService.logout(user);
  }
}
