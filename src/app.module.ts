import { Module } from '@nestjs/common';
import { EspirituModule } from './espiritu/espiritu.module';
import { PreguntaModule } from './pregunta/pregunta.module';
import { RespuestaModule } from './respuesta/respuesta.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MonedaModule } from './moneda/moneda.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RespuestaEspecialModule } from './respuesta_especial/respuesta_especial.module';
import { RespuestaDiaModule } from './respuesta_dia/respuesta_dia.module';
import { TropiPayModule } from './tropipay/tropipay.module';
import { RespuestaPredialogoModule } from './respuesta_predialogo/respuesta_predialogo.module';
import { EvaluacionGeneralModule } from './evaluacion_general/evaluacion_general.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from './user-cleanup/user-cleanup.service';
import { TransferenciaModule } from './transferencia/transferencia.module';
import { WebsocketModule } from './websockets/websocket.module';
import { EsenciaModule } from './esencia/esencia.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClientModule } from './client/client.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    EspirituModule,
    PreguntaModule,
    RespuestaModule,
    RespuestaEspecialModule,
    RespuestaDiaModule,
    UsuarioModule,
    MonedaModule,
    AuthModule,
    ConfigModule.forRoot(),
    TropiPayModule,
    RespuestaPredialogoModule,
    EvaluacionGeneralModule,
    ScheduleModule.forRoot(),
    EsenciaModule,
    TransferenciaModule,
    WebsocketModule,
    NotificationsModule,
    ClientModule,
    RestaurantModule,
    OrderModule,
  ],
  providers: [UserCleanupService],
  controllers: [],
})
export class AppModule {}
