import { Module, forwardRef } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'entities/subCategory.entity';
import { ForumModule } from '../forum/forum.module';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';
import { CategoryService } from '../category/category.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    forwardRef(() => ForumModule), forwardRef(() => CategoryModule)
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, UploadImageService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
