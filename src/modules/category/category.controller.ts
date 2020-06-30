import {
  Controller,
  Get,
  UseGuards,
  Param,
  Request,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private uploadImageService: UploadImageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return await this.categoryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  async findByUser(@Request() { user }: { user: User }) {
    const categories = await this.categoryService.findAll();
    const subcategories = await this.subCategoryService.findByUser(user.email);
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
  @Get('all/with/subcategories')
  async findWithSubcategories(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.categoryService.findWithSubCategories({
      page,
      limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.categoryService.findById(id);
  }

  @Post('photo/upload/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: number) {
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );

    await this.categoryService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }
}
