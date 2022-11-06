import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class PracDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  contact: string;

  @IsNotEmpty()
  dob: string;

  @IsNotEmpty()
  workingDays: string[];

  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  image: string;

  @IsOptional()
  isICUSpecialist: boolean;
}
