import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    idPost: number;

    @Column()
    idForum: number;

    @Column()
    idCategory: number;

    @Column()
    idSubcategory: number;

    @Column()
    email: string;
    
}