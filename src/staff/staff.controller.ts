import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { Roles } from '../auth/roles.decorator';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Staff Management Endpoints
  @Get('members/:gymId')
  @Roles('admin')
  async getStaffMembers(@Param('gymId') gymId: string, @Query() filter: any) {
    return this.staffService.getStaffMembers(gymId, filter);
  }

  @Get('member/:id')
  @Roles('admin')
  async getStaffMemberById(@Param('id') id: string) {
    return this.staffService.getStaffMemberById(id);
  }

  @Post('member')
  @Roles('admin')
  async createStaffMember(@Body() data: any) {
    return this.staffService.createStaffMember(data);
  }

  @Put('member/:id')
  @Roles('admin')
  async updateStaffMember(@Param('id') id: string, @Body() data: any) {
    return this.staffService.updateStaffMember(id, data);
  }

  // Trainer Management Endpoints
  @Get('trainers/:gymId')
  async getTrainers(@Param('gymId') gymId: string, @Query() filter: any) {
    return this.staffService.getTrainers(gymId, filter);
  }

  @Get('trainer/:id')
  async getTrainerById(@Param('id') id: string) {
    return this.staffService.getTrainerById(id);
  }

  @Post('trainer')
  @Roles('admin')
  async createTrainer(@Body() data: any) {
    return this.staffService.createTrainer(data);
  }

  @Put('trainer/:id')
  @Roles('admin')
  async updateTrainer(@Param('id') id: string, @Body() data: any) {
    return this.staffService.updateTrainer(id, data);
  }

  // Schedule and Availability Endpoints
  @Get('trainers/available/:gymId')
  async getAvailableTrainers(
    @Param('gymId') gymId: string,
    @Query('date') date: Date,
  ) {
    return this.staffService.getAvailableTrainers(gymId, date);
  }

  @Get('trainer/:id/schedule')
  async getTrainerSchedule(
    @Param('id') id: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.staffService.getTrainerSchedule(id, startDate, endDate);
  }

  @Get('department/:id/schedule')
  @Roles('admin', 'manager')
  async getStaffSchedule(
    @Param('id') departmentId: string,
    @Query('date') date: Date,
  ) {
    return this.staffService.getStaffSchedule(departmentId, date);
  }

  @Put('trainer/:id/availability')
  @Roles('admin', 'trainer')
  async updateTrainerAvailability(
    @Param('id') id: string,
    @Body() availability: any,
  ) {
    return this.staffService.updateTrainerAvailability(id, availability);
  }

  @Put('member/:id/schedule')
  @Roles('admin', 'manager')
  async updateStaffSchedule(@Param('id') id: string, @Body() schedule: any) {
    return this.staffService.updateStaffSchedule(id, schedule);
  }

  // Certifications and Qualifications Endpoints
  @Put('trainer/:id/certifications')
  @Roles('admin', 'trainer')
  async updateTrainerCertifications(
    @Param('id') id: string,
    @Body() certifications: any[],
  ) {
    return this.staffService.updateTrainerCertifications(id, certifications);
  }

  @Get('trainers/expired-certifications/:gymId')
  @Roles('admin', 'manager')
  async getExpiredCertifications(@Param('gymId') gymId: string) {
    return this.staffService.getExpiredCertifications(gymId);
  }
}
