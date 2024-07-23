import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AccessGuard } from 'src/auth/auth.guard';
import { patchNotification } from './dto/NotificationsDto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('')
  @UseGuards(AccessGuard)
  async getAllNotifications(@Request() req) {
    return this.notificationsService.findAllUnreadNotifications(req.id);
  }

  @Patch('')
  @UseGuards(AccessGuard)
  async patchNotification(@Body() data: patchNotification) {
    return this.notificationsService.updateStateNotification(data);
  }
}
