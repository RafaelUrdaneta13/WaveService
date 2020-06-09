import { userRole } from 'src/helpers/constants';
import { IsDate, IsEmail, IsNotEmpty, Length, IsBoolean, } from 'class-validator';
export class RegisterDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @Length(6, 11)
  password: string;

  @IsNotEmpty()
  birthday: string;

  image: string;

  isActive: boolean;

  role: userRole;
}
