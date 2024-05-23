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
import { FamiliasService } from './familia_espiritual.service';
import { familia_espiritual } from '@prisma/client';
@Controller('familias')
export class FamiliasController {
  constructor(private readonly familiasService: FamiliasService) {}
  @Get()
  async getAllFamilias() {
    return this.familiasService.getAllFamilias();
  }

  @Post()
  async createFamilia(@Body() data: familia_espiritual) {
    return this.familiasService.createFamilia(data);
  }

  @Get(':id')
  async getFamiliaById(@Param('id') id: string) {
    const familiaFound = await this.familiasService.getFamiliaById(Number(id));
    if (!familiaFound) throw new NotFoundException('No existe la Familia');
    return familiaFound;
  }

  @Delete(':id')
  async deleteFamilia(@Param('id') id: string) {
    try {
      return await this.familiasService.deleteFamilia(Number(id));
    } catch (error) {
      throw new NotFoundException('No existe la Familia');
    }
  }

  @Put(':id')
  async updateFamilia(
    @Param('id') id: string,
    @Body() data: familia_espiritual,
  ) {
    try {
      return await this.familiasService.updateFamilia(data, Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
