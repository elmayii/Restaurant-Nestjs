import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { PaymentCheck } from './dto/paymentCheck';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TropiPayService {
  constructor(
    private http: HttpService,
    private prisma: PrismaService,
  ) {}

  async getAccessToken() {
    const body = {
      grant_type: 'client_credentials',
      client_id: process.env.TROPIPAY_CLIENT_ID,
      client_secret: process.env.TROPIPAY_CLIENT_SECRET,
    };
    return await this.http
      .post(process.env.GET_ACCESS_TOKEN, body)
      .pipe(map((response) => response.data.access_token))
      .toPromise();
  }

  async createPaymentCard(body: any) {
    const accessToken = await this.getAccessToken();
    console.log(accessToken);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await this.http
        .post(process.env.CREATE_PAYMENT_CARD, body, { headers })
        .toPromise();
      console.log(response)
      return response.data;
    } catch (error) {
      console.error(error.response.data);
    }
  }

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
