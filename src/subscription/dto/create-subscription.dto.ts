import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsDate, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum PlanName {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export class CreateSubscriptionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  gymId: string;

  @ApiProperty({ enum: PlanName, example: PlanName.STARTER })
  @IsEnum(PlanName)
  planName: PlanName;

  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ example: '2025-07-22' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2026-07-22' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  autoRenew: boolean;

  @ApiProperty({ example: ['online_booking', 'member_app', 'reporting'] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ example: 200 })
  @IsNumber()
  maxMembers: number;
}
