import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { CreateUserDto } from './create_utilisateur.dto';
import { LoginUserDto } from './create_Login.dto';
import { JwtAuthGuard } from '../utilisateur/utilisateur.jwt-auth.guard'; // Assurez-vous que le chemin est correct
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger'; // Pour Swagger

@ApiTags('Utilisateurs') // Catégorise les routes pour la documentation Swagger
@Controller('utilisateur')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  /**
   * Enregistre un nouvel utilisateur dans le système.
   * @param createUserDto Les données d'enregistrement de l'utilisateur.
   * @returns L'utilisateur enregistré (sans le mot de passe hashé).
   */
  @Post('register/client')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Client registered successfully.' })
  async registerClient(@Body() createUserDto: CreateUserDto) {
    return this.utilisateurService.register(createUserDto);
  }

  @Post('register/admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Admin registered successfully.' })
  // Note: This endpoint should be protected by an Admin guard in a real application
  async registerAdmin(@Body() createUserDto: CreateUserDto) {
    return this.utilisateurService.registerAdmin(createUserDto);
  }

  /**
   * Connecte un utilisateur et lui retourne un jeton JWT.
   * @param loginUserDto Les identifiants de connexion de l'utilisateur (email et mot de passe).
   * @returns Un objet contenant le jeton d'accès et les informations de l'utilisateur.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Retourne un statut 200 OK
  @ApiResponse({
    status: 200,
    description:
      "Connexion réussie. Retourne le jeton d'accès et les informations utilisateur.",
  })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.utilisateurService.login(loginUserDto);
  }

  /**
   * Déconnecte un utilisateur en invalidant son jeton JWT actuel.
   * Nécessite un jeton JWT valide dans les en-têtes d'autorisation (Bearer Token).
   * Le jeton est ajouté à une liste noire côté serveur.
   * @param req L'objet de requête HTTP, utilisé pour extraire le jeton.
   * @returns Un message de confirmation de déconnexion.
   */
  @ApiBearerAuth() // Indique que cette route nécessite un jeton Bearer pour Swagger
  @UseGuards(JwtAuthGuard) // Protège cette route, l'utilisateur doit être connecté et son token validé
  @Post('logout')
  @HttpCode(HttpStatus.OK) // Retourne un statut 200 OK
  @ApiResponse({ status: 200, description: 'Déconnexion réussie.' })
  @ApiResponse({
    status: 400,
    description: 'Jeton invalide ou impossible de déconnecter.',
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé (jeton manquant, invalide ou sur liste noire).',
  })
  async logout(@Request() req): Promise<{ message: string }> {
    // Le token est généralement envoyé dans l'en-tête Authorization: Bearer <token>
    // Nous l'extrayons ici pour le passer au service.
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException("Jeton d'authentification manquant.");
    }

    return this.utilisateurService.logout(token);
  }
}
