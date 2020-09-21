import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
export class EditUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  userName: string;
}
