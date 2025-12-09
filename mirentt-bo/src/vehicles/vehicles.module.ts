import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicule } from 'src/entities/vehicle.entity';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Type } from 'src/entities/type.entity';
import { Status } from 'src/entities/status.entity';
import { TypeModule } from 'src/type/type.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicule, Type, Status]), TypeModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService, TypeOrmModule.forFeature([Status])],
})
export class VehiclesModule {}
