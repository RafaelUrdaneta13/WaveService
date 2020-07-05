import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sha1 } from 'object-hash';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmailAndPassword({
      email,
      password: pass,
    });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
