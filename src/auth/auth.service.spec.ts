import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Role } from '../roles/role.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { JwtPayload } from '../types/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository;
  let roleRepository;
  let jwtService;
  let configService;
  let userService;

  beforeEach(async () => {
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
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
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
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UserService>(UserService);
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
        email: 'test@example.com', 
        roles: ['MEMBER'], 
        tenantId: '00000000-0000-0000-0000-000000000000' 
      };
      const result = await service.validateUser(payload);
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      
      const payload: JwtPayload = { 
        sub: '1', 
        email: 'test@example.com', 
        roles: [], 
        tenantId: '00000000-0000-0000-0000-000000000000' 
      };
      await expect(
        service.validateUser(payload)
      ).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should throw if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({ id: '1' });
      
      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          tenantId: '00000000-0000-0000-0000-000000000000',
        })
      ).rejects.toThrow();
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
      };
      
      usersRepository.create.mockReturnValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        tenantId: '00000000-0000-0000-0000-000000000000',
      });

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
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

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
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });
});
