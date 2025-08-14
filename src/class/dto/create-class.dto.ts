import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ description: 'Name of the class' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'ID of the gym where the class is held' })
  @IsUUID()
  @IsNotEmpty()
  gymId: string;

  @ApiProperty({ description: 'ID of the instructor' })
  @IsUUID()
  @IsNotEmpty()
  instructorId: string;

  @ApiProperty({ description: 'Description of the class' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Maximum number of participants' })
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ description: 'Duration of the class in minutes' })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ description: 'Start time of the class' })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiPropertyOptional({ description: 'Equipment needed for the class' })
  @IsString()
  @IsOptional()
  equipment?: string;

  @ApiPropertyOptional({ description: 'Difficulty level of the class' })
  @IsString()
  @IsOptional()
  difficultyLevel?: string;
}
