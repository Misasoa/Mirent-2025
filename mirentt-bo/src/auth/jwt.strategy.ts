import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Utilisateur } from '../entities/utilisateur.entity'; // Changed from './entities/user.entity'
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Utilisateur) // Changed from User
    private usersRepository: Repository<Utilisateur>, // Changed from User
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'lengla123',
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(payload.sub) }, // Convert to number
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
