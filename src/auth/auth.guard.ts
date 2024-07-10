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

      request.user = payload;
    } catch (err) {
      if (err instanceof ForbiddenException) {
        throw err;
      } else {
        throw new UnauthorizedException();
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
