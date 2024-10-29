// src/order/dto/create-order.dto.ts
import { IsString, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Pedido de hamburguesas y refrescos',
    required: true
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 1,
    required: true
  })
  @IsInt()
  client: number;

  @ApiProperty({
    example: 1,
    required: true
  })
  @IsInt()
  restaurant: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

