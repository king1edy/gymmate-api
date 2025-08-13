// src/types/interfaces/index.ts

// Staff
export interface StaffSchedule {
  id: number;
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
  email: string;
  roles: string[];
  tenantId: string;
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
