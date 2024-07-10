import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { EsenciasService } from 'src/esencia/esencia.service';
import { sha256 } from 'js-sha256';
import { UsuariosService } from 'src/usuario/usuario.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTUser } from 'src/lib/jwt';
import { AccessGuard } from 'src/auth/auth.guard';

@Controller('tropipay')
export class TropiPayController {
  constructor(
    private readonly tropiPayService: TropiPayService,
    private readonly esenciaService: EsenciasService,
    private readonly usuarioService: UsuariosService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('get')
  async get() {
    return await this.tropiPayService.getAccessToken();
  }

  @Post('create-payment-card/:id')
  @UseGuards(AccessGuard)
  async createPaymentCard(
    @Param('id') id: string,
    @Request() req: { user: JWTUser },
  ) {
    const ref = (await this.usuarioService.getUsuarioById(req.user.id)).email;
    const esencia = this.esenciaService.getEsenciaById(Number(id));
    return await this.tropiPayService.createPaymentCard({
      reference: ref,
      concept: 'Esencias',
      favorite: true,
      description: (await esencia).descripcion,
      amount: (await esencia).precio,
      currency: 'USD',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://eons-main.vercel.app/payment',
      urlFailed: 'https://eons-main.vercel.app/payment/failed',
      urlNotification:
        //'https://webhook.site/a8b11a1a-e3b9-4811-9f0f-a0452647a269'
        'https://eons-back.onrender.com/tropipay/',
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
      const user = this.usuarioService.findOneByEmail(data.data.reference);
      (await user).esencia = (await user).esencia + epay;
      this.usuarioService.updateUsuario(await user, (await user).id);
      return this.prisma.compra.create({
        data: {
          email: data.data.reference,
          bank_order: data.data.bankOrderCode,
        },
      });
    } else {
      console.log('Firma no válida');
    }
  }

  @Post('validate-payment')
  async validatePayment(@Body() data: any) {
    return await this.tropiPayService.validateBankOrder(data);
  }
}
