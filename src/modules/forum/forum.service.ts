import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from 'entities/forum.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
  ) {}

  findAll(): Promise<Forum[]> {
    return this.forumsRepository.find();
  }

  findAllBySubCategory(id: number): Promise<Forum[]> {
    return this.forumsRepository.find({ where: { subCategory: id } });
  }

  findById(id: number): Promise<Forum> {
    return this.forumsRepository.findOne(id); // tratar de traer el relations??
  }

  findByUserAndSubCategory(
    email: string,
    subCategoryId: number,
  ): Promise<Forum[]> {
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoin('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .where({ where: { subCategory: subCategoryId } })
      .getMany();
  }

  saveForum(forum: Forum): Promise<Forum> {
    return this.forumsRepository.save(forum);
  }
}
