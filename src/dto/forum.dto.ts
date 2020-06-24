import { IsString, IsNotEmpty } from 'class-validator';

export class ForumDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
