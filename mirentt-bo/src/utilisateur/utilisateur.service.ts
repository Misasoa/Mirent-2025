import {
  BadRequestException,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur, UserRole } from '../entities/utilisateur.entity';
import { Client } from '../entities/client.entity';
import { CreateUserDto } from './create_utilisateur.dto';
import { LoginUserDto } from './create_Login.dto';
import { InvalidatedTokenService } from './invalidated-token.service';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private usersRepository: Repository<Utilisateur>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private jwtService: JwtService,
    private invalidatedTokenService: InvalidatedTokenService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<Utilisateur> {
    const { firstName, lastName, email, password, confirmPassword } =
      createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: UserRole.CLIENT, // Force le rôle client pour cette méthode
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Créer automatiquement une entrée Client pour les utilisateurs clients
    try {
      const newClient = this.clientsRepository.create({
        lastName: lastName,
        email: email,
        phone: '', // Sera rempli par le client plus tard ou lors de la première réservation
      });
      await this.clientsRepository.save(newClient);
      console.log(`✅ Client créé automatiquement pour ${email}`);
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      // Ne pas bloquer l'inscription même si la création du client échoue
    }

    return savedUser;
  }

  async registerAdmin(createUserDto: CreateUserDto): Promise<Utilisateur> {
    const { firstName, lastName, email, password, confirmPassword } =
      createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas.');
    }

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = this.usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: UserRole.ADMIN, // Set role to ADMIN
    });

    return this.usersRepository.save(newUser);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    // Comparer le mot de passe fourni avec le hash stocké
    const isPasswordMatching = await bcrypt.compare(pass, user.passwordHash);

    if (isPasswordMatching) {
      // Retourne l'utilisateur sans le mot de passe hashé
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // Générer un jeton JWT
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      const decodedToken = this.jwtService.decode(token);

      if (!decodedToken || !decodedToken.exp) {
        throw new BadRequestException(
          "Jeton invalide ou sans date d'expiration.",
        );
      }

      const expirationDate = new Date(decodedToken.exp * 1000);

      if (expirationDate <= new Date()) {
        return { message: 'Déconnexion réussie (jeton déjà expiré).' };
      }

      await this.invalidatedTokenService.invalidateToken(token, expirationDate);
      return { message: 'Déconnexion réussie.' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
      throw new BadRequestException('Impossible de déconnecter le jeton.');
    }
  }
}