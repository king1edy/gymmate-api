import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsArray } from 'class-validator';

export class UpdateCampaignDto {
  @ApiPropertyOptional({ description: 'Name of the marketing campaign' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the campaign' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'End date of the campaign' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Type of campaign' })
  @IsString()
  @IsOptional()
  type?: string;

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
