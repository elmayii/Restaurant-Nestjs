import { Controller, Get, Post, Delete, Body, Param, NotFoundException, BadRequestException, Patch } from '@nestjs/common';
import { ClientsService } from './client.service';
import { CreateClientDto, UpdateClientDto } from './dto/Client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('client')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}
     @Get()
     async getAllClients() {
       return this.clientsService.getAllClients();
     }
     @Post()
     async createClient(@Body() data: CreateClientDto) {
       return this.clientsService.createClient(data);
     }
     @Get(':id')
     async getClientById(@Param('id') id: string) {
       const ClientFound = await this.clientsService.getClientById(parseInt(id));
       if (!ClientFound) throw new NotFoundException('No existe el Client');
       return ClientFound;
     }
     @Delete(':id')
     async deleteClient(@Param('id') id: string) {
       try {
         return await this.clientsService.deleteClient(parseInt(id));
       } catch (error) {
         throw new NotFoundException('No existe el Client');
       }
     }
     @Patch(':id')
     async updateClient(@Param('id') id: string, @Body() data: UpdateClientDto) {
       try {
         return await this.clientsService.updateClient(parseInt(id),data);
       } catch (error) {
         throw new BadRequestException(error);
       }
     }
}