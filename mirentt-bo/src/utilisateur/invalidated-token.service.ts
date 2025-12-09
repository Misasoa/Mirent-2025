import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { InvalidatedToken } from '../entities/invalidated-token.entity';

@Injectable()
export class InvalidatedTokenService {
  constructor(
    @InjectRepository(InvalidatedToken)
    private invalidatedTokensRepository: Repository<InvalidatedToken>,
  ) {}

  /**
   * Invalide un jeton JWT en l'ajoutant à la liste noire.
   * @param token Le jeton JWT à invalider.
   * @param expiration La date et heure d'expiration du jeton original.
   * @returns Le jeton invalidé enregistré.
   */
  async invalidateToken(
    token: string,
    expiration: Date,
  ): Promise<InvalidatedToken> {
    const invalidatedToken = this.invalidatedTokensRepository.create({
      token,
      expiration,
    });
    try {
      return await this.invalidatedTokensRepository.save(invalidatedToken);
    } catch (error) {
      // Gérer l'erreur si le token est déjà sur la liste noire (conflit de clé primaire)
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        // PostgreSQL/TypeORM specific code for duplicate key
        console.warn(
          `Tentative d'invalider un jeton déjà sur liste noire : ${token.substring(0, 30)}...`,
        );
        const existingToken = await this.invalidatedTokensRepository.findOne({
          where: { token },
        }); // Retourne l'entité existante
        if (!existingToken) {
          throw new Error("Le jeton invalidé n'a pas pu être retrouvé.");
        }
        return existingToken;
      }
      throw error;
    }
  }

  /**
   * Vérifie si un jeton JWT est présent dans la liste noire.
   * @param token Le jeton JWT à vérifier.
   * @returns Vrai si le token est sur la liste noire, faux sinon.
   */
  async isTokenInvalidated(token: string): Promise<boolean> {
    // Supprimez les tokens expirés avant de vérifier pour maintenir la table propre
    // Note: Dans un environnement de production, cette opération devrait être
    // exécutée périodiquement par un cron job ou un mécanisme de nettoyage asynchrone,
    // pas à chaque vérification de token. Pour l'exemple, c'est inclus ici.
    await this.cleanExpiredTokens();

    const found = await this.invalidatedTokensRepository.findOne({
      where: { token },
    });
    return !!found;
  }

  /**
   * Supprime tous les jetons expirés de la liste noire.
   * Ceci aide à garder la base de données propre et performante.
   * Cette fonction devrait idéalement être appelée par un cron job régulier.
   */
  async cleanExpiredTokens(): Promise<void> {
    await this.invalidatedTokensRepository.delete({
      expiration: LessThan(new Date()),
    });
    console.log('Tokens expirés nettoyés de la liste noire.');
  }
}
