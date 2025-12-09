// Exemple : src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
// Importez votre service utilisateur si nécessaire pour récupérer les détails de l'utilisateur
// import { UtilisateurService } from '../utilisateur/utilisateur.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(/* private utilisateurService: UtilisateurService */) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Doit être false pour vérifier l'expiration
      secretOrKey: 'VOTRE_CLÉ_SECRÈTE_IDENTIQUE_À_CELLE_DE_JWTMODULE', // TRÈS IMPORTANT !
    });
  }

  async validate(payload: any) {
    // Le `payload` contient les données que vous avez signées (email, sub, firstName, lastName)
    // Vous pouvez éventuellement rechercher l'utilisateur ici pour attacher un objet utilisateur complet à req.user
    // Par exemple: const user = await this.utilisateurService.findById(payload.sub);
    // if (!user) { throw new UnauthorizedException(); }
    // return user; // Ce que vous retournez ici est attaché à req.user dans les contrôleurs
    return {
      userId: payload.sub,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
