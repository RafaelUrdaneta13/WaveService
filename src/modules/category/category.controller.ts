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
  HttpException,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { Category } from 'entities/category.entity';
import { CategoryDto } from 'src/dto/category.dto';

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
  @Get('all/content')
  async findAllWithContent() {
    return await this.categoryService.findAllWithContent();
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
    return await this.categoryService.findByIdWithContent(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('disable/:id')
  async disableCategory(@Param('id') id: number) {
    const category = await this.categoryService.findByIdWithContent(id);
    if (!category) {
      throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    category.isActive = false;
    return {
      category: await this.categoryService.saveCategory(category),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('activate/:id')
  async activateCategory(@Param('id') id: number) {
    const category = await this.categoryService.findByIdWithContent(id);
    if (!category) {
      throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    category.isActive = true;
    return {
      category: await this.categoryService.saveCategory(category),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createCategory(@Body() body: CategoryDto) {
    const category = new Category({ ...body });
    const newCategory = await this.categoryService.saveCategory(category);
    return {
      category: newCategory,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update/:idCategory')
  async updateCategory(
    @Body() body: CategoryDto,
    @Param('idCategory') idCategory: number,
  ) {
    let category = await this.categoryService.findById(idCategory);
    if (!category) {
      throw new HttpException('La categoria no existe', HttpStatus.NOT_FOUND);
    }
    category = { ...category, ...body };
    return {
      category: await this.categoryService.saveCategory(category),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('photo/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: number) {
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.categoryService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }
}
