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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AccessService } from './access.service';

@Controller('access')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  // Access Points Endpoints
  @Get('points/:gymId')
  @Roles('admin', 'staff')
  async getAccessPoints(@Param('gymId') gymId: string) {
    return this.accessService.getAccessPoints(gymId);
  }

  @Get('point/:id')
  @Roles('admin', 'staff')
  async getAccessPoint(@Param('id') id: string) {
    return this.accessService.getAccessPoint(id);
  }

  @Post('point')
  @Roles('admin')
  async createAccessPoint(@Body() data: any) {
    return this.accessService.createAccessPoint(data);
  }

  @Put('point/:id')
  @Roles('admin')
  async updateAccessPoint(@Param('id') id: string, @Body() data: any) {
    return this.accessService.updateAccessPoint(id, data);
  }

  // Access Cards Endpoints
  @Get('cards')
  @Roles('admin', 'staff')
  async getAccessCards(@Query() filter: any) {
    return this.accessService.getAccessCards(filter);
  }

  @Get('card/:id')
  @Roles('admin', 'staff')
  async getAccessCard(@Param('id') id: string) {
    return this.accessService.getAccessCard(id);
  }

  @Post('card')
  @Roles('admin', 'staff')
  async createAccessCard(@Body() data: any) {
    return this.accessService.createAccessCard(data);
  }

  @Put('card/:id')
  @Roles('admin', 'staff')
  async updateAccessCard(@Param('id') id: string, @Body() data: any) {
    return this.accessService.updateAccessCard(id, data);
  }

  @Put('card/:id/deactivate')
  @Roles('admin', 'staff')
  async deactivateAccessCard(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.accessService.deactivateAccessCard(id, reason);
  }

  // Access Logs Endpoints
  @Get('logs')
  @Roles('admin', 'staff')
  async getAccessLogs(
    @Query() filter: any,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return this.accessService.getAccessLogs(filter, { skip, take });
  }

  @Post('validate')
  async validateAccess(
    @Body('cardId') cardId: string,
    @Body('accessPointId') accessPointId: string,
  ) {
    return this.accessService.validateAccess(cardId, accessPointId);
  }

  @Get('history/:memberId')
  @Roles('admin', 'staff', 'member')
  async getAccessHistory(
    @Param('memberId') memberId: string,
    @Query() filter: any,
  ) {
    return this.accessService.getAccessHistory(memberId, filter);
  }
}
