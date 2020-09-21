import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from 'entities/forum.entity';
import { Repository, UpdateResult, Like, In, Not } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { UserService } from '../user/user.service';
import { User } from 'entities/user.entity';
import { SubCategory } from 'entities/subCategory.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
  ) {}

  findAll(
    subCategories: SubCategory[],
    searchTerm: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Forum>> {
    if (searchTerm) {
      if (subCategories.length > 0) {
        return paginate<Forum>(this.forumsRepository, options, {
          relations: ['subCategory'],
          where: {
            title: Like(`%${searchTerm}%`),
            subCategory: In(subCategories.map(subCategory => subCategory.id)),
          },
        });
      }
      return paginate<Forum>(this.forumsRepository, options, {
        relations: ['subCategory'],
        where: {
          title: Like(`%${searchTerm}%`),
        },
      });
    } else {
      if (subCategories.length > 0) {
        return paginate<Forum>(this.forumsRepository, options, {
          relations: ['subCategory'],
          where: {
            subCategory: In(subCategories.map(subCategory => subCategory.id)),
          },
        });
      }
      return paginate<Forum>(this.forumsRepository, options, {
        relations: ['subCategory'],
      });
    }
  }

  findAllBySubCategory(
    id: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Forum>> {
    return paginate<Forum>(this.forumsRepository, options, {
      where: { subCategory: id },
    });
  }

  findByIdWithUsers(id: number): Promise<Forum> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .leftJoinAndSelect('forum.users', 'user')
      .innerJoinAndSelect('forum.subCategory', 'subCategory')
      .loadRelationCountAndMap('forum.subscribers', 'forum.users')
      .where('forum.id = :id', { id })
      .getOne();
  }

  findById(id: number): Promise<Forum> {
    return this.forumsRepository.findOne(id);
  }

  findByUserAndSubCategory(
    email: string,
    subCategoryId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Forum>> {
    const queryBuilder = this.forumsRepository.createQueryBuilder('forum');
    queryBuilder
      .innerJoin('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .where('forum.subCategory = :subCategoryId', { subCategoryId });
    return paginate<Forum>(queryBuilder, options);
  }

  findNotFavoriteByUserAndSubCategory(
    subCategoryId: number,
    user: User,
    options: IPaginationOptions,
  ): Promise<Pagination<Forum>> {
    const foroQb = this.forumsRepository
      .createQueryBuilder('foro')
      .select('foro.id')
      .where('foro.subCategory = :subCategoryId', { subCategoryId })
      .innerJoin('foro.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: user.email,
      });

    const queryBuilder = this.forumsRepository.createQueryBuilder('foroNot');
    queryBuilder
      .where('foroNot.subCategory = :subCategoryId', { subCategoryId })
      .andWhere('foroNot.id NOT IN (' + foroQb.getQuery() + ')')
      .setParameters(foroQb.getParameters())
      .getMany();
    return paginate<Forum>(queryBuilder, options);
  }

  findByUser(email: string): Promise<Forum[]> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoinAndSelect('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .getMany();
  }

  findByUserWithPostsSubscribe(email: string): Promise<Forum[]> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoin('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .leftJoinAndSelect(
        'forum.posts',
        'post',
        'post.userEmail IN (:userEmail)',
        {
          userEmail: email,
        },
      )
      .getMany();
  }

  findAllWithPostByUser(user: User): Promise<Forum[]> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoinAndSelect(
        'forum.posts',
        'post',
        'post.userEmail IN (:userEmail)',
        {
          userEmail: user.email,
        },
      )
      .getMany();
  }

  findByUserAndSubCategoryWithUsers(
    email: string,
    subCategoryId: number,
  ): Promise<Forum[]> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoin('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .leftJoinAndSelect('forum.users', 'users')
      .where('forum.subCategory = :subCategoryId', { subCategoryId })
      .getMany();
  }

  saveForum(forum: Forum): Promise<Forum> {
    return this.forumsRepository.save(forum);
  }

  savePhoto(id: number, url: string): Promise<UpdateResult> {
    return this.forumsRepository
      .createQueryBuilder()
      .update(Forum)
      .set({
        image: url,
      })
      .where('id = :id', { id: id })
      .execute();
  }

  findByName(title: string): Promise<Forum> {
    return this.forumsRepository.findOne({ where: { title } });
  }

  findForumsCreatedByUser(email: string): Promise<Forum[]> {
    return this.forumsRepository.find({ where: { user: email } });
  }

  deleteForum(forum: Forum): Promise<Forum> {
    return this.forumsRepository.remove(forum);
  }

  getSubscribersCountByForum(id: number): Promise<any> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .loadRelationCountAndMap('forum.subscribers', 'forum.users')
      .where('forum.id = :id', { id })
      .getOne();
  }
}
