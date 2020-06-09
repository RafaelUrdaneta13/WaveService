import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Post } from './post.entity';
import { userRole } from 'src/helpers/constants';

@Entity()
export class User {
  constructor({
    firstName,
    lastName,
    userName,
    email,
    password,
    birthday,
    role,
    isActive,
    image,
  }: {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    password?: string;
    birthday?: Date;
    role?: userRole;
    isActive?: boolean;
    image?: string;
  } = {}) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.userName = userName),
      (this.email = email),
      (this.password = password),
      (this.birthday = birthday),
      (this.role = role),
      (this.isActive = isActive),
      (this.image = image);
  }

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

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.NORMAL,
  })
  role: userRole;

  @Column({ nullable: true })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => Post,
    post => post.user,
  )
  posts: Post[];
}
