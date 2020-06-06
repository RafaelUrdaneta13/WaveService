import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return { categories: await this.categoryService.findAll() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  async findByUser(@Request() { user }: { user: User }) {
    return {
      categories: await this.categoryService.findByUser(user.email),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id:number) {
    return this.categoryService.findById(id)
  }
}
