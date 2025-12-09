import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDevisDto, CreateDevisItemDto } from './dto/create-devis.dto';
import { UpdateDevisDto, UpdateDevisItemDto } from './dto/update-devis.dto';
import { ClientService } from '../client/client.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { Devis } from 'src/entities/devis.entity';
import { RegionService } from 'src/regions/regions.service';

@Injectable()
export class DevisService {
  constructor(
    @InjectRepository(Devis)
    private devisRepository: Repository<Devis>,
    private readonly clientService: ClientService,
    private readonly regionService: RegionService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  private calculateNumberOfDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  private async processDevisItem(
    item: CreateDevisItemDto | UpdateDevisItemDto,
  ): Promise<any> {
    if (!item.regionId) {
      throw new BadRequestException(
        `Chaque item doit spécifier un 'regionId'.`,
      );
    }
    if (!item.vehiculeId) {
      throw new BadRequestException(
        `Chaque item doit spécifier un 'vehiculeId'.`,
      );
    }

    const region = await this.regionService.regionRepository.findOne({
      where: { id: item.regionId },
      relations: ['prix'],
    });

    if (!region) {
      throw new BadRequestException(
        `Région avec l'ID ${item.regionId} introuvable.`,
      );
    }
    if (!region.prix) {
      throw new BadRequestException(
        `Aucun prix défini pour la région avec l'ID ${item.regionId} (${region.nom_region}).`,
      );
    }

    const vehicule = await this.vehiclesService.vehiculeRepository.findOne({
      where: { id: item.vehiculeId },
      relations: ['type', 'status'],
    });

    if (!vehicule) {
      throw new BadRequestException(
        `Véhicule avec l'ID ${item.vehiculeId} introuvable.`,
      );
    }
    if (vehicule.status.status !== 'Disponible') {
      throw new BadRequestException(
        `Le véhicule "${vehicule.nom} - ${vehicule.immatriculation}" n'est pas disponible pour la location (statut: ${vehicule.status.status}).`,
      );
    }

    return {
      quantity: item.quantity,
      regionId: item.regionId,
      vehiculeId: item.vehiculeId,
      unitPrice: region.prix.prix,
      regionName:
        region.nom_region +
        (region.nom_district ? ` - ${region.nom_district}` : ''),
      vehiculeDetails: {
        nom: vehicule.nom,
        marque: vehicule.marque,
        modele: vehicule.modele,
        immatriculation: vehicule.immatriculation,
        nombrePlace: vehicule.nombrePlace,
        type: vehicule.type.type,
        imageUrl: vehicule.imageUrl,
      },
    };
  }

  async create(createDevisDto: CreateDevisDto): Promise<Devis> {
    const {
      clientId,
      items,
      startDate,
      endDate,
      includesFuel,
      fuelCostPerDay,
      ...rest
    } = createDevisDto;

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      throw new BadRequestException(
        'Les dates de début ou de fin ne sont pas valides.',
      );
    }
    if (parsedEndDate < parsedStartDate) {
      throw new BadRequestException(
        'La date de fin ne peut pas être antérieure à la date de début.',
      );
    }

    const numberOfDays = this.calculateNumberOfDays(
      parsedStartDate,
      parsedEndDate,
    );
    if (numberOfDays <= 0) {
      throw new BadRequestException(
        'Le nombre de jours de location doit être supérieur à zéro.',
      );
    }

    // Validation spécifique au carburant
    if (includesFuel && (fuelCostPerDay === undefined || fuelCostPerDay <= 0)) {
      throw new BadRequestException(
        'Si le carburant est inclus, "fuelCostPerDay" doit être fourni et être un nombre positif.',
      );
    }
    if (!includesFuel && fuelCostPerDay !== undefined && fuelCostPerDay > 0) {
      throw new BadRequestException(
        'Si le carburant n\'est pas inclus, "fuelCostPerDay" ne doit pas être fourni ou doit être zéro.',
      );
    }

    const client = await this.clientService.findOne(clientId);
    if (!client) {
      throw new BadRequestException(
        `Client avec l'ID ${clientId} introuvable.`,
      );
    }

    let totalAmount = 0;
    const processedItems: any[] = [];
    const selectedVehicleIds = new Set<number>();

    for (const item of items) {
      if (selectedVehicleIds.has(item.vehiculeId)) {
        throw new BadRequestException(
          `Le véhicule avec l'ID ${item.vehiculeId} est sélectionné plusieurs fois dans ce devis.`,
        );
      }
      selectedVehicleIds.add(item.vehiculeId);

      const processedItem = await this.processDevisItem(item);
      processedItems.push(processedItem);
      totalAmount +=
        processedItem.unitPrice * processedItem.quantity * numberOfDays;
    }

    // Ajout du coût du carburant au total si inclus
    if (includesFuel && fuelCostPerDay !== undefined) {
      totalAmount += fuelCostPerDay * numberOfDays;
    }

    const devis = this.devisRepository.create({
      ...rest,
      ...(typeof processedItems !== 'undefined' && { items: processedItems }), // Only include if items is a valid property
      totalAmount,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      includesFuel, // Enregistrement de l'option carburant
      fuelCostPerDay: includesFuel ? fuelCostPerDay : undefined, // Use undefined instead of null
      client,
      clientId: client.id,
    });

    return this.devisRepository.save(devis);
  }

