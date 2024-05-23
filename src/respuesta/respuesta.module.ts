import { Module } from '@nestjs/common';
import { RespuestasController } from './respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService],
  imports: [PrismaModule],
})
export class RespuestaModule {}
