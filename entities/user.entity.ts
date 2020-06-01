import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Post } from './post.entity';

export enum userRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
  PREMIUM = 'premium',
}

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column()
  birthday: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.NORMAL,
  })
  role: userRole;

  @OneToMany(
    type => Post,
    post => post.user,
  )
  posts: Post[];
}
