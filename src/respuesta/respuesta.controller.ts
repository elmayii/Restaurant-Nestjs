import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { RespuestasService } from './respuesta.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { respuesta } from '@prisma/client';
import { TranslationService } from 'src/translation/translation.service';

@Controller('respuestas')
export class RespuestasController {
  constructor(
    private readonly respuestasService: RespuestasService,
    private readonly translationService: TranslationService,
  ) {}

  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getRespuestaById(
    @Param() { id }: { id: string },
    @Request() req: any,
    @Query() { type }: { type: string },
    @Query() { lang }: { lang: string },
  ) {
    if (id < '01' || id > '37') {
      return {
        statusCode: 400,
        message: 'Lanzamiento no válido',
      };
    }

    const respuestaFound = await this.respuestasService.getRespuestaById(
      id,
      req.user,
      type,
    );

    if (respuestaFound === 'LIMIT_REACHED') {
      return {
        statusCode: 400,
        message:
          'No puede hacer más lanzamientos especiales. Debe continuar con los lanzamientos normales.',
      };
    }

    if (respuestaFound === 'Vuelve a tirar') {
      return {
        statusCode: 200,
        message: 'Vuelve a tirar',
      };
    }
    if (
      respuestaFound ===
      'Vuelve a tirar para caracterizar el lanzamiento especial'
    ) {
      return {
        statusCode: 200,
        message: 'Vuelve a tirar para caracterizar el lanzamiento especial',
      };
    }
    if (lang !== 'es') {
      await this.translationService.translate();
    }

    return {
      statusCode: 200,
      data: respuestaFound,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async createRespuesta(
    @Body() data: respuesta,
    @Query() { close }: { close: string },
    @Request() req: Request,
  ) {
    if (close)
      return this.respuestasService.closeDialog((req as any).user.email);
    return this.respuestasService.createRespuesta(data);
  }

  @Delete()
  async deleteRespuesta() {
    return this.respuestasService.deleteRespuesta();
  }
}
