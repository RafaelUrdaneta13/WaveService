import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Request,
  HttpException,
  HttpStatus,
  Query,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { PostDto } from 'src/dto/post.dto';
import { UserService } from '../user/user.service';
import { Post as PostEntity } from '../../../entities/post.entity';
import { ForumService } from '../forum/forum.service';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private forumService: ForumService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('latest/:id')
  async findLatestPosts(@Param('id') id: number) {
    const posts = await this.postService.findLatestPosts(id);
    return { posts };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all/forum/:id')
  async findByForumId(
    @Param('id') idForum: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.postService.findAllByForum(idForum, {
      page,
      limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all/forum/:id/user')
  async findByForumIdAndUser(
    @Param('id') idForum: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Request() { user }: { user: User },
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.postService.findAllByUserAndForum(
      idForum,
      {
        page,
        limit,
      },
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('publish/forum/:id')
  async createPost(
    @Body() body: PostDto,
    @Request() { user }: { user: User },
    @Param('id') idForo: number,
  ) {
    const forum = await this.forumService.findById(idForo);
    const post: PostEntity = new PostEntity({
      ...body,
      forum: forum,
      user: user,
    });
    await this.postService.savePost(post);
    return { message: 'Post guardado exitosamente' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('like/:id')
  async likePost(@Param('id') id: number, @Request() { user }: { user: User }) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('El post no existe', HttpStatus.NOT_FOUND);
    }
    if (post.users) {
      post.users.push(user);
    } else {
      post.users = [user];
    }
    await this.postService.savePost(post);
    return {
      message: 'Like succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('dislike/:id')
  async dislikePost(
    @Param('id') idPost: number,
    @Request() { user }: { user: User },
  ) {
    const post = await this.postService.findOne(idPost);
    if (!post) {
      throw new HttpException('El post no existe', HttpStatus.NOT_FOUND);
    }
    post.users = post.users.filter(
      (userIn: User) => userIn.email !== user.email,
    );
    await this.postService.savePost(post);
    return {
      message: 'Dislike succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  async deletePost(
    @Param('id') id: number,
    @Request() { user }: { user: User },
  ) {
    const post = await this.postService.findPostByUser(id, user.email);
    if (!post) {
      throw new HttpException('El post no existe', HttpStatus.NOT_FOUND);
    }
    await this.postService.deletePost(post);
    return {
      message: 'Post Deleted',
    };
  }
}
