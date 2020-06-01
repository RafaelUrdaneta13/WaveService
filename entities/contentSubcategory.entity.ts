import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Subcategory } from './subCategory.entity';

@Entity()
export class ContentSubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Subcategory,
    subcategory => subcategory.contentSubcategories,
  )
  subcategory: Subcategory;

  @Column()
  title: string;

  @Column()
  imagen: string;

  @Column()
  text: string;

  @Column()
  link: string;
}