  findAll(): Promise<Devis[]> {
    return this.devisRepository.find({ relations: ['client'] });
  }

  async findOne(id: string): Promise<Devis> {
    const devis = await this.devisRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!devis) {
      throw new NotFoundException(`Devis avec l'ID "${id}" introuvable`);
    }
    return devis;
  }

  async update(id: string, updateDevisDto: UpdateDevisDto): Promise<Devis> {
    const devis = await this.findOne(id);

    // Update client if provided
    if (updateDevisDto.clientId && updateDevisDto.clientId !== devis.clientId) {
      const newClient = await this.clientService.findOne(
        updateDevisDto.clientId,
      );
      if (!newClient) {
        throw new BadRequestException(
          `Client with ID ${updateDevisDto.clientId} not found.`,
        );
      }
      devis.client = newClient;
      devis.clientId = newClient.id;
    }

    // Update dates and recalculate number of days if dates are provided
    let newStartDate = devis.startDate;
    let newEndDate = devis.endDate;

    if (updateDevisDto.startDate) {
      const parsed = new Date(updateDevisDto.startDate);
      if (isNaN(parsed.getTime()))
        throw new BadRequestException('Start date is invalid.');
      newStartDate = parsed;
    }
    if (updateDevisDto.endDate) {
      const parsed = new Date(updateDevisDto.endDate);
      if (isNaN(parsed.getTime()))
        throw new BadRequestException('End date is invalid.');
      newEndDate = parsed;
    }

    if (newEndDate < newStartDate) {
      throw new BadRequestException('End date cannot be before start date.');
    }
    const numberOfDays = this.calculateNumberOfDays(newStartDate, newEndDate);
    if (numberOfDays <= 0) {
      throw new BadRequestException(
        'Number of rental days must be greater than zero after update.',
      );
    }

    devis.startDate = newStartDate;
    devis.endDate = newEndDate;

    // Update includesFuel and fuelCostPerDay
    // Use `if (updateDevisDto.includesFuel !== undefined)` to allow explicit false
    if (updateDevisDto.includesFuel !== undefined) {
      devis.includesFuel = updateDevisDto.includesFuel;
      if (devis.includesFuel) {
        if (
          updateDevisDto.fuelCostPerDay === undefined ||
          updateDevisDto.fuelCostPerDay <= 0
        ) {
          throw new BadRequestException(
            'If fuel is included, "fuelCostPerDay" must be provided and be a positive number.',
          );
        }
        devis.fuelCostPerDay = updateDevisDto.fuelCostPerDay;
      } else {
        devis.fuelCostPerDay = undefined;
        if (
          updateDevisDto.fuelCostPerDay !== undefined &&
          updateDevisDto.fuelCostPerDay > 0
        ) {
          throw new BadRequestException(
            'If fuel is not included, "fuelCostPerDay" should not be provided or should be zero.',
          );
        }
      }
    } else if (
      devis.includesFuel &&
      updateDevisDto.fuelCostPerDay !== undefined &&
      updateDevisDto.fuelCostPerDay <= 0
    ) {
      // If includesFuel was true and fuelCostPerDay is updated to <= 0, it's an error
      throw new BadRequestException(
        'If fuel is currently included, "fuelCostPerDay" must remain a positive number or includesFuel must be set to false.',
      );
    } else if (
      devis.includesFuel &&
      updateDevisDto.fuelCostPerDay !== undefined
    ) {
      // If includesFuel is true and only fuelCostPerDay is updated
      devis.fuelCostPerDay = updateDevisDto.fuelCostPerDay;
    }

    let newTotalAmount = 0;
    // Recalculate total amount from items
    if (updateDevisDto.items) {
      const updatedProcessedItems: any[] = [];
      const selectedVehicleIds = new Set<number>();

      for (const item of updateDevisDto.items) {
        if (item.vehiculeId && selectedVehicleIds.has(item.vehiculeId)) {
          throw new BadRequestException(
            `Le véhicule avec l'ID ${item.vehiculeId} est sélectionné plusieurs fois dans les items de mise à jour.`,
          );
        }
        if (item.vehiculeId) {
          selectedVehicleIds.add(item.vehiculeId);
        }

        const processedItem = await this.processDevisItem(item);
        updatedProcessedItems.push(processedItem);
        newTotalAmount +=
          processedItem.unitPrice * processedItem.quantity * numberOfDays;
      }
      devis.items = updatedProcessedItems;
    } else {
      // If items are not updated, use existing items to calculate base total
      for (const item of devis.items) {
        newTotalAmount += item.unitPrice * item.quantity * numberOfDays;
      }
    }

    // Add fuel cost to the total amount based on the updated devis.includesFuel and devis.fuelCostPerDay
    if (
      devis.includesFuel &&
      devis.fuelCostPerDay !== null &&
      devis.fuelCostPerDay !== undefined
    ) {
      newTotalAmount += devis.fuelCostPerDay * numberOfDays;
    }
    devis.totalAmount = newTotalAmount; // Assign the final calculated total

    Object.assign(devis, updateDevisDto); // Apply other updates like status

    return this.devisRepository.save(devis);
  }

  async remove(id: string): Promise<void> {
    const result = await this.devisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Devis with ID "${id}" not found`);
    }
  }
}
