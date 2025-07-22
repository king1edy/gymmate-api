import { ApiProperty } from '@nestjs/swagger';

export class GymResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  logoUrl: string;

  @ApiProperty()
  timezone: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  businessHours: any;

  @ApiProperty()
  subscriptionPlan: string;

  @ApiProperty()
  subscriptionStatus: string;

  @ApiProperty()
  subscriptionExpiresAt: Date;

  @ApiProperty()
  maxMembers: number;

  @ApiProperty()
  featuresEnabled: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  onboardingCompleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
