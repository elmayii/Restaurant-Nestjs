import { IsEmail } from 'class-validator';

export class Oauth2Dto {
  @IsEmail()
  email: string;
}
