import { Injectable } from '@nestjs/common';
import { espiritu } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EspiritusService {
  constructor(private prisma: PrismaService) {}

  async getAllEspiritus(): Promise<espiritu[]> {
    return this.prisma.espiritu.findMany();
  }

  async getEspirituById(id: number): Promise<espiritu> {
    return this.prisma.espiritu.findUnique({ where: { id } });
  }

  async createEspiritu(data: espiritu, req: any): Promise<espiritu> {
    const user = await this.prisma.usuario.findFirst({
      where: { email: req.email },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const espirituCount = await this.prisma.espiritu.count({
      where: { id_usuario: user.id },
    });

    const espirituName = `Espiritu ${espirituCount + 1}`;

    return this.prisma.espiritu.create({
      data: {
        ...data,
        nombre: espirituName,
        id_usuario: user.id,
      },
    });
  }

  async updateEspiritu(data: espiritu, id: number): Promise<espiritu> {
    return this.prisma.espiritu.update({
      where: { id },
      data,
    });
  }

  async deleteEspiritu(id: number): Promise<espiritu> {
    return this.prisma.espiritu.delete({
      where: { id },
    });
  }
}
