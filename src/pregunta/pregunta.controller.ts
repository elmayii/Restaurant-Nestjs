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
import { PreguntasService } from './pregunta.service';
import { pregunta } from '@prisma/client';
@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}
  @Get()
  async getAllPreguntas() {
    return this.preguntasService.getAllPreguntas();
  }

  @Post()
  async createPregunta(@Body() data: pregunta) {
    return this.preguntasService.createPregunta(data);
  }

  @Get(':id')
  async getPreguntaById(@Param('id') id: string) {
    const preguntaFound = await this.preguntasService.getPreguntaById(
      Number(id),
    );
    if (!preguntaFound) throw new NotFoundException('No existe la pregunta');
    return preguntaFound;
  }

  @Delete(':id')
  async deletePregunta(@Param('id') id: string) {
    try {
      return await this.preguntasService.deletePregunta(Number(id));
    } catch (error) {
      throw new NotFoundException('No existe la pregunta');
    }
  }

  @Put(':id')
  async updatePregunta(@Param('id') id: string, @Body() data: pregunta) {
    try {
      return await this.preguntasService.updatePregunta(data, Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
