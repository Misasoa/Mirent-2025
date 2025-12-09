import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Status } from 'src/entities/status.entity';
import { Repository } from 'typeorm';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { UpdateVehiculeDto } from './updateVehicule.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicule)
    public vehiculeRepository: Repository<Vehicule>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) { }

  async getAvailableVehiculeCount(): Promise<number> {
    const availableStatus = await this.statusRepository.findOne({
      where: { status: 'Disponible' },
      relations: ['vehicules'],
    });

    if (!availableStatus) {
      throw new NotFoundException('Statut "Disponible" non trouvé');
    }

    const availableVehiculeCount = await this.vehiculeRepository.count({
      where: {
        status: availableStatus,
      },
    });
    return availableVehiculeCount;
  }

  /**
   * Calculer le taux d'occupation (véhicules non disponibles / total) × 100
   */
  async getOccupancyRate(): Promise<number> {
    const total = await this.vehiculeRepository.count();
    if (total === 0) return 0;

    const available = await this.getAvailableVehiculeCount();
    const occupied = total - available;
    const rate = (occupied / total) * 100;

    return Math.round(rate);
  }
  // Récupérer tous les véhicules
  async findAll(): Promise<Vehicule[]> {
    return this.vehiculeRepository.find({ relations: ['type', 'status'] });
  }
  //R&cupérer le véhicule par id
  async findOne(id: number): Promise<Vehicule | null> {
    return (
      (await this.vehiculeRepository.findOne({
        where: { id },
        relations: ['type', 'status'],
      })) || null
    );
  }
  //Créer un véhicule
  // Créer un véhicule
  async create(dto: CreateVehiculeDto, imageUrl?: string): Promise<Vehicule> {
    const type = await this.typeRepository.findOne({ where: { id: dto.typeId } });
    const status = await this.statusRepository.findOne({ where: { id: dto.statusId } });

    if (!type || !status) throw new NotFoundException('Type ou Status non trouvé');

    const vehicule = this.vehiculeRepository.create({
      nom: dto.nom,
      marque: dto.marque,
      modele: dto.modele,
      immatriculation: dto.immatriculation,
      nombrePlace: dto.nombrePlace,
      imageUrl: imageUrl || dto.imageUrl,
      distance_moyenne: dto.distance_moyenne,
      derniere_visite: dto.derniere_visite,
      type: type,
      status: status,
    });


    return this.vehiculeRepository.save(vehicule);
  }
  //Mise à jour d'un véhicule
  async update(
    id: number,
    dto: UpdateVehiculeDto,
    imageUrl?: string,
  ): Promise<Vehicule> {
    console.log(`Mise à jour du véhicule avec l'ID : ${id}`);
    console.log('DTO reçu :', dto);
    const vehicule = await this.vehiculeRepository.findOne({
      where: { id },
      relations: ['type', 'status'],
    });

    if (!vehicule) {
      throw new NotFoundException('Véhicule non trouvé');
    }
    console.log('Véhicule récupéré :', vehicule);

    // Modification du status
    if (dto.statusId !== undefined) {
      console.log('Status avant modification :', vehicule.status);
      const status = await this.statusRepository.findOne({
        where: { id: dto.statusId },
      });
      if (!status) {
        throw new BadRequestException('Status non trouvé');
      }
      vehicule.status = status;
      console.log('Status après modification :', vehicule.status);
    }

    // Modification du type
    if (dto.typeId !== undefined) {
      console.log('Type avant modification :', vehicule.type);
      const type = await this.typeRepository.findOne({
        where: { id: dto.typeId },
      });
      if (!type) {
        throw new BadRequestException('Type non trouvé');
      }
      vehicule.type = type;
      console.log('Type après modification :', vehicule.type);
    }

    vehicule.nom = dto.nom || vehicule.nom;
    vehicule.marque = dto.marque || vehicule.marque;
    vehicule.modele = dto.modele || vehicule.modele;
    vehicule.immatriculation = dto.immatriculation || vehicule.immatriculation;
    vehicule.nombrePlace = dto.nombrePlace || vehicule.nombrePlace;
    vehicule.imageUrl = imageUrl || vehicule.imageUrl;
    vehicule.distance_moyenne = dto.distance_moyenne || vehicule.distance_moyenne;
    vehicule.derniere_visite = dto.derniere_visite || vehicule.derniere_visite;

    console.log('Véhicule avant sauvegarde :', vehicule);
    const result = await this.vehiculeRepository.save(vehicule);
    console.log('Véhicule après sauvegarde :', result);

    return result;
  }

  // Cette méthode recherche le véhicule par son ID, puis met à jour son statut

  async updateStatusByName(vehicleId: number, statusName: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id: vehicleId }, relations: ['status'] });
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    const status = await this.statusRepository.findOne({ where: { status: statusName } });
    if (!status) throw new NotFoundException(`Statut "${statusName}" introuvable`);

    vehicule.status = status;
    return this.vehiculeRepository.save(vehicule);
  }
  //Mise à jour du statut d'un véhicule par son ID
  async updateStatus(id: number, statusId: number): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findOne({ where: { id }, relations: ['status'] });
    if (!vehicule) throw new NotFoundException('Véhicule non trouvé');

    const status = await this.statusRepository.findOne({ where: { id: statusId } });
    if (!status) throw new NotFoundException('Statut non trouvé');

    vehicule.status = status;
    return this.vehiculeRepository.save(vehicule);
  }

  //Initialisation des statuts
  async initStatuses(): Promise<void> {
    const statusNames = ['Disponible', 'Maintenance', 'Réservé'];

    for (const name of statusNames) {
      const existing = await this.statusRepository.findOneBy({ status: name });
      if (!existing) {
        await this.statusRepository.save({ status: name });
      }
    }
  }

  //Suppression du statut indisponible
  async removeIndisponibleStatus(): Promise<void> {
    const indisponibleStatus = await this.statusRepository.findOneBy({
      status: 'Indisponible',
    });

    if (indisponibleStatus) {
      const defaultStatus = await this.statusRepository.findOneBy({
        status: 'Disponible',
      }); // ou 'Maintenance'

      if (!defaultStatus) {
        throw new NotFoundException(
          'Statut "Disponible" non trouvé pour la réaffectation.',
        );
      }

      // Met à jour tous les véhicules qui ont le statut "Indisponible"
      const vehicles = await this.vehiculeRepository.find({
        where: { status: { id: indisponibleStatus.id } },
        relations: ['status'],
      });

      for (const vehicle of vehicles) {
        vehicle.status = defaultStatus;
        await this.vehiculeRepository.save(vehicle);
      }

      // Supprimer le statut "Indisponible"
      await this.statusRepository.remove(indisponibleStatus);
    }
  }

  async remove(id: number): Promise<void> {
    await this.vehiculeRepository.delete(id);
  }
}
