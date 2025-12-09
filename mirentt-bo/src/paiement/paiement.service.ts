// src/paiement/paiement.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paiement, PaymentMethod } from '../entities/paiement.entity';
import { BonDeCommande } from 'src/entities/commande.entity';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private paiementRepository: Repository<Paiement>,
    @InjectRepository(BonDeCommande)
    private bdcRepository: Repository<BonDeCommande>,
  ) { }

  async getAllPaiementsWithDetails() {
    const paiements = await this.paiementRepository.find({
      relations: [
        'bdc',
        'bdc.reservation',
        'bdc.reservation.client',
        'bdc.reservation.vehicule',
        'bdc.reservation.location',
      ],
    });

    const paiementsWithDetails = await Promise.all(
      paiements.map(async (paiement) => {
        if (!paiement.bdc) {
          return {
            ...paiement,
            details_bdc: null,
            resume_paiement: null,
          };
        }

        const resume = await this.getSummary(paiement.bdc.id);

        return {
          ...paiement,
          details_bdc: paiement.bdc,
          resume_paiement: resume,
        };
      }),
    );

    return paiementsWithDetails;
  }

  // Méthode modifiée pour accepter une référence
  async addPaiement(
    bdcReference: string,
    montant: number,
    methode: PaymentMethod,
    reference?: string,
  ) {
    // 1. Trouver le BDC en utilisant la référence
    const bdc = await this.bdcRepository.findOne({
      where: { reference: bdcReference },
      relations: ['reservation'],
    });
    if (!bdc) {
      throw new NotFoundException(
        `BDC avec la référence '${bdcReference}' non trouvé`,
      );
    }

    // 2. Vérifier le reste à payer en utilisant l'ID du BDC trouvé
    const summary = await this.getSummary(bdc.id);
    if (montant > summary.reste) {
      throw new BadRequestException(
        `Le montant du paiement (${montant}) dépasse le reste à payer (${summary.reste}).`,
      );
    }

    // 3. Créer et sauvegarder le paiement
    const paiement = this.paiementRepository.create({
      montant,
      methode,
      reference_transaction: reference || null,
      bdc,
    });

    const savedPaiement = await this.paiementRepository.save(paiement);

    // 4. Retourner les données formatées
    return {
      ...savedPaiement,
      details_bdc: bdc,
      resume_paiement: await this.getSummary(bdc.id),
    };
  }

  async getPaiements(bdcId: number) {
    return this.paiementRepository.find({
      where: { bdc: { id: bdcId } },
      relations: ['bdc'],
    });
  }

  async getTotalPaye(bdcId: number): Promise<number> {
    const paiements = await this.getPaiements(bdcId);
    return paiements.reduce((sum, p) => sum + Number(p.montant), 0);
  }

  async getResteAPayer(bdcId: number): Promise<number> {
    const bdc = await this.bdcRepository.findOne({
      where: { id: bdcId },
      relations: ['reservation'],
    });

    if (!bdc) {
      throw new NotFoundException(`BDC ${bdcId} non trouvé`);
    }

    if (!bdc.reservation) {
      throw new NotFoundException(
        `Aucune réservation associée au BDC ${bdcId}`,
      );
    }

    const montantTotal = Number(bdc.reservation.total_price);
    const totalPaye = await this.getTotalPaye(bdcId);
    const reste = montantTotal - totalPaye;

    return reste > 0 ? reste : 0;
  }

  async getSummary(bdcId: number) {
    const bdc = await this.bdcRepository.findOne({
      where: { id: bdcId },
      relations: ['reservation'],
    });

    if (!bdc) throw new NotFoundException(`BDC ${bdcId} non trouvé`);
    if (!bdc.reservation)
      throw new NotFoundException(
        `Aucune réservation associée au BDC ${bdcId}`,
      );

    const montantTotal = Number(bdc.reservation.total_price);
    const totalPaye = await this.getTotalPaye(bdcId);
    const reste = montantTotal - totalPaye > 0 ? montantTotal - totalPaye : 0;

    return {
      bdcId,
      montantTotal,
      totalPaye,
      reste,
    };
  }

  /**
   * Calculer le revenu total (somme de tous les paiements)
   */
  async getTotalRevenue(): Promise<number> {
    const allPaiements = await this.paiementRepository.find();
    return allPaiements.reduce((sum, p) => sum + Number(p.montant), 0);
  }
}
