import { IsUrl, IsString, IsNotEmpty } from 'class-validator';

export class ContentCategoryDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;
}
