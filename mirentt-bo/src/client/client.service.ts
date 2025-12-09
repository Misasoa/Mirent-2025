import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from './createClient.dto';
import { UpdateClientDto } from './updateClient.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) { }
  //*ajout//
  async findOneById(id: number): Promise<Client | undefined> {
    const client = await this.clientRepository.findOne({ where: { id } });
    return client ?? undefined;
  }

  async getClientCount(): Promise<number> {
    const availableClientCount = await this.clientRepository.count({});

    if (availableClientCount === 0) {
      throw new NotFoundException('Aucun client disponible trouvé');
    }

    return availableClientCount;
  }

  findAll(email?: string): Promise<Client[]> {
    if (email) {
      return this.clientRepository.find({ where: { email } });
    }
    return this.clientRepository.find();
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.clientRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async create(dto: CreateClientDto, logo?: string): Promise<Client> {
    const client = this.clientRepository.create({
      ...dto,
      logo: logo || undefined,
    });
    return this.clientRepository.save(client);
  }

  async findOne(id: number): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      return null;
    }
    return client;
  }

  async update(
    id: number,
    dto: UpdateClientDto,
    logo?: string,
  ): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    client.lastName = dto.lastName || client.lastName;
    client.email = dto.email || client.email;
    client.phone = dto.phone || client.phone;
    client.logo = logo || client.logo;

    return await this.clientRepository.save(client);
  }
}
