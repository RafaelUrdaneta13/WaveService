import { Module, forwardRef } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'entities/subCategory.entity';
import { ForumModule } from '../forum/forum.module';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    forwardRef(() => ForumModule),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService, UploadImageService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
