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
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Category,
    category => category.subcategories,
  )
  category: Category;

  @Column()
  name: string;

  @OneToMany(
    type => ContentSubcategory,
    contentSubcategory => contentSubcategory.subcategory,
  )
  contentSubcategories: ContentSubcategory[];

  @OneToMany(
    type => Forum,
    forum => forum.subcategory,
  )
  forums: Forum[];
}
