import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class PostDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  foroId: number;

  @IsString()
  @IsNotEmpty()
  email: string;
}
