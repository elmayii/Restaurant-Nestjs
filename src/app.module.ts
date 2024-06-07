import { Module } from '@nestjs/common';
import { EspirituModule } from './espiritu/espiritu.module';
import { FamiliaModule } from './familia_espiritual/familia_espiritual.module';
import { PreguntaModule } from './pregunta/pregunta.module';
import { FamiliasEspiritusModule } from './relacion_familia_espiritu/relacion_familia_espiritu.module';
import { RespuestaModule } from './respuesta/respuesta.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MonedaModule } from './moneda/moneda.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RespuestaEspecialModule } from './respuesta_especial/respuesta_especial.module';
import { RespuestaDiaModule } from './respuesta_dia/respuesta_dia.module';
import { TropiPayModule } from './tropipay/tropipay.module';

@Module({
  imports: [
    EspirituModule,
    FamiliaModule,
    PreguntaModule,
    FamiliasEspiritusModule,
    RespuestaModule,
    RespuestaEspecialModule,
    RespuestaDiaModule,
    UsuarioModule,
    MonedaModule,
    AuthModule,
    ConfigModule.forRoot(),
    TropiPayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
