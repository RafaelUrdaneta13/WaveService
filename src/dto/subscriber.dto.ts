import { IsString, IsNotEmpty } from 'class-validator';

export class SubscriberDto {
  @IsNotEmpty()
  @IsString()
  endpoint: string;

  @IsNotEmpty()
  @IsString()
  encriptionKey: string;

  @IsNotEmpty()
  @IsString()
  authSecret: string;
}
