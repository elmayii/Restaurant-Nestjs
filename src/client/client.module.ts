import { Module } from '@nestjs/common';
import { ClientsService } from './client.service';
import { ClientsController } from './client.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [ClientsController],
    providers: [ClientsService],
    imports: [PrismaModule],
    exports: [ClientsService],
})
export class ClientModule {}