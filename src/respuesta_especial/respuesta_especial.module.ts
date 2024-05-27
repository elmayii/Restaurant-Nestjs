import { Module } from '@nestjs/common';
import { RespuestasEspecialController } from './respuesta_especial.controller';
import { RespuestasEspecialService } from './respuesta_especial.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RespuestasEspecialController],
  providers: [RespuestasEspecialService],
  imports: [PrismaModule],
})
export class RespuestaEspecialModule {}
