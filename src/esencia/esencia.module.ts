import { Module } from '@nestjs/common';
import { EsenciasController } from './esencia.controller';
import { EsenciasService } from './esencia.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EsenciasController],
  providers: [EsenciasService],
  imports: [PrismaModule],
  exports: [EsenciasService],
})
export class EsenciaModule {}
