import { Module } from '@nestjs/common';
import { TropiPayService } from './tropipay.service';
import { TropiPayController } from './tropipay.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [TropiPayService],
  controllers: [TropiPayController],
  imports: [HttpModule],
})
export class TropiPayModule {}
