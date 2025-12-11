import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/entities/status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) { }

  async findAll(): Promise<Status[]> {
    return this.statusRepository.find();
  }

  async create(statusName: string): Promise<Status> {
    const newStatus = this.statusRepository.create({ status: statusName });
    return this.statusRepository.save(newStatus);
  }
}
