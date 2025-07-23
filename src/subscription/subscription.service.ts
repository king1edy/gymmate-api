import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { Gym } from '../gym/gym.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const gym = await this.gymRepository.findOne({ where: { id: createSubscriptionDto.gymId }});
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${createSubscriptionDto.gymId} not found`);
    }

    // Check if gym already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        gym: { id: createSubscriptionDto.gymId },
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('Gym already has an active subscription');
    }

    const subscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      gym,
    });

    await this.subscriptionRepository.save(subscription);
    return this.toResponseDto(subscription);
  }

  async findAll(): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['gym'],
    });
    return subscriptions.map(subscription => this.toResponseDto(subscription));
  }

  async findOne(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['gym'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }
    return this.toResponseDto(subscription);
  }

  async findByGymId(gymId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { gym: { id: gymId } },
      relations: ['gym'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription not found for gym ID ${gymId}`);
    }
    return this.toResponseDto(subscription);
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['gym'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    const updatedSubscription = this.subscriptionRepository.merge(subscription, updateSubscriptionDto);
    await this.subscriptionRepository.save(updatedSubscription);
    return this.toResponseDto(updatedSubscription);
  }

  async cancel(id: string, reason: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['gym'],
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
      gymId: subscription.gym.id,
    });
    delete responseDto['gym'];
    return responseDto;
  }
}
