import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsEmail,
  IsObject,
  IsArray,
  IsBoolean,
  IsNumber,
  IsIn,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateGymDto {
  @ApiProperty({ example: 'Fitness Plus' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Gym Street' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'contact@fitnessplus.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'https://fitnessplus.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'https://fitnessplus.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({ example: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    example: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
    },
  })
  @IsObject()
  @IsOptional()
  businessHours?: any;

  @ApiProperty({
    example: 'starter',
    enum: ['starter', 'professional', 'enterprise'],
  })
  @IsString()
  @IsIn(['starter', 'professional', 'enterprise'])
  @IsOptional()
  subscriptionPlan?: string;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'pending', 'cancelled'],
  })
  @IsString()
  @IsIn(['active', 'inactive', 'pending', 'cancelled'])
  @IsOptional()
  subscriptionStatus?: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  subscriptionExpiresAt?: Date;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @IsOptional()
  maxMembers?: number;

  @ApiProperty({ example: ['online_booking', 'member_app', 'reporting'] })
  @IsArray()
  @IsOptional()
  featuresEnabled?: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  onboardingCompleted?: boolean;
}
