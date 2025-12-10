import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { VehiclesModule } from './vehicles/vehicles.module';
import { TypeModule } from './type/type.module';
import { StatusModule } from './status/status.module';

import { RegionsModule } from './regions/regions.module';
import { PrixsModule } from './prixs/prixs.module';
import { ClientModule } from './client/client.module';
import { ProformaModule } from './proforma/proforma.module';
import { MailerModule } from './mailer/mailer.module';
import { DevisModule } from './devis/devis.module';
import { ReservationModule } from './reservation/reservation.module';
import { TypeCarburantModule } from './type-carburant/type-carburant.module';
import { PrixCarburantModule } from './prix-carburant/prix-carburant.module';
import { PrixCarburantController } from './prix-carburant/prix-carburant.controller';
import { PrixCarburantService } from './prix-carburant/prix-carburant.service';

import { Vehicule } from './entities/vehicle.entity';
import { Region } from './entities/region.entity';
import { Status } from './entities/status.entity';
import { Type } from './entities/type.entity';
import { Prix } from './entities/prix.entity';
import { Client } from './entities/client.entity';
import { Proforma } from './entities/proforma.entity';
import { Devis } from './entities/devis.entity';
import { ProformaItem } from './entities/proformat-item.entity';
import { UtilisateurController } from './utilisateur/utilisateur.controller';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { Utilisateur } from './entities/utilisateur.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Notification } from './entities/notifications.entity';
import { BonDeCommandeController } from './commande/commande.controller';
import { BonDeCommandeService } from './commande/commande.service';
import { BonDeCommandeModule } from './commande/commande.module';
import { FactureModule } from './facturation/facturation.module';
import { PaiementService } from './paiement/paiement.service';
import { PaiementController } from './paiement/paiement.controller';
import { PaiementModule } from './paiement/paiement.module';
import { Paiement } from './entities/paiement.entity';
import { Facture } from './entities/facture.entity';
import { BonDeCommande } from './entities/commande.entity';
import { PrixCarburant } from './entities/carburant-price.entity';
import { TypeCarburant } from './entities/carburant.entity';
import { District } from './entities/district.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [
        Reservation,
        Vehicule,
        Region,
        Status,
        Type,
        Prix,
        Client,
        Proforma,
        ProformaItem,
        Devis,
        Utilisateur,
        Notification,
        Paiement,
        Facture,
        BonDeCommande,
        PrixCarburant,
        TypeCarburant,
        District,
      ],
    }),
    AuthModule,
    VehiclesModule,
    TypeModule,
    StatusModule,
    ClientModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    RegionsModule,
    PrixsModule,
    ProformaModule,
    MailerModule,
    DevisModule,
    ReservationModule,
    UtilisateurModule,
    NotificationsModule,
    BonDeCommandeModule,
    FactureModule,
    PaiementModule,
    PrixCarburantModule,
    TypeCarburantModule,
  ],
  controllers: [UtilisateurController],
  providers: [],
})
export class AppModule { }
