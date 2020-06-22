import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, UpdateResult } from 'typeorm';
import { Post } from 'entities/post.entity';
import { User } from 'entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne(id);
  }

  findAllByForum(id: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { forum: id },
      relations: ['user'],
    });
  }

  createPost(post: any): Promise<Post> {
    return this.postsRepository.save(post);
  }

  findLatestPosts(id: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { id: MoreThan(id) },
    });
  }

  like(post: Post): Promise<Post> {
    return this.postsRepository.save(post);
  }
}
