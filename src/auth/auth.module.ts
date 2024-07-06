import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mailer/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/websockets/websocket.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
    }),
    MailModule,
    PrismaModule,
    WebsocketModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
