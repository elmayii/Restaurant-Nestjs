import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}
  @Get()
  async getAllUsuarios() {
    return this.usuariosService.getAllUsuarios();
  }

  @Post()
  async createUsuario(@Body() data: CreateUsuarioDto) {
    return this.usuariosService.createUsuario(data);
  }

  @Get(':id')
  async getUsuarioById(@Param('id') id: string) {
    const usuarioFound = await this.usuariosService.getUsuarioById(id);
    if (!usuarioFound) throw new NotFoundException('No existe el Usuario');
    return usuarioFound;
  }

  @Delete(':id')
  async deleteUsuario(@Param('id') id: string) {
    try {
      return await this.usuariosService.deleteUsuario(id);
    } catch (error) {
      throw new NotFoundException('No existe el Usuario');
    }
  }

  @Put(':id')
  async updateUsuario(@Param('id') id: string, @Body() data: UpdateUsuarioDto) {
    try {
      return await this.usuariosService.updateUsuario(data, id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
