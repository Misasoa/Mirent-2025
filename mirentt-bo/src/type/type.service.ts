import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from 'src/entities/type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private readonly typesRepository: Repository<Type>,
  ) {}

  async findAll(): Promise<Type[]> {
    return this.typesRepository.find();
  }

  // Dans votre service TypesService
  async delete(id: number): Promise<void> {
    try {
      const result = await this.typesRepository.delete(id);
      if (result.affected === 0) {
        // L'élément n'a pas été trouvé
        throw new NotFoundException(`Le type avec l'ID ${id} n'existe pas.`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      throw new InternalServerErrorException(
        'Erreur lors de la suppression du type.',
      );
    }
  }

  async update(id: number, type: Partial<Type>): Promise<Type> {
    const existingType = await this.typesRepository.findOneBy({ id });
    if (!existingType) {
      throw new NotFoundException(`Type with ID ${id} not found`);
    }
    await this.typesRepository.update(id, type);
    const updatedType = await this.typesRepository.findOneBy({ id });
    if (!updatedType) {
      throw new NotFoundException(`Type with ID ${id} not found after update`);
    }
    return updatedType;
  }
}
