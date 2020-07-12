import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAdminForumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  subcategory: number;
}