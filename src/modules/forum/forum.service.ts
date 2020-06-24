import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Forum } from 'entities/forum.entity';
import { Repository, UpdateResult } from 'typeorm';
import Axios, { AxiosResponse } from 'axios';
import FormData = require('form-data');
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
    return this.forumsRepository.findOne(id, { relations: ['subCategory'] });
  }

  findByUserAndSubCategory(
    email: string,
    subCategoryId: number,
  ): Promise<Forum[]> {
    console.log(subCategoryId);
    return this.forumsRepository
      .createQueryBuilder('forum')
      .innerJoinAndSelect('forum.users', 'user', 'user.email IN (:userEmail)', {
        userEmail: email,
      })
      .where('forum.subCategory = :subCategoryId', { subCategoryId })
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

  saveProfilePhoto(id: number, url: string): Promise<UpdateResult> {
    return this.forumsRepository
      .createQueryBuilder()
      .update(Forum)
      .set({
        image: url,
      })
      .where('id = :id', { id: id })
      .execute();
  }

  uploadImage(image: string): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return Axios({
      method: 'post',
      url:
        'https://api.imgbb.com/1/upload?key=96370f6b88cfde1ea6a16a5d0d13bb0f',
      data: formData,
      headers: { ...formData.getHeaders() },
    }).catch(err => err);
  }

  findByName(title: string): Promise<Forum> {
    return this.forumsRepository.findOne({ where: { title } });
  }
}
