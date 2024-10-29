// src/client/dto/create-client.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, Min, MaxLength, IsPhoneNumber } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'Juan Perez',
    required: true
  })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'juan.perez@gmail.com',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+5355241256',
    required: true
  })
  @IsString()
  @IsPhoneNumber()
  @MaxLength(15)
  phone: string;

  @ApiProperty({
    example: 20,
    required: true
  })
  @IsInt()
  @Min(18, { message: 'El cliente debe tener al menos 18 años' })
  age: number;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}