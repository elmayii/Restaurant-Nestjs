import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { RespuestasEspecialService } from './respuesta_especial.service';
import { respuesta_especial } from '@prisma/client';

@Controller('respuestas_especial')
export class RespuestasEspecialController {
  constructor(private readonly respuestasService: RespuestasEspecialService) {}
  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Post()
  async createRespuesta(@Body() data: respuesta_especial) {
    return this.respuestasService.createRespuesta(data);
  }

  @Delete()
  async deleteRespuesta() {
    return this.respuestasService.deleteRespuesta();
  }
}
