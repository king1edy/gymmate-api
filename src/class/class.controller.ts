import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClassService } from './class.service';

@ApiTags('Classes - Class Management Endpoints (Schedules, Bookings, Areas, Categories)')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  @Roles('admin', 'staff', 'trainer', 'member')
  async getClasses(@Query('gymId') gymId: string) {
    return this.classService.getClasses(gymId);
  }

  @Get(':id')
  @Roles('admin', 'staff', 'trainer', 'member')
  async getClass(@Param('id') id: string) {
    return this.classService.getClassById(id);
  }

  @Post()
  @Roles('admin')
  async createClass(@Body() data: any) {
    return this.classService.createClass(data);
  }

  @Get('schedule')
  @Roles('admin', 'staff', 'trainer', 'member')
  async getSchedules(@Query('gymId') gymId: string, @Query() filter: any) {
    return this.classService.getSchedules(gymId, filter);
  }

  @Get('bookings/:scheduleId')
  @Roles('admin', 'staff', 'trainer')
  async getBookings(@Param('scheduleId') scheduleId: string) {
    return this.classService.getBookings(scheduleId);
  }

  @Post('bookings')
  @Roles('admin', 'staff', 'member')
  async createBooking(@Body() data: any) {
    return this.classService.createBooking(data);
  }

  @Get('areas')
  @Roles('admin', 'staff', 'trainer', 'member')
  async getTenantAreas(@Query('gymId') gymId: string) {
    return this.classService.getTenantAreas(gymId);
  }

  @Get('categories')
  @Roles('admin', 'staff', 'trainer', 'member')
  async getCategories(@Query('gymId') gymId: string) {
    return this.classService.getCategories(gymId);
  }

  // Additional endpoints for class waitlists, categories, and areas can be added here

  // update class, schedule, booking, and waitlist methods can be added similarly
  @Put(':id')
  @Roles('admin')
  async updateClass(@Param('id') id: string, @Body() data: any) {
    return this.classService.updateClass(id, data);
  }
}
