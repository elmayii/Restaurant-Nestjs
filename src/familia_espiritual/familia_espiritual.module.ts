import { Module } from '@nestjs/common';
import { FamiliasController } from './familia_espiritual.controller';
import { FamiliasService } from './familia_espiritual.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FamiliasController],
  providers: [FamiliasService],
  imports: [PrismaModule],
})
export class FamiliaModule {}
