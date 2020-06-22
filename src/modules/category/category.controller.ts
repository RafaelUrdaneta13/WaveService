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
    console.log(subcategories);
    const filterCategories = categories.filter(category => {
      const subCategoriesFiltradas = subcategories.filter(subcategory =>
        category.subCategories.some(sub => sub.id === subcategory.id),
      );
      if (subCategoriesFiltradas.length > 0) {
        category.subCategories = subCategoriesFiltradas;
        return category;
      } else {
        return false;
      }
    });
    return {
      categories: filterCategories,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all-with-subcategories')
  async findWithSubcategories() {
    return { categories: await this.categoryService.findWithSubCategories() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.categoryService.findById(id);
  }
}
