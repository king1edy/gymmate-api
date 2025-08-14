import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { Tenant } from '../tenant/tenant.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: createSubscriptionDto.tenantId },
    });
    if (!tenant) {
      throw new NotFoundException(
        `Tenant with ID ${createSubscriptionDto.tenantId} not found`,
      );
    }

    // Check if tenant already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        tenant: { id: createSubscriptionDto.tenantId },
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('Tenant already has an active subscription');
    }

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      tenant,
    });

    await this.subscriptionRepository.save(subscription);
    return this.toResponseDto(subscription);
  }

  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['tenant'],
    });
    return subscriptions.map((subscription) =>
      this.toResponseDto(subscription),
    );
  }

  async findOne(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return this.toResponseDto(subscription);
  }

  async findByTenantId(tenantId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { tenant: { id: tenantId } },
      relations: ['tenant'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription not found for tenant ID ${tenantId}`);
    }
    return this.toResponseDto(subscription);
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    const updatedSubscription = this.subscriptionRepository.merge(
      subscription,
      updateSubscriptionDto,
    );
    await this.subscriptionRepository.save(updatedSubscription);
    return this.toResponseDto(updatedSubscription);
  }

  async cancel(id: string, reason: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    subscription.status = 'cancelled';
    subscription.canceledAt = new Date();
    subscription.cancelReason = reason;
    subscription.autoRenew = false;

    await this.subscriptionRepository.save(subscription);
    return this.toResponseDto(subscription);
  }

  async remove(id: string): Promise<void> {
    const result = await this.subscriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
  }

  private toResponseDto(subscription: Subscription): SubscriptionResponseDto {
    const responseDto = new SubscriptionResponseDto();
    Object.assign(responseDto, {
      ...subscription,
      tenantId: subscription.tenant.id,
    });
    delete responseDto['tenant'];
    return responseDto;
  }
}
