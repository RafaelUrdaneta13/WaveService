import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

}