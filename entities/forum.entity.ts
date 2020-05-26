import { PrimaryGeneratedColumn,Column,Entity } from "typeorm";

@Entity()
export class Forum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idCategory: number;

    @Column()
    idSubcategory: number;

    @Column()
    title: string;
}