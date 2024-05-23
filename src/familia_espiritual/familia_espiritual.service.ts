import { Injectable } from '@nestjs/common';
import { familia_espiritual } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FamiliasService {
  constructor(private prisma: PrismaService) {}

  async getAllFamilias(): Promise<familia_espiritual[]> {
    return this.prisma.familia_espiritual.findMany();
  }

  async getFamiliaById(id: number): Promise<familia_espiritual> {
    return this.prisma.familia_espiritual.findUnique({ where: { id } });
  }

  async createFamilia(data: familia_espiritual): Promise<familia_espiritual> {
    return this.prisma.familia_espiritual.create({ data });
  }

  async updateFamilia(
    data: familia_espiritual,
    id: number,
  ): Promise<familia_espiritual> {
    return this.prisma.familia_espiritual.update({
      where: { id },
      data,
    });
  }

  async deleteFamilia(id: number): Promise<familia_espiritual> {
    return this.prisma.familia_espiritual.delete({
      where: { id },
    });
  }
}
