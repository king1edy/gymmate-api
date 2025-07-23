import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully', type: SubscriptionResponseDto })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiResponse({ status: 200, description: 'Return all subscriptions', type: [SubscriptionResponseDto] })
  async findAll(): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionService.findAll();
  }

  @Get('gym/:gymId')
  @ApiOperation({ summary: 'Get subscription by gym ID' })
  @ApiResponse({ status: 200, description: 'Return subscription for gym', type: SubscriptionResponseDto })
  async findByGymId(@Param('gymId') gymId: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.findByGymId(gymId);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiResponse({ status: 200, description: 'Return found subscription', type: SubscriptionResponseDto })
  async findOne(@Param('id') id: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiResponse({ status: 200, description: 'Subscription updated successfully', type: SubscriptionResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Put(':id/cancel')
  @Roles('admin')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully', type: SubscriptionResponseDto })
  async cancel(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.cancel(id, reason);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete subscription' })
  @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.subscriptionService.remove(id);
  }
}
