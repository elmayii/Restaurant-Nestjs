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
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PreguntasService } from './pregunta.service';
import { pregunta } from '@prisma/client';
import { AccessGuard } from 'src/auth/auth.guard';
@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}
  @Get()
  @UseGuards(AccessGuard)
  async getAllPreguntas(@Request() req: any, @Query('type') type: string) {
    return this.preguntasService.getAllPreguntas(req.user, type);
  }

  @Post()
  @UseGuards(AccessGuard)
  async createPregunta(@Body() data: pregunta, @Request() req: any) {
    return this.preguntasService.createPregunta(data, req.user);
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  async getPreguntaById(@Param('id') id: string) {
    const preguntaFound = await this.preguntasService.getPreguntaById(
      Number(id),
    );
    if (!preguntaFound) throw new NotFoundException('No existe la pregunta');
    return preguntaFound;
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  async deletePregunta(@Param('id') id: string) {
    try {
      return await this.preguntasService.deletePregunta(Number(id));
    } catch (error) {
      throw new NotFoundException('No existe la pregunta');
    }
  }

  @Put(':id')
  @UseGuards(AccessGuard)
  async updatePregunta(@Param('id') id: string, @Body() data: pregunta) {
    try {
      return await this.preguntasService.updatePregunta(data, Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
