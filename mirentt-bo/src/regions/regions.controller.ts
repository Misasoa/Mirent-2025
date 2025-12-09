import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RegionService } from './regions.service';
import { Region } from 'src/entities/region.entity';
import { Prix } from 'src/entities/prix.entity';

import { CreateRegionDto } from './create-region.dto';

@Controller('regions')
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Get()
  async findAll(): Promise<Region[]> {
    return this.regionService.findAll();
  }

  @Post()
  async create(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionService.create(createRegionDto);
  }

  @Put(':id')
  async updateFull(
    @Param('id') id: number,
    @Body() region: Partial<Region>,
  ): Promise<Region> {
    return this.regionService.updateFull(id, region);
  }

  @Put(':id/prix')
  async updatePrix(
    @Param('id') id: number,
    @Body('prix') prix: number,
  ): Promise<Prix> {
    return this.regionService.updatePrix(id, prix);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.regionService.remove(id);
  }
}
