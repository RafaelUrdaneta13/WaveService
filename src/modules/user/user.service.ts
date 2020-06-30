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

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOne(email);
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
}
