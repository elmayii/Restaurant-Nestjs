import { Injectable } from '@nestjs/common';
import { notificaciones } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationDto, patchNotification } from './dto/NotificationsDto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllUnreadNotifications(id: string): Promise<notificaciones[]> {
    return this.prisma.notificaciones.findMany({
      where: {
        id_usuario: id,
        estado: false,
      },
    });
  }

  async updateStateNotification(
    data: patchNotification,
  ): Promise<notificaciones> {
    return this.prisma.notificaciones.update({
      where: {
        id: data.id,
      },
      data: {
        estado: data.state,
      },
    });
  }

  async createNotification(data: NotificationDto): Promise<notificaciones> {
    return this.prisma.notificaciones.create({
      data: {
        id_usuario: data.id_usuario,
        descripcion: data.descripcion,
        estado: data.estado,
        nombre: data.nombre,
        tipo: data.tipo,
        date: new Date()
      },
    });
  }
}
