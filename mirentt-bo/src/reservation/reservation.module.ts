import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Vehicule } from 'src/entities/vehicle.entity';
import { Client } from 'src/entities/client.entity';
import { District } from 'src/entities/district.entity';
import { Prix } from 'src/entities/prix.entity';
import { Region } from 'src/entities/region.entity';
import { Status } from 'src/entities/status.entity';
import { BonDeCommande } from 'src/entities/commande.entity';
import { PrixCarburant } from 'src/entities/carburant-price.entity';
import { Facture } from 'src/entities/facture.entity';
import { FactureModule } from 'src/facturation/facturation.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      Vehicule,
      Client,
      District,
      Prix,
      Region,
      Status,
      BonDeCommande,
      PrixCarburant,
      Facture,
    ]),
    FactureModule,
    NotificationsModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule { }
