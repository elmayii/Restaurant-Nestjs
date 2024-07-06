import { Module } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { TransferenciaController } from './transferencia.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransferenciaController],
  providers: [TransferenciaService],
})
export class TransferenciaModule {}
