import { IsNotEmpty, IsString } from 'class-validator';

export class SubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
