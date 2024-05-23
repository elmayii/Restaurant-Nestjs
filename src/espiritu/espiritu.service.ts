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

  async createEspiritu(data: espiritu): Promise<espiritu> {
    return this.prisma.espiritu.create({ data });
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
