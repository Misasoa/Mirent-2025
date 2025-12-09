import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prix } from '../entities/prix.entity';

@Injectable()
export class PrixsService {
  constructor(
    @InjectRepository(Prix)
    private readonly prixsRepository: Repository<Prix>,
  ) {}

  async getAvailableCountPrixs(): Promise<number> {
    const total = await this.prixsRepository.count({
      relations: ['region'],
    });
    return total;
  }

  async findAll(): Promise<Prix[]> {
    return this.prixsRepository.find({ relations: ['region'] });
  }

  async findByRegion(regionId: number): Promise<Prix[]> {
    return this.prixsRepository.find({
      where: { region: { id: regionId } },
      relations: ['region'],
    });
  }

  async getTotalRevenueFromRegionPrices(): Promise<number> {
    try {
      const result = await this.prixsRepository
        .createQueryBuilder('prix')
        .select('SUM(prix.prix)', 'totalRevenue')
        .getRawOne();

      return parseFloat(result?.totalRevenue) || 0;
    } catch (error) {
      console.error(
        'Erreur lors du calcul du revenu total par région :',
        error,
      );
      throw error;
    }
  }
}
