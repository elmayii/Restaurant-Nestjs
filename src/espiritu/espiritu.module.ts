import { Module } from '@nestjs/common';
import { EspiritusController } from './espiritu.controller';
import { EspiritusService } from './espiritu.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [EspiritusController],
  providers: [EspiritusService],
  imports: [PrismaModule],
})
export class EspirituModule {}
