import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { respuesta_predialogo } from '@prisma/client';
import { RespuestaPredialogoService } from './respuesta_predialogo.service';
import { AccessGuard } from 'src/auth/auth.guard';

@Controller('respuestas_predialogo')
export class RespuestaPredialogoController {
  constructor(private readonly respuestasService: RespuestaPredialogoService) {}
  @Get()
  @UseGuards(AccessGuard)
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Post()
  @UseGuards(AccessGuard)
  async createRespuesta(@Body() data: respuesta_predialogo) {
    return this.respuestasService.createRespuesta(data);
  }

  @Delete()
  @UseGuards(AccessGuard)
  async deleteRespuesta() {
    return this.respuestasService.deleteRespuesta();
  }
}
