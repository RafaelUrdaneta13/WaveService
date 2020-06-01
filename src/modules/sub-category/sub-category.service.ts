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
}
