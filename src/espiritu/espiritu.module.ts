import { Module } from '@nestjs/common';
import { EspiritusController } from './espiritu.controller';
import { EspiritusService } from './espiritu.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [EspiritusController],
  providers: [EspiritusService],
  imports: [PrismaModule, WebsocketModule],
  exports: [EspiritusService],
})
export class EspirituModule {}
