import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class SubCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
