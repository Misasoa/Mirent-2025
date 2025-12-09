import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from 'src/entities/status.entity';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }
}
