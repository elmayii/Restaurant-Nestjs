import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class TropiPayService {
  constructor(private http: HttpService) {}

  async getAccessToken() {
    const body = {
      grant_type: 'client_credentials',
      client_id: process.env.TROPIPAY_CLIENT_ID,
      client_secret: process.env.TROPIPAY_CLIENT_SECRET,
    };
    return await this.http
      .post(process.env.GET_ACCESS_TOKEN, body)
      .pipe(map((response) => response.data.access_token))
      .toPromise();
  }

  async createPaymentCard(body: any) {
    const accessToken = await this.getAccessToken();
    console.log(accessToken);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await this.http
        .post(process.env.CREATE_PAYMENT_CARD, body, { headers })
        .toPromise();
      return response.data;
    } catch (error) {
      console.error(error.response.data);
    }
  }
}
