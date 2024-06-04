import { Module } from '@nestjs/common';
import { RespuestasController } from './respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TranslationModule } from 'src/translation/translation.module';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService],
  imports: [PrismaModule, TranslationModule],
})
export class RespuestaModule {}
