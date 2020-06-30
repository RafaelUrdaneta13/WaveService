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
  constructor({
    title,
    image,
    subCategory,
    userCreator,
  }: {
    title?: string;
    image?: string;
    subCategory?: SubCategory;
    userCreator?: string;
  } = {}) {
    (this.title = title),
      (this.image = image),
      (this.subCategory = subCategory),
      (this.userCreator = userCreator);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => SubCategory,
    subCategory => subCategory.forums,
  )
  subCategory: SubCategory;

  @Column()
  title: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(
    () => User,
    user => user.forums,
    { nullable: true },
  )
  user: User;

  @ManyToMany(() => User) //Suscrito a
  @JoinTable()
  users: User[];

  @OneToMany(
    () => Post,
    post => post.forum,
  )
  posts: Post[];
}
