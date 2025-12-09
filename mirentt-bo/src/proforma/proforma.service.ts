import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proforma, ProformaStatus } from 'src/entities/proforma.entity';
import { ProformaItem } from 'src/entities/proformat-item.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateProformaItemByCriteriaDto } from './create-proformaItem.dto';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';
import { Status } from 'src/entities/status.entity';
import { CreateProformaByCriteriaDto } from './create-proforma.dto';
import { Client } from 'src/entities/client.entity';
import { Type } from 'src/entities/type.entity';
import { FindAvailableVehiclesDto } from 'src/dto/find-available-vehicles.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { MailService } from 'src/mailer/mailer.service';
import { UpdateProformaItemDto } from './uptade-proforma.dto';
import { Response } from 'express';

@Injectable()
export class ProformaService {
  constructor(
    @InjectRepository(Proforma)
    private readonly proformaRepository: Repository<Proforma>,
    @InjectRepository(ProformaItem)
    private readonly proformaItemRepository: Repository<ProformaItem>,
    @InjectRepository(Vehicule)
    private readonly vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    @InjectRepository(Prix)
    private readonly prixRepository: Repository<Prix>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    private readonly pdfService: PdfService,
    private readonly mailService: MailService,
  ) {}

  async generateProformaNumber(): Promise<string> {
    const lastProforma = await this.proformaRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let numero = 1;
    if (lastProforma.length > 0) {
      const lastNumberMatch =
        lastProforma[0].proformaNumber.match(/MRT (\d+)PROF/);
      if (lastNumberMatch) {
        numero = parseInt(lastNumberMatch[1], 10) + 1;
      }
    }

    const date = new Date();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = date.getFullYear();

    return `FACTURE PROFORMA N° MRT ${String(numero).padStart(3, '0')}PROF/${mois}/${annee}`;
  }

  async create(
    proformaData: CreateProformaByCriteriaDto,
  ): Promise<{ proforma: Proforma; pdfBuffer: Buffer; message: string }> {
    const clientExist = await this.clientRepository.findOne({
      where: [
        { lastName: proformaData.clientLastName },
        { email: proformaData.clientEmail },
        { phone: proformaData.clientPhone },
      ],
    });
    if (!clientExist) {
      throw new NotFoundException(
        `Client not found with the provided information`,
      );
    }

    const proforma = this.proformaRepository.create({
      client: clientExist,
      date: proformaData.date,
      contractReference: proformaData.contractReference,
      notes: proformaData.notes,
      proformaNumber: await this.generateProformaNumber(),
    });

    proforma.proformaNumber = await this.generateProformaNumber();

    const proformaItems = await Promise.all(
      proformaData.items.map(async (item: CreateProformaItemByCriteriaDto) => {
        const regionExist = await this.regionRepository.findOne({
          where: { nom_region: item.regionName },
          relations: ['prix'],
        });
        if (!regionExist) {
          throw new NotFoundException(
            `Region with name "${item.regionName}" not found`,
          );
        }

        if (!regionExist.prix) {
          throw new NotFoundException(
            `Price not found for the region "${item.regionName}"`,
          );
        }
        const prixExist = regionExist.prix;

        const statusDisponible = await this.statusRepository.findOne({
          where: { status: 'Disponible' },
        });
        if (!statusDisponible) {
          throw new NotFoundException(`Statut "Disponible" non trouvé`);
        }

        const whereClause: any = {
          ...item.vehicleCriteria,
          status: { id: statusDisponible.id },
        };
        if (item.vehicleCriteria.type) {
          const typeExist = await this.typeRepository.findOne({
            where: { type: item.vehicleCriteria.type },
          });
          if (!typeExist) {
            throw new NotFoundException(
              `Type "${item.vehicleCriteria.type}" not found`,
            );
          }
          whereClause.type = typeExist;
          delete whereClause.type;
        }

        console.log('Critères de recherche :', whereClause);
        const availableVehicles = await this.vehiculeRepository.find({
          where: whereClause,
          relations: ['type', 'status'],
        });

        if (!availableVehicles || availableVehicles.length === 0) {
          throw new NotFoundException(
            `No available vehicle found for the given criteria`,
          );
        }

        const vehiculeChoisi = availableVehicles[0];

        const vehiculeDejaLoue = await this.proformaItemRepository.findOne({
          where: {
            vehicle: { id: vehiculeChoisi.id },
            dateDepart: item.dateDepart,
            dateRetour: item.dateRetour,
          },
        });

        if (vehiculeDejaLoue) {
          throw new BadRequestException(
            `Le véhicule "${vehiculeChoisi.nom}" (ID: ${vehiculeChoisi.id}) est déjà loué pour cette période`,
          );
        }

        const dureeLocation = Math.ceil(
          (new Date(item.dateRetour).getTime() -
            new Date(item.dateDepart).getTime()) /
            (1000 * 3600 * 24),
        );
        const prixNumerique = Number(prixExist.prix);
        const subTotalCalculated = prixNumerique * dureeLocation;

        console.log(
          'Création ProformaItem - prixExist.prix:',
          prixExist.prix,
          'dureeLocation:',
          dureeLocation,
          'subTotalCalculated:',
          subTotalCalculated,
        );

        const proformaItem = this.proformaItemRepository.create({
          vehicle: vehiculeChoisi,
          region: regionExist,
          prix: prixExist,
          dateDepart: new Date(item.dateDepart),
          dateRetour: new Date(item.dateRetour),
          nombreJours: dureeLocation,
          subTotal: subTotalCalculated,
        });

        const statusIndisponible = await this.statusRepository.findOne({
          where: { status: 'Réservé' },
        });
        if (!statusIndisponible) {
          throw new NotFoundException(`Statut "Réservé" non trouvé`);
        }

        vehiculeChoisi.status = statusIndisponible;
        await this.vehiculeRepository.save(vehiculeChoisi);

        return proformaItem;
      }),
    );

    proforma.items = await this.proformaItemRepository.save(proformaItems);
    proforma.totalAmount = proforma.items.reduce(
      (sum, item) => sum + Number(item.subTotal),
      0,
    );
    console.log('Total amount (before toFixed):', proforma.totalAmount);
    console.log('Type of total amount:', typeof proforma.totalAmount);
    proforma.totalAmount = Number(proforma.totalAmount.toFixed(2));
    console.log('Total amount (after toFixed):', proforma.totalAmount);
    console.log('Type of total amount:', typeof proforma.totalAmount);

    const savedProforma = await this.proformaRepository.save(proforma);

    const savedProformaWithRelations = await this.proformaRepository.findOne({
      where: { id: savedProforma.id },
      relations: [
        'items',
        'items.vehicle',
        'items.vehicle.type',
        'items.vehicle.status',
        'items.region',
        'items.prix',
        'client',
      ],
    });

    console.log('Saved proforma with relations:', savedProformaWithRelations);

    const pdfBuffer = await this.pdfService.generateProformaPdf(
      savedProformaWithRelations,
    );

    if (!savedProformaWithRelations) {
      throw new NotFoundException('Proforma not found after saving.');
    }

    return {
      message: 'Le proforma a été créé avec succès !',
      proforma: savedProformaWithRelations,
      pdfBuffer,
    };
  }

