import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, UpdateResult } from 'typeorm';
import axios, { AxiosResponse } from 'axios';

import FormData = require('form-data');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findByEmailAndPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    return this.usersRepository.findOne({ where: { email, password } });
  }

  findByEmailOrUsername(email: string, userName: string): Promise<User> {
    return this.usersRepository.findOne({ where: [{ email }, { userName }] });
  }

  createUser(userRegister: User): Promise<User> {
    return this.usersRepository.save(userRegister);
  }

  saveProfilePhoto(user: User, url: string): Promise<UpdateResult> {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        image: url,
      })
      .where('email = :email', { email: user.email })
      .execute();
  }

  uploadImage(image: string): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('image', image);
    return axios({
      method: 'post',
      url:
        'https://api.imgbb.com/1/upload?key=96370f6b88cfde1ea6a16a5d0d13bb0f',
      data: formData,
      headers: { ...formData.getHeaders() },
    }).catch(err => err);
  }
}
