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
import { AccessGuard } from 'src/auth/auth.guard';
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
  @UseGuards(AccessGuard)
  async getRespuestaById(
    @Param() { id }: { id: string },
    @Param() { action }: { action: string | null | undefined },
    @Param() { param1 }: { param1: number | null | undefined },
    @Param() { param2 }: { param2: string | null | undefined },
    @Request() req: any,
    @Query() { type }: { type: string },
    @Query() { lang }: { lang: string },
  ) {
    if (id < '01' || id > '37') {
      let message = 'Lanzamiento no válido';
      if (lang !== 'es') {
        message = await this.translationService.translateText(
          message,
          'es',
          lang,
        );
      }
      return {
        statusCode: 400,
        message: message,
      };
    }

    let respuestaFound = await this.respuestasService.getRespuestaById(
      id,
      req.user,
      type,
      action,
      param1,
      param2,
    );

    if (respuestaFound === 'LIMIT_REACHED') {
      let message =
        'No puede hacer más lanzamientos especiales. Debe continuar con los lanzamientos normales.';
      if (lang !== 'es') {
        message = await this.translationService.translateText(
          message,
          'es',
          lang,
        );
      }
      return {
        statusCode: 400,
        message: message,
      };
    }

    if (respuestaFound === 'Vuelve a tirar') {
      let message = 'Vuelve a tirar';
      if (lang !== 'es') {
        message = await this.translationService.translateText(
          message,
          'es',
          lang,
        );
      }
      return {
        statusCode: 200,
        message: message,
      };
    }
    if (
      respuestaFound ===
      'Vuelve a tirar para caracterizar el lanzamiento especial'
    ) {
      let message = 'Vuelve a tirar para caracterizar el lanzamiento especial';
      if (lang !== 'es') {
        message = await this.translationService.translateText(
          message,
          'es',
          lang,
        );
      }
      return {
        statusCode: 200,
        message: message,
      };
    }

    if (lang !== 'es') {
      respuestaFound = await this.translationService.translateText(
        respuestaFound,
        'es',
        lang,
      );
    }

    return {
      statusCode: 200,
      data: respuestaFound,
    };
  }

  @Post()
  @UseGuards(AccessGuard)
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
