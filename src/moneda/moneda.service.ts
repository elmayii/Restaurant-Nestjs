import { Injectable } from '@nestjs/common';
import { moneda } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MonedasService {
  constructor(private prisma: PrismaService) {}

  async getAllMonedas(): Promise<moneda[]> {
    return this.prisma.moneda.findMany();
  }

  async getMonedaById(id: number): Promise<moneda> {
    return this.prisma.moneda.findUnique({ where: { id } });
  }

  async createMoneda(data: moneda): Promise<moneda> {
    return this.prisma.moneda.create({ data });
  }

  async updateMoneda(data: moneda, id: number): Promise<moneda> {
    return this.prisma.moneda.update({
      where: { id },
      data,
    });
  }

  async deleteMoneda(id: number): Promise<moneda> {
    return this.prisma.moneda.delete({
      where: { id },
    });
  }
}
