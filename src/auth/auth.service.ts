import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload, AuthTokens } from '../types/interfaces';
import { UserStatus, UserType } from '../types/interfaces';
import { UserRole } from '../user/dto/UserRole';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const { email, password, firstName, lastName, phone, tenantId, userType } =
      registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email, tenantId },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = uuidv4();

    // Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash: hashedPassword,
      emailVerificationToken,
      status: UserStatus.PENDING_VERIFICATION,
      tenantId,
      userType: userType || UserType.MEMBER,
    });

    // Assign default role
    const defaultRole = await this.usersService.getDefaultRole(
      userType || UserType.MEMBER,
    );
    if (!defaultRole) {
      throw new BadRequestException('Default role not found');
    }
    user.roles = [defaultRole];

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // TODO: Send email verification email
    // await this.emailService.sendVerificationEmail(user.email, emailVerificationToken);

    return { user, tokens };
  }

  async login(
    loginDto: LoginDto,
    ip?: string,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const { email, password } = loginDto;

    // Find user with roles and permissions
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account suspended');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Account inactive');
    }

    // Update last login
    user.lastLoginAt = new Date();
    user.lastLoginIp = ip || null;
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  // Additional methods for API service compatibility
  getToken(): string | null {
    // This method should be implemented based on your token storage strategy
    // For now, returning null as this is a backend service
    return null;
  }

  getUserInfo() {
    // This method should return user information based on your auth strategy
    // For now, returning basic structure
    return {
      id: null,
      username: null,
      email: null,
      tenantId: null,
      role: null,
      permissions: [],
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await this.userRepository.save(user);

    // TODO: Send password reset email
    // await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    user.passwordHash = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshToken = null; // Invalidate all sessions

    await this.userRepository.save(user);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    user.passwordHash = hashedPassword;
    user.refreshToken = null; // Invalidate all sessions

    await this.userRepository.save(user);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.status = UserStatus.ACTIVE;

    await this.userRepository.save(user);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      preferred_username: user.firstName + ' ' + user.lastName,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
      tenantId: user.tenantId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // validate token
  async validateToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return await this.validateUser(payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Legacy methods for backward compatibility
  legacyLogin(user: any) {
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

  async legacyRegister(
    email: string,
    password: string,
    role: UserRole = UserRole.MEMBER,
    tenantId: string,
  ) {
    const existing = await this.userRepository.findOne({
      where: { email, tenantId },
    });
    if (existing) throw new UnauthorizedException('User already exists');

    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      passwordHash: hash,
      tenantId,
      firstName: 'New', // Default values for legacy system
      lastName: 'User',
      userType: UserType.MEMBER,
    });
    await this.userRepository.save(user);

    // Get the role for the user
    const userRole = await this.usersService.getDefaultRole(UserType.MEMBER);
    if (userRole) {
      user.roles = [userRole];
      await this.userRepository.save(user);
    }

    // Return the same format as login
    const payload = {
      email: user.email,
      sub: user.id,
      role: role,
      tenantId: user.tenantId,
    };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      userId: user.id,
      email: user.email,
      roles: [role],
      expiresIn: 86400, // 24 hours in seconds
    };
  }

  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash, refreshToken, passwordResetToken, ...sanitized } =
      user;
    return sanitized;
  }
}
