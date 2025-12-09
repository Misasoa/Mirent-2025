import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { Type } from '../entities/type.entity';
import { Vehicule } from '../entities/vehicle.entity';

import { Prix } from 'src/entities/prix.entity';
import { Client } from '../entities/client.entity';
import { ProformaItem } from 'src/entities/proformat-item.entity';
import { Proforma } from 'src/entities/proforma.entity';
import { Devis } from 'src/entities/devis.entity';
import { CarburantPolicy, Reservation } from 'src/entities/reservation.entity';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { Notification } from 'src/entities/notifications.entity';
import { Facture } from 'src/entities/facture.entity';
import { Paiement } from 'src/entities/paiement.entity';
import { BonDeCommande } from 'src/entities/commande.entity';
import { PrixCarburant } from 'src/entities/carburant-price.entity';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    BlacklistedToken,
    Vehicule,
    Type,
    Status,
    Region,
    Client,
    Prix,
    ProformaItem,
    Proforma,
    Devis,
    Reservation,
    Utilisateur,
    Notification,
    Facture,
    Paiement,
    BonDeCommande,
    PrixCarburant,
  ],

  synchronize: true,
};
