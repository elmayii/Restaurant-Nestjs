import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
  imports: [PrismaModule],
})
export class WebsocketModule {}
