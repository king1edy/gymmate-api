import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EquipmentResponseDto {
  @ApiProperty({ description: 'Equipment ID' })
  id: string;

  @ApiProperty({ description: 'Name of the equipment' })
  name: string;

  @ApiProperty({ description: 'ID of the gym where the equipment is located' })
  gymId: string;

  @ApiProperty({ description: 'Type of equipment' })
  type: string;

  @ApiProperty({ description: 'Brand of the equipment' })
  brand: string;

  @ApiProperty({ description: 'Model number of the equipment' })
  modelNumber: string;

  @ApiPropertyOptional({ description: 'Serial number of the equipment' })
  serialNumber?: string;

  @ApiProperty({ description: 'Purchase date of the equipment' })
  purchaseDate: Date;

  @ApiProperty({ description: 'Purchase cost of the equipment' })
  purchaseCost: number;

  @ApiPropertyOptional({ description: 'Warranty expiration date' })
  warrantyExpiration?: Date;

  @ApiProperty({ description: 'Last maintenance date' })
  lastMaintenanceDate: Date;

  @ApiPropertyOptional({ description: 'Next scheduled maintenance date' })
  nextMaintenanceDate?: Date;

  @ApiProperty({ description: 'Status of the equipment' })
  status: string;

  @ApiPropertyOptional({ description: 'Notes about the equipment' })
  notes?: string;

  @ApiProperty({ description: 'Date when the equipment was created in the system' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the equipment was last updated' })
  updatedAt: Date;
}
