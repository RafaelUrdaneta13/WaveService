import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentCategory } from 'entities/contentCategory.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ContentCategoryService {
    constructor(
        @InjectRepository(ContentCategory)
        private contentsCategoriesRepository: Repository<ContentCategory>,
      ) {}

      findAllContentCategory(): Promise<ContentCategory[]> {
        return this.contentsCategoriesRepository.find({relations: ['category']})
      }

      findOneContentCategory(id : number): Promise<ContentCategory> {
          return this.contentsCategoriesRepository.findOne(id)
      }

      deleteContentCategory(content: ContentCategory): Promise<ContentCategory> {
          return this.contentsCategoriesRepository.remove(content)
      }

      createContentCategory(content: ContentCategory): Promise<ContentCategory> {
          return this.contentsCategoriesRepository.save(content)
      }

      findContentByIdCategory(idCategory: number): Promise<ContentCategory[]> {
          return this.contentsCategoriesRepository.find({where: {category : idCategory}, relations: ['category']})
      }

      findById(id: number): Promise<ContentCategory> {
        return this.contentsCategoriesRepository.findOne(id)
      }

      savePhoto(id: number, url: string): Promise<UpdateResult> {
        return this.contentsCategoriesRepository
          .createQueryBuilder()
          .update(ContentCategory)
          .set({
            imagen: url,
          })
          .where('id = :id', { id: id })
          .execute();
      }
}
