import { MicrosoftOAuthGuard } from '../strategies/microsoft-oauth.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { MicrosoftService } from './microsoft.service';

@Controller('microsoft')
export class MicrosoftController {
  constructor(private readonly microsoftService: MicrosoftService) {}

  @Get()
  @UseGuards(MicrosoftOAuthGuard)
  async microsoftAuth() {}

  @Get('microsoft-redirect')
  @UseGuards(MicrosoftOAuthGuard)
  microsoftAuthRedirect(@Request() req) {
    return this.microsoftService.microsoftLogin(req);
  }
}
