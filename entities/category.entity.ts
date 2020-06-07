import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Color } from './color.entity';
import { SubCategory } from './subCategory.entity';
import { ContentCategory } from './contentCategory.entity';

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
    () => SubCategory,
    subCategory => subCategory.category,
  )
  subCategories: SubCategory[];

  @OneToMany(
    () => ContentCategory,
    contentCategory => contentCategory.category,
  )
  contentCategories: ContentCategory[];
}
