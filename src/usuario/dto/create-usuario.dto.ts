export class CreateUsuarioDto {
  email: string;
  password?: string;
  type: string;
  isEmailVerified?: boolean;
}
