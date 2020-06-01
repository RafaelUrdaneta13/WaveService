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

  findAllBySubCategory(id: number): Promise<Forum[]> {
    return this.forumsRepository.find({ where: { subcategory: id } });
  }
}
