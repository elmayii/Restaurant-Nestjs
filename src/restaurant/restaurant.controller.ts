import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/Restaurant';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Crear un nuevo restaurante
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  // Obtener todos los restaurantes
  @Get()
  async findAll() {
    return this.restaurantService.getRestaurants();
  }

  // Obtener un restaurante por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantById(id);
  }

  // Actualizar un restaurante
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateRestaurant(id, updateRestaurantDto);
  }

  // Eliminar un restaurante
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantService.deleteRestaurant(id);
  }
}
