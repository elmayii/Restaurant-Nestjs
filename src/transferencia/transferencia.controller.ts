import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { CreateTransferenciaDto } from 'src/lib/dtos';
import { AccessGuard } from 'src/auth/auth.guard';
import { JWTUser } from 'src/lib/jwt';

@Controller('transferencias')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @UseGuards(AccessGuard)
  @Post()
  async createTransferencia(
    @Request() req: { user: JWTUser },
    @Body() createTransferenciaDto: CreateTransferenciaDto,
  ) {
    const userId = req.user.id;
    return this.transferenciaService.createTransferencia(
      userId,
      createTransferenciaDto,
    );
  }
  @UseGuards(AccessGuard)
  @Get()
  async getRecentTransfers(@Request() req: { user: JWTUser }) {
    const userId = req.user.id;
    return this.transferenciaService.getRecentTransfers(userId);
  }

  @UseGuards(AccessGuard)
  @Get(':id')
  async searchUsersByEmail(@Param() { id }: { id: string }) {
    return this.transferenciaService.searchUsersByEmail(id);
  }
}
