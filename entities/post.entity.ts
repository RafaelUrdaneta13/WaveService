import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Forum } from './forum.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Forum,
    forum => forum.posts,
  )
  forum: Forum;

  @ManyToOne(
    type => User,
    user => user.posts,
  )
  user: User;

  @Column()
  text: string;

  @Column({ default: false })
  isReported: boolean;

  @ManyToMany(type => User)
  @JoinTable()
  users: User[];
}
