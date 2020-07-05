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
import { ContentSubcategory } from './contentSubcategory.entity';
import { User } from './user.entity';

@Entity()
export class SubCategory {
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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => ContentSubcategory,
    contentSubcategory => contentSubcategory.subCategory,
  )
  contentSubcategories: ContentSubcategory[];

  @OneToMany(
    () => Forum,
    forum => forum.subCategory,
  )
  forums: Forum[];

  @ManyToMany(() => User) //Categorias favoritas
  @JoinTable()
  users: User[];
}
