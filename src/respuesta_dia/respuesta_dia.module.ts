import { Module } from '@nestjs/common';
import { RespuestasDiaController } from './respuesta_dia.controller';
import { RespuestasDiaService } from './respuesta_dia.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RespuestasDiaController],
  providers: [RespuestasDiaService],
  imports: [PrismaModule],
})
export class RespuestaDiaModule {}
