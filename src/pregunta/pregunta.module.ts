import { Module } from '@nestjs/common';
import { PreguntasController } from './pregunta.controller';
import { PreguntasService } from './pregunta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [PreguntasController],
  providers: [PreguntasService],
  imports: [PrismaModule, WebsocketModule],
})
export class PreguntaModule {}
