import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Redirect,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, LogOutData } from './dto/login.dto';
import { AccessGuard } from './auth.guard';
import { RefreshGuard } from './auth.refresGuard';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
//import { Oauth2Dto as Oauth2Dto } from './dto/oauth2.dto';
import { JWTUser } from 'src/lib/jwt';

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

  // @Post('google')
  // google(
  //   @Body()
  //   registerDto: Oauth2Dto,
  // ) {
  //   return this.authService.register(registerDto);
  // }

  // @Post('microsoft')
  // microsoft(
  //   @Body()
  //   registerDto: Oauth2Dto,
  // ) {
  //   return this.authService.register(registerDto);
  // }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('login')
  @UseGuards(RefreshGuard)
  recoverSection(@Headers('authorization') refreshToken: string) {
    return this.authService.recoverSection(refreshToken);
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  logOut(@Body() logout: LogOutData, @Request() req: { user: JWTUser }) {
    const data = {
      providerId: logout.providerId,
      userId: req.user.id,
    };
    return this.authService.logOut(data);
  }

  @Get('profile')
  @UseGuards(AccessGuard)
  profile(@Request() req) {
    return this.authService.getProfile(req?.user?.id);
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
  @Redirect('https://www.eons.es/services/true')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('request-verify-email')
  async sendVerificationEmail(@Query('email') email: string) {
    console.log(email);
    return this.authService.sendVerificationEmail(email);
  }
}
