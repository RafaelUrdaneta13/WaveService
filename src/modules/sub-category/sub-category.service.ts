import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from 'entities/subCategory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoriesRepository: Repository<SubCategory>,
  ) {}

  findAllByCategory(id: number): Promise<SubCategory[]> {
    return this.subCategoriesRepository.find({
      where: { category: id },
      relations: ['contentSubcategories'],
    });
  }

  findByUser(email: string): Promise<SubCategory[]> {
    return this.subCategoriesRepository
      .createQueryBuilder('subCategory')
      .innerJoin('subCategory.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .getMany();
  }

  findById(id: number): Promise<SubCategory> {
    return this.subCategoriesRepository.findOne(id);
  }
}
