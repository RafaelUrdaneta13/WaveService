import {
  Controller,
  Body,
  Request,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { sha1 } from 'object-hash';
import { User } from 'entities/user.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}


  @Post('login')
  async login(@Body() body: LoginDto) {
    const encryptedPass = sha1(body.password);
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
  @UseInterceptors(FilesInterceptor('image'))
  async uploadFile(@UploadedFiles() file){
    console.log(file);
    return file;
  }
  async register(@Body() body: RegisterDto) {
    const encryptedPass = sha1(body.password);
    body.password = encryptedPass;
    const user: User = new User({ ...body, birthday: new Date(body.birthday)});
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
      const userCreated = await this.userService.createUser(user);
      delete userCreated.password;
      return {
        accessToken: this.jwtService.sign({
          email: userCreated.email,
          password: encryptedPass,
        }),
        userCreated,
      };
    }
  }
}
