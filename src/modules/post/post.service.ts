import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, createQueryBuilder } from 'typeorm';
import { Post } from 'entities/post.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
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

  findOneWithUsers(id: number): Promise<Post> {
    return this.postsRepository.findOne(id, { relations: ['users'] });
  }

  findAllByForum(
    id: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Post>> {
    return paginate<Post>(this.postsRepository, options, {
      where: { forum: id },
      relations: ['user', 'users'],
      order: {
        date: 'DESC',
      },
    });
  }

  findAllByUserAndForum(
    id: number,
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<Post>> {
    return paginate<Post>(this.postsRepository, options, {
      where: { forum: id, user },
      order: {
        date: 'DESC',
      },
    });
  }

  findLatestPosts(id: number): Promise<Post[]> {
    return this.postsRepository.find({
      where: { id: MoreThan(id) },
      relations: ['user'],
    });
  }

  savePost(post: Post): Promise<Post> {
    return this.postsRepository.save(post);
  }

  findPostByUser(id: number, email: string): Promise<Post> {
    return this.postsRepository.findOne(id, { where: { userEmail: email } });
  }

  deletePost(post: Post): Promise<Post> {
    return this.postsRepository.remove(post);
  }

  getLikesCountByPost(id: number): Promise<any> {
    return this.postsRepository
      .createQueryBuilder('post')
      .loadRelationCountAndMap('post.likes', 'post.users')
      .where('post.id = :id', { id })
      .getOne();
  }
}
