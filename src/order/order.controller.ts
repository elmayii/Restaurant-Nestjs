import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/Order';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

  // Crear un nuevo pedido
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  // Obtener todos los pedidos
  @Get()
  async findAll() {
    return this.orderService.getOrders();
  }

  // Obtener un pedido por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  // Actualizar un pedido
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  // Eliminar un pedido
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
