import { Controller, Get, UseGuards, Param, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return { categories: await this.categoryService.findAll() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  async findByUser(@Request() { user }: { user: User }) {
    const categories = await this.categoryService.findWithSubCategories();
    console.log(categories);
    const subcategories = await this.subCategoryService.findByUser(user.email);
    return {
      categories: categories.filter(category =>
        category.subCategories.some(subCategory =>
          subcategories.some(subCat => subCat.id === subCategory.id),
        ),
      ),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }
}
