import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prix } from 'src/entities/prix.entity';
import { Region } from 'src/entities/region.entity';
import { RegionService } from './regions.service';
import { RegionController } from './regions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Prix])],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService, TypeOrmModule],
})
export class RegionsModule {}
