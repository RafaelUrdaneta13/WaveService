import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';
import { Forum } from './forum.entity';
import { ContentSubcategory } from './contentSubcategory.entity';
@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Category,
    category => category.subCategories,
  )
  category: Category;

  @Column()
  name: string;

  @OneToMany(
    type => ContentSubcategory,
    contentSubcategory => contentSubcategory.subCategory,
  )
  contentSubcategories: ContentSubcategory[];

  @OneToMany(
    type => Forum,
    forum => forum.subCategory,
  )
  forums: Forum[];
}
