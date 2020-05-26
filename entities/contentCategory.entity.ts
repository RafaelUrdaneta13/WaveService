import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContentCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCategory: number;

  @Column()
  title: string;

  @Column()
  imagen: string;

  @Column()
  text: string;

  @Column()
  link: string;

}