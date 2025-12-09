import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonDeCommande } from 'src/entities/commande.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BonDeCommandeService {
  constructor(
    @InjectRepository(BonDeCommande)
    private bdcRepository: Repository<BonDeCommande>,
  ) { }

  async findAll(): Promise<BonDeCommande[]> {
    return this.bdcRepository.find({
      relations: [
        'reservation',
        'reservation.client',
        'reservation.vehicule',
        'reservation.location',
        'reservation.location.prix',
      ],
    });
  }

  async findOne(id: number): Promise<BonDeCommande> {
    const bdc = await this.bdcRepository.findOne({
      where: { id },
      relations: [
        'reservation',
        'reservation.client',
        'reservation.vehicule',
        'reservation.location',
        'reservation.location.prix',
      ],
    });
    if (!bdc) throw new NotFoundException(`BDC with ID ${id} not found`);
    return bdc;
  }

  async remove(id: number): Promise<void> {
    const result = await this.bdcRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BDC with ID ${id} not found`);
    }
  }

  /**
   * Récupérer tous les BDC qui ont un reste à payer (montant payé < montant total)
   */
  async getPendingPayments(): Promise<any[]> {
    const allBDC = await this.bdcRepository.find({
      relations: [
        'reservation',
        'reservation.client',
        'reservation.vehicule',
        'paiements',
      ],
    });

    // Filtrer et enrichir avec les calculs
    const pendingBDC = allBDC
      .map((bdc) => {
        const montantTotal = Number(bdc.reservation?.total_price || 0);
        const totalPaye = bdc.paiements?.reduce(
          (sum, p) => sum + Number(p.montant),
          0,
        ) || 0;
        const reste = montantTotal - totalPaye;

        return {
          id: bdc.id,
          reference: bdc.reference,
          client: {
            lastName: bdc.reservation?.client?.lastName || '',
          },
          vehicule: {
            nom: bdc.reservation?.vehicule?.nom || '',
            marque: bdc.reservation?.vehicule?.marque || '',
            immatriculation: bdc.reservation?.vehicule?.immatriculation || '',
          },
          montantTotal,
          totalPaye,
          reste,
          nombrePaiements: bdc.paiements?.length || 0,
        };
      })
      .filter((bdc) => bdc.reste > 0); // Seulement ceux avec reste à payer

    return pendingBDC;
  }
}
