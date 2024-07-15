import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentCheck } from './dto/paymentCheck';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TropiPayService {
  constructor(private prisma: PrismaService) {}

  async validateBankOrder(data: PaymentCheck) {
    try {
      console.log(data);
      const compra = this.prisma.compra.findFirst({
        where: { email: data.reference, bank_order: data.banckOrderCode },
      });

      if (compra) {
        return { message: 'Compra exitosa' };
      } else {
        throw new NotFoundException('No se encuentra la compra');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
