import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Forum } from './forum.entity';
import { User } from './user.entity';

@Entity()
export class SubCategory {
  constructor({
    name,
    text,
    category,
    image,
  }: {
    name?: string;
    text?: string;
    category?: Category;
    image?: string;
  } = {}) {
    (this.name = name),
      (this.text = text),
      (this.category = category),
      (this.image = image);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Category,
    category => category.subCategories,
  )
  category: Category;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  text: string;

  @Column()
  link: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => Forum,
    forum => forum.subCategory,
  )
  forums: Forum[];

  @ManyToMany(() => User) //Categorias favoritas
  @JoinTable()
  users: User[];
}
