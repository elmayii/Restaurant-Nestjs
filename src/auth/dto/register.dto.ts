import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

enum TYPE {
  mail,
  apple,
  microsoft,
  google
}
export class RegisterDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password?: string;

  @IsEnum(TYPE)
  type?:string;
}
