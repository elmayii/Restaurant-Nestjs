import {
  //Body,
  Controller,
  //Delete,
  //Get,
  //Param,
  //Put,
  //Post,
  //NotFoundException,
  //BadRequestException,
} from '@nestjs/common';
import { MonedasService } from './moneda.service';
//import { moneda } from '@prisma/client';
@Controller('monedas')
export class MonedasController {
  constructor(private readonly monedasService: MonedasService) {}
  // @Get()
  // async getAllMonedas() {
  //   return this.monedasService.getAllMonedas();
  // }

  // @Post()
  // async createMoneda(@Body() data: moneda) {
  //   return this.monedasService.createMoneda(data);
  // }

  // @Get(':id')
  // async getMonedaById(@Param('id') id: string) {
  //   const monedaFound = await this.monedasService.getMonedaById(Number(id));
  //   if (!monedaFound) throw new NotFoundException('No existe la Moneda');
  //   return monedaFound;
  // }

  // @Delete(':id')
  // async deleteMoneda(@Param('id') id: string) {
  //   try {
  //     return await this.monedasService.deleteMoneda(Number(id));
  //   } catch (error) {
  //     throw new NotFoundException('No existe la Moneda');
  //   }
  // }

  // @Put(':id')
  // async updateMoneda(@Param('id') id: string, @Body() data: moneda) {
  //   try {
  //     return await this.monedasService.updateMoneda(data, Number(id));
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }
}
