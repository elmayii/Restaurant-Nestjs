import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { respuesta_predialogo } from '@prisma/client';
import { RespuestaPredialogoService } from './respuesta_predialogo.service';

@Controller('respuestas_predialogo')
export class RespuestaPredialogoController {
  constructor(private readonly respuestasService: RespuestaPredialogoService) {}
  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Post()
  async createRespuesta(@Body() data: respuesta_predialogo) {
    return this.respuestasService.createRespuesta(data);
  }

  @Delete()
  async deleteRespuesta() {
    return this.respuestasService.deleteRespuesta();
  }
}
