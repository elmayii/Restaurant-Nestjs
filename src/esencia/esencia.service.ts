import { Injectable } from '@nestjs/common';
import { esencia } from '@prisma/client';
import { calculatePrice } from 'src/lib/calc';
import { PriceDTO } from 'src/lib/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EsenciasService {
  constructor(private prisma: PrismaService) {}

  async getAllEsencias(): Promise<esencia[]> {
    return this.prisma.esencia.findMany({orderBy:{id:'desc'}});
  }

  async getEsenciaById(id: number): Promise<esencia> {
    return this.prisma.esencia.findUnique({ where: { id } });
  }

  async createEsencia(data: esencia): Promise<esencia> {
    return this.prisma.esencia.create({ data });
  }

  async updateEsencia(data: esencia, id: number): Promise<esencia> {
    return this.prisma.esencia.update({
      where: { id },
      data,
    });
  }

  async deleteEsencia(id: number): Promise<esencia> {
    return this.prisma.esencia.delete({
      where: { id },
    });
  }

  calculateEsenciaCost(esencia: number): PriceDTO {
    return calculatePrice(esencia);
  }
}
