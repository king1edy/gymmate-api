import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ description: 'Name of the marketing campaign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the gym this campaign belongs to' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Description of the campaign' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Start date of the campaign' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'End date of the campaign' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Type of campaign' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ description: 'Target audience for the campaign' })
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Channels used for the campaign' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  channels?: string[];

  @ApiPropertyOptional({ description: 'Budget allocated for the campaign' })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiPropertyOptional({ description: 'Goals of the campaign' })
  @IsString()
  @IsOptional()
  goals?: string;

  @ApiPropertyOptional({ description: 'Additional notes about the campaign' })
  @IsString()
  @IsOptional()
  notes?: string;
}
