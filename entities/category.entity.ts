import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SubCategory } from './subCategory.entity';
import { ContentCategory } from './contentCategory.entity';

@Entity()
export class Category {
  constructor({
    name,
    text,
    image,
  }: {
    name?: string;
    text?: string;
    image?: string;
  } = {}) {
    (this.name = name), (this.text = text), (this.image = image);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  text: string;

  @Column({ default: true })
  isActive: boolean;

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
