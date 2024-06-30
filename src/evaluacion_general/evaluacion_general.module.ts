import { Module } from '@nestjs/common';
import { EvaluacionGeneralController } from './evaluacion_general.controller';
import { EvaluacionGeneralService } from './evaluacion_general.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EspiritusService } from 'src/espiritu/espiritu.service';

@Module({
  controllers: [EvaluacionGeneralController],
  providers: [EvaluacionGeneralService, EspiritusService],
  imports: [PrismaModule],
})
export class EvaluacionGeneralModule {}
