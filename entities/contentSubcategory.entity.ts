import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class ContentSubcategory{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idCategory: number;

    @Column()
    idSubcategory: number;

    @Column()
    title: string;

    @Column()
    imagen: string;

    @Column()
    text: string;

    @Column()
    link: string;
}