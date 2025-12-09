import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from '../entities/paiement.entity';
import { Facture } from '../entities/facture.entity';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { BonDeCommande } from 'src/entities/commande.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement, Facture, BonDeCommande])],
  providers: [PaiementService],
  controllers: [PaiementController],
  exports: [PaiementService],
})
export class PaiementModule {}
