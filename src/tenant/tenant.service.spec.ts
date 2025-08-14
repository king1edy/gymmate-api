import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from './tenant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';

describe('TenantService', () => {
  let service: TenantService;
  let tenantRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getRepositoryToken(Tenant),
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

    service = module.get<TenantService>(TenantService);
    tenantRepository = module.get(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all tenants', async () => {
    tenantRepository.find.mockResolvedValue(['tenant1', 'tenant2']);
    const tenants = await service.findAll();
    expect(tenants).toEqual(['tenant1', 'tenant2']);
  });

  it('should find one tenant by id', async () => {
    tenantRepository.findOne.mockResolvedValue('tenant1');
    const tenant = await service.findOne('1');
    expect(tenant).toEqual('tenant1');
  });

  it('should create a tenant', async () => {
    tenantRepository.create.mockReturnValue('newTenant');
    tenantRepository.save.mockResolvedValue('newTenant');
    const tenant = await service.create({
      name: 'Test Tenant',
      subdomain: 'test',
    });
    expect(tenant).toEqual('newTenant');
  });

  it('should update a tenant', async () => {
    const mockTenant = { id: '1', name: 'Tenant1' };
    tenantRepository.findOne.mockResolvedValue(mockTenant);
    tenantRepository.save.mockResolvedValue({
      ...mockTenant,
      name: 'Updated Tenant',
    });
    const result = await service.update('1', { name: 'Updated Tenant' });
    expect(result).toEqual({ ...mockTenant, name: 'Updated Tenant' });
  });

  it('should delete a tenant', async () => {
    const mockTenant = { id: '1', name: 'Tenant1' };
    tenantRepository.findOne.mockResolvedValue(mockTenant);
    tenantRepository.remove = jest.fn().mockResolvedValue(undefined);
    const result = await service.remove('1');
    expect(result).toBeUndefined();
  });
});
