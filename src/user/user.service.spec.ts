import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let usersRepository;
  let rolesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
    rolesRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const mockRole = { id: '1', name: 'MEMBER' };
    const mockUsers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        roles: [mockRole],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        roles: [mockRole],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    usersRepository.find.mockResolvedValue(mockUsers);
    const users = await service.findAll();
    expect(users).toEqual(
      mockUsers.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    );
  });

  it('should find one user by id', async () => {
    const mockRole = { id: '1', name: 'MEMBER' };
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      roles: [mockRole],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    usersRepository.findOne.mockResolvedValue(mockUser);
    const user = await service.findOne('1');
    expect(user).toEqual({
      id: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      roles: mockUser.roles,
      isActive: mockUser.isActive,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should create a user', async () => {
    const mockRole = { id: '1', name: 'MEMBER' };
    const mockUser = {
      id: '3',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1112223333',
      roles: [mockRole],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    rolesRepository.findOne.mockResolvedValue(mockRole);
    usersRepository.create.mockReturnValue(mockUser);
    usersRepository.save.mockResolvedValue(mockUser);
    
    const user = await service.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      tenantId: 'tenant1',
    });
    
    expect(user).toEqual({
      id: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      roles: mockUser.roles,
      isActive: mockUser.isActive,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should update a user', async () => {
    const mockRole = { id: '1', name: 'MEMBER' };
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      roles: [mockRole],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    usersRepository.findOne.mockResolvedValue(mockUser);
    usersRepository.save.mockResolvedValue({
      ...mockUser,
      email: 'updated@example.com',
    });
    
    const result = await service.update('1', { email: 'updated@example.com' });
    expect(result).toEqual({
      id: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: 'updated@example.com',
      phone: mockUser.phone,
      roles: mockUser.roles,
      isActive: mockUser.isActive,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should delete a user', async () => {
    usersRepository.delete.mockResolvedValue({ affected: 1 });
    await expect(service.remove('1')).resolves.toBeUndefined();
  });

  it('should throw NotFoundException when user not found for findOne', async () => {
    usersRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when user not found for update', async () => {
    usersRepository.findOne.mockResolvedValue(null);
    await expect(service.update('999', { email: 'test@test.com' })).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when user not found for remove', async () => {
    usersRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('999')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when default role not found', async () => {
    rolesRepository.findOne.mockResolvedValue(null);
    
    await expect(service.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      tenantId: 'tenant1',
    })).rejects.toThrow(NotFoundException);
  });
});
