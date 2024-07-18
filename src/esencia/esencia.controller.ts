import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EsenciasService } from './esencia.service';
import { esencia } from '@prisma/client';
@Controller('esencias')
export class EsenciasController {
  constructor(private readonly esenciasService: EsenciasService) {}
  @Get()
  async getAllEsencias() {
    return this.esenciasService.getAllEsencias();
  }

  @Post()
  async createEsencia(@Body() data: esencia) {
    return this.esenciasService.createEsencia(data);
  }

  @Get(':id')
  async getEsenciaById(@Param('id') id: string) {
    const esenciaFound = await this.esenciasService.getEsenciaById(Number(id));
    if (!esenciaFound) throw new NotFoundException('No existe la esencia');
    return esenciaFound;
  }

  @Get('calculate/:esencia')
  async getExactEsenciaCost(@Param('esencia') esencia: number) {
    return this.esenciasService.calculateEsenciaCost(esencia);
  }

  @Delete(':id')
  async deleteEsencia(@Param('id') id: string) {
    try {
      return await this.esenciasService.deleteEsencia(Number(id));
    } catch (error) {
      throw new NotFoundException('No existe la esencia');
    }
  }

  @Put(':id')
  async updateEsencia(@Param('id') id: string, @Body() data: esencia) {
    try {
      return await this.esenciasService.updateEsencia(data, Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
