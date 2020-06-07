import { Injectable } from '@nestjs/common';
import { Category } from 'entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['color', 'contentCategories'],
    });
  }

  findWithSubCategories(): Promise<Category[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.subCategories', 'subCategory')
      .leftJoinAndSelect('category.contentCategories', 'contentCategories')
      .getMany();
  }

  findById(id: number): Promise<Category> {
    return this.categoriesRepository.findOne(id);
  }
}
