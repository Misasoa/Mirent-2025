import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facture } from '../entities/facture.entity';
import { ReservationStatus } from 'src/entities/reservation.entity';
import { BonDeCommande } from 'src/entities/commande.entity';
import { PaiementService } from 'src/paiement/paiement.service';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,
    @InjectRepository(BonDeCommande)
    private bdcRepository: Repository<BonDeCommande>,
    private paiementService: PaiementService,
  ) {}

  async generateFactureFinaleByReference(bdcReference: string) {
    const bdc = await this.bdcRepository.findOne({
      where: { reference: bdcReference },
    });

    if (!bdc) {
      throw new NotFoundException(
        `Bon de Commande with reference "${bdcReference}" not found`,
      );
    }

    return this.generateFactureFinale(bdc.id);
  }

  async getAllFactures() {
    const factures = await this.factureRepository.find({
      relations: [
        'bdc',
        'bdc.paiements',
        'bdc.reservation',
        'bdc.reservation.client',
        'bdc.reservation.vehicule',
        'bdc.reservation.location',
      ],
    });

    return Promise.all(
      factures.map(async (facture) => {
        const summary = await this.paiementService.getSummary(facture.bdc.id);

        return {
          id: facture.id,
          numero: facture.numero,
          date_facture: facture.date_facture,
          montant: facture.montant,
          totalPaiements: summary.totalPaye,
          resteAPayer: summary.reste,
          bdc: {
            id: facture.bdc.id,
            reference: facture.bdc.reference,
            created_at: facture.bdc.created_at,
            reservation: {
              id: facture.bdc.reservation.id,
              reference: facture.bdc.reservation.reference,
              client: facture.bdc.reservation.client,
              vehicule: facture.bdc.reservation.vehicule,
              region: facture.bdc.reservation.location,
              pickup_date: facture.bdc.reservation.pickup_date,
              return_date: facture.bdc.reservation.return_date,
              total_price: facture.bdc.reservation.total_price,
              nombreJours: facture.bdc.reservation.nombreJours,
            },
          },
          paiements: facture.bdc.paiements.map((p) => ({
            id: p.id,
            montant: p.montant,
            methode: p.methode,
            reference_transaction: p.reference_transaction,
            date_paiement: p.date_paiement,
          })),
        };
      }),
    );
  }

  async getFactureById(id: number) {
    const facture = await this.factureRepository.findOne({
      where: { id },
      relations: [
        'bdc',
        'bdc.paiements',
        'bdc.reservation',
        'bdc.reservation.client',
        'bdc.reservation.vehicule',
        'bdc.reservation.location',
      ],
    });

    if (!facture) throw new NotFoundException(`Facture ${id} introuvable`);

    const summary = await this.paiementService.getSummary(facture.bdc.id);

    return {
      id: facture.id,
      numero: facture.numero,
      date_facture: facture.date_facture,
      montant: facture.montant,
      totalPaiements: summary.totalPaye,
      resteAPayer: summary.reste,
      bdc: {
        id: facture.bdc.id,
        reference: facture.bdc.reference,
        created_at: facture.bdc.created_at,
        reservation: {
          id: facture.bdc.reservation.id,
          reference: facture.bdc.reservation.reference,
          client: facture.bdc.reservation.client,
          vehicule: facture.bdc.reservation.vehicule,
          region: facture.bdc.reservation.location,
          pickup_date: facture.bdc.reservation.pickup_date,
          return_date: facture.bdc.reservation.return_date,
          total_price: facture.bdc.reservation.total_price,
          nombreJours: facture.bdc.reservation.nombreJours,
        },
      },
      paiements: facture.bdc.paiements.map((p) => ({
        id: p.id,
        montant: p.montant,
        methode: p.methode,
        reference_transaction: p.reference_transaction,
        date_paiement: p.date_paiement,
      })),
    };
  }

  async generateFactureFinale(bdcId: number) {
    const bdc = await this.bdcRepository.findOne({
      where: { id: bdcId },
      relations: [
        'reservation',
        'reservation.client',
        'reservation.vehicule',
        'reservation.location',
        'paiements',
      ],
    });

    if (!bdc) throw new NotFoundException(`BDC ${bdcId} non trouvé`);
    if (bdc.reservation.status !== ReservationStatus.TERMINEE) {
      throw new BadRequestException(
        `Réservation non terminée, impossible de générer la facture`,
      );
    }

    // Vérifier si une facture existe déjà
    let facture = await this.factureRepository.findOne({
      where: { bdc: { id: bdcId } },
    });
    if (!facture) {
      const count = await this.factureRepository.count();
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const numero = `MRT-${year}/${month}/${day}-${(count + 1).toString().padStart(4, '0')}`;

      facture = this.factureRepository.create({
        numero,
        montant: bdc.reservation.total_price,
        bdc,
      });

      await this.factureRepository.save(facture);
    }

    // Récupérer le résumé des paiements
    const summary = await this.paiementService.getSummary(bdc.id);

    // Retourner le JSON complet
    return {
      id: facture.id,
      numero: facture.numero,
      date_facture: facture.date_facture,
      montant: facture.montant,
      totalPaiements: summary.totalPaye,
      resteAPayer: summary.reste,
      bdc: {
        id: bdc.id,
        reference: bdc.reference,
        created_at: bdc.created_at,
        reservation: bdc.reservation,
        paiements: bdc.paiements,
      },
    };
  }
}
