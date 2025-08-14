import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MembershipPlan } from './membership-plan.entity';
import { Member } from './member.entity';
import { MemberMembership } from './member-membership.entity';

describe('MembershipService', () => {
  let service: MembershipService;
  let memberRepository;
  let planRepository;
  let membershipRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: getRepositoryToken(Member),
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
          provide: getRepositoryToken(MembershipPlan),
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
          provide: getRepositoryToken(MemberMembership),
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

    service = module.get<MembershipService>(MembershipService);
    memberRepository = module.get(getRepositoryToken(Member));
    planRepository = module.get(getRepositoryToken(MembershipPlan));
    membershipRepository = module.get(getRepositoryToken(MemberMembership));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all membership plans', async () => {
    const mockPlans = [
      { id: '1', name: 'plan1' },
      { id: '2', name: 'plan2' },
    ];
    membershipRepository.find.mockResolvedValue(mockPlans);
    const plans = await service.getPlans('gym1');
    expect(plans).toEqual(mockPlans);
  });

  it('should find one membership plan by id', async () => {
    const mockPlan = { id: '1', name: 'plan1' };
    membershipRepository.findOne.mockResolvedValue(mockPlan);
    const plan = await service.getPlanById('1');
    expect(plan).toEqual(mockPlan);
  });

  it('should create a membership plan', async () => {
    const mockPlan = { id: '3', name: 'newPlan', price: 100 };
    membershipRepository.create.mockReturnValue(mockPlan);
    membershipRepository.save.mockResolvedValue(mockPlan);
    const plan = await service.createPlan({ name: 'Test Plan', price: 100 });
    expect(plan).toEqual(mockPlan);
  });

  it('should update a membership plan', async () => {
    membershipRepository.update.mockResolvedValue({ affected: 1 });
    membershipRepository.findOne.mockResolvedValue({
      id: '1',
      name: 'Updated Plan',
    });
    const result = await service.updatePlan('1', { name: 'Updated Plan' });
    expect(result).toEqual({ id: '1', name: 'Updated Plan' });
  });

  it('should delete a membership plan', async () => {
    membershipRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await membershipRepository.delete('1');
    expect(result).toEqual({ affected: 1 });
  });
});
