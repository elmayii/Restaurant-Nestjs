import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClientsService } from 'src/client/client.service';

@Module({
  providers: [RestaurantService],
  controllers: [RestaurantController],
  imports: [PrismaModule],
  exports: [RestaurantService],
})
export class RestaurantModule {}
