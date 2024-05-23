import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RespuestasService } from './respuesta.service';
import { AuthGuard } from 'src/auth/auth.guard';
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
    const respuestaFound = await this.respuestasService.getRespuestaById(
      id,
      req.body,
      type,
    );
    console.log(respuestaFound);
    if (!respuestaFound) throw new NotFoundException('Vuelve a tirar');
    return respuestaFound;
  }
}
