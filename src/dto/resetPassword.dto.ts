import { IsEmail, Length } from 'class-validator';

export class ResetPasswordDto {
  @Length(6, 11)
  password: string;
}
