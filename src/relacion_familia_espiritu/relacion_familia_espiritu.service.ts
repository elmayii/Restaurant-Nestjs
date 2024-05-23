import { Injectable } from '@nestjs/common';
import { relacion_familia_espiritu } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FamiliasEspiritusService {
  constructor(private prisma: PrismaService) {}

  async getAllFamiliasEspiritus(): Promise<relacion_familia_espiritu[]> {
    return this.prisma.relacion_familia_espiritu.findMany();
  }

  async getFamiliaEspirituById(id: number): Promise<relacion_familia_espiritu> {
    return this.prisma.relacion_familia_espiritu.findUnique({ where: { id } });
  }

  async createFamiliaEspiritu(
    data: relacion_familia_espiritu,
  ): Promise<relacion_familia_espiritu> {
    return this.prisma.relacion_familia_espiritu.create({ data });
  }

  async updateFamiliaEspiritu(
    data: relacion_familia_espiritu,
    id: number,
  ): Promise<relacion_familia_espiritu> {
    return this.prisma.relacion_familia_espiritu.update({
      where: { id },
      data,
    });
  }

  async deleteFamiliaEspiritu(id: number): Promise<relacion_familia_espiritu> {
    return this.prisma.relacion_familia_espiritu.delete({
      where: { id },
    });
  }
}
