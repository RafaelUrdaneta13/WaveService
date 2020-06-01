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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Category,
    category => category.contentCategories,
  )
  category: Category;

  @Column()
  title: string;

  @Column()
  imagen: string;

  @Column()
  text: string;

  @Column()
  link: string;
}
