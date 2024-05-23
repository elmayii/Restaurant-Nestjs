import { Injectable } from '@nestjs/common';
import { pregunta } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  async getAllPreguntas(): Promise<pregunta[]> {
    return this.prisma.pregunta.findMany();
  }

  async getPreguntaById(id: number): Promise<pregunta> {
    return this.prisma.pregunta.findUnique({ where: { id } });
  }

  async createPregunta(data: pregunta): Promise<pregunta> {
    return this.prisma.pregunta.create({ data });
  }

  async updatePregunta(data: pregunta, id: number): Promise<pregunta> {
    return this.prisma.pregunta.update({
      where: { id },
      data,
    });
  }

  async deletePregunta(id: number): Promise<pregunta> {
    return this.prisma.pregunta.delete({
      where: { id },
    });
  }
}
