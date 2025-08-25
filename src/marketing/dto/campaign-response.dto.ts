import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty({ description: 'Campaign ID' })
  id: string;

  @ApiProperty({ description: 'Name of the marketing campaign' })
  name: string;

  @ApiProperty({
    description: 'ID of the tenant - gym this campaign belongs to',
  })
  tenantId: string;

  @ApiProperty({ description: 'Description of the campaign' })
  description: string;

  @ApiProperty({ description: 'Start date of the campaign' })
  startDate: Date;

  @ApiProperty({ description: 'End date of the campaign' })
  endDate: Date;

  @ApiProperty({ description: 'Type of campaign' })
  type: string;

  @ApiPropertyOptional({ description: 'Target audience for the campaign' })
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Channels used for the campaign' })
  channels?: string[];

  @ApiPropertyOptional({ description: 'Budget allocated for the campaign' })
  budget?: string;

  @ApiPropertyOptional({ description: 'Goals of the campaign' })
  goals?: string;

  @ApiPropertyOptional({ description: 'Additional notes about the campaign' })
  notes?: string;

  @ApiProperty({ description: 'Current status of the campaign' })
  status: string;

  @ApiProperty({ description: 'Date when the campaign was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the campaign was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the campaign is active' })
  isActive: boolean;
}
