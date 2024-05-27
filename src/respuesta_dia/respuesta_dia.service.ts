import { Injectable } from '@nestjs/common';
import { respuesta_dia } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RespuestasDiaService {
  constructor(private prisma: PrismaService) {}

  async getAllRespuestas(): Promise<respuesta_dia[]> {
    return this.prisma.respuesta_especial.findMany();
  }

  async createRespuesta(data: respuesta_dia): Promise<respuesta_dia> {
    return this.prisma.respuesta.create({ data });
  }
}
