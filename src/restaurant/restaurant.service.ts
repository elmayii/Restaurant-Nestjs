import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, restaurant } from '@prisma/client';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/Restaurant';
import { UpdateClientDto } from 'src/client/dto/Client';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo restaurante
  async createRestaurant(data: CreateRestaurantDto): Promise<restaurant> {
    return this.prisma.restaurant.create({
      data:{
        ...data,
        clients:""
      },
    });
  }

  // Obtener todos los restaurantes
  async getRestaurants(): Promise<restaurant[]> {
    return this.prisma.restaurant.findMany();
  }

  // Obtener un restaurante por ID
  async getRestaurantById(id: number): Promise<restaurant> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return restaurant;
  }

  // Actualizar un restaurante
  async updateRestaurant(id: number, data: UpdateRestaurantDto): Promise<restaurant> {
    await this.getRestaurantById(id); // Verificar que el restaurante exista

    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  // Eliminar un restaurante
  async deleteRestaurant(id: number): Promise<restaurant> {
    await this.getRestaurantById(id); // Verificar que el restaurante exista

    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  // Verificar si hay espacio en el restaurante
  async hasCapacity(restaurantId: number): Promise<boolean> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    //convertir lista de clientes a un Int[]
    var arrayClients = restaurant.clients.split(',')
    const arrayIds = arrayClients.map((e) => parseInt(e))

    return (arrayIds.length < restaurant.capacity);
  }
}
