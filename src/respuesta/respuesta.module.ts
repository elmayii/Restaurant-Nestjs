import { Module } from '@nestjs/common';
import { RespuestasController } from './respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { WebsocketModule } from 'src/websockets/websocket.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService, EspiritusService],
  imports: [PrismaModule, WebsocketModule,NotificationsModule],
})
export class RespuestaModule {}
