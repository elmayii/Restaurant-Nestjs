import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [PrismaModule,RestaurantModule],
  exports: [OrderService],
})
export class OrderModule {}
