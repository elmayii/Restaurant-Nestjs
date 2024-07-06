import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsuariosService } from 'src/usuario/usuario.service';

@Injectable()
export class UserCleanupService {
  constructor(private readonly userService: UsuariosService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async removeUnverifiedUsers() {
    const users = await this.userService.findUnverifiedUsers();
    const now = new Date();

    users.forEach(async (user) => {
      const timeSinceCreation =
        now.getTime() - new Date(user.createdAt).getTime();
      const hoursSinceCreation = timeSinceCreation / (1000 * 60 * 60);

      if (hoursSinceCreation > 24 && !user.isEmailVerified) {
        await this.userService.deleteUsuario(user.id);
      }
    });
  }
}
