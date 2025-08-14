import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MembershipResponseDto {
  @ApiProperty({ description: 'Membership ID' })
  id: string;

  @ApiProperty({ description: 'ID of the user this membership is for' })
  userId: string;

  @ApiProperty({ description: 'ID of the gym this membership belongs to' })
  gymId: string;

  @ApiProperty({ description: 'Type of membership' })
  membershipType: string;

  @ApiProperty({ description: 'Start date of the membership' })
  startDate: Date;

  @ApiProperty({ description: 'End date of the membership' })
  endDate: Date;

  @ApiProperty({ description: 'Cost of the membership' })
  cost: number;

  @ApiProperty({ description: 'Status of the membership' })
  status: string;

  @ApiPropertyOptional({
    description: 'Any special notes about the membership',
  })
  notes?: string;

  @ApiProperty({ description: 'Date when the membership was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the membership was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the membership is active' })
  isActive: boolean;
}
