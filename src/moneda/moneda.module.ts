import { Module } from '@nestjs/common';
import { MonedasController } from './moneda.controller';
import { MonedasService } from './moneda.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MonedasController],
  providers: [MonedasService],
  imports: [PrismaModule],
})
export class MonedaModule {}
