import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'verify.eons.es@gmail.com',
          pass: 'Verify24_eonsemail',
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
