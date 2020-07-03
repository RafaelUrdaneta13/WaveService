import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class ContentCategory {
  constructor(
    {
      title,
      text,
      link,
      imagen,
      category
    }
    :{
    title?: string,
    text?: string,
    link?: string,
    imagen?: string,
    category?: Category
  } = {}) {
    (this.title = title),
    (this.text = text),
    (this.link = link),
    (this.imagen = imagen),
    (this.category = category)
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Category,
    category => category.contentCategories,
  )
  category: Category;

  @Column()
  title: string;

  @Column({nullable: true})
  imagen: string;

  @Column()
  text: string;

  @Column()
  link: string;
}
