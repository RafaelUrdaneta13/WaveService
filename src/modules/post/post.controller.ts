import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Request,
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
  @Get('all/forum/:id')
  async findByForumId(@Param('id') id: number) {
    const posts = await this.postService.findAllByForum(id);
    return { posts };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('latest/:id')
  async findLatestPosts(@Param('id') id: number) {
    const posts = await this.postService.findLatestPosts(id);
    return { posts };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('publish/:id')
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
    this.postService.createPost(post);
    return 'lo logre';
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('like/:id')
  async likePost(@Param('id') id: number, @Request() { user }: { user: User }) {
    const post = await this.postService.findOne(id);
    if (post.users) {
      post.users.push(user);
    } else {
      const users = [user];
      post.users = users;
    }
    await this.postService.savePost(post);
    return {
      message: 'Like succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('dislike/:id')
  async dislikeForum(
    @Param('id') idPost: number,
    @Request() { user }: { user: User },
  ) {
    const post = await this.postService.findOne(idPost);
    post.users = post.users.filter(userIn => userIn.email !== user.email);
    await this.postService.savePost(post);
    return {
      message: 'Dislike succeeded',
    };
  }
}
