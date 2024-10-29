import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, order } from '@prisma/client';
import { CreateOrderDto, UpdateOrderDto } from './dto/Order';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService, private restaurantServices: RestaurantService) {}

  // Crear un nuevo pedido
  async createOrder(data: CreateOrderDto): Promise<order> {
    // Verificar que el cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: data.client},
    });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que el restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: data.restaurant },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }
    else{
        //convertir lista de clientes a un Int[]
        var arrayClients = restaurant.clients.split(',')
        const arrayIds = arrayClients.map((e) => parseInt(e))

        //si el cliente de la nueva orden no esta?
        //entonces añadirlo a arreglo de clientes de ese restaurante
        //&& si este tiene capacidad?
        if(!arrayIds.includes(client.id)){

          if(!(await this.restaurantServices.hasCapacity(restaurant.id)))
            throw new BadRequestException("Restaurante lleno")

          arrayClients[0] == ""
          ?arrayClients[0] = client.id.toString()
          :arrayClients.push(`${client.id}`)
          this.restaurantServices.updateRestaurant(restaurant.id,{...restaurant,clients:arrayClients.toString()})
        }
    }

    // Crear el pedido
    return this.prisma.order.create({
      data,
    });
  }

  // Obtener todos los pedidos
  async getOrders(): Promise<order[]> {
    return this.prisma.order.findMany({
      include: { 
        client_order_clientToclient: true,
        restaurant_order_restaurantTorestaurant: true 
    },
    });
  }

  // Obtener un pedido por ID
  async getOrderById(id: number): Promise<order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
        client_order_clientToclient: true,
        restaurant_order_restaurantTorestaurant: true 
    },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  // Actualizar un pedido
  async updateOrder(id: number, data: UpdateOrderDto): Promise<order> {
    const order = await this.getOrderById(id); // Verificar que el pedido existe

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    // Verificar que el cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: data.client},
    });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que el restaurante existe
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: data.restaurant },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  // Eliminar un pedido
  async deleteOrder(id: number): Promise<order> {
    await this.getOrderById(id); // Verificar que el pedido existe

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
