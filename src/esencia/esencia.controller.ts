import { Controller, Get, Param } from '@nestjs/common';
import { EsenciasService } from './esencia.service';
@Controller('esencias')
export class EsenciasController {
  constructor(private readonly esenciasService: EsenciasService) {}
  @Get()
  async getAllEsencias() {
    return this.esenciasService.getAllEsencias();
  }

  @Get('calculate/:esencia')
  async getExactEsenciaCost(@Param('esencia') esencia: number) {
    return this.esenciasService.calculateEsenciaCost(esencia);
  }
}
