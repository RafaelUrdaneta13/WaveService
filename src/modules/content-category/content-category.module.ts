import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentCategory } from 'entities/contentCategory.entity';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { ContentCategoryController } from './content-category.controller';
import { ContentCategoryService } from './content-category.service';
import { CategoryModule } from '../category/category.module';

@Module({
    imports: [TypeOrmModule.forFeature([ContentCategory]),  forwardRef(() => CategoryModule)],
    controllers: [ContentCategoryController],
    providers: [ContentCategoryService, UploadImageService],
    exports: [ContentCategoryService]
})
export class ContentCategoryModule {}
