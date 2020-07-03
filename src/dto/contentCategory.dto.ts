import { IsNotEmpty, IsUrl } from "class-validator";

export class ContentCategoryDto {
    @IsNotEmpty()
    text: string

    @IsNotEmpty()
    title: string

    @IsUrl()
    link: string
    
    @IsNotEmpty()
    idCategory: number

    image: string;
}