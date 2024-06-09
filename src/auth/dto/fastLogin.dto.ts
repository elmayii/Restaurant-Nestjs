import { IsString } from 'class-validator';
export class FastLoginDto {
  @IsString()
  id: string;
}
