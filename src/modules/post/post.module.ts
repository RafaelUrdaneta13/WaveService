import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from 'entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ForumModule } from '../forum/forum.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { ForumService } from '../forum/forum.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule,ForumModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
