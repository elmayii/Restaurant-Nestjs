import { Injectable } from '@nestjs/common';
import { respuesta_especial } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RespuestasEspecialService {
  constructor(private prisma: PrismaService) {}

  async getAllRespuestas(): Promise<respuesta_especial[]> {
    return this.prisma.respuesta_especial.findMany();
  }

  async createRespuesta(data: respuesta_especial): Promise<respuesta_especial> {
    return this.prisma.respuesta.create({ data });
  }

  async deleteRespuesta() {
    this.prisma.respuesta.deleteMany();
  }
}
