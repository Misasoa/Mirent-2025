import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-eceptionfilters';
import 'reflect-metadata';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(new Logger());
  dotenv.config();

  // Loggez le secret JWT au démarrage de l'application
  console.log('JWT_SECRET (from .env at startup):', 'ghioouitu5632iiuo');
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET is not set in environment!');
    process.exit(1);
  }

  // Activer CORS pour tout le backend via NestJS
  // app.use(cors(...)) supprimé pour éviter les conflits

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        console.log(errors); // Log des erreurs détaillées
        throw new BadRequestException(errors);
      },
    }),
  );

  // Middleware pour ajouter les en-têtes CORS aux fichiers statiques
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // Gérer les fichiers statiques avec Express
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Ajout de la validation globale pour sécuriser les entrées
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = process.env.PORT || 3000;
  const logger = new Logger('Main');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT);
  Logger.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
}

bootstrap();
