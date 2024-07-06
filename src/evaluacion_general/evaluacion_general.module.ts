import { Module } from '@nestjs/common';
import { EvaluacionGeneralController } from './evaluacion_general.controller';
import { EvaluacionGeneralService } from './evaluacion_general.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EspiritusService } from 'src/espiritu/espiritu.service';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [EvaluacionGeneralController],
  providers: [EvaluacionGeneralService, EspiritusService],
  imports: [PrismaModule, WebsocketModule],
})
export class EvaluacionGeneralModule {}
