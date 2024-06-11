import { Module } from '@nestjs/common';
import { RespuestasController } from './respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TranslationModule } from 'src/translation/translation.module';
import { EspiritusService } from 'src/espiritu/espiritu.service';

@Module({
  controllers: [RespuestasController],
  providers: [RespuestasService, EspiritusService],
  imports: [PrismaModule, TranslationModule],
})
export class RespuestaModule {}
