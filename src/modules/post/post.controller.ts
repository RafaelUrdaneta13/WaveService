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
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userRole } from 'src/helpers/constants';

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
    @Request() { user }: { user: User },
  ) {
    limit = limit > 100 ? 100 : limit;
    let posts = await this.postService.findAllByForum(idForum, {
      page,
      limit,
    });
    const items = posts.items.map(post => ({
      ...post,
      likes: post.users.length,
      isLiked: post.users.some(userToFind => userToFind.email === user.email),
    }));
    posts = { ...posts, items: items };
    posts.items.map(post => {
      delete post.users;
      delete post.user.password;
    });
    return posts;
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Get('admin/all/forum/:id')
  async findByForumIdForAdmin(
    @Param('id') idForum: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Request() { user }: { user: User },
  ) {
    limit = limit > 100 ? 100 : limit;
    let posts = await this.postService.findAllByForum(idForum, {
      page,
      limit,
    });
    const items = posts.items.map(post => ({
      ...post,
      likes: post.users.length,
    }));
    posts = { ...posts, items: items };
    posts.items.map(post => {
      delete post.users;
      delete post.user.password;
    });
    return posts;
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
  @Patch('like/:id')
  async likePost(@Param('id') id: number, @Request() { user }: { user: User }) {
    const post = await this.postService.findOneWithUsers(id);
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
  @Patch('dislike/:id')
  async dislikePost(
    @Param('id') idPost: number,
    @Request() { user }: { user: User },
  ) {
    const post = await this.postService.findOneWithUsers(idPost);
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
  @Get('likesCount/:id')
  async getLikesCountByPost(@Param('id') id: number) {
    const post = await this.postService.getLikesCountByPost(id);
    return { post };
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

  @UseGuards(AuthGuard('jwt'))
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Patch('admin/report/:id')
  async reportPost(@Param('id') id: number) {
    let post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('El post no existe', HttpStatus.NOT_FOUND);
    }
    post.isReported = !post.isReported;
    post = await this.postService.savePost(post);
    return {
      post,
    };
  }
}
