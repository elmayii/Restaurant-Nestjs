import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { RespuestasService } from './respuesta.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { respuesta } from '@prisma/client';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}
  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getRespuestaById(
    @Param() { id }: { id: string },
    @Request() req: Request,
    @Query() { type }: { type: string },
  ) {
    if (id < '01' || id > '37') {
      return {
        statusCode: 400,
        message: 'Lanzamiento no válido',
      };
    }

    const respuestaFound = await this.respuestasService.getRespuestaById(
      id,
      req.body,
      type,
    );

    if (!respuestaFound) {
      return {
        statusCode: 200,
        message: 'Vuelve a tirar',
      };
    }

    return {
      statusCode: 200,
      data: respuestaFound,
    };
  }

  @Post()
  async createRespuesta(@Body() data: respuesta) {
    return this.respuestasService.createRespuesta(data);
  }
}
