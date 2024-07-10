import { Module } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { TropiPayController } from './tropipay.controller';
import { HttpModule } from '@nestjs/axios';
import { EsenciasService } from 'src/esencia/esencia.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuariosService } from 'src/usuario/usuario.service';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';

@Module({
  providers: [TropiPayService, EsenciasService, UsuariosService, WebsocketGateway],
  controllers: [TropiPayController],
  imports: [HttpModule, PrismaModule],
})
export class TropiPayModule {}
