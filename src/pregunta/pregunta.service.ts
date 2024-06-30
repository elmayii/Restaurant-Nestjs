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

  async createPregunta(data: pregunta, request: any): Promise<pregunta> {
    const user = await this.prisma.usuario.findFirst({
      where: { email: request.email },
    });
    if (data.tipo === 'dialog') {
      return this.prisma.pregunta.create({
        data: {
          ...data,
          id_usuario: user.id,
        },
      });
    } else if (data.tipo === 'day') {
      const date = new Date();
      const formattedDateTime = date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return this.prisma.pregunta.create({
        data: {
          ...data,
          id_usuario: user.id,
          fecha: formattedDateTime,
        },
      });
    }
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
