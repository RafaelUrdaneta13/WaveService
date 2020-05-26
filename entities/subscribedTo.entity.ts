import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubscribedTo{
    @PrimaryGeneratedColumn()
    email: string;

    @Column()
    idForum: number;

    @Column()
    idCategory: number;

    @Column()
    idSubcategory: number;
}