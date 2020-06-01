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
import { RegisterDto } from 'src/dto/register.dto';
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
    //console.log(encryptedPass);
    const user = await this.userService.findByEmailAndPassword({
      email: body.email,
      password: encryptedPass,
    });
    if (user) {
      delete user.password;
      return {
        accessToken: this.jwtService.sign({
          email: user.email,
          password: encryptedPass,
        }),
        user,
      };
    } else {
      throw new HttpException('Este usuario no existe', HttpStatus.NOT_FOUND);
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const encrytedPass = sha1(body.password);
    const foundUser = await this.userService.findByEmailOrUsername(
      body.email,
      body.userName,
    );
    if (foundUser) {
      throw new HttpException(
        'El email o username ya se encuentra registrado',
        HttpStatus.FOUND,
      );
    } else {
      const user = await this.userService.createUser({
        firstName: body.firstName,
        lastName: body.lastName,
        userName: body.userName,
        email: body.email,
        birthday: '1988-06-05',
        isActive: true,
        password: encrytedPass,
      });
      delete user.password;
      return {
        accessToken: this.jwtService.sign({
          email: user.email,
          password: encrytedPass,
        }),
        user,
      };
    }
  }
}
