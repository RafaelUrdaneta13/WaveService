import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { FavoriteSubCategoryDto } from 'src/dto/favoriteSubCategory.dto';

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
  @Patch('add/favorite')
  async addAsFavorite(
    @Request() { user }: { user: User },
    @Body() subCategories: FavoriteSubCategoryDto[],
  ) {
    const subCategoriesToChange = await this.subCategoryService.findByIds(
      subCategories.map(subCategory => subCategory.id),
    );

    subCategoriesToChange.map(subcategory => subcategory.users.push(user));

    const promises = subCategoriesToChange.map(subcategory =>
      this.subCategoryService.saveSubCategory(subcategory),
    );

    return Promise.all(promises).then(() => ({
      message: 'Subcategorias actualizadas',
    }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('dislike/:id')
  async dislikeSubcategory(
    @Param('id') idSubcategory: number,
    @Request() { user }: { user: User },
  ) {
    const subcategory = await this.subCategoryService.findById(idSubcategory);
    console.log(subcategory);
    console.log(subcategory.users);
    subcategory.users = subcategory.users.filter(userIn => userIn !== user);
    await this.subCategoryService.saveSubCategory(subcategory);
    return {
      message: 'Dislike succeeded',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.subCategoryService.findById(id);
  }
}
