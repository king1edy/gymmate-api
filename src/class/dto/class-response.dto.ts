import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassResponseDto {
  @ApiProperty({ description: 'Class ID' })
  id: string;

  @ApiProperty({ description: 'Name of the class' })
  name: string;

  @ApiProperty({ description: 'ID of the gym where the class is held' })
  gymId: string;

  @ApiProperty({ description: 'ID of the instructor' })
  instructorId: string;

  @ApiProperty({ description: 'Description of the class' })
  description: string;

  @ApiProperty({ description: 'Maximum number of participants' })
  capacity: number;

  @ApiProperty({ description: 'Duration of the class in minutes' })
  duration: number;

  @ApiProperty({ description: 'Start time of the class' })
  startTime: Date;

  @ApiPropertyOptional({ description: 'Equipment needed for the class' })
  equipment?: string;

  @ApiPropertyOptional({ description: 'Difficulty level of the class' })
  difficultyLevel?: string;

  @ApiProperty({ description: 'Current number of participants' })
  currentParticipants: number;

  @ApiProperty({ description: 'Status of the class' })
  status: string;

  @ApiProperty({ description: 'Date when the class was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the class was last updated' })
  updatedAt: Date;
}
