import { Controller, UseGuards, Get, Param, Request } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private subCategoryService: SubCategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('category/:id')
  async findByCategory(@Param() params) {
    return {
      subCategories: await this.subCategoryService.findAllByCategory(params.id),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  async findByUser(@Request() { user }: { user: User }) {
    return {
      subCategories: await this.subCategoryService.findByUser(user.email),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.subCategoryService.findById(id);
  }
}
