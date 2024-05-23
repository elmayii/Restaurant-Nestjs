import { Module } from '@nestjs/common';
import { FamiliasEspiritusController } from './relacion_familia_espiritu.controller';
import { FamiliasEspiritusService } from './relacion_familia_espiritu.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FamiliasEspiritusController],
  providers: [FamiliasEspiritusService],
  imports: [PrismaModule],
})
export class FamiliasEspiritusModule {}
