import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateClientDto, UpdateClientDto } from "./dto/Client";
import { client } from "@prisma/client";

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) {}

    // Crear un nuevo cliente
  async createClient(data: CreateClientDto): Promise<client> {
    // Validar si el cliente es adulto
    if (data.age < 18) {
      throw new BadRequestException('El cliente debe tener al menos 18 años');
    }

    // Verificar la capacidad máxima del restaurante
    // const restaurant = await this.prisma.restaurant.findUnique({
    //   where: { id: data.restaurantId },
    // });

    // if (!restaurant) {
    //   throw new BadRequestException('Restaurante no encontrado');
    // }

    // if (restaurant.clients.length >= restaurant.capacity) {
    //   throw new BadRequestException('Capacidad máxima del restaurante alcanzada');
    // }

    // Crear el cliente
    return this.prisma.client.create({
      data,
    });
  }

  // Obtener todos los clientes
  async getAllClients(): Promise<client[]> {
    return this.prisma.client.findMany();
  }

  // Obtener un cliente por ID
  async getClientById(id: number): Promise<client> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Cliente no encontrado');
    }

    return client;
  }

  // Actualizar un cliente
  async updateClient(id: number, data: UpdateClientDto): Promise<client> {
    const client = await this.getClientById(id);

    if (data.age && data.age < 18) {
      throw new BadRequestException('El cliente debe tener al menos 18 años');
    }

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  // Eliminar un cliente
  async deleteClient(id: number): Promise<client> {
    await this.getClientById(id); // Verificar que el cliente exista

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
