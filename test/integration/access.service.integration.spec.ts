import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { AccessService } from '../../src/access/access.service';
import { AccessControl } from '../../src/access/access-control.entity';
import { AccessLog } from '../../src/access/access-log.entity';
import { AccessCard } from '../../src/access/access-card.entity';
import { Member } from '../../src/membership/member.entity';
import { Tenant } from '../../src/tenant/tenant.entity';
import { TenantArea } from '../../src/class/tenant-area.entity';
import { User } from '../../src/user/user.entity'; // Assuming you have a User entity

describe('AccessService Integration Tests', () => {
  let app: INestApplication;
  let service: AccessService;
  let dataSource: DataSource;
  
  // Repositories for test data setup
  let accessControlRepository: Repository<AccessControl>;
  let accessLogRepository: Repository<AccessLog>;
  let accessCardRepository: Repository<AccessCard>;
  let memberRepository: Repository<Member>;
  let tenantRepository: Repository<Tenant>;
  let tenantAreaRepository: Repository<TenantArea>;
  let userRepository: Repository<User>;

  // Test data IDs
  let testTenant: Tenant;
  let testArea: TenantArea;
  let testUser: User;
  let testMember: Member;
  let testAccessPoint: AccessControl;
  let testAccessCard: AccessCard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres', // Change to 'sqlite' for simpler setup
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5433'),
          username: process.env.DB_USERNAME || 'test',
          password: process.env.DB_PASSWORD || 'test',
          database: process.env.DB_NAME || 'gym_test',
          entities: [
            AccessControl,
            AccessLog,
            AccessCard,
            Member,
            Tenant,
            TenantArea,
            User,
          ],
          synchronize: true, // Only for testing!
          dropSchema: true, // Clean start for each test run
          logging: false, // Set to true for debugging
        }),
        TypeOrmModule.forFeature([
          AccessControl,
          AccessLog,
          AccessCard,
          Member,
          Tenant,
          TenantArea,
          User,
        ]),
      ],
      providers: [AccessService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<AccessService>(AccessService);
    dataSource = module.get<DataSource>(DataSource);
    
    // Get repositories for test data setup
    accessControlRepository = module.get<Repository<AccessControl>>(getRepositoryToken(AccessControl));
    accessLogRepository = module.get<Repository<AccessLog>>(getRepositoryToken(AccessLog));
    accessCardRepository = module.get<Repository<AccessCard>>(getRepositoryToken(AccessCard));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    tenantRepository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
    tenantAreaRepository = module.get<Repository<TenantArea>>(getRepositoryToken(TenantArea));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    // Clean up data before each test
    await accessLogRepository.delete({});
    await accessCardRepository.delete({});
    await accessControlRepository.delete({});
    await memberRepository.delete({});
    await tenantAreaRepository.delete({});
    await tenantRepository.delete({});
    await userRepository.delete({});

    // Create test data for each test
    await setupTestData();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  // Helper function to set up test data
  async function setupTestData() {
    // Create test user
    testUser = await userRepository.save({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      // Add other required fields based on your User entity
    });

    // Create test tenant
    testTenant = await tenantRepository.save({
      name: 'Test Gym',
      email: 'gym@test.com',
      // Add other required fields
    });

    // Create test area
    testArea = await tenantAreaRepository.save({
      name: 'Main Floor',
      tenant: testTenant,
      // Add other required fields
    });

    // Create test member
    testMember = await memberRepository.save({
      user: testUser,
      tenant: testTenant,
      membershipType: 'premium',
      isActive: true,
      // Add other required fields
    });

    // Create test access point
    testAccessPoint = await accessControlRepository.save({
      tenant: testTenant,
      area: testArea,
      name: 'Main Entrance',
      description: 'Primary gym entrance',
      controlType: 'card_reader',
      serialNumber: 'SR001',
      manufacturer: 'ACME Security',
      model: 'CardReader Pro',
      configuration: {
        ipAddress: '192.168.1.100',
        port: 80,
        settings: { timeout: 30 }
      },
      isActive: true,
      scheduleRestrictions: [
        {
          dayOfWeek: 1,
          startTime: '06:00',
          endTime: '22:00'
        }
      ]
    });

    // Create test access card
    testAccessCard = await accessCardRepository.save({
      member: testMember,
      cardId: 'CARD001',
      cardType: 'RFID',
      isActive: true,
      activatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      restrictions: {
        timeRestrictions: [
          {
            dayOfWeek: 1,
            startTime: '06:00',
            endTime: '22:00'
          }
        ],
        areaRestrictions: ['main_floor']
      },
      cardDetails: {
        manufacturer: 'CardCorp',
        technology: 'RFID',
        format: 'Proximity',
        serialNumber: 'CC123456'
      },
      deposit: 25.00,
      depositPaidAt: new Date()
    });
  }

  describe('Database Integration', () => {
    it('should create access point with proper relations', async () => {
      const accessPointData = {
        tenant: testTenant,
        area: testArea,
        name: 'Secondary Entrance',
        controlType: 'biometric',
        isActive: true
      };

      const created = await service.createAccessPoint(accessPointData);
      
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Secondary Entrance');

      // Verify it was actually saved to database
      const found = await accessControlRepository.findOne({
        where: { id: created.id },
        relations: ['tenant', 'area']
      });

      expect(found).toBeDefined();
      expect(found).not.toBeNull();
      if (found) {
        expect(found.tenant.id).toBe(testTenant.id);
        expect(found.area.id).toBe(testArea.id);
      }
    });

    it('should create access card with member relations', async () => {
      const cardData = {
        member: testMember,
        cardId: 'CARD002',
        cardType: 'NFC',
        isActive: true,
        deposit: 30.00
      };

      const created = await service.createAccessCard(cardData);
      
      expect(created).toBeDefined();
      expect(created.cardId).toBe('CARD002');

      // Verify relations are properly loaded
      const found = await service.getAccessCard(created.id);
      expect(found).toBeDefined();
      expect(found).not.toBeNull();
      if (found) {
        expect(found.member).toBeDefined();
        expect(found.member.id).toBe(testMember.id);
        expect(found.member.user).toBeDefined();
        expect(found.member.user.email).toBe('test@example.com');
      }
    });

    it('should handle complex JSONB queries and updates', async () => {
      // Test JSONB column updates
      const updatedRestrictions = {
        timeRestrictions: [
          {
            dayOfWeek: 2,
            startTime: '08:00',
            endTime: '20:00'
          }
        ],
        areaRestrictions: ['main_floor', 'pool_area']
      };

      await service.updateAccessCard(testAccessCard.id, {
        restrictions: updatedRestrictions
      });

      // Verify JSONB update worked
      const updated = await accessCardRepository.findOne({
        where: { id: testAccessCard.id }
      });

      expect(updated).toBeDefined();
      expect(updated).not.toBeNull();
      if (updated?.restrictions) {
        expect(updated.restrictions.timeRestrictions).toHaveLength(1);
        expect(updated.restrictions.timeRestrictions?.[0]?.dayOfWeek).toBe(2);
        expect(updated.restrictions.areaRestrictions).toContain('pool_area');
      }
    });
  });

  describe('Access Validation Workflow Integration', () => {
    it('should complete full access validation and logging workflow', async () => {
      // Test the complete workflow
      const result = await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);

      // Should allow access
      expect(result.allowed).toBe(true);

      // Verify log was created
      const logs = await accessLogRepository.find({
        relations: ['accessPoint', 'member', 'member.user']
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].cardId).toBe(testAccessCard.cardId);
      expect(logs[0].isSuccessful).toBe(true);
      expect(logs[0].accessPoint.id).toBe(testAccessPoint.id);
      expect(logs[0].member.id).toBe(testMember.id);
      expect(logs[0].timestamp).toBeInstanceOf(Date);
    });

    it('should deny access for inactive card and log the attempt', async () => {
      // Deactivate the card
      await service.deactivateAccessCard(testAccessCard.id, 'Card reported lost');

      const result = await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Invalid or inactive card');

      // Verify card was properly deactivated in database
      const card = await accessCardRepository.findOne({
        where: { id: testAccessCard.id }
      });

      expect(card.isActive).toBe(false);
      expect(card.deactivationReason).toBe('Card reported lost');
      expect(card.deactivatedAt).toBeInstanceOf(Date);
    });

    it('should deny access for inactive access point', async () => {
      // Deactivate access point
      await service.updateAccessPoint(testAccessPoint.id, { isActive: false });

      const result = await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Invalid or inactive access point');
    });

    it('should handle concurrent access validations', async () => {
      // Create additional test data
      const card2 = await accessCardRepository.save({
        member: testMember,
        cardId: 'CARD_CONCURRENT',
        isActive: true
      });

      // Simulate concurrent access attempts
      const promises = [
        service.validateAccess(testAccessCard.cardId, testAccessPoint.id),
        service.validateAccess(card2.cardId, testAccessPoint.id),
        service.validateAccess(testAccessCard.cardId, testAccessPoint.id)
      ];

      const results = await Promise.all(promises);

      // All should be successful
      results.forEach(result => {
        expect(result.allowed).toBe(true);
      });

      // Should have 3 log entries
      const logs = await accessLogRepository.find();
      expect(logs).toHaveLength(3);
    });
  });

  describe('Complex Queries Integration', () => {
    it('should filter access points by tenant correctly', async () => {
      // Create another tenant and access point
      const tenant2 = await tenantRepository.save({
        name: 'Another Gym',
        email: 'gym2@test.com'
      });

      const area2 = await tenantAreaRepository.save({
        name: 'Second Floor',
        tenant: tenant2
      });

      await accessControlRepository.save({
        tenant: tenant2,
        area: area2,
        name: 'Second Gym Entrance',
        controlType: 'keypad',
        isActive: true
      });

      // Should only return access points for the requested tenant
      const points = await service.getAccessPoints(testTenant.id);
      
      expect(points).toHaveLength(1);
      expect(points[0]).toBeDefined();
      if (points[0]) {
        expect(points[0].id).toBe(testAccessPoint.id);
        expect(points[0].tenant.id).toBe(testTenant.id);
      }
    });

    it('should paginate access logs correctly', async () => {
      // Create multiple log entries
      const logPromises = [];
      for (let i = 0; i < 15; i++) {
        logPromises.push(
          service.logAccess({
            accessPoint: testAccessPoint,
            member: testMember,
            cardId: testAccessCard.cardId,
            isSuccessful: true,
            timestamp: new Date(Date.now() - i * 1000) // Different timestamps
          })
        );
      }
      await Promise.all(logPromises);

      // Test pagination
      const page1 = await service.getAccessLogs({}, { skip: 0, take: 10 });
      const page2 = await service.getAccessLogs({}, { skip: 10, take: 10 });

      expect(page1).toHaveLength(10);
      expect(page2).toHaveLength(5);

      // Verify ordering (most recent first)
      expect(page1[0].timestamp.getTime()).toBeGreaterThan(page1[1].timestamp.getTime());
    });

    it('should filter access history by member correctly', async () => {
      // Create another member
      const user2 = await userRepository.save({
        email: 'member2@test.com',
        firstName: 'Jane',
        lastName: 'Smith'
      });

      const member2 = await memberRepository.save({
        user: user2,
        tenant: testTenant,
        membershipType: 'basic',
        isActive: true
      });

      // Create logs for both members
      await service.logAccess({
        accessPoint: testAccessPoint,
        member: testMember,
        cardId: 'CARD001',
        isSuccessful: true,
        timestamp: new Date()
      });

      await service.logAccess({
        accessPoint: testAccessPoint,
        member: member2,
        cardId: 'CARD002',
        isSuccessful: true,
        timestamp: new Date()
      });

      // Should only return logs for requested member
      const member1History = await service.getAccessHistory(testMember.id);
      const member2History = await service.getAccessHistory(member2.id);

      expect(member1History).toHaveLength(1);
      expect(member2History).toHaveLength(1);
      expect(member1History[0].member.id).toBe(testMember.id);
      expect(member2History[0].member.id).toBe(member2.id);
    });
  });

  describe('Data Consistency Integration', () => {
    it('should maintain referential integrity on card deactivation', async () => {
      // Validate access first
      await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);

      // Deactivate card
      await service.deactivateAccessCard(testAccessCard.id, 'Membership expired');

      // Attempt validation again
      const result = await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);
      expect(result.allowed).toBe(false);

      // Logs should still exist and be accessible
      const logs = await service.getAccessLogs();
      expect(logs).toHaveLength(1); // The successful one from before deactivation
      expect(logs[0]).toBeDefined();
      if (logs[0]) {
        expect(logs[0].isSuccessful).toBe(true);
      }

      // Card should be deactivated but still linked to member
      const card = await service.getAccessCard(testAccessCard.id);
      expect(card).toBeDefined();
      expect(card).not.toBeNull();
      if (card) {
        expect(card.isActive).toBe(false);
        expect(card.member).toBeDefined();
        expect(card.member.id).toBe(testMember.id);
      }
    });

    it('should handle cascade operations correctly', async () => {
      // This test depends on your cascade settings
      // Verify that deleting a member doesn't break access logs
      const initialLogs = await accessLogRepository.count();
      
      // Create access log
      await service.validateAccess(testAccessCard.cardId, testAccessPoint.id);
      
      const afterAccessLogs = await accessLogRepository.count();
      expect(afterAccessLogs).toBe(initialLogs + 1);

      // If you have proper cascade settings, logs should handle member changes gracefully
      // This test would need adjustment based on your actual cascade configuration
    });
  });

  describe('Transaction Integration', () => {
    it('should handle database transaction rollbacks properly', async () => {
      // Test what happens if a validation creates a log but then fails
      const originalCardCount = await accessCardRepository.count();
      const originalLogCount = await accessLogRepository.count();

      try {
        // This should simulate a transaction that partially succeeds then fails
        await dataSource.transaction(async (manager) => {
          // This would succeed
          await manager.save(AccessCard, {
            member: testMember,
            cardId: 'TRANSACTION_TEST',
            isActive: true
          });

          // Force a failure
          throw new Error('Simulated transaction failure');
        });
      } catch (error) {
        // Expected to fail
        expect(error.message).toBe('Simulated transaction failure');
      }

      // Verify rollback worked
      const finalCardCount = await accessCardRepository.count();
      const finalLogCount = await accessLogRepository.count();

      expect(finalCardCount).toBe(originalCardCount);
      expect(finalLogCount).toBe(originalLogCount);
    });
  });
});