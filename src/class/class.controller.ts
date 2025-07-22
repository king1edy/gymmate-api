import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ClassService } from './class.service';

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
  async getSchedules(
    @Query('gymId') gymId: string,
    @Query() filter: any,
  ) {
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
  async getGymAreas(@Query('gymId') gymId: string) {
    return this.classService.getGymAreas(gymId);
  }

  @Get('categories')
  @Roles('admin', 'staff', 'trainer', 'member')
  async getCategories(@Query('gymId') gymId: string) {
    return this.classService.getCategories(gymId);
  }
}
