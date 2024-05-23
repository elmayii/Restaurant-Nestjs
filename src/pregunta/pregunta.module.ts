import { Module } from '@nestjs/common';
import { PreguntasController } from './pregunta.controller';
import { PreguntasService } from './pregunta.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PreguntasController],
  providers: [PreguntasService],
  imports: [PrismaModule],
})
export class PreguntaModule {}
