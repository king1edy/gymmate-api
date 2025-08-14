import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateMembershipDto {
  @ApiPropertyOptional({ description: 'Type of membership' })
  @IsString()
  @IsOptional()
  membershipType?: string;

  @ApiPropertyOptional({ description: 'End date of the membership' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Cost of the membership' })
  @IsNumber()
  @IsOptional()
  cost?: number;

  @ApiPropertyOptional({ description: 'Status of the membership' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Any special notes about the membership',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
