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
import { WebsocketGateway } from 'src/websockets/websocket.gateway';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: WebsocketGateway,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.accessSecret,
      });
      //console.log(payload)

      const user = await this.prisma.usuario.findFirst({
        where: { id: payload.id },
      });

      if (!user || !user.isEmailVerified) {
        if (user) {
          this.prisma.notificaciones.create({
            data: {
              descripcion: 'Recuerde que usted no ha verificado su cuenta',
              id_usuario: user.id,
            },
          });
          this.notificationsGateway.notifyUser(user.id, {
            message: 'Recuerde que usted no ha verificado su cuenta',
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
