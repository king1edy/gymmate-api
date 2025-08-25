import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  IsUUID,
  IsDate,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { UserType, UserStatus } from '../../types/interfaces';

export class CreateUserDto {
  @ApiProperty({ description: 'Tenant ID this user belongs to' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'User date of birth' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date | null;

  @ApiPropertyOptional({ description: 'User address' })
  @IsString()
  @IsOptional()
  address?: string | null;

  @ApiPropertyOptional({ description: 'User gender' })
  @IsString()
  @IsOptional()
  gender?: string | null;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  @IsString()
  @IsOptional()
  avatarUrl?: string | null;

  @ApiPropertyOptional({
    description: 'User type',
    enum: UserType,
    default: UserType.MEMBER,
  })
  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType = UserType.MEMBER;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus = UserStatus.PENDING_VERIFICATION;

  @ApiPropertyOptional({
    description: 'Whether email is verified',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean = false;

  @ApiPropertyOptional({ description: 'Whether user is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
