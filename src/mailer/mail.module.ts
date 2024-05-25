import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'garciaj1246@gmail.com',
          pass: 'xhxf tcwe ttjb yzbz',
        },
      },
      defaults: {
        from: '"No Reply" garciaj1246@gmail.com',
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
