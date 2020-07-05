import {
  Controller,
  Body,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { sendEmail } from 'src/helpers/email.service';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { GenerateResetPasswordDto } from 'src/dto/generateResetPassword.dto';
import { ResetPasswordDto } from 'src/dto/resetPassword.dto';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { sha1 } from 'object-hash';
import { User } from 'entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { TokenExpiredError } from 'jsonwebtoken';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private uploadImageService: UploadImageService,
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

  @Post('generate/passwordURL')
  async generateURLForResetPassword(@Body() body: GenerateResetPasswordDto) {
    const user = await this.userService.findOne(body.email);
    if (user) {
      const token = this.jwtService.sign(
        {
          password: user.password,
          email: user.email,
        },
        { expiresIn: 1200 },
      );
      await sendEmail(
        user.email,
        `https://waveapp-f4960.firebaseapp.com/reset/password?token=${token}`,
      );
      return {
        message: 'Correo Enviado',
      };
    } else {
      throw new HttpException('Este usuario no existe', HttpStatus.NOT_FOUND);
    }
  }

  @Post('reset/password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    try {
      this.jwtService.verify(token);
      const payload: any = this.jwtService.decode(token, { json: true });
      const encryptedPass = sha1(payload.password);
      const user = await this.userService.findOne(payload.email);
      if (user) {
        user.password = encryptedPass;
        this.userService.createUser(user);
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
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('El token es inválido', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('profile/photo/upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Request() { user }: { user: User }) {
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.userService.saveProfilePhoto(user, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const encryptedPass = sha1(body.password);
    body.password = encryptedPass;
    const user: User = new User({ ...body, birthday: new Date(body.birthday) });
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

  @UseGuards(AuthGuard('jwt'))
  @Post('premium/active')
  async activatePremium(@Request() { user }: { user: User }) {
    await this.userService.activePremium(user.email);
    const newUser = await this.userService.findOne(user.email);
    return {
      user: newUser,
    };
  }
}
