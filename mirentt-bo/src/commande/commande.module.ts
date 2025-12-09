import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonDeCommande } from 'src/entities/commande.entity';
import { BonDeCommandeService } from './commande.service';
import { BonDeCommandeController } from './commande.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BonDeCommande])],
  providers: [BonDeCommandeService],
  controllers: [BonDeCommandeController],
  exports: [BonDeCommandeService],
})
export class BonDeCommandeModule {}
