import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferenciaDto } from 'src/lib/dtos';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TransferenciaService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createTransferencia(
    userId: string,
    createTransferenciaDto: CreateTransferenciaDto,
  ) {
    const { receiver, amount } = createTransferenciaDto;
    const sender = await this.prisma.usuario.findFirst({
      where: { id: userId },
    });

    if (!sender || sender.esencia < amount) {
      throw new BadRequestException('Insufficient essence');
    }

    const receiverUser = await this.prisma.usuario.findUnique({
      where: { email: receiver },
    });

    if (!receiverUser) {
      throw new BadRequestException('Receiver not found');
    }

    await this.prisma.$transaction([
      this.prisma.usuario.update({
        where: { id: userId },
        data: { esencia: { decrement: amount } },
      }),
      this.prisma.usuario.update({
        where: { email: receiver },
        data: { esencia: { increment: amount } },
      }),
      this.prisma.transferencia.create({
        data: {
          user_id: userId,
          receiver: receiverUser.email,
          amount: amount,
        },
      }),
    ]);

    this.notificationsService.createNotification({
      nombre: 'Transferencia',
      id_usuario: receiverUser.id,
      tipo: 'transferencia',
      descripcion: `Usted ha recibido ${amount} de Esencia de ${sender.email}`,
      estado: false,
    });

    this.notificationsService.createNotification({
      nombre: 'Transferencia',
      id_usuario: sender.id,
      tipo: 'transferencia',
      descripcion: `Usted ha enviado ${amount} de Esencia a ${receiverUser.email}`,
      estado: false,
    });

    return { essence: (sender.esencia - amount) };
  }

  async getRecentTransfers(userId: string) {
    const transfers = await this.prisma.transferencia.findMany({
      where: {
        OR: [{ user_id: userId }, { receiver: userId }],
      },
      orderBy: {
        date: 'desc',
      },
      take: 30,
      include: {
        usuario: {
          select: {
            email: true,
          },
        },
      },
    });

    return transfers.map((transfer) => ({
      id: transfer.id,
      senderEmail: transfer.usuario?.email,
      receiverEmail: transfer.receiver,
      amount: transfer.amount,
      date: transfer.date,
    }));
  }

  async searchUsersByEmail(emailFragment: string) {
    return this.prisma.usuario.findMany({
      where: {
        email: {
          contains: emailFragment,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
