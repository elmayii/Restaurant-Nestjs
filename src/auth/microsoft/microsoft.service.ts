import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/usuario/usuario.service';
import { AuthService } from '../auth.service';

@Injectable()
export class MicrosoftService {
  constructor(
    private userService: UsuariosService,
    private authService: AuthService,
  ) {}
  async microsoftLogin(req) {
    if (!req.user) {
      return 'No user from Microsoft';
    }

    const newUser = await this.userService.findOneByEmail(req.user.email);
    if (!newUser) {
      return {
        message: 'User information from Microsoft',
        user: req.user.email,
        STATUS_CODES: 200,
      };
    } else {
      console.log(newUser.password);
      return this.authService.Fastlogin({
        email: newUser.email,
      });
    }
  }
}
