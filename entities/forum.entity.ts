import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { SubCategory } from './subCategory.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Forum {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => SubCategory,
    subCategory => subCategory.forums,
  )
  subCategory: SubCategory;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => User) //Suscrito a
  @JoinTable()
  users: User[];

  @OneToMany(
    () => Post,
    post => post.forum,
  )
  posts: Post[];
}
