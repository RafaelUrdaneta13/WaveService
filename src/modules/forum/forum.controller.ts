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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForumService } from './forum.service';
import { User } from 'entities/user.entity';
import { ForumDto } from 'src/dto/forum.dto';
import { Forum } from 'entities/forum.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';

@Controller('forum')
export class ForumController {
  constructor(
    private forumService: ForumService,
    private subCategoryService: SubCategoryService,
    private uploadImageService: UploadImageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.forumService.findAll({
      page,
      limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('subcategory/:id')
  async findBySubcategory(
    @Param('id') idSubcategory,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.forumService.findAllBySubCategory(idSubcategory, {
      page,
      limit,
    });
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
  @Get('user/posts')
  async findByUserWithPosts(@Request() { user }: { user: User }) {
    return {
      forums: await this.forumService.findByUserWithPostsSubscribe(user.email),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/notSubscribe/posts')
  async findByUserWithPostNotSubscribe(@Request() { user }: { user: User }) {
    const allForums = await this.forumService.findAllWithPostByUser(user);
    const subscribeForums = await this.forumService.findByUser(user.email);
    const forumsNotSubscribeWithPost = allForums.filter(
      forum =>
        !subscribeForums.some(subscribeForum => forum.id === subscribeForum.id),
    );
    return {
      forums: forumsNotSubscribeWithPost,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('like/:id')
  async likeForum(
    @Param('id') id: number,
    @Request() { user }: { user: User },
  ) {
    const forum = await this.forumService.findById(id);
    if (!forum) {
      throw new HttpException('El foro no existe', HttpStatus.NOT_FOUND);
    }
    if (forum.users) {
      forum.users.push(user);
    } else {
      forum.users = [user];
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
    if (!forum) {
      throw new HttpException('El foro no existe', HttpStatus.NOT_FOUND);
    }
    forum.users = forum.users.filter(
      (userIn: User) => userIn.email !== user.email,
    );
    await this.forumService.saveForum(forum);
    return {
      message: 'Dislike succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('created/user')
  async findCreatedByUser(@Request() { user }: { user: User }) {
    return {
      forums: await this.forumService.findForumsCreatedByUser(user.email),
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
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.forumService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create/:idSubcategoria')
  async createForum(
    @Body() body: ForumDto,
    @Param('idSubcategoria') idSubcategoria: number,
    @Request() { user }: { user: User },
  ) {
    const subCate = await this.subCategoryService.findById(idSubcategoria);
    const forumExist = await this.forumService.findByName(body.title);
    if (forumExist) {
      throw new HttpException(
        'El foro ya se encuentra registrado',
        HttpStatus.FOUND,
      );
    } else {
      const forum: Forum = new Forum({
        ...body,
        subCategory: subCate,
        user: user,
      });
      const savedForum = await this.forumService.saveForum(forum);
      return { message: 'Foro creado exitosamente', forum: savedForum };
    }
  }
}
