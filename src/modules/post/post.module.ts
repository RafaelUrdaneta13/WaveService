import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from 'entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ForumModule } from '../forum/forum.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { ForumService } from '../forum/forum.service';
import { PostGateway } from './post.gateway';
import { SubscriberModule } from '../subscriber/subscriber.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule,
    ForumModule,
    SubscriberModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostGateway],
})
export class PostModule {}
