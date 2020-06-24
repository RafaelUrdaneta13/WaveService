import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class ForumDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    subCategoryId: number;
}