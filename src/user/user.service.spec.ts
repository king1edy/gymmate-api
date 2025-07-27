import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let usersRepository;

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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all users', async () => {
    const mockUsers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        role: 'member',
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
        role: 'member',
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
        roles: [user.role],
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    );
  });

  it('should find one user by id', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'member',
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
      roles: [mockUser.role],
      isActive: mockUser.isActive,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should create a user', async () => {
    const mockUser = {
      id: '3',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '1112223333',
      role: 'member',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    usersRepository.create.mockReturnValue(mockUser);
    usersRepository.save.mockResolvedValue(mockUser);
    const user = await service.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
      gymId: 'gym1',
    });
    expect(user).toEqual({
      id: mockUser.id,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      roles: [mockUser.role],
      isActive: mockUser.isActive,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    });
  });

  it('should update a user', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'member',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    usersRepository.findOne.mockResolvedValue(mockUser);
    usersRepository.save.mockResolvedValue({ ...mockUser, email: 'updated@example.com' });
    const result = await service.update('1', { email: 'updated@example.com' });
    expect(result).toEqual({ ...mockUser, email: 'updated@example.com' });
  });

  it('should delete a user', async () => {
    usersRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove('1');
    expect(result).toBeUndefined();
  });
});
