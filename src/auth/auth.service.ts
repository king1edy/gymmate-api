import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/user.entity';
import { Gym } from '../gym/gym.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Gym)
    private gymsRepository: Repository<Gym>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role, gymId: user.gym.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, role: UserRole = 'member', gymId: string) {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('User already exists');
    const gym = await this.gymsRepository.findOne({ where: { id: gymId } });
    if (!gym) throw new UnauthorizedException('Gym not found');
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email, password: hash, role, gym });
    await this.usersRepository.save(user);
    return this.login(user);
  }
} 