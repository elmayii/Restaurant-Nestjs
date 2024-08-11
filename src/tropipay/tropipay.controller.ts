import {
  Controller,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { EsenciasService } from 'src/esencia/esencia.service';
import { sha256 } from 'js-sha256';
import { UsuariosService } from 'src/usuario/usuario.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTUser } from 'src/lib/jwt';
import { AccessGuard } from 'src/auth/auth.guard';
import { Tropipay } from '@yosle/tropipayjs';
import { ServerMode$1 } from './type/type';
import { PaymentOperation } from './dto/paymentCheck';
import { TranslationService } from 'src/translation/translation.service';

@Controller('tropipay')
export class TropiPayController {
  constructor(
    private readonly tropiPayService: TropiPayService,
    private readonly esenciaService: EsenciasService,
    private readonly usuarioService: UsuariosService,
    private readonly prisma: PrismaService,
    private readonly translationService: TranslationService,
  ) {}
  config = {
    clientId: process.env.TROPIPAY_CLIENT_ID,
    clientSecret: process.env.TROPIPAY_CLIENT_SECRET,
    scopes: [
      'ALLOW_GET_PROFILE_DATA',
      'ALLOW_PAYMENT_IN',
      'ALLOW_EXTERNAL_CHARGE',
      'KYC3_FULL_ALLOW',
      'ALLOW_GET_BALANCE',
      'ALLOW_GET_MOVEMENT_LIST',
    ],
    serverMode: 'Production' as ServerMode$1,
  };
  tpp = new Tropipay(this.config);

  @Post('create-payment-card/:id')
  @UseGuards(AccessGuard)
  async createPaymentCard(
    @Param('id') id: string,
    @Request() req: { user: JWTUser },
    @Query() { lang }: { lang: string },
  ) {
    const date = new Date();
    const formattedDateTime = date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const ref = (await this.usuarioService.getUsuarioById(req.user.id)).email;
    const esencia = await this.esenciaService.getEsenciaById(Number(id));
    const payload = {
      descripcion: await this.translationService.translateText(
        esencia.descripcion,
        'es',
        lang,
      ),
      precio: Number(esencia.precio) * 100,
    };
    return await this.tpp.paymentCards.create({
      reference: ref,
      concept: 'de Esencia',
      favorite: true,
      description: payload.descripcion,
      amount: payload.precio,
      currency: 'EUR',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://www.eons.es/payment',
      urlFailed: 'https://www.eons.es/payment/failed',
      urlNotification:
        //'https://webhook.site/a8b11a1a-e3b9-4811-9f0f-a0452647a269'
        'https://eons-services.onrender.com/tropipay',
      serviceDate: formattedDateTime,
      client: null,
      directPayment: true,
      paymentMethods: ['EXT', 'TPP'],
    });
  }

  @Post('create-payment-card')
  @UseGuards(AccessGuard)
  async createPaymentCustomCard(
    @Body() datah: PaymentOperation,
    @Request() req: { user: JWTUser },
    @Query() { lang }: { lang: string },
  ) {
    const date = new Date();
    const formattedDateTime = date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const ref = (await this.usuarioService.getUsuarioById(req.user.id)).email;
    const payload = {
      descripcion: await this.translationService.translateText(
        `${datah.esencia} de Esencia`,
        'es',
        lang,
      ),
      precio: datah.precio * 100,
    };
    return await this.tpp.paymentCards.create({
      reference: ref,
      concept: 'Esencia',
      favorite: true,
      description: payload.descripcion,
      amount: payload.precio,
      currency: 'EUR',
      singleUse: true,
      reasonId: 4,
      expirationDays: 1,
      lang: 'es',
      urlSuccess: 'https://www.eons.es/payment',
      urlFailed: 'https://www.eons.es/payment/failed',
      urlNotification:
        'https://webhook.site/c43d202f-2571-4a6c-af46-e2a3ca539851',
      //'https://eons-services.onrender.com/tropipay/',
      serviceDate: formattedDateTime,
      client: null,
      directPayment: true,
      paymentMethods: ['EXT', 'TPP'],
    });
  }

  @Post()
  async validateSignature(@Body() data) {
    const { bankOrderCode, originalCurrencyAmount, signaturev2 } = data.data;
    console.log(signaturev2);
    const clientId = process.env.TROPIPAY_CLIENT_ID;
    const clientSecret = process.env.TROPIPAY_CLIENT_SECRET;

    const messageToSign = `${bankOrderCode}${clientId}${clientSecret}${originalCurrencyAmount}`;

    const expectedSignature = sha256(messageToSign);
    console.log(expectedSignature);

    if (expectedSignature === signaturev2) {
      let epay = 0;
      if (data.data.charges[0].amount === 499) {
        epay = 5;
      } else if (data.data.charges[0].amount === 1440) {
        epay = 15;
      } else if (data.data.charges[0].amount === 2350) {
        epay = 25;
      } else if (data.data.charges[0].amount === 4599) {
        epay = 50;
      } else if (data.data.charges[0].amount === 8999) {
        epay = 100;
      } else if (data.data.charges[0].amount === 21250) {
        epay = 250;
      } else {
        const match = data.data.paymentcard.description.match(/\d+/);
        epay = match ? parseInt(match[0], 10) : null;
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
