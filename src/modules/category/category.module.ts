import { Module, forwardRef } from '@nestjs/common';
import { Category } from 'entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryModule } from 'src/modules/sub-category/sub-category.module';
import { ContentCategoryService } from '../content-category/content-category.service';
import { ContentCategoryModule } from '../content-category/content-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SubCategoryModule, forwardRef(() => ContentCategoryModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
