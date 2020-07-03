import { Controller, Get, UseGuards, Delete, Param, HttpException, HttpStatus, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentCategoryService } from './content-category.service';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { ContentCategoryDto } from "../../dto/contentCategory.dto";
import { ContentCategory } from 'entities/contentCategory.entity';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('content-category')
export class ContentCategoryController {
constructor(
    private ContentCategoryService: ContentCategoryService,
    private CategoryService: CategoryService,
    private uploadImageService: UploadImageService,
) {}

@UseGuards(AuthGuard('jwt'))
@Get('all')
async findAllContentCategory() {
    return {Contents: await this.ContentCategoryService.findAllContentCategory()}
}

@UseGuards(AuthGuard('jwt'))
@Get('category/:id')
async findContentByCategoryWithoutPositionZero(@Param('id') id: number) {
    const category = await this.CategoryService.findById(id)
    if (!category) {
        throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    const result =  await (await this.ContentCategoryService.findContentByIdCategory(id)).reverse()
    result.pop()
    result.reverse()
    return {
        // Intento de no traer el primero
        Contents: result }
}

@UseGuards(AuthGuard('jwt'))
@Delete('delete/:id')
async deleteContentCategory(
    @Param('id') id: number
) {
    const Content = await this.ContentCategoryService.findOneContentCategory(id);
    if (!Content) {
    throw new HttpException('El Contenido no existe', HttpStatus.NOT_FOUND);
    }
    await this.ContentCategoryService.deleteContentCategory(Content);
    return {
        message: 'Content Deleted',
    };
}

@UseGuards(AuthGuard('jwt'))
@Post('create')
async createContentCategory(@Body() body: ContentCategoryDto) {
    const category = await this.CategoryService.findById(body.idCategory)
    if (!category) {
        throw new HttpException('La Categoria no existe', HttpStatus.NOT_FOUND);
    }
    const content = new ContentCategory({title: body.title, text: body.text, link: body.link, imagen: "", category: category})
    await this.ContentCategoryService.createContentCategory(content)
    return {
        message: "Content Created"
    }
}

@UseGuards(AuthGuard('jwt'))
@Post('photo/upload/:id')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file, @Param('id') id: number) {
  const response = await this.uploadImageService.uploadImage(
    file.buffer.toString('base64'),
  );
  await this.ContentCategoryService.savePhoto(id, response.data.data.url);
  return { imageUrl: response.data.data.url };
}
}
