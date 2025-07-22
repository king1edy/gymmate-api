import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateEquipmentDto {
  @ApiPropertyOptional({ description: 'Name of the equipment' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Type of equipment' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Brand of the equipment' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ description: 'Model number of the equipment' })
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @ApiPropertyOptional({ description: 'Serial number of the equipment' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Last maintenance date' })
  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: Date;

  @ApiPropertyOptional({ description: 'Next scheduled maintenance date' })
  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: Date;

  @ApiPropertyOptional({ description: 'Status of the equipment' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Notes about the equipment' })
  @IsString()
  @IsOptional()
  notes?: string;
}
