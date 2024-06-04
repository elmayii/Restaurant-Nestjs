import { Module } from '@nestjs/common';
import { TropipayService } from './tropipay.service';
import { TropipayController } from './tropipay.controller';

@Module({
  controllers: [TropipayController],
  providers: [TropipayService],
  exports: [TropipayService],
})
export class TropipayModule {}
