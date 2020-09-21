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
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { userRole } from 'src/helpers/constants';
import { SubCategory } from 'entities/subCategory.entity';
import { Forum } from 'entities/forum.entity';
import { ForumService } from '../forum/forum.service';

@Controller('category')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private uploadImageService: UploadImageService,
    private forumService: ForumService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAll() {
    return await this.categoryService.findAllWithoutRelations();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all/subcategories')
  async findAllWithSubcategoriesAdmin() {
    return await this.categoryService.findAllWithSubcategoriesAdmin();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/all/subcategories/forums')
  async findAllWithSubcategoriesAndForumsAdmin() {
    return await this.categoryService.findAllWithSubcategoriesAndForumsAdmin();
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('change/status/:id')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async changeStatusCategory(@Param('id') id: number) {
    const category = await this.categoryService.findOneWithSubcategoriesAndForumsAdmin(
      id,
    );
    if (!category) {
      throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    category.isActive = !category.isActive;
    let promises: Promise<any>[] = [];
    promises.push(this.categoryService.saveCategory(category));

    promises = promises.concat(
      category.subCategories.map((subCategory: SubCategory) => {
        const disabledSubCategory: SubCategory = {
          ...subCategory,
          isActive: category.isActive,
        };
        return this.subCategoryService.saveSubCategory(disabledSubCategory);
      }),
    );

    promises = promises.concat(
      category.subCategories.map((subCategory: SubCategory) => {
        const forumPromises = subCategory.forums.map((forum: Forum) => {
          const disabledForum: Forum = {
            ...forum,
            isActive: category.isActive,
          };
          return this.forumService.saveForum(disabledForum);
        });
        return Promise.all(forumPromises);
      }),
    );

    Promise.all(promises).then(([updatedCategory]) => {
      return {
        category: updatedCategory,
      };
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin/create')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async createCategory(@Body() body: CategoryDto) {
    const exist = await this.categoryService.findByName(body.name);
    console.log(exist);
    if (exist) {
      throw new HttpException('La Categoria existe', HttpStatus.FOUND);
    }
    const category = new Category({
      ...body,
      image: 'https://i.ibb.co/XFrKdNG/4a8bc11da4eb.jpg',
    });
    const newCategory = await this.categoryService.saveCategory(category);
    return {
      category: newCategory,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('update/:idCategory')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
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
