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
import { FamiliasEspiritusService } from './relacion_familia_espiritu.service';
import { relacion_familia_espiritu } from '@prisma/client';
@Controller('familiasEspiritus')
export class FamiliasEspiritusController {
  constructor(
    private readonly familiasEspiritusService: FamiliasEspiritusService,
  ) {}
  @Get()
  async getAllFamiliasEspiritus() {
    return this.familiasEspiritusService.getAllFamiliasEspiritus();
  }

  @Post()
  async createFamiliaEspiritu(@Body() data: relacion_familia_espiritu) {
    return this.familiasEspiritusService.createFamiliaEspiritu(data);
  }

  @Get(':id')
  async getFamiliaEspirituById(@Param('id') id: string) {
    const espirituFound =
      await this.familiasEspiritusService.getFamiliaEspirituById(Number(id));
    if (!espirituFound)
      throw new NotFoundException(
        'No existe la relación entre familia y espíritu',
      );
    return espirituFound;
  }

  @Delete(':id')
  async deleteFamiliaEspiritu(@Param('id') id: string) {
    try {
      return await this.familiasEspiritusService.deleteFamiliaEspiritu(
        Number(id),
      );
    } catch (error) {
      throw new NotFoundException(
        'No existe la relación entre familia y espíritu',
      );
    }
  }

  @Put(':id')
  async updateFamiliaEspiritu(
    @Param('id') id: string,
    @Body() data: relacion_familia_espiritu,
  ) {
    try {
      return await this.familiasEspiritusService.updateFamiliaEspiritu(
        data,
        Number(id),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
