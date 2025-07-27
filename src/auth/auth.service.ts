import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserRole } from '../user/dto/UserRole';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
    };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      userId: user.id,
      email: user.email,
      roles: [user.role],
      expiresIn: 86400, // 24 hours in seconds
    };
  }

  async register(
    email: string,
    password: string,
    role: UserRole = UserRole.MEMBER,
    tenantId: string,
  ) {
    const existing = await this.usersRepository.findOne({
      where: { email, tenantId },
    });
    if (existing) throw new UnauthorizedException('User already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      passwordHash: hash,
      role,
      tenantId,
    });
    await this.usersRepository.save(user);

    // Return the same format as login
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
    };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      userId: user.id,
      email: user.email,
      roles: [user.role],
      expiresIn: 86400, // 24 hours in seconds
    };
  }
}
