import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-eceptionfilters';
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv'; // Importation correcte

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Main'); // Déclaration déplacée en haut pour usage général

  // 1. Configuration des variables d'environnement (Doit être fait très tôt)
  dotenv.config();

  // 2. Configuration CORS (DOIT ÊTRE FAIT TÔT ET AVANT app.listen)
  // Utilisation de l'URL spécifique de votre frontend Vercel pour la sécurité.
  const vercelFrontendUrl = 'https://mirent-2025-hybf.vercel.app';

  app.enableCors({
    origin: vercelFrontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Inclure OPTIONS pour les preflight requests
    credentials: true, // Nécessaire si vous utilisez des cookies ou des headers d'auth.
  });
  logger.log(`CORS activé pour l'origine : ${vercelFrontendUrl}`);

  // 3. Configuration JWT (avant d'autres logiques de l'application)
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'ghioouitu5632iiuo';
    logger.warn('WARNING: JWT_SECRET non défini, utilisation de la valeur par défaut.');
  }
  logger.log('JWT_SECRET configuré');

  // 4. Gestion des exceptions globales
  app.useGlobalFilters(new AllExceptionsFilter());

  // 5. Utilisation d'un seul ValidationPipe (Suppression de la redondance)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        logger.error('Erreurs de validation:', errors); // Utilisation du logger Nest
        throw new BadRequestException(errors);
      },
    }),
  );

  // 6. Gestion des fichiers statiques
  // Le middleware pour les headers CORS sur les fichiers statiques n'est plus nécessaire
  // car 'app.enableCors' gère globalement les requêtes, y compris les fichiers statiques si bien configuré.
  // Cependant, pour être certain que le header est présent sur ces assets spécifiques:

  // A. Servir les fichiers statiques avec express
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // B. Middleware pour forcer les headers CORS sur les fichiers statiques (optionnel mais sécurisant pour les assets)
  app.use('/uploads', (req, res, next) => {
    // Si vous utilisez 'app.enableCors', il est préférable de ne pas utiliser '*' ici
    // Utilisez l'URL autorisée si l'Asset doit être accessible uniquement par Vercel
    res.header('Access-Control-Allow-Origin', vercelFrontendUrl);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


  // 7. Démarrage de l'application
  const PORT = process.env.PORT || 3000;
  // '0.0.0.0' est essentiel pour l'écoute sur les environnements de conteneur/cloud comme Render
  await app.listen(PORT, '0.0.0.0');
  logger.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
}

bootstrap();