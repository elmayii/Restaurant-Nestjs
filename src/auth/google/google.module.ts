import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleService } from './google.service';
import { GoogleStrategy } from '../strategies/google.strategy';
import { GoogleController } from './google.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [ConfigModule.forRoot(), UsuarioModule, AuthModule],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
})
export class GoogleModule {}
