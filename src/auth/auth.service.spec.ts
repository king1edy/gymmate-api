import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Role } from '../roles/role.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../types/interfaces';
import {
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

// Create a mock for bcrypt
const mockBcrypt = {
  compare: jest.fn(),
  hash: jest.fn(),
};

// Mock the uuid module
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid-token'),
}));

// Mock the entire bcryptjs module
jest.mock('bcryptjs', () => mockBcrypt);

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: any;
  let roleRepository: any;
  let jwtService: JwtService;
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
            findByIds: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                JWT_ACCESS_SECRET: 'test-access-secret',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_ACCESS_EXPIRES_IN: '15m',
                JWT_REFRESH_EXPIRES_IN: '7d',
              };
              return config[key] || 'test-secret';
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getDefaultRole: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    roleRepository = module.get(getRepositoryToken(Role));
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validateUser', () => {
    it('should validate user JWT payload', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'ACTIVE',
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      const payload: JwtPayload = {
        sub: '1',
        preferred_username: 'testuser',
        email: 'test@example.com',
        roles: ['MEMBER'],
        tenantId: '00000000-0000-0000-0000-000000000000',
      };
      const result = await service.validateUser(payload);
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const payload: JwtPayload = {
        sub: '1',
        preferred_username: 'testuser',
        email: 'test@example.com',
        roles: [],
        tenantId: '00000000-0000-0000-0000-000000000000',
      };
      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'INACTIVE',
      };
      usersRepository.findOne.mockResolvedValue(mockUser);

      const payload: JwtPayload = {
        sub: '1',
        preferred_username: 'testuser',
        email: 'test@example.com',
        roles: ['MEMBER'],
        tenantId: '00000000-0000-0000-0000-000000000000',
      };
      await expect(service.validateUser(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    beforeEach(() => {
      mockBcrypt.hash.mockResolvedValue('hashedPassword');
    });

    it('should throw ConflictException if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          tenantId: '00000000-0000-0000-0000-000000000000',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if default role not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      userService.getDefaultRole.mockResolvedValue(null);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          tenantId: '00000000-0000-0000-0000-000000000000',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and save user with default role', async () => {
      const defaultRole = { id: '1', name: 'MEMBER' };
      usersRepository.findOne.mockResolvedValue(null);
      userService.getDefaultRole.mockResolvedValue(defaultRole);

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [defaultRole],
        status: 'PENDING_VERIFICATION',
        firstName: 'Test',
        lastName: 'User',
      };

      usersRepository.create.mockReturnValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.register({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        tenantId: '00000000-0000-0000-0000-000000000000',
      });

      expect(userService.getDefaultRole).toHaveBeenCalled();
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.update).toHaveBeenCalled();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBe('token');
      expect(result.tokens.refreshToken).toBe('token');
    });
  });

  describe('login', () => {
    it('should return tokens and user info on successful login', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'ACTIVE',
        firstName: 'Test',
        lastName: 'User',
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue({ affected: 1 });
      mockBcrypt.compare.mockResolvedValue(true);
      mockBcrypt.hash.mockResolvedValue('hashedRefreshToken');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
      expect(usersRepository.save).toHaveBeenCalled();
      expect(usersRepository.update).toHaveBeenCalled();
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBe('token');
      expect(result.tokens.refreshToken).toBe('token');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      usersRepository.findOne.mockResolvedValue({
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      });
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for suspended user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'SUSPENDED',
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'INACTIVE',
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        refreshToken: 'hashedRefreshToken',
        roles: [{ name: 'MEMBER', permissions: [] }],
        firstName: 'Test',
        lastName: 'User',
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      usersRepository.update.mockResolvedValue({ affected: 1 });
      mockBcrypt.compare.mockResolvedValue(true);
      mockBcrypt.hash.mockResolvedValue('newHashedRefreshToken');

      const result = await service.refreshTokens('1', 'refreshToken');

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBe('token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.refreshTokens('1', 'refreshToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        refreshToken: 'hashedRefreshToken',
        roles: [{ name: 'MEMBER', permissions: [] }],
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(
        service.refreshTokens('1', 'wrongRefreshToken'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      usersRepository.update.mockResolvedValue({ affected: 1 });

      await service.logout('1');

      expect(usersRepository.update).toHaveBeenCalledWith('1', {
        refreshToken: null,
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ name: 'MEMBER', permissions: [] }],
        status: 'ACTIVE',
      };

      const mockPayload = {
        sub: '1',
        preferred_username: 'testuser',
        email: 'test@example.com',
        roles: ['MEMBER'],
        tenantId: '00000000-0000-0000-0000-000000000000',
      };

      jwtService.verify = jest.fn().mockReturnValue(mockPayload);
      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateToken('validToken');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
