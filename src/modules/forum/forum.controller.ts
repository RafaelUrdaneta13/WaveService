import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForumService } from './forum.service';

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
}
