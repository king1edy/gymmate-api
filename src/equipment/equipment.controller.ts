import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EquipmentService } from './equipment.service';

@ApiTags('Equipment - Equipment Management Endpoints (Maintenance, Categories, Inventory)')
@Controller('equipment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @Roles('admin', 'staff')
  async getEquipment(@Query('gymId') gymId: string, @Query() filter: any) {
    return this.equipmentService.getEquipment(gymId, filter);
  }

  @Get(':id')
  @Roles('admin', 'staff')
  async getEquipmentById(@Param('id') id: string) {
    return this.equipmentService.getEquipmentById(id);
  }

  @Post()
  @Roles('admin')
  async createEquipment(@Body() data: any) {
    return this.equipmentService.createEquipment(data);
  }

  @Put(':id')
  @Roles('admin')
  async updateEquipment(@Param('id') id: string, @Body() data: any) {
    return this.equipmentService.updateEquipment(id, data);
  }

  @Get('categories')
  @Roles('admin', 'staff')
  async getCategories(@Query('gymId') gymId: string) {
    return this.equipmentService.getCategories(gymId);
  }

  @Post('categories')
  @Roles('admin')
  async createCategory(@Body() data: any) {
    return this.equipmentService.createCategory(data);
  }

  @Get(':id/maintenance')
  @Roles('admin', 'staff')
  async getMaintenanceHistory(@Param('id') id: string) {
    return this.equipmentService.getMaintenanceHistory(id);
  }

  @Post(':id/maintenance')
  @Roles('admin', 'staff')
  async logMaintenance(@Param('id') id: string, @Body() data: any) {
    return this.equipmentService.logMaintenance({
      ...data,
      equipment: { id },
    });
  }

  @Get('maintenance/upcoming')
  @Roles('admin', 'staff')
  async getUpcomingMaintenance(@Query('gymId') gymId: string) {
    return this.equipmentService.getUpcomingMaintenance(gymId);
  }
}
