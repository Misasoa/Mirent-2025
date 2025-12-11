import { Body, Controller, Get, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from 'src/entities/status.entity';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) { }

  @Get()
  async findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }

  @Post()
  async createStatus(@Body() statusData: { status: string }): Promise<Status> {
    return this.statusService.create(statusData.status);
  }
}
