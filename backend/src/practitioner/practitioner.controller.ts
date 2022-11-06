import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AccessTokenGuard } from 'src/common/guards';

import { PractitionerService } from './practitioner.service';

import { CreatePracDto } from './dto/createPrac.dto';
import { UpdatePracDto } from './dto/updatePrac.dto';

import { GetUser } from 'src/user/getUser.decorator';
import { User } from 'src/user/schemas/user.schema';

@Controller('/api/v1/practitioner')
@UseGuards(AccessTokenGuard)
export class PractitionerController {
  constructor(private readonly practitionerService: PractitionerService) {}

  @Post('create')
  async createPractitioner(
    @Body() createPracDto: CreatePracDto,
    @GetUser() user: User,
  ) {
    const {
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
    } = createPracDto;
    return await this.practitionerService.createPractitioner(
      user._id,
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
    );
  }

  @Delete(':practitionerId')
  async deletePractitioner(
    @Param('practitionerId') practitionerId: string,
    @GetUser() user: User,
  ) {
    return await this.practitionerService.deletePractitioner(
      user._id,
      practitionerId,
    );
  }

  @Put(':practitionerId')
  @UseInterceptors(FileInterceptor('image'))
  async updatePractitioner(
    @Param('practitionerId') practitionerId: string,
    @Body() updatePracDto: UpdatePracDto,
    @GetUser() user: User,
  ) {
    console.log({ updatePracDto });
    const {
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
      isICUSpecialist,
    } = updatePracDto;
    return await this.practitionerService.updatePractitioner(
      user._id,
      practitionerId,
      name,
      email,
      contact,
      dob,
      workingDays,
      startTime,
      endTime,
      image,
      isICUSpecialist,
    );
  }

  @Get('viewAll')
  async getPractitionerList(@GetUser() user: User) {
    return await this.practitionerService.getPractitionerList(user._id);
  }

  @Get(':practitionerId')
  async getPractitioner(
    @Param('practitionerId') practitionerId: string,
    @GetUser() user: User,
  ) {
    return await this.practitionerService.getPractitionerDetail(
      user._id,
      practitionerId,
    );
  }

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @GetUser() user: User) {
    const image = file;
    return await this.practitionerService.uploadImage(user._id, image);
  }
}
