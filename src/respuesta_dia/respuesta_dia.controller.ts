import { Controller, Get, Post, Body } from '@nestjs/common';
import { RespuestasDiaService } from './respuesta_dia.service';
import { respuesta_dia } from '@prisma/client';

@Controller('respuestas_dia')
export class RespuestasDiaController {
  constructor(private readonly respuestasService: RespuestasDiaService) {}
  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Post()
  async createRespuesta(@Body() data: respuesta_dia) {
    return this.respuestasService.createRespuesta(data);
  }
}
