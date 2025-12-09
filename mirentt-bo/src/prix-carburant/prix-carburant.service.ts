import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrixCarburant } from '../entities/carburant-price.entity';
import { CreatePrixCarburantDto } from './dto/create-prix-carburant.dto';

@Injectable()
export class PrixCarburantService {
  constructor(
    @InjectRepository(PrixCarburant)
    private prixCarburantRepository: Repository<PrixCarburant>,
  ) {}

  async create(createPrixDto: CreatePrixCarburantDto): Promise<PrixCarburant> {
    const nouveauPrix = this.prixCarburantRepository.create(createPrixDto);
    return this.prixCarburantRepository.save(nouveauPrix);
  }

  async findAll(): Promise<PrixCarburant[]> {
    return this.prixCarburantRepository.find({
      order: { date_effective: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PrixCarburant> {
    const prix = await this.prixCarburantRepository.findOneBy({ id });
    if (!prix) {
      throw new NotFoundException(
        `Prix du carburant avec l'ID ${id} non trouvé`,
      );
    }
    return prix;
  }
}
