import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-eceptionfilters';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Charger .env dès le début

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Main');

  // -------------------------------
  // 🔥 CORS — partie la plus importante
  // -------------------------------

  const allowedOrigins = [
    'https://mirent-2025-hybf.vercel.app',  // ton front déployé
    'http://localhost:5173',                // front en local
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  logger.log('CORS activé pour : ' + allowedOrigins.join(', '));

  // -------------------------------
  // 🔐 JWT
  // -------------------------------

  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'ghioouitu5632iiuo';
    logger.warn('⚠️ JWT_SECRET non défini — valeur par défaut utilisée.');
  }

  // -------------------------------
  // 🛑 FILTRE EXCEPTION GLOBAL
  // -------------------------------
  app.useGlobalFilters(new AllExceptionsFilter());

  // -------------------------------
  // 🧹 VALIDATION PIPE
  // -------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        logger.error('Erreur validation :', errors);
        return new BadRequestException(errors);
      },
    }),
  );

  // -------------------------------
  // 📁 FICHIERS STATIQUES
  // -------------------------------
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Ajouter CORS uniquement pour les uploads
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', allowedOrigins.join(', '));
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  // -------------------------------
  // 🚀 LANCEMENT DU SERVEUR
  // -------------------------------
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  logger.log(`🚀 Serveur lancé sur port ${PORT}`);
}

bootstrap();
