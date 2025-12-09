import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FactureService } from './facturation.service';

@Controller('factures')
export class FactureController {
  constructor(private readonly factureService: FactureService) {}

  @Get()
  async getAllFactures() {
    return this.factureService.getAllFactures();
  }

  @Get(':id')
  async getFacture(@Param('id', ParseIntPipe) id: number) {
    return this.factureService.getFactureById(id);
  }

  @Post('generate/:bdcId')
  async generate(@Param('bdcId') bdcId: number) {
    return this.factureService.generateFactureFinale(+bdcId);
  }

  @Post('generate-by-reference/:bdcReference')
  async generateByReference(@Param('bdcReference') bdcReference: string) {
    return this.factureService.generateFactureFinaleByReference(bdcReference);
  }
}
