import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from 'entities/forum.entity';
import { SubCategoryModule } from '../sub-category/sub-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Forum]), SubCategoryModule],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService]
})
export class ForumModule {}
