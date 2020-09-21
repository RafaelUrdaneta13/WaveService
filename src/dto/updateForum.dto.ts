import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateForumDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
