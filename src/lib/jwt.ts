export interface JWTUser {
  id: string;
  exp: number;
  iat: number;
  email?:string
}
