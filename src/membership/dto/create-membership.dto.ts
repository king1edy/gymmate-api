import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ description: 'ID of the user this membership is for' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID of the gym this membership belongs to' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Type of membership' })
  @IsString()
  @IsNotEmpty()
  membershipType: string;

  @ApiProperty({ description: 'Start date of the membership' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'End date of the membership' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Cost of the membership' })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiPropertyOptional({
    description: 'Any special notes about the membership',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
