import {
  Controller,
  UseGuards,
  Get,
  Param,
  Request,
  Patch,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { FavoriteSubCategoryDto } from 'src/dto/favoriteSubCategory.dto';
import { ForumService } from '../forum/forum.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { SubCategoryDto } from 'src/dto/subCategory.dto';
import { CreateSubCategoryDto } from 'src/dto/createSubCategory.dto';
import { CategoryService } from '../category/category.service';
import { SubCategory } from 'entities/subCategory.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { userRole } from 'src/helpers/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { Forum } from 'entities/forum.entity';

@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private subCategoryService: SubCategoryService,
    private forumService: ForumService,
    private categoryService: CategoryService,
    private uploadImageService: UploadImageService,
  ) {}

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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
  @Patch('dislike/:id')
  async dislikeSubcategory(
    @Param('id') idSubcategory: number,
    @Request() { user }: { user: User },
  ) {
    const subcategory = await this.subCategoryService.findById(idSubcategory);
    subcategory.users = subcategory.users.filter(
      (userIn: User) => userIn.email !== user.email,
    );
    await this.subCategoryService.saveSubCategory(subcategory);
    const forums = await this.forumService.findByUserAndSubCategoryWithUsers(
      user.email,
      idSubcategory,
    );
    const forumsPromises = forums.map(async forum => {
      forum.users = forum.users.filter(
        (userIn: User) => userIn.email !== user.email,
      );
      return this.forumService.saveForum(forum);
    });
    return Promise.all(forumsPromises).then(() => {
      return {
        message: 'Dislike succeeded',
      };
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('update/:idsubCategory')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async updateSubCategory(
    @Body() body: SubCategoryDto,
    @Param('idsubCategory') idsubCategory: number,
  ) {
    let subCategory = await this.subCategoryService.findById(idsubCategory);
    if (!subCategory) {
      throw new HttpException(
        'La subcategoria no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    subCategory = { ...subCategory, ...body };
    return {
      subCategory: await this.subCategoryService.saveSubCategory(subCategory),
    };
  }

  @Post('photo/upload/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: number) {
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.subCategoryService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('change/status/:id')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async chageStatusSubCategory(@Param('id') id: number) {
    const subCategory = await this.subCategoryService.findByIdWithForums(id);
    if (!subCategory) {
      throw new HttpException(
        'La Subcategoria no existe',
        HttpStatus.NOT_FOUND,
      );
    }
    subCategory.isActive = !subCategory.isActive;
    let promises: Promise<any>[] = [];
    promises.push(this.subCategoryService.saveSubCategory(subCategory));
    promises = promises.concat(
      subCategory.forums.map((forum: Forum) => {
        const disabledForum: Forum = {
          ...forum,
          isActive: subCategory.isActive,
        };
        return this.forumService.saveForum(disabledForum);
      }),
    );
    return Promise.all(promises).then(([savedSubCategory]) => {
      delete savedSubCategory.users;
      delete savedSubCategory.forums;
      return {
        subCategory: savedSubCategory,
        message: 'Status Changed',
      };
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin/create')
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async createSubCategory(@Body() body: CreateSubCategoryDto) {
    const category = await this.categoryService.findById(body.category);
    if (!category) {
      throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    const exist = await this.subCategoryService.findByName(body.name);
    if (exist) {
      throw new HttpException('La Subcategoria ya existe', HttpStatus.FOUND);
    }
    const subCategory = new SubCategory({
      ...body,
      category: category,
      image: 'https://i.ibb.co/XFrKdNG/4a8bc11da4eb.jpg',
    });
    const savedSubCategory = await this.subCategoryService.saveSubCategory(
      subCategory,
    );
    return {
      message: 'Subcategoria creada exitosamente',
      SubCategory: savedSubCategory,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number, @Request() { user }: { user: User }) {
    let subcategory: any = await this.subCategoryService.findById(id);
    subcategory = {
      ...subcategory,
      isLiked: subcategory.users.some(
        userToFind => userToFind.email === user.email,
      ),
    };
    delete subcategory.users;
    delete subcategory.category;
    return { subcategory };
  }
}
