import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  idCategory: number;

}