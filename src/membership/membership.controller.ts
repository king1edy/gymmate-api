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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MembershipService } from './membership.service';

@Controller('membership')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('members')
  @Roles('admin', 'staff')
  async getMembers(@Query('gymId') gymId: string, @Query() filter: any) {
    return this.membershipService.getMembers(gymId, filter);
  }

  @Get('members/:id')
  @Roles('admin', 'staff')
  async getMember(@Param('id') id: string) {
    return this.membershipService.getMemberById(id);
  }

  @Post('members')
  @Roles('admin', 'staff')
  async createMember(@Body() data: any) {
    return this.membershipService.createMember(data);
  }

  @Put('members/:id')
  @Roles('admin', 'staff')
  async updateMember(@Param('id') id: string, @Body() data: any) {
    return this.membershipService.updateMember(id, data);
  }

  @Get('plans')
  @Roles('admin', 'staff', 'member')
  async getPlans(@Query('gymId') gymId: string) {
    return this.membershipService.getPlans(gymId);
  }

  @Get('plans/:id')
  @Roles('admin', 'staff', 'member')
  async getPlan(@Param('id') id: string) {
    return this.membershipService.getPlanById(id);
  }

  @Post('plans')
  @Roles('admin')
  async createPlan(@Body() data: any) {
    return this.membershipService.createPlan(data);
  }

  @Put('plans/:id')
  @Roles('admin')
  async updatePlan(@Param('id') id: string, @Body() data: any) {
    return this.membershipService.updatePlan(id, data);
  }

  @Get('members/:memberId/memberships')
  @Roles('admin', 'staff', 'member')
  async getMemberMemberships(@Param('memberId') memberId: string) {
    return this.membershipService.getMemberMemberships(memberId);
  }

  @Post('members/:memberId/memberships')
  @Roles('admin', 'staff')
  async createMembership(
    @Param('memberId') memberId: string,
    @Body() data: any,
  ) {
    return this.membershipService.createMembership({
      ...data,
      member: { id: memberId },
    });
  }

  @Put('members/:memberId/memberships/:id')
  @Roles('admin', 'staff')
  async updateMembership(@Param('id') id: string, @Body() data: any) {
    return this.membershipService.updateMembership(id, data);
  }
}
