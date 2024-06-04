import { Injectable } from '@nestjs/common';
import { Tropipay } from '@yosle/tropipayjs';

@Injectable()
export class TropipayService {
  private tpp: Tropipay;

  constructor() {
    const config = {
      clientId: process.env.TROPIPAY_CLIENT_ID,
      clientSecret: process.env.TROPIPAY_CLIENT_SECRET,
    };
    this.tpp = new Tropipay(config);
  }

  async generatePaymentLink(amount: string): Promise<string> {
    try {
      return await this.tpp['generatePaymentLink'](amount);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
