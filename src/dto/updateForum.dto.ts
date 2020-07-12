import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateForumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
