import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Forum } from './forum.entity';

@Entity()
export class Post {
  constructor({
    text,
    forum,
    user,
    date,
  }: { text?: string; forum?: Forum; user?: User; date?: Date } = {}) {
    (this.text = text),
      (this.forum = forum),
      (this.user = user),
      (this.date = date);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Forum,
    forum => forum.posts,
  )
  forum: Forum;

  @ManyToOne(
    () => User,
    user => user.posts,
  )
  user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ default: false })
  isReported: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
