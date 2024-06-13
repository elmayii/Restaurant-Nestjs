import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { EsenciasService } from 'src/esencia/esencia.service';
import { sha256 } from 'js-sha256';
import { UsuariosService } from 'src/usuario/usuario.service';

@Controller('tropipay')
export class TropiPayController {
  constructor(
    private readonly tropiPayService: TropiPayService,
    private readonly esenciaService: EsenciasService,
    private readonly usuarioService: UsuariosService,
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
  @Post()
  async validateSignature(@Body() data) {
    console.log(data.data.charges[0].clientEmail);
    const { bankOrderCode, originalCurrencyAmount, signaturev2 } = data.data;
    const clientId = process.env.TROPIPAY_CLIENT_ID;
    const clientSecret = process.env.TROPIPAY_CLIENT_SECRET;

    const messageToSign = `${bankOrderCode}${clientId}${clientSecret}${originalCurrencyAmount}`;

    const expectedSignature = sha256(messageToSign);

    if (expectedSignature === signaturev2) {
      let epay = 0;
      if (data.data.charges[0].amount === 199) {
        epay = 15;
      } else if (data.data.charges[0].amount === 399) {
        epay = 40;
      } else if (data.data.charges[0].amount === 799) {
        epay = 100;
      } else {
        epay = 240;
      }
      const user = this.usuarioService.findOneByEmail(
        data.data.charges[0].clientEmail,
      );
      (await user).esencia = (await user).esencia + epay;
      this.usuarioService.updateUsuario(await user, (await user).id);
    } else {
      console.log('Firma no válida');
    }
  }
}
