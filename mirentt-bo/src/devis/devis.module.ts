import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devis } from 'src/entities/devis.entity';
import { ClientModule } from 'src/client/client.module';
import { RegionsModule } from 'src/regions/regions.module';
import { VehiclesModule } from 'src/vehicles/vehicles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Devis]),
    RegionsModule,
    ClientModule,
    VehiclesModule,
  ],
  providers: [DevisService],
  controllers: [DevisController],
})
export class DevisModule {}
