import { IsNotEmpty, IsNumber } from 'class-validator';

export class FavoriteSubCategoryDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
