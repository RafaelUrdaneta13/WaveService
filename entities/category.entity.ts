import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Color } from './color.entity';
import { Subcategory } from './subCategory.entity';
import { ContentCategory } from './contentCategory.entity';
import { User } from './user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Color)
  @JoinColumn()
  color: Color;

  @OneToMany(
    type => Subcategory,
    subcategory => subcategory.category,
  )
  subcategories: Subcategory[];

  @OneToMany(
    type => ContentCategory,
    contentCategory => contentCategory.category,
  )
  contentCategories: ContentCategory[];

  @ManyToMany(type => User) //Categorias favoritas
  @JoinTable()
  users: User[];
}
