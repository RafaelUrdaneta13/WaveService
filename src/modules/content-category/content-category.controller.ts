import {
  Controller,
  Get,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentCategoryService } from './content-category.service';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { ContentCategoryDto } from '../../dto/contentCategory.dto';
import { ContentCategory } from 'entities/contentCategory.entity';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userRole } from 'src/helpers/constants';

@Controller('content-category')
export class ContentCategoryController {
  constructor(
    private contentCategoryService: ContentCategoryService,
    private categoryService: CategoryService,
    private uploadImageService: UploadImageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async findAllContentCategory() {
    return {
      ContentsCategory: await this.contentCategoryService.findAllContentCategory(),
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Patch('change/status/:id')
  async changeStatusContentCategory(@Param('id') id: number) {
    const content = await this.contentCategoryService.findById(id);
    if (!content) {
      throw new HttpException('El Contenido no existe', HttpStatus.NOT_FOUND);
    }
    content.isActive = !content.isActive;
    return {
      contentCategory: await this.contentCategoryService.saveContentCategory(
        content,
      ),
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  @Post('create/category/:idCategory')
  async createContentCategory(
    @Body() body: ContentCategoryDto,
    @Param('idCategory') idCategory: number,
  ) {
    const category = await this.categoryService.findById(idCategory);
    if (!category) {
      throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    let content = new ContentCategory({ ...body, category });
    content = await this.contentCategoryService.saveContentCategory(content);
    return {
      content: content,
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.ADMIN, userRole.SUPER_ADMIN)
  async updateContentCategory(
    @Body() body: ContentCategoryDto,
    @Param('idContent') idContent: number,
  ) {
    let content = await this.contentCategoryService.findById(idContent);
    if (!content) {
      throw new HttpException('El contenido no existe', HttpStatus.NOT_FOUND);
    }
    content = { ...content, ...body };
    return {
      contentCategory: await this.contentCategoryService.saveContentCategory(
        content,
      ),
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
    await this.contentCategoryService.savePhoto(id, response.data.data.url);
    return { imageUrl: response.data.data.url };
  }
}
