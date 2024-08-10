import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'eonss7070@gmail.com',
          pass: 'qdgf jwld yoqc kzdk',
        },
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
