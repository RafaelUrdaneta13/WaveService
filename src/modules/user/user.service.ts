import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
