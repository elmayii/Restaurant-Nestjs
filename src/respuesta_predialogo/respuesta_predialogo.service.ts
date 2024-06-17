import { Injectable } from '@nestjs/common';
import { respuesta_predialogo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RespuestaPredialogoService {
  constructor(private prisma: PrismaService) {}

  async getAllRespuestas(): Promise<respuesta_predialogo[]> {
    return this.prisma.respuesta_especial.findMany();
  }

  async createRespuesta(
    data: respuesta_predialogo,
  ): Promise<respuesta_predialogo> {
    return this.prisma.respuesta.create({ data });
  }

  async deleteRespuesta() {
    return this.prisma.respuesta_especial.deleteMany();
  }
}
