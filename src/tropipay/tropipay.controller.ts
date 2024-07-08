import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { EsenciasService } from 'src/esencia/esencia.service';
import { sha256 } from 'js-sha256';
import { UsuariosService } from 'src/usuario/usuario.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('tropipay')
export class TropiPayController {
  constructor(
    private readonly tropiPayService: TropiPayService,
    private readonly esenciaService: EsenciasService,
    private readonly usuarioService: UsuariosService,
    private readonly prisma: PrismaService
  ) {}

  @Get('get')
  async get() {
    return await this.tropiPayService.getAccessToken();
  }
  @Post('create-payment-card/:id')
  async createPaymentCard(@Param('id') id: string) {
    const ID = parseInt(id)
    if(ID >= 1 && ID <= 4){
      const esencia = this.esenciaService.getEsenciaById(Number(id));
    }
    const esencia = this.esenciaService.getEsenciaById(Number(id));
    return await this.tropiPayService.createPaymentCard({
      reference: 'mayito2',
      concept: 'Esencias',
      favorite: true,
      description: (await esencia).descripcion,
      amount: (await esencia).precio,
      currency: 'USD',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://webhook.site/c984565f-07bb-4a0a-ab20-87d1294fc0bd',
      urlFailed: 'https://my-business.com/payment-ko',
      urlNotification:
        'https://webhook.site/a8b11a1a-e3b9-4811-9f0f-a0452647a269',
      serviceDate: '2021-08-20',
      client: null,
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
        data.data.reference,
      );
      (await user).esencia = (await user).esencia + epay;
      this.usuarioService.updateUsuario(await user, (await user).id);
      return this.prisma.compra.create({data:{
        email: data.data.reference,
        bank_order: data.data.bankOrderCode,
      }})
    } else {
      console.log('Firma no válida');
    }
  }
}
