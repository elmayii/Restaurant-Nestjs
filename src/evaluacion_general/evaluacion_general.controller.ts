import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { EvaluacionGeneralService } from './evaluacion_general.service';
import { AccessGuard } from 'src/auth/auth.guard';
import { JWTUser } from 'src/lib/jwt';

@Controller('evaluacion_general')
export class EvaluacionGeneralController {
  constructor(
    private readonly evaluacionGeneralService: EvaluacionGeneralService,
  ) {}

  @Post(':id')
  @UseGuards(AccessGuard)
  async processEvaluacionGeneral(
    @Param() { id }: { id: string },
    @Request() req: { user: JWTUser },
  ) {
    return this.evaluacionGeneralService.processEvaluacionGeneral(
      id,
      req.user.id,
    );
  }
}
