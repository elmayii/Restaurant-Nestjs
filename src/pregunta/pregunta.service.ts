import { Injectable } from '@nestjs/common';
import { pregunta } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  async getAllPreguntas(request: any, type: string): Promise<pregunta[]> {
    if (type)
      return this.prisma.pregunta.findMany({
        where: { id_usuario: request.id, tipo: type },
      });
    else {
      return this.prisma.pregunta.findMany({
        where: { id_usuario: request.id },
      });
    }
  }

  async getPreguntaById(id: number): Promise<pregunta> {
    return this.prisma.pregunta.findUnique({ where: { id } });
  }

  async createPregunta(data: pregunta, request: any): Promise<pregunta> {
    //console.log(request);
    const user = await this.prisma.usuario.findFirst({
      where: { id: request.id },
    });

    const date = new Date();

    if (data.tipo === 'dialog') {
      return this.prisma.pregunta.create({
        data: {
          ...data,
          id_usuario: user.id,
          fecha: date,
        },
      });
    } else if (data.tipo === 'day') {
      return this.prisma.pregunta.create({
        data: {
          ...data,
          id_usuario: user.id,
          fecha: date,
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
