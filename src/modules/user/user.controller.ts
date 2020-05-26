import {
  Controller,
  Body,
  Request,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { sha1 } from 'object-hash';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const encryptedPass = sha1(body.password);
    const user = await this.userService.findByEmailAndPassword({
      email: body.email,
      password: encryptedPass,
    });
    if (user) {
      return {
        accessToken: this.jwtService.sign({
          email: user.email,
          password: user.password,
        }),
      };
    } else {
      throw new HttpException('Este usuario no existe', HttpStatus.NOT_FOUND);
    }
  }
}
