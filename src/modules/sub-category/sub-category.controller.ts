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
} from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'entities/user.entity';
import { FavoriteSubCategoryDto } from 'src/dto/favoriteSubCategory.dto';
import { ForumService } from '../forum/forum.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';

@Controller('sub-category')
export class SubCategoryController {
  constructor(
    private subCategoryService: SubCategoryService,
    private forumService: ForumService,
    private uploadImageService: UploadImageService
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

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.subCategoryService.findById(id);
  }

  @Post('photo/upload/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('id') id: number) {
    const response = await this.uploadImageService.uploadImage(
      file.buffer.toString('base64'),
    );
    await this.subCategoryService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }
}
