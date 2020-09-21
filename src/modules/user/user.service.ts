import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID, UpdateResult } from 'typeorm';
import axios, { AxiosResponse } from 'axios';
import { userRole } from '../../helpers/constants';

import FormData = require('form-data');
import {
  Pagination,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findAllByRoleNormal(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      select: [
        'firstName',
        'lastName',
        'email',
        'birthday',
        'userName',
        'role',
        'isActive',
      ],
      where: [{ role: userRole.NORMAL }, { role: userRole.PREMIUM }],
    });
  }

  findAllByRoleAdmin(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options, {
      select: [
        'firstName',
        'lastName',
        'email',
        'birthday',
        'userName',
        'role',
        'isActive',
      ],
      where: [{ role: userRole.ADMIN }, { role: userRole.SUPER_ADMIN }],
    });
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

  findyByForum(forumId: number): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.forums', 'forum', 'forum.id = : forumId', { forumId })
      .getMany();
  }

  saveUser(userRegister: User): Promise<User> {
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

  activePremium(email: string): Promise<UpdateResult> {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        role: userRole.PREMIUM,
      })
      .where('email = :email', { email: email })
      .execute();
  }
}
