import { IsEmail } from 'class-validator';

export class GenerateResetPasswordDto {
  @IsEmail()
  email: string;
}
