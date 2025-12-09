import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeCarburantService } from './type-carburant.service';
import { TypeCarburantController } from './type-carburant.controller';
import { TypeCarburant } from '../entities/carburant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeCarburant])],
  controllers: [TypeCarburantController],
  providers: [TypeCarburantService],
  exports: [TypeCarburantService, TypeOrmModule],
})
export class TypeCarburantModule {}
