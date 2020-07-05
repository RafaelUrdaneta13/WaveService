import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { SubCategory } from './subCategory.entity';

@Entity()
export class ContentSubcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => SubCategory,
    subCategory => subCategory.contentSubcategories,
  )
  subCategory: SubCategory;

  @Column()
  title: string;

  @Column({ nullable: true })
  imagen: string;

  @Column()
  text: string;

  @Column()
  link: string;

  @Column({ default: true })
  isActive: boolean;
}
