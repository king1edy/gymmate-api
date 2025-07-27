import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ description: 'Name of the equipment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the gym where the equipment is located' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'Type of equipment' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Brand of the equipment' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Model number of the equipment' })
  @IsString()
  @IsNotEmpty()
  modelNumber: string;

  @ApiPropertyOptional({ description: 'Serial number of the equipment' })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({ description: 'Purchase date of the equipment' })
  @IsDateString()
  @IsNotEmpty()
  purchaseDate: Date;

  @ApiProperty({ description: 'Purchase cost of the equipment' })
  @IsNumber()
  @IsNotEmpty()
  purchaseCost: number;

  @ApiPropertyOptional({ description: 'Warranty expiration date' })
  @IsDateString()
  @IsOptional()
  warrantyExpiration?: Date;

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
