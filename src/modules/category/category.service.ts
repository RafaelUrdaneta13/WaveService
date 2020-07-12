import { Injectable } from '@nestjs/common';
import { Category } from 'entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, UpdateResult } from 'typeorm';
import { ContentCategory } from 'entities/contentCategory.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['subCategories'],
    });
  }

  findAllWithoutRelations(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  findAllWithContent(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['subCategories', 'contentCategories'],
    });
  }

  findWithSubCategories(
    options: IPaginationOptions,
  ): Promise<Pagination<Category>> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.subCategories', 'subCategory');
    return paginate<Category>(queryBuilder, options);
  }

  findById(id: number): Promise<Category> {
    return this.categoriesRepository.findOne(id);
  }

  findByIdWithContent(id: number): Promise<Category> {
    return this.categoriesRepository.findOne(id, {
      relations: ['contentCategories'],
    });
  }

  saveCategory(category: Category): Promise<Category> {
    return this.categoriesRepository.save(category);
  }

  savePhoto(id: number, url: string): Promise<UpdateResult> {
    return this.categoriesRepository
      .createQueryBuilder()
      .update(Category)
      .set({
        image: url,
      })
      .where('id = :id', { id: id })
      .execute();
  }

  findByName(name: string): Promise<Category> {
    return this.categoriesRepository.findOne({
      where: { name: name },
    });
  }
}