  async updateStatus(id: number, newStatus: ProformaStatus): Promise<Proforma> {
    const proforma = await this.proformaRepository.findOne({
      where: { id: Number(id) },
    });
    if (!proforma) {
      throw new NotFoundException(`Proforma with ID ${id} not found`);
    }

    proforma.status = newStatus;
    return this.proformaRepository.save(proforma);
  }

  async findAvailableVehicles(
    criteria: FindAvailableVehiclesDto,
  ): Promise<Vehicule[]> {
    const { marque, modele, type, dateDepart, dateRetour } = criteria;

    const statusDisponible = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
    });
    if (!statusDisponible) {
      throw new NotFoundException(`Statut "Disponible" non trouvé`);
    }

    const whereClause: any = { status: { id: statusDisponible.id } };
    if (marque) {
      whereClause.marque = marque;
    }
    if (modele) {
      whereClause.modele = modele;
    }
    if (type) {
      const typeExist = await this.typeRepository.findOne({ where: { type } });
      if (!typeExist) {
        throw new NotFoundException(`Type "${type}" non trouvé`);
      }
      whereClause.type = typeExist;
    }

    const allMatchingVehicles = await this.vehiculeRepository.find({
      where: whereClause,
      relations: ['type', 'status'],
    });

    const unavailableVehicles = await this.proformaItemRepository.find({
      where: [
        {
          dateDepart: LessThanOrEqual(dateRetour),
          dateRetour: MoreThanOrEqual(dateDepart),
        },
      ],
      relations: ['vehicle'],
    });

    const unavailableVehicleIds = unavailableVehicles.map(
      (item) => item.vehicle.id,
    );

    return allMatchingVehicles.filter(
      (vehicle) => !unavailableVehicleIds.includes(vehicle.id),
    );
  }

  async findOne(id: number): Promise<Proforma> {
    const proforma = await this.proformaRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.vehicle',
        'items.vehicle.type',
        'items.vehicle.status',
        'items.region',
        'items.prix',
        'client',
      ],
    });

    if (!proforma) {
      throw new NotFoundException(`Proforma with ID ${id} not found`);
    }

    return proforma;
  }

  async findAll(): Promise<Proforma[]> {
    return this.proformaRepository.find({
      relations: [
        'items',
        'items.vehicle',
        'items.vehicle.type',
        'items.vehicle.status',
        'items.region',
        'items.prix',
        'client',
      ],
    });
  }

  async delete(id: number): Promise<void> {
    const proforma = await this.proformaRepository.findOne({
      where: { id },
      relations: ['items', 'items.vehicle'],
    });

    if (!proforma) {
      throw new NotFoundException(`Proforma with ID ${id} not found`);
    }

    // Mettre à jour le statut des véhicules associés à "Disponible"
    const statusDisponible = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
    });
    if (!statusDisponible) {
      throw new NotFoundException(`Statut "Disponible" non trouvé`);
    }

    for (const item of proforma.items) {
      const vehicle = item.vehicle;
      vehicle.status = statusDisponible;
      await this.vehiculeRepository.save(vehicle);
    }

    // Supprimer les éléments du proforma
    await this.proformaItemRepository.delete({ proforma: { id } });

    // Supprimer le proforma
    await this.proformaRepository.delete(id);
  }

  // mettre à jour un proforma

  async update(
    id: number,
    updateDto: UpdateProformaItemDto,
  ): Promise<ProformaItem> {
    const item = await this.proformaItemRepository.findOne({
      where: { id },
      relations: ['region', 'vehicle', 'prix', 'vehicle.type'],
    });

    if (!item) {
      throw new NotFoundException(`Proforma item avec l'id ${id} non trouvé.`);
    }

    // Mise à jour de la région
    if (updateDto.regionName) {
      const region = await this.regionRepository.findOne({
        where: { nom_region: updateDto.regionName },
      });
      if (!region) {
        throw new NotFoundException(
          `Région avec le nom "${updateDto.regionName}" non trouvée.`,
        );
      }
      item.region = region;
    }

    // Mise à jour du véhicule
    if (updateDto.vehicleCriteria) {
      // Prepare criteria for vehicle lookup
      const vehicleCriteria: any = { ...updateDto.vehicleCriteria };
      if (vehicleCriteria.type) {
        const typeEntity = await this.typeRepository.findOne({
          where: { type: vehicleCriteria.type },
        });
        if (!typeEntity) {
          throw new NotFoundException(
            `Type de véhicule "${vehicleCriteria.type}" non trouvé.`,
          );
        }
        vehicleCriteria.type = typeEntity;
      }
      const vehicle = await this.vehiculeRepository.findOne({
        where: vehicleCriteria,
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Véhicule avec les critères fournis non trouvé.`,
        );
      }
      if (updateDto.vehicleCriteria.marque)
        vehicle.marque = updateDto.vehicleCriteria.marque;
      if (updateDto.vehicleCriteria.modele)
        vehicle.modele = updateDto.vehicleCriteria.modele;
      if (updateDto.vehicleCriteria.type) {
      }
      await this.vehiculeRepository.save(vehicle);
      item.vehicle = vehicle;
    }

    // Mise à jour des dates
    if (updateDto.dateDepart) item.dateDepart = updateDto.dateDepart;
    if (updateDto.dateRetour) item.dateRetour = updateDto.dateRetour;

    // Mise à jour du prix
    if (updateDto.prixId) {
      const prix = await this.prixRepository.findOne({
        where: { id: updateDto.prixId },
      });
      if (!prix) {
        throw new BadRequestException(
          `Prix avec l'id ${updateDto.prixId} non trouvé.`,
        );
      }
      item.prix = prix;
    }

    // Mise à jour du nombre de jours
    if (updateDto.nombreJours !== undefined) {
      item.nombreJours = updateDto.nombreJours;
    }

    // Recalcul du subTotal si prix et nombreJours sont présents
    if (item.prix && item.nombreJours !== undefined) {
      const prixValue =
        typeof item.prix.prix === 'number'
          ? item.prix.prix
          : Number(item.prix.prix);
      item.subTotal = prixValue * item.nombreJours;
    }

    return this.proformaItemRepository.save(item);
  }

  // Nouvelle méthode pour servir le PDF
  async getProformaPdf(id: number, res: Response): Promise<void> {
    const proformaWithRelations = await this.proformaRepository.findOne({
      where: { id },
      relations: [
        'items',
        'items.vehicle',
        'items.vehicle.type',
        'items.vehicle.status',
        'items.region',
        'items.prix',
        'client',
      ],
    });

    if (!proformaWithRelations) {
      throw new NotFoundException(`Proforma with ID ${id} not found`);
    }

    const pdfBuffer = await this.pdfService.generateProformaPdf(
      proformaWithRelations,
    );

    // Configuration des headers pour indiquer au navigateur qu'il s'agit d'un PDF à télécharger
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="proforma_${proformaWithRelations.proformaNumber}.pdf"`,
    );

    // Envoyer le buffer du PDF en réponse
    res.send(pdfBuffer);
  }

  async getProformaItemsByClientId(clientId: number): Promise<ProformaItem[]> {
    return this.proformaItemRepository.find({
      where: {
        proforma: {
          client: { id: clientId }, // Assurez-vous que Proforma et Client sont correctement liés
        },
      },
      relations: ['proforma', 'proforma.client', 'vehicle', 'region', 'prix'],
    });
  }
}
