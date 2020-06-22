import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForumService } from './forum.service';
import { User } from 'entities/user.entity';

@Controller('forum')
export class ForumController {
  constructor(private forumService: ForumService) {}

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
    const newUsers = forum.users.filter(userIn => userIn !== user);
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
}
