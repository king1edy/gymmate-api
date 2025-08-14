import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsEmail,
} from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'First name of the staff member' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the staff member' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email of the staff member' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the staff member' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'ID of the gym where the staff member works' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Role of the staff member' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ description: 'Employment start date' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiPropertyOptional({ description: 'Employment end date' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ description: 'Hourly rate or salary' })
  @IsNumber()
  @IsNotEmpty()
  payRate: number;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Any certifications held' })
  @IsString()
  @IsOptional()
  certifications?: string;
}
