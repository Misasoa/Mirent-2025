import { Module } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { Utilisateur } from 'src/entities/utilisateur.entity';
import { Client } from 'src/entities/client.entity';
import { UtilisateurController } from './utilisateur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { InvalidatedTokenService } from './invalidated-token.service'; // Importez le nouveau service
import { InvalidatedToken } from '../entities/invalidated-token.entity'; // Importez la nouvelle entité
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../utilisateur/jwt.stratezgy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, Client, InvalidatedToken]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UtilisateurController],
  providers: [UtilisateurService, InvalidatedTokenService, JwtStrategy],
  exports: [UtilisateurService, JwtModule, InvalidatedTokenService],
})
export class UtilisateurModule { }
