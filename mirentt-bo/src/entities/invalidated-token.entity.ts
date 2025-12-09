import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Entité représentant un jeton JWT invalidé (mis sur liste noire).
 * Un token est ajouté ici lorsqu'un utilisateur se déconnecte,
 * le rendant inutilisable même s'il n'est pas encore expiré.
 */
@Entity('invalidated_tokens')
export class InvalidatedToken {
  /**
   * Le jeton JWT complet ou son JTI (JWT ID) si disponible dans le payload.
   * Nous utilisons le token complet ici pour simplifier.
   * C'est une clé primaire pour garantir l'unicité.
   */
  @PrimaryColumn({ length: 500 }) // Longueur suffisante pour stocker le JWT
  token: string;

  /**
   * La date d'expiration originale du jeton JWT.
   * Le token sera automatiquement supprimé de la liste noire après cette date
   * pour éviter une croissance illimitée de la table.
   */
  @Column({ type: 'timestamp' })
  expiration: Date;
}
