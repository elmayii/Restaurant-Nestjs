import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password?: string;
}

export class LogOutData {
  @IsString()
  providerId: string;
}
export class LogOutDto {
  @IsString()
  providerId: string;

  @IsString()
  userId: string;
}
