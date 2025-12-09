// src/paiement/paiement.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaymentMethod } from '../entities/paiement.entity';

@Controller('paiements')
export class PaiementController {
  constructor(private paiementService: PaiementService) { }

  @Get('all/details')
  async getAllPaiementsWithDetails() {
    return this.paiementService.getAllPaiementsWithDetails();
  }

  @Get('total-revenue')
  async getTotalRevenue() {
    const total = await this.paiementService.getTotalRevenue();
    return { total };
  }

  @Post(':bdcReference')
  async addPaiement(
    @Param('bdcReference') bdcReference: string,
    @Body()
    body: { montant: number; methode: PaymentMethod; reference?: string },
  ) {
    return this.paiementService.addPaiement(
      bdcReference,
      body.montant,
      body.methode,
      body.reference,
    );
  }

  @Get(':bdcId')
  async getPaiements(@Param('bdcId') bdcId: string) {
    return this.paiementService.getPaiements(+bdcId);
  }

  @Get(':bdcId/total')
  async getTotal(@Param('bdcId') bdcId: string) {
    const total = await this.paiementService.getTotalPaye(+bdcId);
    return { bdcId, total };
  }

  @Get(':bdcId/reste')
  async getReste(@Param('bdcId') bdcId: string) {
    const reste = await this.paiementService.getResteAPayer(+bdcId);
    return { bdcId: +bdcId, reste };
  }

  @Get(':bdcId/summary')
  async getSummary(@Param('bdcId') bdcId: string) {
    return this.paiementService.getSummary(+bdcId);
  }
}
