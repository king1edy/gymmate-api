import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../user/dto/UserRole';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository;
  let jwtService;

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
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data without passwordHash if valid', async () => {
      const user = { email: 'test@example.com', passwordHash: 'hashedpass' };
      usersRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
      const result = await service.validateUser('test@example.com', 'pass');
      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).toBeUndefined();
    });

    it('should return null if invalid', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);
      const result = await service.validateUser(
        'test@example.com',
        'wrongpass',
      );
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should throw if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({ id: '1' });
      await expect(
        service.register('test@example.com', 'pass', UserRole.MEMBER, 'tenant1'),
      ).rejects.toThrow();
    });

    it('should create and save user', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      usersRepository.create.mockReturnValue({
        email: 'test@example.com',
        passwordHash: 'hash',
      });
      usersRepository.save.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        role: 'member',
        tenantId: 'tenant1',
      });
      const result = await service.register('test@example.com', 'pass', UserRole.MEMBER, 'tenant1');
      expect(result.accessToken).toBe('token');
    });
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'member',
        tenantId: 'tenant1',
      };
      const result = await service.login(user);
      expect(result.accessToken).toBe('token');
      expect(result.userId).toBe('1');
    });
  });
});
