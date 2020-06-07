import { IsEmail, Length, IsNotEmpty } from 'class-validator';
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(7, 10)
  password: string;
}
