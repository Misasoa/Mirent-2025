import { Controller, Get, Param } from '@nestjs/common';
import { PrixsService } from './prixs.service';

@Controller('prixs')
export class PrixsController {
  constructor(private readonly prixsService: PrixsService) {}

  @Get('count')
  getCount(): Promise<number> {
    return this.prixsService.getAvailableCountPrixs();
  }

  @Get()
  findAll() {
    return this.prixsService.findAll();
  }

  @Get('region/:id')
  findByRegion(@Param('id') id: number) {
    return this.prixsService.findByRegion(id);
  }

  @Get('total-revenue-from-regions')
  async getTotalRevenueFromRegions() {
    return this.prixsService.getTotalRevenueFromRegionPrices();
  }
}
