import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prix } from 'src/entities/prix.entity';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';

import { CreateRegionDto } from './create-region.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    public regionRepository: Repository<Region>,
    @InjectRepository(Prix)
    private prixRepository: Repository<Prix>,
  ) {}

  async findAll(): Promise<Region[]> {
    const regions = await this.regionRepository.find({ relations: ['prix'] });
    console.log('Regions with prices in findAll service:', JSON.stringify(regions, null, 2));
    return regions;
  }

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    try {
      const region = new Region();
      region.nom_region = createRegionDto.nom_region;
      region.nom_district = createRegionDto.nom_district;

      if (createRegionDto.prix && createRegionDto.prix.prix !== undefined) {
        const prix = new Prix();
        prix.prix = createRegionDto.prix.prix;
        region.prix = prix; // Associate the new Prix for cascading
      }

      return this.regionRepository.save(region); // Saves Region and cascades to Prix
    } catch (error) {
      console.error('Error creating region:', error);
      throw error;
    }
  }

  async updatePrix(regionId: number, prixValue: number): Promise<Prix> {
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
      relations: ['prix'],
    });
    if (!region) {
      throw new Error('Region not found');
    }

    let prix = region.prix;
    if (!prix) {
      prix = this.prixRepository.create({ prix: prixValue, region: region });
    } else {
      prix.prix = prixValue;
    }

    return this.prixRepository.save(prix);
  }

  async updateFull(
    regionId: number,
    updatedRegion: Partial<Region>,
  ): Promise<Region> {
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
      relations: ['prix'],
    });
    if (!region) {
      throw new Error('Region not found');
    }

    if (updatedRegion.nom_region) {
      region.nom_region = updatedRegion.nom_region;
    }
    if (updatedRegion.nom_district !== undefined) {
      region.nom_district = updatedRegion.nom_district;
    }

    if (updatedRegion.prix && updatedRegion.prix.prix !== undefined) {
      if (region.prix) {
        region.prix.prix = updatedRegion.prix.prix;
        await this.prixRepository.save(region.prix);
      } else {
        const newPrix = this.prixRepository.create({
          prix: updatedRegion.prix.prix,
          region: region,
        });

        await this.prixRepository.save(newPrix);
        region.prix = newPrix;
      }
    }

    return this.regionRepository.save(region);
  }

  async remove(regionId: number): Promise<void> {
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
      relations: ['prix'],
    });
    if (!region) {
      throw new Error('Region not found');
    }

    if (region.prix) {
      await this.prixRepository.remove(region.prix);
    }
    await this.regionRepository.remove(region);
  }
  /* async findByName(name: string): Promise<Region> {
    const region = await this.regionRepository.findOneBy({ nom_region: name });
    if (!region) {
      throw new NotFoundException(`Region '${name}' not found.`);
    }
    return region;
  }*/
  async findByName(regionName: string): Promise<Region | undefined> {
    const region = await this.regionRepository.findOne({
      where: { nom_region: regionName },
      relations: ['prix'], // <--- Cette ligne est CRUCIALE dans RegionService.findByName !!
    });
    console.log(
      'Region loaded in findByName (should be in RegionService):',
      JSON.stringify(region, null, 2),
    );
    return region ?? undefined;
  }
}
