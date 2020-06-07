import { Module } from '@nestjs/common';
import { Category } from 'entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryModule } from 'src/modules/sub-category/sub-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), SubCategoryModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
