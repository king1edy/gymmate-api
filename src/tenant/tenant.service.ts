import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { SubscriptionPlan, SubscriptionStatus } from './types';

@Injectable()
export class TenantService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
    ) {}

    async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
        // Check if subdomain is available
        const existingTenant = await this.tenantRepository.findOne({
            where: { subdomain: createTenantDto.subdomain }
        });

        if (existingTenant) {
            throw new ConflictException('Subdomain already exists');
        }

        const tenant = this.tenantRepository.create({
            ...createTenantDto,
            subscriptionPlan: SubscriptionPlan.STARTER,
            subscriptionStatus: SubscriptionStatus.TRIALING,
            subscriptionExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
            maxMembers: 100, // Starter plan limits
            maxStaff: 5,
            featuresEnabled: ['basic_analytics', 'member_management', 'class_scheduling']
        });

        return this.tenantRepository.save(tenant);
    }

    async findAll(): Promise<Tenant[]> {
        return this.tenantRepository.find();
    }

    async findOne(id: string): Promise<Tenant> {
        const tenant = await this.tenantRepository.findOne({
            where: { id }
        });

        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    async findBySubdomain(subdomain: string): Promise<Tenant> {
        const tenant = await this.tenantRepository.findOne({
            where: { subdomain }
        });

        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
        const tenant = await this.findOne(id);
        
        Object.assign(tenant, updateTenantDto);
        
        return this.tenantRepository.save(tenant);
    }

    async updateSubscription(
        id: string,
        plan: SubscriptionPlan,
        expiresAt: Date
    ): Promise<Tenant> {
        const tenant = await this.findOne(id);
        
        tenant.subscriptionPlan = plan;
        tenant.subscriptionExpiresAt = expiresAt;
        
        // Update plan limits
        switch (plan) {
            case SubscriptionPlan.STARTER:
                tenant.maxMembers = 100;
                tenant.maxStaff = 5;
                tenant.featuresEnabled = ['basic_analytics', 'member_management', 'class_scheduling'];
                break;
            case SubscriptionPlan.PROFESSIONAL:
                tenant.maxMembers = 500;
                tenant.maxStaff = 20;
                tenant.featuresEnabled = [
                    'basic_analytics',
                    'advanced_analytics',
                    'member_management',
                    'class_scheduling',
                    'equipment_tracking',
                    'pos_integration'
                ];
                break;
            case SubscriptionPlan.ENTERPRISE:
                tenant.maxMembers = -1; // Unlimited
                tenant.maxStaff = -1; // Unlimited
                tenant.featuresEnabled = [
                    'basic_analytics',
                    'advanced_analytics',
                    'member_management',
                    'class_scheduling',
                    'equipment_tracking',
                    'pos_integration',
                    'custom_integrations',
                    'white_label',
                    'priority_support'
                ];
                break;
        }

        return this.tenantRepository.save(tenant);
    }

    async remove(id: string): Promise<void> {
        const tenant = await this.findOne(id);
        await this.tenantRepository.remove(tenant);
    }

    async validateFeatureAccess(tenantId: string, feature: string): Promise<boolean> {
        const tenant = await this.findOne(tenantId);
        return tenant.featuresEnabled.includes(feature);
    }

    async checkUsageLimit(tenantId: string, limitType: 'members' | 'staff'): Promise<boolean> {
        const tenant = await this.findOne(tenantId);
        
        if (tenant[`max${limitType.charAt(0).toUpperCase() + limitType.slice(1)}`] === -1) {
            return true; // Unlimited
        }

        // TODO: Implement actual usage counting
        return true;
    }
}
