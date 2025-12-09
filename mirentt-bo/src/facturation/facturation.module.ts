import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from '../entities/facture.entity';
import { FactureController } from './facturation.controller';
import { FactureService } from './facturation.service';
import { BonDeCommande } from 'src/entities/commande.entity';
import { PaiementModule } from 'src/paiement/paiement.module';

@Module({
  imports: [TypeOrmModule.forFeature([Facture, BonDeCommande]), PaiementModule],
  providers: [FactureService],
  exports: [FactureService],
  controllers: [FactureController],
})
export class FactureModule {}
