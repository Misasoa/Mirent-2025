import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrixCarburantService } from './prix-carburant.service';
import { PrixCarburantController } from './prix-carburant.controller';
import { PrixCarburant } from '../entities/carburant-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrixCarburant])],
  controllers: [PrixCarburantController],
  providers: [PrixCarburantService],
  exports: [PrixCarburantService, TypeOrmModule],
})
export class PrixCarburantModule {}
