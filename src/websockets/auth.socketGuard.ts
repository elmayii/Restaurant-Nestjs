import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from '../auth/constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';
import { Socket } from 'socket.io';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: WebsocketGateway,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Socket = context.switchToWs().getClient<Socket>();

    const token = request.handshake.auth.token;
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
          this.notificationsGateway.notifyUser(user.id, {
            message: 'Recuerde que usted no ha verificado su cuenta',
          });
        }
        throw new ForbiddenException('Email not verified');
      }

      request.data.token = token;
    } catch (err) {
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new UnauthorizedException();
      }
    }

    return true;
  }
}
