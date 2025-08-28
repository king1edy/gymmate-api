// src/types/interfaces/index.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectLiteral,
  Column,
} from 'typeorm';

// Base Interfaces
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class AuditEntity extends BaseEntity {
  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'varchar', nullable: true })
  updatedBy: string;
}

// Tenant
// Base interface for tenant-aware entities
export interface TenantAwareEntity extends ObjectLiteral {
  tenantId: string;
}

// Staff
export interface StaffSchedule {
  id: string;
  staffId: number;

  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface StaffFilter {
  isActive?: boolean;
  department?: string;
}

export interface TrainerFilter {
  isActive?: boolean;
  isAcceptingClients?: boolean;
}

export interface Certification {
  name: string;
  issuedDate: Date;
  expiryDate: Date;
  issuingBody: string;
}

export interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Availability {
  dayOfWeek: number;
  slots: { start: string; end: string }[];
}

// JWT settings
export interface JwtPayload {
  sub: string;
  preferred_username: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions?: string[];
  member_id?: string;
  staff_id?: string;

  // Optional fields for additional claims
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
}

// User
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum UserType {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  STAFF = 'staff',
  GUEST = 'guest',
  MANAGER = 'manager',
  TRAINER = 'trainer',
  MEMBER = 'member',
}

// Role and Permission
export interface Permission {
  id: string;
  name: string;
  description?: string;
}
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}
export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: string[];
}
export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: string[];
}
export interface AssignRoleDto {
  userId: string;
  roleIds: string[];
}
export interface RemoveRoleDto {
  userId: string;
  roleIds: string[];
}
export interface RoleFilter {
  name?: string;
}
export interface PermissionFilter {
  name?: string;
}

// Marketing promotions filters
export interface CampaignFilter {
  status?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  minBudget?: number;
  maxBudget?: number;
}

export interface PromotionFilter {
  type?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  minDiscountAmount?: number;
  maxDiscountAmount?: number;
}
export interface LeadFilter {
  source?: string;
  status?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  minValue?: number;
  maxValue?: number;
}
export interface PromotionRedemptionFilter {
  promotionId?: string;
  memberId?: string;
  redeemedFrom?: Date;
  redeemedTo?: Date;
  status?: string;
}

// Inventory
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// Equipment
export interface EquipmentFilter {
  category?: string;
  status?: string;
  areaId?: string;
  minConditionRating?: number;
  maxConditionRating?: number;
}

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

export interface BillingInfo {
  stripeCustomerId?: string;
  defaultPaymentMethod?: string;
  billingEmail?: string;
  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  taxId?: string;
}

// Events - Base Event Interface
export interface BaseEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: Date;
  data: any;
  metadata?: {
    userId?: string;
    tenantId?: string;
    correlationId?: string;
    causationId?: string;
  };
}

// Specific Registration Events
export interface GymTenantRegisteredEvent extends BaseEvent {
  type: 'GymTenantRegistered';
  aggregateType: 'Tenant';
  data: {
    tenantId: string;
    name: string;
    email: string;
    subscriptionPlan: string;
    ownerInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface MemberRegisteredEvent extends BaseEvent {
  type: 'MemberRegistered';
  aggregateType: 'Member';
  data: {
    memberId: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    membershipTypeId: string;
    joinDate: string;
  };
}

export interface StaffRegisteredEvent extends BaseEvent {
  type: 'StaffRegistered';
  aggregateType: 'Staff';
  data: {
    staffId: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isTrainer: boolean;
  };
}
