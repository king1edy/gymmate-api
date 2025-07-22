import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StaffResponseDto {
  @ApiProperty({ description: 'Staff member ID' })
  id: string;

  @ApiProperty({ description: 'First name of the staff member' })
  firstName: string;

  @ApiProperty({ description: 'Last name of the staff member' })
  lastName: string;

  @ApiProperty({ description: 'Email of the staff member' })
  email: string;

  @ApiProperty({ description: 'Phone number of the staff member' })
  phoneNumber: string;

  @ApiProperty({ description: 'ID of the gym where the staff member works' })
  gymId: string;

  @ApiProperty({ description: 'Role of the staff member' })
  role: string;

  @ApiProperty({ description: 'Employment start date' })
  startDate: Date;

  @ApiPropertyOptional({ description: 'Employment end date' })
  endDate?: Date;

  @ApiProperty({ description: 'Hourly rate or salary' })
  payRate: number;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Any certifications held' })
  certifications?: string;

  @ApiProperty({ description: 'Date when the staff record was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the staff record was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether the staff member is active' })
  isActive: boolean;
}
