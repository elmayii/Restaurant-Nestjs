import { Controller, Get, Query } from '@nestjs/common';
import { TropipayService } from './tropipay.service';

@Controller('tropipay')
export class TropipayController {
  constructor(private readonly tropipayService: TropipayService) {}

  @Get()
  async getPene(): Promise<string> {
    return 'pene';
  }
  @Get('generate-link')
  async generatePaymentLink(
    @Query() { amount }: { amount: string },
  ): Promise<string> {
    return this.tropipayService.generatePaymentLink(amount);
  }
}
