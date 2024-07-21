import { Injectable } from '@nestjs/common';
import { usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async getAllUsuarios(): Promise<usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async getUsuarioById(id: string): Promise<usuario> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async createUsuario(data: CreateUsuarioDto): Promise<usuario> {
    return this.prisma.usuario.create({ data });
  }

  async updateUsuario(data: UpdateUsuarioDto, id: string): Promise<usuario> {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async deleteUsuario(id: string): Promise<usuario> {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.usuario.findFirst({
      where: {
        email,
      },
    });
  }

  async findOneById(id: string) {
    return this.prisma.usuario.findFirst({
      where: {
        id,
      },
    });
  }

  async findUnverifiedUsers(): Promise<usuario[]> {
    return this.prisma.usuario.findMany({
      where: {
        isEmailVerified: false,
      },
    });
  }
}
