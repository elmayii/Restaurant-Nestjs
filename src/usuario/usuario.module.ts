import { Module } from '@nestjs/common';
import { UsuariosController } from './usuario.controller';
import { UsuariosService } from './usuario.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [PrismaModule],
  exports: [UsuariosService],
})
export class UsuarioModule {}
