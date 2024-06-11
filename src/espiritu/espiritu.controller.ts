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
  Request,
  UseGuards,
} from '@nestjs/common';
import { EspiritusService } from './espiritu.service';
import { espiritu } from '@prisma/client';
import { AccessGuard } from 'src/auth/auth.guard';
@Controller('espiritus')
export class EspiritusController {
  constructor(private readonly espiritusService: EspiritusService) {}
  @Get()
  async getAllEspiritus() {
    return this.espiritusService.getAllEspiritus();
  }

  @Post()
  @UseGuards(AccessGuard)
  async createEspiritu(@Body() data: espiritu, @Request() req: any) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const descripcion_sistema = `Este espíritu se creó por usted el ${formattedDate}`;
    data.descripcion_sistema = descripcion_sistema;
    return this.espiritusService.createEspiritu(data, req.user);
  }

  @Get(':id')
  async getEspirituById(@Param('id') id: string) {
    const espirituFound = await this.espiritusService.getEspirituById(
      Number(id),
    );
    if (!espirituFound) throw new NotFoundException('No existe el Espíritu');
    return espirituFound;
  }

  @Delete(':id')
  async deleteEspiritu(@Param('id') id: string) {
    try {
      return await this.espiritusService.deleteEspiritu(Number(id));
    } catch (error) {
      throw new NotFoundException('No existe el Espíritu');
    }
  }

  @Put(':id')
  async updateEspiritu(@Param('id') id: string, @Body() data: espiritu) {
    try {
      return await this.espiritusService.updateEspiritu(data, Number(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
