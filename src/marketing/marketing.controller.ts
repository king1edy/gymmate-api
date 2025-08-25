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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MarketingService } from './marketing.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags(
  'Marketing - Marketing Management Endpoints (Campaigns, Promotions, Lead Sources, Leads, Analytics)',
)
@Controller('marketing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // Campaign Endpoints
  @Get('campaigns/:gymId')
  @Roles('admin', 'staff')
  async getCampaigns(@Param('gymId') gymId: string) {
    return this.marketingService.getCampaigns(gymId);
  }

  @Get('campaign/:id')
  @Roles('admin', 'staff')
  async getCampaign(@Param('id') id: string) {
    return this.marketingService.getCampaign(id);
  }

  @Post('campaign')
  @Roles('admin')
  async createCampaign(@Body() data: CreateCampaignDto) {
    return this.marketingService.createCampaign(data);
  }

  @Put('campaign/:id')
  @Roles('admin')
  async updateCampaign(@Param('id') id: string, @Body() data: any) {
    return this.marketingService.updateCampaign(id, data);
  }

  // Promotion Endpoints
  @Get('promotions/:gymId')
  @Roles('admin', 'staff')
  async getPromotions(@Param('gymId') gymId: string, @Query() filter: any) {
    return this.marketingService.getPromotions(gymId, filter);
  }

  @Get('promotion/:id')
  @Roles('admin', 'staff')
  async getPromotion(@Param('id') id: string) {
    return this.marketingService.getPromotion(id);
  }

  @Post('promotion')
  @Roles('admin')
  async createPromotion(@Body() data: any) {
    return this.marketingService.createPromotion(data);
  }

  @Put('promotion/:id')
  @Roles('admin')
  async updatePromotion(@Param('id') id: string, @Body() data: any) {
    return this.marketingService.updatePromotion(id, data);
  }

  // Lead Source Endpoints
  @Get('lead-sources/:gymId')
  @Roles('admin', 'staff')
  async getLeadSources(@Param('gymId') gymId: string) {
    return this.marketingService.getLeadSources(gymId);
  }

  @Post('lead-source')
  @Roles('admin')
  async createLeadSource(@Body() data: any) {
    return this.marketingService.createLeadSource(data);
  }

  // Lead Management Endpoints
  @Get('leads/:gymId')
  @Roles('admin', 'staff')
  async getLeads(@Param('gymId') gymId: string, @Query() filter: any) {
    return this.marketingService.getLeads(gymId, filter);
  }

  @Get('lead/:id')
  @Roles('admin', 'staff')
  async getLead(@Param('id') id: string) {
    return this.marketingService.getLead(id);
  }

  @Post('lead')
  @Roles('admin', 'staff')
  async createLead(@Body() data: any) {
    return this.marketingService.createLead(data);
  }

  @Put('lead/:id')
  @Roles('admin', 'staff')
  async updateLead(@Param('id') id: string, @Body() data: any) {
    return this.marketingService.updateLead(id, data);
  }

  // Analytics Endpoints
  @Get('analytics/lead-sources/:gymId')
  @Roles('admin')
  async getLeadSourceStats(
    @Param('gymId') gymId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.marketingService.getLeadSourceStats(gymId, {
      startDate,
      endDate,
    });
  }

  @Get('analytics/campaign/:id')
  @Roles('admin')
  async getCampaignStats(@Param('id') campaignId: string) {
    return this.marketingService.getCampaignStats(campaignId);
  }
}
