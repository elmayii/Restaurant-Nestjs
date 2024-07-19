import { IsEmail, IsInt, Min } from 'class-validator';

export class CreateTransferenciaDto {
  @IsEmail()
  receiver: string;

  @IsInt()
  @Min(1)
  amount: number;
}

export interface PriceDTO {
  descuento: number;
  costo: number;
  esencia: number;
}
