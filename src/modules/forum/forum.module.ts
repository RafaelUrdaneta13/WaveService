import { Module, forwardRef } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum } from 'entities/forum.entity';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { UploadImageService } from 'src/helpers/upload-image/upload-image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Forum]),
    forwardRef(() => SubCategoryModule),
  ],
  controllers: [ForumController],
  providers: [ForumService, UploadImageService],
  exports: [ForumService],
})
export class ForumModule {}
