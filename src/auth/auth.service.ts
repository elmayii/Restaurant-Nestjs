import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from 'src/usuario/usuario.service';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto, LogOutDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { notificaciones, usuario } from '@prisma/client';
import { jwtConstants } from './constants/jwt.constant';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly http: HttpService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async register({ email, password, type }: RegisterDto) {
    let user = await this.userService.findOneByEmail(email);

    if (user && user?.password == password) {
      return this.sendUser(user);
    }
    else if(user && user?.password != password) {
      throw new UnauthorizedException('User Alredy exist')
    }

    user = await this.userService.createUsuario({
      email,
      password: await bcryptjs.hash(password, 10),
      type,
    });

    return this.sendUser(user);
  }

  async google({ email, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      return this.sendUser(user);
    }

    await this.userService.createUsuario({
      email,
      password: await bcryptjs.hash(password, 10),
      type: 'google',
      isEmailVerified: true,
    });

    return this.sendUser(user);
  }

  async microsoft({ email, password }: RegisterDto) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      return this.sendUser(user);
    }

    await this.userService.createUsuario({
      email,
      password: await bcryptjs.hash(password, 10),
      type: 'microsoft',
      isEmailVerified: true,
    });

    return this.sendUser(user);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    return this.sendUser(user);
  }

  async logOut({ providerId, userId }: LogOutDto) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('session not found');
    }

    const type = user.type;
    if (type == 'google') {
      const params = {
        token: providerId,
      };
      try {
        return await this.http
          .post(`https://oauth2.googleapis.com/revoke`, {
            params,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .pipe(map((response) => response.data))
          .toPromise();
      } catch (error) {
        console.log(error);
      }
    } else if (type == 'microsoft') {
    }

    return { message: 'User Log-out' };
  }

  private async sendUser(user: usuario) {
    const payload = { id: user.id, email: user.email };

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: jwtConstants.refreshSecret,
    });
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
      secret: jwtConstants.accessSecret,
    });

    return {
      refreshToken,
      accessToken,
      email: user.email,
      type: user.type,
      valid: user.isEmailVerified,
      essence: user.esencia,
    };
  }

  private async sendProfile(user: usuario, notificaciones: notificaciones[]) {
    return {
      essence: user.esencia,
      notificaciones,
    };
  }

  async requestPasswordReset({ email }: ResetPasswordRequestDto) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    const token = await this.jwtService.signAsync(
      { email },
      {
        expiresIn: '1h',
        secret: jwtConstants.accessSecret,
      },
    );

    const resetUrl = `https://www.eons.es/auth/change-password/${token}/${email}`;

    const htmlContent = `
      <p>Hola ${user.email},</p>
      <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <p><a href="${resetUrl}">Restablecer Contraseña</a></p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
      <p>Saludos,</p>
      <p>EONS</p>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
      context: {
        name: user.email,
        resetUrl,
      },
    });

    return { message: 'Password reset email sent', token: token };
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    let email: string;

    try {
      const payload = await this.jwtService.verifyAsync(token);
      email = payload.email;
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email does not exist');
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await this.userService.updateUsuario(
      { password: user.password, email: user.email, type: user.type },
      user.id,
    );

    return { message: 'Password successfully reset' };
  }

  async sendVerificationEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Email does not exist');
    } else if (user.isEmailVerified) {
      throw new BadRequestException('This user its valid');
    }

    const payload = { email: user.email };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: jwtConstants.accessSecret,
    });
    const resetUrl = `https://eons-services.onrender.com/auth/verify-email/?token=${token}`;
    const htmlContent = `
      <p>Hola ${email},</p>
      <p>Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
      <p><a href="${resetUrl}">Verificar Email</a></p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo electrónico.</p>
      <p>Saludos,</p>
      <p>EONS</p>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verifica tu correo electrónico',
      html: htmlContent,
      context: {
        resetUrl,
      },
    });
    return token;
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.accessSecret,
      });
      const email = payload.email;
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        user.isEmailVerified = true;
        await this.userService.updateUsuario(user, user.id);
        this.notificationsService.createNotification({
          nombre: 'Cuenta Verificada',
          id_usuario: user.id,
          tipo: 'validacion',
          descripcion:
            'Su cuenta ha sido verificada con exito, ahora puede consumir los servicios disponibles',
          estado: false,
        });
        return { success: true };
      } else {
        throw new Error('Correo electrónico no encontrado');
      }
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async recoverSection(refreshToken: string) {
    try {
      // eslint-disable-next-line prefer-const
      let [type, token] = refreshToken.split(' ') ?? [];
      token = type === 'Bearer' ? token : undefined;

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.refreshSecret,
      });

      const email = payload.email;
      const user = await this.userService.findOneByEmail(email);
      if (user) {
        return this.sendUser(user);
      } else {
        throw new Error('Correo electrónico no encontrado');
      }
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async getProfile(userId: string) {
    try {
      const notificaciones =
        await this.notificationsService.findAllUnreadNotifications(userId);
      const user = await this.userService.findOneById(userId);
      if (notificaciones && user) {
        return this.sendProfile(user, notificaciones);
      } else {
        throw new Error('Correo electrónico no encontrado');
      }
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}
