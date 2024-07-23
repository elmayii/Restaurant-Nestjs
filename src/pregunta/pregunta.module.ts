import { Module } from '@nestjs/common';
import { PreguntasController } from './pregunta.controller';
import { PreguntasService } from './pregunta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/websockets/websocket.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [PreguntasController],
  providers: [PreguntasService],
  imports: [PrismaModule, WebsocketModule, NotificationsModule],
})
export class PreguntaModule {}
