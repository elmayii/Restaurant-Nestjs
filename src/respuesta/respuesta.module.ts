import { Module } from '@nestjs/common';
import { RespuestasController } from './respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService, EspiritusService],
  imports: [PrismaModule, WebsocketModule],
})
export class RespuestaModule {}
