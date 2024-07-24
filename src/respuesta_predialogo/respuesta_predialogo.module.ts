import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RespuestaPredialogoController } from './respuesta_predialogo.controller';
import { RespuestaPredialogoService } from './respuesta_predialogo.service';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  controllers: [RespuestaPredialogoController],
  providers: [RespuestaPredialogoService],
  imports: [PrismaModule, NotificationsModule],
})
export class RespuestaPredialogoModule {}
