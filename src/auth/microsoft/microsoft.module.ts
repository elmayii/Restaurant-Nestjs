import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftService } from './microsoft.service';
import { MicrosoftStrategy } from '../strategies/microsoft.strategy';
import { MicrosoftController } from './microsoft.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsuarioModule],
  controllers: [MicrosoftController],
  providers: [MicrosoftService, MicrosoftStrategy],
})
export class MicrosoftModule {}
