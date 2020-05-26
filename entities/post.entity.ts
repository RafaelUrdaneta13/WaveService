import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    idCategory: number;

    @Column()
    idSubcategory: string;

    @Column()
    email: string;

    @Column()
    text: string;
    
}