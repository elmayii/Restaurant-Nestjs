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
import { EspiritusService } from './espiritu.service';
import { espiritu } from '@prisma/client';
@Controller('espiritus')
export class EspiritusController {
  constructor(private readonly espiritusService: EspiritusService) {}
  @Get()
  async getAllEspiritus() {
    return this.espiritusService.getAllEspiritus();
  }

  @Post()
  async createEspiritu(@Body() data: espiritu) {
    return this.espiritusService.createEspiritu(data);
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
