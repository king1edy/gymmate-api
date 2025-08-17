import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessService } from '../../src/access/access.service';
import { AccessControl } from '../../src/access/access-control.entity';
import { AccessLog } from '../../src/access/access-log.entity';
import { AccessCard } from '../../src/access/access-card.entity';

describe('AccessService', () => {
  let service: AccessService;
  let accessControlRepository: jest.Mocked<Repository<AccessControl>>;
  let accessLogRepository: jest.Mocked<Repository<AccessLog>>;
  let accessCardRepository: jest.Mocked<Repository<AccessCard>>;

  // Mock data
  const mockTenantId = 'tenant-123';
  const mockAccessPointId = 'access-point-123';
  const mockCardId = 'card-123';
  const mockMemberId = 'member-123';

  const mockAccessPoint: Partial<AccessControl> = {
    id: mockAccessPointId,
    name: 'Main Entrance',
    controlType: 'card_reader',
    isActive: true,
    tenant: { id: mockTenantId } as any,
    area: { id: 'area-123', name: 'Main Floor' } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccessCard: Partial<AccessCard> = {
    id: mockCardId,
    cardId: 'CARD001',
    isActive: true,
    member: {
      id: mockMemberId,
      user: { id: 'user-123', email: 'test@example.com' }
    } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccessLog: Partial<AccessLog> = {
    id: 'log-123',
    cardId: 'CARD001',
    timestamp: new Date(),
    isSuccessful: true,
    accessPoint: mockAccessPoint as AccessControl,
    member: mockAccessCard.member,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: getRepositoryToken(AccessControl),
          useFactory: () => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(AccessLog),
          useFactory: () => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(AccessCard),
          useFactory: () => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
    accessControlRepository = module.get(getRepositoryToken(AccessControl));
    accessLogRepository = module.get(getRepositoryToken(AccessLog));
    accessCardRepository = module.get(getRepositoryToken(AccessCard));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Points Management', () => {
    describe('getAccessPoints', () => {
      it('should return access points for a tenant', async () => {
        const mockAccessPoints = [mockAccessPoint];
        accessControlRepository.find.mockResolvedValue(mockAccessPoints as AccessControl[]);

        const result = await service.getAccessPoints(mockTenantId);

        expect(accessControlRepository.find).toHaveBeenCalledWith({
          where: { tenant: { id: mockTenantId } },
          relations: ['area'],
        });
        expect(result).toEqual(mockAccessPoints);
      });

      it('should return empty array when no access points found', async () => {
        accessControlRepository.find.mockResolvedValue([]);

        const result = await service.getAccessPoints(mockTenantId);

        expect(result).toEqual([]);
      });
    });

    describe('getAccessPoint', () => {
      it('should return a specific access point by id', async () => {
        accessControlRepository.findOne.mockResolvedValue(mockAccessPoint as AccessControl);

        const result = await service.getAccessPoint(mockAccessPointId);

        expect(accessControlRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockAccessPointId },
          relations: ['area', 'gym'],
        });
        expect(result).toEqual(mockAccessPoint);
      });

      it('should return null when access point not found', async () => {
        accessControlRepository.findOne.mockResolvedValue(null);

        const result = await service.getAccessPoint('non-existent-id');

        expect(result).toBeNull();
      });
    });

    describe('createAccessPoint', () => {
      it('should create and save a new access point', async () => {
        const createData = {
          name: 'New Entrance',
          controlType: 'biometric',
          tenantId: mockTenantId,
        };

        accessControlRepository.create.mockReturnValue(createData as any);
        accessControlRepository.save.mockResolvedValue({ ...createData, id: 'new-id' } as any);

        const result = await service.createAccessPoint(createData);

        expect(accessControlRepository.create).toHaveBeenCalledWith(createData);
        expect(accessControlRepository.save).toHaveBeenCalledWith(createData);
        expect(result).toEqual({ ...createData, id: 'new-id' });
      });
    });

    describe('updateAccessPoint', () => {
      it('should update access point and return updated entity', async () => {
        const updateData = { name: 'Updated Entrance' };
        const updatedAccessPoint = { ...mockAccessPoint, ...updateData };

        accessControlRepository.update.mockResolvedValue({ affected: 1 } as any);
        accessControlRepository.findOne.mockResolvedValue(updatedAccessPoint as AccessControl);

        const result = await service.updateAccessPoint(mockAccessPointId, updateData);

        expect(accessControlRepository.update).toHaveBeenCalledWith(mockAccessPointId, updateData);
        expect(accessControlRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockAccessPointId },
          relations: ['area', 'gym'],
        });
        expect(result).toEqual(updatedAccessPoint);
      });
    });
  });

  describe('Access Cards Management', () => {
    describe('getAccessCards', () => {
      it('should return access cards with default empty filter', async () => {
        const mockCards = [mockAccessCard];
        accessCardRepository.find.mockResolvedValue(mockCards as AccessCard[]);

        const result = await service.getAccessCards();

        expect(accessCardRepository.find).toHaveBeenCalledWith({
          where: {},
          relations: ['member', 'member.user'],
        });
        expect(result).toEqual(mockCards);
      });

      it('should return access cards with custom filter', async () => {
        const filter = { isActive: true };
        const mockCards = [mockAccessCard];
        accessCardRepository.find.mockResolvedValue(mockCards as AccessCard[]);

        const result = await service.getAccessCards(filter);

        expect(accessCardRepository.find).toHaveBeenCalledWith({
          where: filter,
          relations: ['member', 'member.user'],
        });
        expect(result).toEqual(mockCards);
      });
    });

    describe('getAccessCard', () => {
      it('should return a specific access card by id', async () => {
        accessCardRepository.findOne.mockResolvedValue(mockAccessCard as AccessCard);

        const result = await service.getAccessCard(mockCardId);

        expect(accessCardRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockCardId },
          relations: ['member', 'member.user'],
        });
        expect(result).toEqual(mockAccessCard);
      });
    });

    describe('createAccessCard', () => {
      it('should create and save a new access card', async () => {
        const createData = {
          cardId: 'CARD002',
          memberId: mockMemberId,
        };

        accessCardRepository.create.mockReturnValue(createData as any);
        accessCardRepository.save.mockResolvedValue({ ...createData, id: 'new-card-id' } as any);

        const result = await service.createAccessCard(createData);

        expect(accessCardRepository.create).toHaveBeenCalledWith(createData);
        expect(accessCardRepository.save).toHaveBeenCalledWith(createData);
        expect(result).toEqual({ ...createData, id: 'new-card-id' });
      });
    });

    describe('updateAccessCard', () => {
      it('should update access card and return updated entity', async () => {
        const updateData = { cardType: 'premium' };
        const updatedCard = { ...mockAccessCard, ...updateData };

        accessCardRepository.update.mockResolvedValue({ affected: 1 } as any);
        accessCardRepository.findOne.mockResolvedValue(updatedCard as AccessCard);

        const result = await service.updateAccessCard(mockCardId, updateData);

        expect(accessCardRepository.update).toHaveBeenCalledWith(mockCardId, updateData);
        expect(result).toEqual(updatedCard);
      });
    });

    describe('deactivateAccessCard', () => {
      it('should deactivate access card with reason and timestamp', async () => {
        const reason = 'Card lost';
        const mockDate = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

        const expectedUpdateData = {
          isActive: false,
          deactivationReason: reason,
          deactivatedAt: mockDate,
        };

        accessCardRepository.update.mockResolvedValue({ affected: 1 } as any);
        accessCardRepository.findOne.mockResolvedValue({
          ...mockAccessCard,
          ...expectedUpdateData,
        } as AccessCard);

        const result = await service.deactivateAccessCard(mockCardId, reason);

        expect(accessCardRepository.update).toHaveBeenCalledWith(mockCardId, expectedUpdateData);
        expect(result).toEqual({ ...mockAccessCard, ...expectedUpdateData });

        jest.restoreAllMocks();
      });
    });
  });

  describe('Access Logs Management', () => {
    describe('getAccessLogs', () => {
      it('should return access logs with default pagination', async () => {
        const mockLogs = [mockAccessLog];
        accessLogRepository.find.mockResolvedValue(mockLogs as AccessLog[]);

        const result = await service.getAccessLogs();

        expect(accessLogRepository.find).toHaveBeenCalledWith({
          where: {},
          relations: ['accessPoint', 'member', 'member.user'],
          skip: 0,
          take: 50,
          order: { timestamp: 'DESC' },
        });
        expect(result).toEqual(mockLogs);
      });

      it('should return access logs with custom filter and pagination', async () => {
        const filter = { isSuccessful: true };
        const pagination = { skip: 10, take: 20 };
        const mockLogs = [mockAccessLog];

        accessLogRepository.find.mockResolvedValue(mockLogs as AccessLog[]);

        const result = await service.getAccessLogs(filter, pagination);

        expect(accessLogRepository.find).toHaveBeenCalledWith({
          where: filter,
          relations: ['accessPoint', 'member', 'member.user'],
          skip: 10,
          take: 20,
          order: { timestamp: 'DESC' },
        });
        expect(result).toEqual(mockLogs);
      });
    });

    describe('logAccess', () => {
      it('should create and save access log', async () => {
        const logData = {
          accessPoint: mockAccessPoint,
          member: mockAccessCard.member,
          cardId: 'CARD001',
          isSuccessful: true,
          timestamp: new Date(),
        };

        accessLogRepository.create.mockReturnValue(logData as any);
        accessLogRepository.save.mockResolvedValue({ ...logData, id: 'new-log-id' } as any);

        const result = await service.logAccess(logData);

        expect(accessLogRepository.create).toHaveBeenCalledWith(logData);
        expect(accessLogRepository.save).toHaveBeenCalledWith(logData);
        expect(result).toEqual({ ...logData, id: 'new-log-id' });
      });
    });
  });

  describe('Access Control Functions', () => {
    describe('validateAccess', () => {
      it('should allow access for valid active card and access point', async () => {
        const mockDate = new Date();
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

        accessCardRepository.findOne.mockResolvedValue(mockAccessCard as AccessCard);
        accessControlRepository.findOne.mockResolvedValue(mockAccessPoint as AccessControl);
        accessLogRepository.create.mockReturnValue({} as any);
        accessLogRepository.save.mockResolvedValue({} as any);

        const result = await service.validateAccess('CARD001', mockAccessPointId);

        expect(accessCardRepository.findOne).toHaveBeenCalledWith({
          where: { cardId: 'CARD001' },
          relations: ['member', 'member.user'],
        });
        expect(accessControlRepository.findOne).toHaveBeenCalledWith({
          where: { id: mockAccessPointId },
          relations: ['area'],
        });

        expect(accessLogRepository.create).toHaveBeenCalledWith({
          accessPoint: mockAccessPoint,
          member: mockAccessCard.member,
          cardId: 'CARD001',
          isSuccessful: true,
          timestamp: mockDate,
        });

        expect(result).toEqual({ allowed: true });

        jest.restoreAllMocks();
      });

      it('should deny access for invalid card', async () => {
        accessCardRepository.findOne.mockResolvedValue(null);

        const result = await service.validateAccess('INVALID_CARD', mockAccessPointId);

        expect(result).toEqual({
          allowed: false,
          reason: 'Invalid or inactive card',
        });
        expect(accessControlRepository.findOne).not.toHaveBeenCalled();
        expect(accessLogRepository.create).not.toHaveBeenCalled();
      });

      it('should deny access for inactive card', async () => {
        const inactiveCard = { ...mockAccessCard, isActive: false };
        accessCardRepository.findOne.mockResolvedValue(inactiveCard as AccessCard);

        const result = await service.validateAccess('CARD001', mockAccessPointId);

        expect(result).toEqual({
          allowed: false,
          reason: 'Invalid or inactive card',
        });
        expect(accessControlRepository.findOne).not.toHaveBeenCalled();
      });

      it('should deny access for invalid access point', async () => {
        accessCardRepository.findOne.mockResolvedValue(mockAccessCard as AccessCard);
        accessControlRepository.findOne.mockResolvedValue(null);

        const result = await service.validateAccess('CARD001', 'INVALID_POINT');

        expect(result).toEqual({
          allowed: false,
          reason: 'Invalid or inactive access point',
        });
        expect(accessLogRepository.create).not.toHaveBeenCalled();
      });

      it('should deny access for inactive access point', async () => {
        const inactiveAccessPoint = { ...mockAccessPoint, isActive: false };
        accessCardRepository.findOne.mockResolvedValue(mockAccessCard as AccessCard);
        accessControlRepository.findOne.mockResolvedValue(inactiveAccessPoint as AccessControl);

        const result = await service.validateAccess('CARD001', mockAccessPointId);

        expect(result).toEqual({
          allowed: false,
          reason: 'Invalid or inactive access point',
        });
        expect(accessLogRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('getAccessHistory', () => {
      it('should return member access history with default filter', async () => {
        const mockHistory = [mockAccessLog];
        accessLogRepository.find.mockResolvedValue(mockHistory as AccessLog[]);

        const result = await service.getAccessHistory(mockMemberId);

        expect(accessLogRepository.find).toHaveBeenCalledWith({
          where: { member: { id: mockMemberId } },
          relations: ['accessPoint'],
          order: { timestamp: 'DESC' },
        });
        expect(result).toEqual(mockHistory);
      });

      it('should return member access history with custom filter', async () => {
        const filter = { isSuccessful: true };
        const mockHistory = [mockAccessLog];
        accessLogRepository.find.mockResolvedValue(mockHistory as AccessLog[]);

        const result = await service.getAccessHistory(mockMemberId, filter);

        expect(accessLogRepository.find).toHaveBeenCalledWith({
          where: { member: { id: mockMemberId }, ...filter },
          relations: ['accessPoint'],
          order: { timestamp: 'DESC' },
        });
        expect(result).toEqual(mockHistory);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors gracefully', async () => {
      const error = new Error('Database connection failed');
      accessControlRepository.find.mockRejectedValue(error);

      await expect(service.getAccessPoints(mockTenantId)).rejects.toThrow(error);
    });

    it('should handle validation errors in validateAccess', async () => {
      const error = new Error('Card lookup failed');
      accessCardRepository.findOne.mockRejectedValue(error);

      await expect(service.validateAccess('CARD001', mockAccessPointId)).rejects.toThrow(error);
    });
  });
});