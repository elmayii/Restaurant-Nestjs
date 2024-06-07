import { Controller, Get, Param, Post } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';

@Controller('tropipay')
export class TropiPayController {
  constructor(private readonly tropiPayService: TropiPayService) {}

  @Get('get')
  async get() {
    return await this.tropiPayService.getAccessToken();
  }
  @Post('create-payment-card/:id')
  async createPaymentCard(@Param('id') id: string) {
    return await this.tropiPayService.createPaymentCard({
      reference: 'my-reference',
      concept: 'Bicycle',
      favorite: true,
      description: 'Two wheels',
      amount: id,
      currency: 'USD',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://my-business.com/payment-ok',
      urlFailed: 'https://my-business.com/payment-ko',
      urlNotification: 'https://my-business.com/payment-callback',
      serviceDate: '2021-08-20',
      client: null,
      directPayment: true,
      paymentMethods: ['EXT', 'TPP'],
    });
  }
}
