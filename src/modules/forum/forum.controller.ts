import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Patch,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForumService } from './forum.service';
import { User } from 'entities/user.entity';
import { ForumDto } from 'src/dto/forum.dto';
import { Forum } from 'entities/forum.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('forum')
export class ForumController {
  constructor(
    private forumService: ForumService,
    private subCategoryService: SubCategoryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return { forums: await this.forumService.findAll() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('subcategory/:id')
  async findBySubcategory(@Param() params) {
    return { forums: await this.forumService.findAllBySubCategory(params.id) };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites/sub-category/:id')
  async findByUserAndSubCategory(
    @Request() { user }: { user: User },
    @Param('id') id,
  ) {
    return {
      forums: await this.forumService.findByUserAndSubCategory(user.email, id),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('like/:id')
  async likeForum(
    @Param('id') id: number,
    @Request() { user }: { user: User },
  ) {
    const forum = await this.forumService.findById(id);
    if (forum.users) {
      forum.users.push(user);
    } else {
      const users = [user];
      forum.users = users;
    }
    await this.forumService.saveForum(forum);
    return {
      message: 'Like succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('dislike/:id')
  async dislikeForum(
    @Param('id') idForum: number,
    @Request() { user }: { user: User },
  ) {
    const forum = await this.forumService.findById(idForum);
    console.log(forum);
    console.log(forum.users);
    const newUsers = forum.users.filter(userIn => userIn.email !== user.email);
    forum.users = newUsers;
    await this.forumService.saveForum(forum);
    return {
      message: 'Dislike succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return { forum: await this.forumService.findById(id) };
  }

  @Post('photo/upload/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: number) {
    const response = await this.forumService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.forumService.saveProfilePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createForum(@Body() body: ForumDto) {
    const subCate = await this.subCategoryService.findById(body.subCategoryId);
    const forumExist = await this.forumService.findByName(body.title);
    if (forumExist) {
      throw new HttpException(
        'El foro ya se encuentra registrado',
        HttpStatus.FOUND,
      );
    } else {
      const forum: Forum = new Forum({ ...body, subCategory: subCate });
      await this.forumService.saveForum(forum);
      return 'Algo bonito';
    }
  }
}
