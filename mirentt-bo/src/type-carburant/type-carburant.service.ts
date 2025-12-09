import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeCarburant } from '../entities/carburant.entity';
import { CreateTypeCarburantDto } from './dto/create-type-carburant.dto';

@Injectable()
export class TypeCarburantService {
  constructor(
    @InjectRepository(TypeCarburant)
    private typeCarburantRepository: Repository<TypeCarburant>,
  ) {}

  async create(createTypeDto: CreateTypeCarburantDto): Promise<TypeCarburant> {
    const nouveauType = this.typeCarburantRepository.create(createTypeDto);
    return this.typeCarburantRepository.save(nouveauType);
  }

  async findAll(): Promise<TypeCarburant[]> {
    return this.typeCarburantRepository.find();
  }

  async findOne(id: number): Promise<TypeCarburant> {
    const type = await this.typeCarburantRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(
        `Type de carburant avec l'ID ${id} non trouvé`,
      );
    }
    return type;
  }
}
