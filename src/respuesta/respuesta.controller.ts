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
import { JWTUser } from 'src/lib/jwt';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}

  @Get()
  async getAllrespuestas() {
    return this.respuestasService.getAllRespuestas();
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  async getRespuestaById(
    @Param() { id }: { id: string },
    @Query() { action }: { action: string | null | undefined },
    @Query() { param1 }: { param1: number | null | undefined },
    @Query() { param2 }: { param2: string | null | undefined },
    @Request() req: { user: JWTUser },
    @Query() { type }: { type: string },
  ) {
    console.log(req.user);
    if (id < '01' || id > '37') {
      const message = 'Lanzamiento no válido';
      // if (lang !== 'es') {
      //   message = await this.translationService.translateText(
      //     message,
      //     'es',
      //     lang,
      //   );
      // }
      return {
        statusCode: 400,
        message: message,
      };
    }

    const respuestaFound = await this.respuestasService.getRespuestaById(
      id,
      req.user.id,
      type,
      action,
      param1,
      param2,
    );

    if (respuestaFound === 'LIMIT_REACHED') {
      const message =
        'No puede hacer más lanzamientos especiales. Debe continuar con los lanzamientos normales.';
      // if (lang !== 'es') {
      //   message = await this.translationService.translateText(
      //     message,
      //     'es',
      //     lang,
      //   );
      // }
      return {
        statusCode: 400,
        message: message,
      };
    }

    if (respuestaFound === 'Vuelve a tirar') {
      const message = 'Vuelve a tirar';
      // if (lang !== 'es') {
      //   message = await this.translationService.translateText(
      //     message,
      //     'es',
      //     lang,
      //   );
      // }
      return {
        statusCode: 200,
        message: message,
      };
    }
    if (
      respuestaFound ===
      'Vuelve a tirar para caracterizar el lanzamiento especial'
    ) {
      const message =
        'Vuelve a tirar para caracterizar el lanzamiento especial';
      // if (lang !== 'es') {
      //   message = await this.translationService.translateText(
      //     message,
      //     'es',
      //     lang,
      //   );
      // }
      return {
        statusCode: 200,
        message: message,
      };
    }

    // if (lang !== 'es') {
    //   respuestaFound = await this.translationService.translateText(
    //     respuestaFound,
    //     'es',
    //     lang,
    //   );
    // }

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
    @Request() req: { user: JWTUser },
  ) {
    if (close) return this.respuestasService.closeDialog(req.user.id);
    return this.respuestasService.createRespuesta(data);
  }

  @Delete()
  async deleteRespuesta() {
    return this.respuestasService.deleteRespuesta();
  }
}
