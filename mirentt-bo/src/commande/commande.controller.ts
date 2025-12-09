import { Controller, Get, Param, Delete } from '@nestjs/common';
import { BonDeCommandeService } from './commande.service';

@Controller('commande')
export class BonDeCommandeController {
  constructor(private readonly bdcService: BonDeCommandeService) { }

  // GET /commande
  @Get()
  async findAll() {
    return this.bdcService.findAll();
  }

  // GET /commande/pending-payments
  @Get('pending-payments')
  async getPendingPayments() {
    return this.bdcService.getPendingPayments();
  }

  // GET /commande/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bdcService.findOne(+id);
  }

  // DELETE /commande/:id
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bdcService.remove(+id);
  }
}
