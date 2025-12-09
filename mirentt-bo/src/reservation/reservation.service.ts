import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CarburantPolicy,
  Reservation,
  ReservationStatus,
} from '../entities/reservation.entity';
import { CreateReservationDto } from './dto/create_reservation.dto';
import { Client } from '../entities/client.entity';
import { Vehicule } from '../entities/vehicle.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { BonDeCommande } from 'src/entities/commande.entity';
import { PrixCarburant } from 'src/entities/carburant-price.entity';
import { TypeCarburant } from '../entities/carburant.entity';
import { Facture } from 'src/entities/facture.entity';

import { FactureService } from 'src/facturation/facturation.service';
import { NotificationsService } from 'src/notifications/notifications.service';

// 🔹 Fonction utilitaire pour convertir un nombre en lettres (français simplifié)
function numberToFrenchWords(n: number): string {
  const units = [
    '',
    'un',
    'deux',
    'trois',
    'quatre',
    'cinq',
    'six',
    'sept',
    'huit',
    'neuf',
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
  ];
  const tens = [
    '',
    'dix',
    'vingt',
    'trente',
    'quarante',
    'cinquante',
    'soixante',
    'soixante',
    'quatre-vingt',
    'quatre-vingt',
  ];

  if (n === 0) return 'zéro Ariary';

  function convertBelow1000(num: number): string {
    let result = '';
    let hundreds = Math.floor(num / 100);
    let remainder = num % 100;

    if (hundreds > 0) {
      if (hundreds > 1) result += units[hundreds] + ' ';
      result += 'cent';
      if (remainder === 0 && hundreds > 1) result += 's';
      if (remainder > 0) result += ' ';
    }

    if (remainder > 0) {
      if (remainder < 20) {
        result += units[remainder];
      } else {
        let ten = Math.floor(remainder / 10);
        let unit = remainder % 10;

        if (ten === 7 || ten === 9) {
          result += tens[ten] + '-' + units[10 + unit];
        } else {
          result += tens[ten];
          if (unit === 1 && ten !== 8) {
            result += ' et un';
          } else if (unit > 0) {
            result += '-' + units[unit];
          }
          if (ten === 8 && unit === 0) result += 's';
        }
      }
    }
    return result.trim();
  }

  let parts: string[] = [];
  let milliards = Math.floor(n / 1_000_000_000);
  let millions = Math.floor((n % 1_000_000_000) / 1_000_000);
  let milliers = Math.floor((n % 1_000_000) / 1000);
  let reste = n % 1000;

  if (milliards > 0) {
    parts.push(
      convertBelow1000(milliards) + ' milliard' + (milliards > 1 ? 's' : ''),
    );
  }
  if (millions > 0) {
    parts.push(
      convertBelow1000(millions) + ' million' + (millions > 1 ? 's' : ''),
    );
  }
  if (milliers > 0) {
    if (milliers === 1) parts.push('mille');
    else parts.push(convertBelow1000(milliers) + ' mille');
  }
  if (reste > 0) {
    parts.push(convertBelow1000(reste));
  }

  return parts.join(' ') + ' Ariary';
}

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Vehicule)
    private vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @InjectRepository(BonDeCommande)
    private bonDeCommandeRepository: Repository<BonDeCommande>,
    @InjectRepository(PrixCarburant)
    private prixCarburantRepository: Repository<PrixCarburant>,
    private factureService: FactureService,
    private notificationsService: NotificationsService,
  ) { }

  async createDevis(dto: CreateReservationDto): Promise<Reservation> {
    const {
      clientId,
      vehiculeId,
      pickup_date,
      return_date,
      region_id,
      carburant_policy,
      carburant_depart,
    } = dto;

    const client = await this.clientRepository.findOneBy({ id: clientId });
    if (!client)
      throw new NotFoundException(`Client with ID ${clientId} not found`);

    const vehicule = await this.vehiculeRepository.findOne({
      where: { id: vehiculeId },
      relations: ['status'],
    });
    if (!vehicule)
      throw new NotFoundException(`Vehicule with ID ${vehiculeId} not found`);

    if (vehicule.status.status !== 'Disponible') {
      throw new BadRequestException(
        `Le véhicule n'est pas disponible (Statut actuel : ${vehicule.status.status})`,
      );
    }

    const reservedStatus = await this.statusRepository.findOne({
      where: { status: 'Réservé' },
    });
    if (!reservedStatus)
      throw new Error('Status "Réservé" not found in database');

    vehicule.status = reservedStatus;
    await this.vehiculeRepository.save(vehicule);

    const region = await this.regionRepository.findOne({
      where: { id: region_id },
      relations: ['prix'],
    });
    if (!region)
      throw new NotFoundException(`Region with ID ${region_id} not found`);
    if (!region.prix || region.prix.prix === undefined)
      throw new NotFoundException(
        `Pricing for region ID ${region_id} not found`,
      );

    const dailyRate = parseFloat(String(region.prix.prix));
    const startDate = new Date(pickup_date);
    const endDate = new Date(return_date);

    if (endDate <= startDate)
      throw new BadRequestException('Return date must be after pickup date');

    const rentalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = rentalDays * dailyRate;
    let note = 'Sans carburant';

    const policy: CarburantPolicy = carburant_policy as CarburantPolicy;

    if (policy === CarburantPolicy.PLEIN_A_PLEIN) {
      note = 'Carburant inclus (Plein à plein)';
    } else if (policy === CarburantPolicy.PAY_AS_YOU_USE) {
      note = 'Carburant à payer au retour (Pay as you use)';
    }

    const lastReservation = await this.reservationRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let nextNumber = 1;
    if (lastReservation.length > 0) {
      const lastRef = lastReservation[0].reference;
      const match = lastRef?.match(/DEV-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const newReference = `DEV-${String(nextNumber).padStart(3, '0')}`;

    const newDevis = this.reservationRepository.create({
      reference: newReference,
      client,
      vehicule,
      pickup_date: startDate,
      return_date: endDate,
      location: region,
      nombreJours: rentalDays,
      total_price: totalPrice,
      status: ReservationStatus.DEVIS,
      note,
      carburant_policy: policy,
      carburant_depart,
      createdAt: new Date(),
    });

    const savedDevis = await this.reservationRepository.save(newDevis);

    // Créer une notification pour l'admin
    await this.notificationsService.createNotification({
      type: 'new_reservation',
      message: `Nouveau devis créé par ${client.lastName} pour ${vehicule.marque} ${vehicule.modele} (${newReference})`,
      isRead: false,
      payload: {
        reservationId: savedDevis.id,
        clientName: client.lastName,
        vehicleName: `${vehicule.marque} ${vehicule.modele}`,
        status: 'devis',
      },
    });

    return savedDevis;
  }

  async confirmReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['vehicule', 'bonDeCommande'],
    });
    if (!reservation)
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );

    // Vérifier si la réservation est déjà confirmée ou a un BonDeCommande
    if (reservation.status !== ReservationStatus.DEVIS) {
      throw new BadRequestException(
        `Reservation is not in DEVIS status. Current status: ${reservation.status}`,
      );
    }

    // Ajout de la vérification pour la contrainte d'unicité
    if (reservation.bonDeCommande) {
      throw new BadRequestException(
        `A Bon de Commande already exists for this reservation.`,
      );
    }

    const reservedStatus = await this.statusRepository.findOne({
      where: { status: 'Réservé' },
    });
    if (!reservedStatus)
      throw new Error('Status "Réservé" not found in database');

    reservation.vehicule.status = reservedStatus;
    await this.vehiculeRepository.save(reservation.vehicule);

    reservation.status = ReservationStatus.CONFIRMEE;
    await this.reservationRepository.save(reservation);

    const lastBDC = await this.bonDeCommandeRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    let nextNumber = 1;
    if (lastBDC.length > 0) {
      const lastRef = lastBDC[0].reference;
      const match = lastRef?.match(/BC-(\d+)/);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }
    const newBDCRef = `BC-${String(nextNumber).padStart(3, '0')}`;

    const bdc = this.bonDeCommandeRepository.create({
      reference: newBDCRef,
      reservation,
    });
    await this.bonDeCommandeRepository.save(bdc);

    // Créer une notification pour l'admin lors de la confirmation
    await this.notificationsService.createNotification({
      type: 'reservation_confirmed',
      message: `Devis ${reservation.reference} confirmé par ${reservation.client.lastName} - Bon de commande ${newBDCRef} créé`,
      isRead: false,
      payload: {
        reservationId: reservation.id,
        bonDeCommandeId: bdc.id,
        bonDeCommandeRef: newBDCRef,
        clientName: reservation.client.lastName,
        vehicleName: `${reservation.vehicule.marque} ${reservation.vehicule.modele}`,
        status: 'confirmée',
      },
    });

    return reservation;
  }

  async completeReservation(
    reservationId: number,
    carburant_retour: number,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: [
        'vehicule',
        'vehicule.typeCarburant',
        'location',
        'location.prix',
        'bonDeCommande',
      ],
    });

    if (!reservation)
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    if (reservation.status !== ReservationStatus.CONFIRMEE)
      throw new BadRequestException(`Reservation is not in CONFIRMEE status`);

    if (reservation.carburant_policy === CarburantPolicy.PAY_AS_YOU_USE) {
      const carburantDepart = parseFloat(String(reservation.carburant_depart));
      const carburantRetour = parseFloat(String(carburant_retour));

      if (isNaN(carburantDepart) || isNaN(carburantRetour)) {
        throw new BadRequestException(
          'Les valeurs de carburant doivent être des nombres.',
        );
      }

      const consommation = carburantDepart - carburantRetour;
      if (consommation > 0) {
        if (!reservation.vehicule.typeCarburant) {
          throw new BadRequestException(
            "Le type de carburant du véhicule n'est pas défini.",
          );
        }
        const dernierPrixCarburant = await this.prixCarburantRepository.findOne(
          {
            where: {
              typeCarburant: { id: reservation.vehicule.typeCarburant.id },
            },
            order: { date_effective: 'DESC' },
          },
        );

        if (!dernierPrixCarburant) {
          throw new NotFoundException(
            `Prix du carburant pour le type '${reservation.vehicule.typeCarburant.nom}' non défini. Veuillez le configurer.`,
          );
        }

        const prixLitre = parseFloat(
          String(dernierPrixCarburant.prix_par_litre),
        );
        let totalPrice = parseFloat(String(reservation.total_price));
        totalPrice += consommation * prixLitre;

        reservation.total_price = totalPrice;
        reservation.note = `Carburant (${reservation.vehicule.typeCarburant.nom}) payé au retour (${consommation} L x ${prixLitre} Ariary)`;
      }
      reservation.carburant_retour = carburant_retour;
    }

    const availableStatus = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
    });
    if (!availableStatus)
      throw new Error('Status "Disponible" not found in database');

    reservation.vehicule.status = availableStatus;
    await this.vehiculeRepository.save(reservation.vehicule);

    reservation.status = ReservationStatus.TERMINEE;
    const savedReservation = await this.reservationRepository.save(reservation);

    const facture = await this.factureService.generateFactureFinale(
      reservation.bonDeCommande.id,
    );

    // Créer une notification pour l'admin lors de la terminaison
    await this.notificationsService.createNotification({
      type: 'reservation_completed',
      message: `Réservation ${reservation.reference} terminée - Facture générée pour ${reservation.client.lastName} (Total: ${savedReservation.total_price} Ar)`,
      isRead: false,
      payload: {
        reservationId: reservation.id,
        factureId: facture.id,
        clientName: reservation.client.lastName,
        vehicleName: `${reservation.vehicule.marque} ${reservation.vehicule.modele}`,
        totalPrice: savedReservation.total_price,
        status: 'terminée',
      },
    });

    return savedReservation;
  }

  async cancelReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['vehicule', 'vehicule.status', 'bonDeCommande'],
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    // Vérifier si la réservation peut être annulée
    if (
      reservation.status === ReservationStatus.TERMINEE ||
      reservation.status === ReservationStatus.ANNULEE
    ) {
      throw new BadRequestException(
        `Cannot cancel reservation in status: ${reservation.status}`,
      );
    }

    // Remettre le véhicule en statut "Disponible"
    const availableStatus = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
    });
    if (!availableStatus)
      throw new Error('Status "Disponible" not found in database');

    reservation.vehicule.status = availableStatus;
    await this.vehiculeRepository.save(reservation.vehicule);

    // Marquer la réservation comme annulée
    reservation.status = ReservationStatus.ANNULEE;
    reservation.note = `Réservation annulée le ${new Date().toLocaleDateString()}`;

    return this.reservationRepository.save(reservation);
  }

  async deleteReservation(reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['bonDeCommande'],
    });

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationId} not found`,
      );
    }

    // Empêcher la suppression des réservations confirmées ou terminées
    if (
      reservation.status === ReservationStatus.CONFIRMEE ||
      reservation.status === ReservationStatus.TERMINEE
    ) {
      throw new ForbiddenException(
        `Cannot delete reservation in status: ${reservation.status}. Use cancel instead.`,
      );
    }

    // Supprimer le bon de commande associé s'il existe
    if (reservation.bonDeCommande) {
      await this.bonDeCommandeRepository.remove(reservation.bonDeCommande);
    }

    await this.reservationRepository.remove(reservation);
  }

  // Mettre à jour la méthode findAll pour inclure les réservations annulées
  async findAll(clientId?: number): Promise<any[]> {
    const whereClause = clientId ? { client: { id: clientId } } : {};
    const reservations = await this.reservationRepository.find({
      where: whereClause,
      relations: [
        'client',
        'vehicule',
        'vehicule.type',
        'vehicule.status',
        'location',
        'location.prix',
      ],
    });

    return reservations.map((res) => {
      const dailyRate = parseFloat(String(res.location?.prix?.prix)) || 0;
      return {
        id: res.id,
        reference: res.reference,
        client: res.client,
        vehicule: res.vehicule,
        pickup_date: res.pickup_date,
        return_date: res.return_date,
        createdAt: res.createdAt,
        nombreJours: res.nombreJours,
        prix_unitaire: dailyRate,
        total_price: res.total_price,
        total_en_lettres: numberToFrenchWords(
          parseFloat(String(res.total_price)),
        ),
        note: res.note,
        status: res.status,
        region: res.location
          ? {
            id: res.location.id,
            nom_region: res.location.nom_region,
            nom_district: res.location.nom_district,
          }
          : null,
        // Ajouter des informations supplémentaires pour l'annulation
        canBeCancelled:
          res.status === ReservationStatus.DEVIS ||
          res.status === ReservationStatus.CONFIRMEE,
        canBeDeleted:
          res.status === ReservationStatus.DEVIS ||
          res.status === ReservationStatus.ANNULEE,
      };
    });
  }
}
