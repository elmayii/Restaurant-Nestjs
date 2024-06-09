import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AccessGuard } from './auth.guard';
import { RefreshGuard } from './auth.refresGuard';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Oauth2Dto as Oauth2Dto } from './dto/oauth2.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('google')
  google(
    @Body()
    registerDto: Oauth2Dto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('microsoft')
  microsoft(
    @Body()
    registerDto: Oauth2Dto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(RefreshGuard)
  profile(@Request() req) {
    return req.user;
  }
  @Post('request-password-reset')
  requestPasswordReset(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.authService.requestPasswordReset(resetPasswordRequestDto);
  }

  @Post('reset-password')
  @UseGuards(AccessGuard)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('verify-email')
  @UseGuards(AccessGuard)
  @Redirect('http://localhost:4321/')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
