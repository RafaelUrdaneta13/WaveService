import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Forum } from './forum.entity';

@Entity()
export class Post {
  constructor({
    text,
    forum,
    user,
  }: { text?: string; forum?: Forum; user?: User } = {}) {
    (this.text = text), (this.forum = forum), (this.user = user);
  }

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
