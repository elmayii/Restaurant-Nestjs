// src/restaurant/dto/create-restaurant.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MaxLength } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Bistro Habana',
    required: true
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Calle 4ta e/ avenida X ...',
    required: true
  })
  @IsString()
  @MaxLength(200)
  address: string;

  @ApiProperty({
    example: 10,
    required: true
  })
  @IsInt()
  @Min(1, { message: 'La capacidad debe ser al menos 1' })
  capacity: number;
}

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({
    example: "1,2",
    required: true
  })
  @IsString()
  clients: string;
}
