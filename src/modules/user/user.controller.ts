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
  Patch,
  Get,
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
import { userRole } from '../../helpers/constants';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { EditUserDto } from 'src/dto/editUser.dto';
import { EditUserNameDto } from 'src/dto/editUserName.dto';
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
      if (!user.isActive) {
        throw new HttpException(
          'La cuenta de este usuario se ha desactivado',
          HttpStatus.FORBIDDEN,
        );
      }
      delete user.password;
      return {
        accessToken: this.jwtService.sign({
          email: user.email,
          password: encryptedPass,
        }),
        user,
      };
    } else {
      throw new HttpException('Clave o correo inválidas', HttpStatus.NOT_FOUND);
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
        user.firstName,
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
      const encryptedPass = sha1(body.password);
      const user = await this.userService.findByEmailAndPassword({
        email: payload.email,
        password: payload.password,
      });
      if (user) {
        user.password = encryptedPass;
        await this.userService.saveUser(user);
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
    const user: User = new User({
      image: 'https://i.ibb.co/XFrKdNG/4a8bc11da4eb.jpg',
      ...body,
      birthday: new Date(body.birthday),
    });
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
      const userCreated = await this.userService.saveUser(user);
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
  @Patch('premium/activate')
  async activatePremium(@Request() { user }: { user: User }) {
    await this.userService.activePremium(user.email);
    const newUser = await this.userService.findOne(user.email);
    return {
      user: newUser,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.SUPER_ADMIN)
  @Post('register/Admin')
  async registerAdmin(
    @Request() { user }: { user: User },
    @Body() body: RegisterDto,
  ) {
    const foundUser = await this.userService.findByEmailOrUsername(
      body.email,
      body.userName,
    );
    if (foundUser) {
      throw new HttpException(
        'El email o username ya se encuentra registrado',
        HttpStatus.FOUND,
      );
    }
    const encryptedPass = sha1(body.password);
    body.password = encryptedPass;
    const newUser: User = new User({
      ...body,
      birthday: new Date(body.birthday),
      role: userRole.ADMIN,
      image: 'https://i.ibb.co/XFrKdNG/4a8bc11da4eb.jpg',
    });
    const userCreated = await this.userService.saveUser(newUser);
    delete userCreated.password;
    return { user: userCreated };
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(
    userRole.NORMAL,
    userRole.PREMIUM,
    userRole.ADMIN,
    userRole.SUPER_ADMIN,
  )
  @Get('current')
  async getCurrentUser(@Request() { user }: { user: User }) {
    return {
      user: user,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Get('admin/readNormalUsers')
  async getNormalUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 100 ? 100 : limit;
    const users = await this.userService.findAllByRoleNormal({
      page,
      limit,
    });
    return {
      users,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Get('admin/readAdminUsers')
  async getAdminUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 100 ? 100 : limit;
    const admins = await this.userService.findAllByRoleAdmin({
      page,
      limit,
    });
    return {
      admins,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Patch('admin/activate/normal')
  async activateOrDesactivateUsers(@Body() body: EditUserDto) {
    const userToChange = await this.userService.findByEmailOrUsername(
      body.email,
      body.userName,
    );
    if (!userToChange) {
      throw new HttpException(
        'El email o username no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    if (userToChange.role === 'admin' || userToChange.role === 'superadmin') {
      throw new HttpException(
        'No tiene permisos para activar o desactivar administradores',
        HttpStatus.FORBIDDEN,
      );
    }
    userToChange.isActive = !userToChange.isActive;
    const userCreated = await this.userService.saveUser(userToChange);
    delete userCreated.password;
    return { user: userCreated };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.SUPER_ADMIN)
  @Patch('superadmin/activate/admin')
  async activateOrDesactivateAdmins(@Body() body: EditUserDto) {
    const userToChange = await this.userService.findByEmailOrUsername(
      body.email,
      body.userName,
    );
    if (!userToChange) {
      throw new HttpException(
        'El email o username no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    if (userToChange.role === 'superadmin') {
      throw new HttpException(
        'No tiene permisos para activar o desactivar super administradores',
        HttpStatus.FORBIDDEN,
      );
    }
    userToChange.isActive = !userToChange.isActive;
    const userCreated = await this.userService.saveUser(userToChange);
    delete userCreated.password;
    return { user: userCreated };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
  @Patch('profile/edit')
  async editUserName(
    @Request() { user }: { user: User },
    @Body() body: EditUserNameDto,
  ) {
    let userToChange = await this.userService.findByEmailOrUsername(
      user.email,
      body.userName,
    );
    if (!userToChange) {
      throw new HttpException(
        'El email o username no existe',
        HttpStatus.FOUND,
      );
    }
    userToChange = {
      ...userToChange,
      userName: body.userName,
      firstName: body.firstName,
      lastName: body.lastName,
    };
    const userCreated = await this.userService.saveUser(userToChange);
    delete userCreated.password;
    return { user: userCreated };
  }
}
