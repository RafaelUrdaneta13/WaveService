import { userRole } from 'src/helpers/constants';
export class RegisterDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  birthday: string;
  role: userRole;
  isActive: boolean;
}
