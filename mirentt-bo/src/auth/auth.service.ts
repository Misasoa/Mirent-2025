import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilisateur } from '../entities/utilisateur.entity'; // Changed from './entities/user.entity'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur) // Changed from User
    private usersRepository: Repository<Utilisateur>, // Changed from User
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Utilisateur> {
    // Changed from User
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword, // Changed from password
    });
    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role }; // Add user.role to payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
