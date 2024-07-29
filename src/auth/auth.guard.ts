import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from './constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    //console.log(token)
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.accessSecret,
      });

      const user = await this.prisma.usuario.findFirst({
        where: { id: payload.id },
      });

      if (!user || !user.isEmailVerified) {
        if (user) {
          this.notificationsService.createNotification({
            nombre: 'Cuenta sin Verificar',
            id_usuario: user.id,
            tipo: 'notValidAcount',
            descripcion: `Aún no ha validado su cuenta, comienze el proceso aquí`,
            estado: false,
          });
          throw new ForbiddenException('Email not verified');
        } else {
          throw new UnauthorizedException();
        }
      }

      request.user = payload;
    } catch (err) {
      throw err;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
