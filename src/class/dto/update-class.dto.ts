import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateClassDto {
  @ApiPropertyOptional({ description: 'Name of the class' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the class' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Maximum number of participants' })
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Duration of the class in minutes' })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ description: 'Start time of the class' })
  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @ApiPropertyOptional({ description: 'Equipment needed for the class' })
  @IsString()
  @IsOptional()
  equipment?: string;

  @ApiPropertyOptional({ description: 'Difficulty level of the class' })
  @IsString()
  @IsOptional()
  difficultyLevel?: string;
}
