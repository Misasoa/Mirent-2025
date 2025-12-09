import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvalidatedTokenService } from '../utilisateur/invalidated-token.service'; // Assurez-vous du bon chemin

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private invalidatedTokenService: InvalidatedTokenService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Appelle la logique standard de vérification JWT (vérifie la signature, l'expiration, etc.)
    const canActivate = (await super.canActivate(context)) as boolean;

    // Si la vérification standard échoue, nous n'avons pas besoin de vérifier la liste noire.
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    // Extrait le token 'Bearer' des en-têtes d'autorisation
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      // Devrait être géré par AuthGuard('jwt'), mais une vérification supplémentaire ne nuit pas.
      throw new UnauthorizedException("Jeton d'authentification manquant.");
    }

    // Vérifie si le token est dans la liste noire des tokens invalidés
    const isInvalidated =
      await this.invalidatedTokenService.isTokenInvalidated(token);

    if (isInvalidated) {
      throw new UnauthorizedException(
        'Votre session a été déconnectée. Veuillez vous reconnecter.',
      );
    }

    return true; // Le token est valide et n'est pas sur liste noire
  }
}
