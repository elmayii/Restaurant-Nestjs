import { Controller, Get, Param, Post } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { EsenciasService } from 'src/esencia/esencia.service';

@Controller('tropipay')
export class TropiPayController {
  constructor(
    private readonly tropiPayService: TropiPayService,
    private readonly esenciaService: EsenciasService,
  ) {}

  @Get('get')
  async get() {
    return await this.tropiPayService.getAccessToken();
  }
  @Post('create-payment-card/:id')
  async createPaymentCard(@Param('id') id: string) {
    const esencia = this.esenciaService.getEsenciaById(Number(id));
    return await this.tropiPayService.createPaymentCard({
      reference: 'my-reference',
      concept: 'Esencias',
      favorite: true,
      description: (await esencia).descripcion,
      amount: (await esencia).precio,
      currency: 'USD',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://my-business.com/payment-ok',
      urlFailed: 'https://my-business.com/payment-ko',
      urlNotification:
        'https://webhook.site/fa08adba-b98a-4c40-84d8-1813b3d5ca2e',
      serviceDate: '2021-08-20',
      client: {
        name: 'John',
        lastName: 'McClane',
        address: 'Ave. Guadí 232, Barcelona, Barcelona',
        phone: '+34645553333',
        email: 'client@email.com',
        countryId: 1,
        termsAndConditions: 'true',
      },
      directPayment: true,
      paymentMethods: ['EXT', 'TPP'],
    });
  }
}
