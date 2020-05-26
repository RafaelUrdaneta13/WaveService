import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FavoriteCategory{
    @Column()
    email: string;

    @PrimaryGeneratedColumn()
    idCategory: number;
}