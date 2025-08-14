import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { Role } from '../roles/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Add In operator
import { Tenant } from './tenant.entity';
import { User } from '../user/user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { SubscriptionPlan, SubscriptionStatus } from './types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserRole } from '../user/dto/UserRole';

@Injectable()
export class TenantService {
  private readonly CACHE_TTL = 3600000; // 1 hour in milliseconds
  private readonly CACHE_PREFIX = 'tenant:';
  private readonly USAGE_CACHE_TTL = 300000; // 5 minutes for usage stats

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  private getCacheKey(type: string, value: string): string {
    return `${this.CACHE_PREFIX}${type}:${value}`;
  }

  private async invalidateCache(tenant: Tenant): Promise<void> {
    await Promise.all([
      this.cacheManager.del(this.getCacheKey('id', tenant.id)),
      this.cacheManager.del(this.getCacheKey('subdomain', tenant.subdomain)),
    ]);
  }

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const cacheKey = this.getCacheKey('subdomain', createTenantDto.subdomain);
    const cachedTenant = await this.cacheManager.get<Tenant>(cacheKey);
    if (cachedTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain },
    });

    if (existingTenant) {
      await this.cacheManager.set(cacheKey, existingTenant, this.CACHE_TTL);
      throw new ConflictException('Subdomain already exists');
    }

    const tenant = this.tenantRepository.create({
      ...createTenantDto,
      subscriptionPlan: SubscriptionPlan.STARTER,
      subscriptionStatus: SubscriptionStatus.TRIALING,
      subscriptionEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      limits: { maxMembers: 100, maxStaff: 5 },
      featuresEnabled: [
        'basic_analytics',
        'member_management',
        'class_scheduling',
      ],
    });

    const savedTenant = await this.tenantRepository.save(tenant);
    await this.cacheManager.set(cacheKey, savedTenant, this.CACHE_TTL);
    await this.cacheManager.set(
      this.getCacheKey('id', savedTenant.id),
      savedTenant,
      this.CACHE_TTL,
    );

    return savedTenant;
  }

  async findAll(): Promise<Tenant[]> {
    const cacheKey = `${this.CACHE_PREFIX}all`;
    const cachedTenants = await this.cacheManager.get<Tenant[]>(cacheKey);

    if (cachedTenants) {
      return cachedTenants;
    }

    const tenants = await this.tenantRepository.find();
    await this.cacheManager.set(cacheKey, tenants, this.CACHE_TTL);
    return tenants;
  }

  async findOne(id: string): Promise<Tenant> {
    const cacheKey = this.getCacheKey('id', id);
    const cachedTenant = await this.cacheManager.get<Tenant>(cacheKey);

    if (cachedTenant) {
      return cachedTenant;
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.cacheManager.set(cacheKey, tenant, this.CACHE_TTL);
    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const cacheKey = this.getCacheKey('subdomain', subdomain);
    const cachedTenant = await this.cacheManager.get<Tenant>(cacheKey);

    if (cachedTenant) {
      return cachedTenant;
    }

    const tenant = await this.tenantRepository.findOne({
      where: { subdomain },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.cacheManager.set(cacheKey, tenant, this.CACHE_TTL);
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    Object.assign(tenant, updateTenantDto);

    const updatedTenant = await this.tenantRepository.save(tenant);
    await this.invalidateCache(updatedTenant);

    // Set new cache
    await this.cacheManager.set(
      this.getCacheKey('id', updatedTenant.id),
      updatedTenant,
      this.CACHE_TTL,
    );
    await this.cacheManager.set(
      this.getCacheKey('subdomain', updatedTenant.subdomain),
      updatedTenant,
      this.CACHE_TTL,
    );

    return updatedTenant;
  }

  async updateSubscription(
    id: string,
    plan: SubscriptionPlan,
    expiresAt: Date,
  ): Promise<Tenant> {
    const tenant = await this.findOne(id);

    tenant.subscriptionPlan = plan;
    tenant.subscriptionEndDate = expiresAt;

    // Update plan limits
    switch (plan) {
      case SubscriptionPlan.STARTER:
        tenant.limits = { maxMembers: 100, maxStaff: 5 };
        tenant.featuresEnabled = [
          'basic_analytics',
          'member_management',
          'class_scheduling',
        ];
        break;
      case SubscriptionPlan.PROFESSIONAL:
        tenant.limits = { maxMembers: 500, maxStaff: 20 };
        tenant.featuresEnabled = [
          'basic_analytics',
          'advanced_analytics',
          'member_management',
          'class_scheduling',
          'equipment_tracking',
          'pos_integration',
        ];
        break;
      case SubscriptionPlan.ENTERPRISE:
        tenant.limits = { maxMembers: -1, maxStaff: -1 };
        tenant.featuresEnabled = [
          'basic_analytics',
          'advanced_analytics',
          'member_management',
          'class_scheduling',
          'equipment_tracking',
          'pos_integration',
          'custom_integrations',
          'white_label',
          'priority_support',
        ];
        break;
    }

    const updatedTenant = await this.tenantRepository.save(tenant);
    await this.invalidateCache(updatedTenant);

    // Set new cache
    await this.cacheManager.set(
      this.getCacheKey('id', updatedTenant.id),
      updatedTenant,
      this.CACHE_TTL,
    );
    await this.cacheManager.set(
      this.getCacheKey('subdomain', updatedTenant.subdomain),
      updatedTenant,
      this.CACHE_TTL,
    );

    return updatedTenant;
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.invalidateCache(tenant);
    await this.tenantRepository.remove(tenant);
  }

  async checkUsageLimit(
    tenantId: string,
    limitType: 'members' | 'staff',
  ): Promise<boolean> {
    const tenant = await this.findOne(tenantId);

    // Convert limitType to the correct property name
    const limitPropertyName =
      limitType === 'members' ? 'maxMembers' : 'maxStaff';

    // Get the maximum limit from tenant configuration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const maxLimit = tenant.limits[limitPropertyName];

    // If the limit is -1, it means unlimited
    if (maxLimit === -1) {
      return true;
    }

    // Get current usage count
    const currentCount = await this.getUsageCount(tenantId, limitType);

    // Return true if current count is less than the limit
    return currentCount < maxLimit;
  }

  private async getUsageCount(
    tenantId: string,
    type: 'members' | 'staff',
  ): Promise<number> {
    const cacheKey = `${this.CACHE_PREFIX}usage:${tenantId}:${type}`;
    const cachedCount = await this.cacheManager.get<number>(cacheKey);

    if (cachedCount !== undefined) {
      return cachedCount;
    }

      const roleMapping = {
      members: ['MEMBER'],
      staff: ['TRAINER', 'ADMIN', 'STAFF'],
    };

    // Find users with specified roles
    const count = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.roles', 'role')
      .where('user.tenantId = :tenantId', { tenantId })
      .andWhere('role.name IN (:...roleNames)', { roleNames: roleMapping[type] })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getCount();    // Cache the count for a shorter period since it changes more frequently
    await this.cacheManager.set(cacheKey, count, this.USAGE_CACHE_TTL);
    return count;
  }

  async validateFeatureAccess(
    tenantId: string,
    feature: string,
  ): Promise<boolean> {
    const tenant = await this.findOne(tenantId);
    return tenant.featuresEnabled.includes(feature);
  }

  async getUsageStats(tenantId: string): Promise<{
    members: { current: number; limit: number };
    staff: { current: number; limit: number };
  }> {
    const tenant = await this.findOne(tenantId);
    const [membersCount, staffCount] = await Promise.all([
      this.getUsageCount(tenantId, 'members'),
      this.getUsageCount(tenantId, 'staff'),
    ]);

    const { maxMembers, maxStaff } = tenant.limits;

    return {
      members: {
        current: membersCount,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        limit: maxMembers !== -1 ? maxMembers : Infinity,
      },
      staff: {
        current: staffCount,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        limit: maxStaff !== -1 ? maxStaff : Infinity,
      },
    };
  }

  // Helper method to invalidate usage cache when users are added/removed
  async invalidateUsageCache(tenantId: string): Promise<void> {
    await Promise.all([
      this.cacheManager.del(`${this.CACHE_PREFIX}usage:${tenantId}:members`),
      this.cacheManager.del(`${this.CACHE_PREFIX}usage:${tenantId}:staff`),
    ]);
  }
}
