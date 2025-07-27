import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { GymResponseDto } from './dto/gym-response.dto';
import { GymService } from './gym.service';

@ApiTags('gyms')
@ApiBearerAuth()
@Controller('gyms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new gym' })
  @ApiResponse({
    status: 201,
    description: 'Gym created successfully',
    type: GymResponseDto,
  })
  async create(@Body() createGymDto: CreateGymDto): Promise<GymResponseDto> {
    return this.gymService.create(createGymDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all gyms' })
  @ApiResponse({
    status: 200,
    description: 'Return all gyms',
    type: [GymResponseDto],
  })
  async findAll(): Promise<GymResponseDto[]> {
    return this.gymService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gym by id' })
  @ApiResponse({
    status: 200,
    description: 'Return found gym',
    type: GymResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<GymResponseDto> {
    return this.gymService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update gym' })
  @ApiResponse({
    status: 200,
    description: 'Gym updated successfully',
    type: GymResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateGymDto: UpdateGymDto,
  ): Promise<GymResponseDto> {
    return this.gymService.update(id, updateGymDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete gym' })
  @ApiResponse({ status: 200, description: 'Gym deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.gymService.remove(id);
  }
}
