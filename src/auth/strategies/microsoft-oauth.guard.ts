import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MicrosoftOAuthGuard extends AuthGuard('microsoft') {
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
