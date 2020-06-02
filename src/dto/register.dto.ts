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

  @Length(7, 10)
  password: string;

  @IsDate()
  birthday: string;
  
  role: userRole;
}
