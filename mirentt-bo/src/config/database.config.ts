import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Importez toutes vos entités ici (Liste complète des entités)
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { Region } from '../entities/region.entity';
import { Status } from '../entities/status.entity';
import { Type } from '../entities/type.entity';
import { Vehicule } from '../entities/vehicle.entity';
import { Prix } from '../entities/prix.entity';
import { Client } from '../entities/client.entity';
import { ProformaItem } from '../entities/proformat-item.entity';
import { Proforma } from '../entities/proforma.entity';
import { Devis } from '../entities/devis.entity';
import { Reservation } from '../entities/reservation.entity';
import { Utilisateur } from '../entities/utilisateur.entity';
import { Notification } from '../entities/notifications.entity';
import { Facture } from '../entities/facture.entity';
import { Paiement } from '../entities/paiement.entity';
import { BonDeCommande } from '../entities/commande.entity';
import { PrixCarburant } from '../entities/carburant-price.entity';

dotenv.config();

// Liste complète de vos entités
const entities = [
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
];

// Détection de l'environnement de production
// Si la variable DATABASE_URL existe (ce qui sera le cas sur Render), nous sommes en production.
const isProduction = !!process.env.DATABASE_URL;

// --- Configuration de Base ---
const baseConfig: Partial<DataSourceOptions> = {
  type: 'postgres',
  // Utiliser la liste complète des entités
  entities: entities,
  // Configuration des migrations (essentielle pour la production !)
  // Si vous utilisez des migrations, décommentez ces lignes :
  // migrations: ['dist/migrations/*.js'],
  // migrationsRun: isProduction,
  // logging: isProduction ? ['error'] : ['query', 'error'],
};
// ----------------------------


let finalConfig: DataSourceOptions;

if (isProduction) {
  // === 🚀 CONFIGURATION DE PRODUCTION (Render/DigitalOcean) ===

  finalConfig = {
    ...baseConfig,
    // CRITIQUE 1 : Utilisation de l'URL complète
    url: process.env.DATABASE_URL,

    // CRITIQUE 2 : Configuration SSL requise par les bases de données Cloud (DigitalOcean)
    ssl: {
      rejectUnauthorized: false,
    },

    // IMPORTANT: synchronize activé pour créer les tables initiales
    // À désactiver après le premier déploiement réussi
    synchronize: true,

    // Si votre code est dans 'dist/' après compilation:
    entities: ['dist/**/*.entity{.ts,.js}'],

  } as DataSourceOptions;

} else {
  // === 🛠️ CONFIGURATION DE DÉVELOPPEMENT (Local .env) ===

  finalConfig = {
    ...baseConfig,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,

    // La synchronisation peut être activée en développement pour la commodité
    synchronize: true,

  } as DataSourceOptions;
}

export const typeOrmConfig: DataSourceOptions = finalConfig;