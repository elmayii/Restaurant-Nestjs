import { Module } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { TransferenciaController } from './transferencia.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebsocketModule } from 'src/websockets/websocket.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [PrismaModule, WebsocketModule, NotificationsModule],
  controllers: [TransferenciaController],
  providers: [TransferenciaService],
})
export class TransferenciaModule {}
