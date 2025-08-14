import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Promotion } from './promotion.entity';
import { LeadSource } from './lead-source.entity';
import { Lead } from './lead.entity';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(LeadSource)
    private leadSourceRepository: Repository<LeadSource>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  // Campaign Management
  async getCampaigns(tenantId: string) {
    return this.campaignRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['promotions'],
    });
  }

  async getCampaign(id: string) {
    return this.campaignRepository.findOne({
      where: { id },
      relations: ['promotions', 'tenant'],
    });
  }

  async createCampaign(data: any) {
    const campaign = this.campaignRepository.create(data);
    return this.campaignRepository.save(campaign);
  }

  async updateCampaign(id: string, data: any) {
    await this.campaignRepository.update(id, data);
    return this.getCampaign(id);
  }

  // Promotion Management
  async getPromotions(tenantId: string, filter: any = {}) {
    const now = new Date();
    const { startDate, endDate, tenant, ...safeFilter } = filter;
    return this.promotionRepository.find({
      where: {
        tenant: { id: tenantId },
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
        isActive: true,
        ...safeFilter,
      },
      relations: ['campaign'],
    });
  }

  async getPromotion(id: string) {
    return this.promotionRepository.findOne({
      where: { id },
      relations: ['campaign', 'gym'],
    });
  }

  async createPromotion(data: any) {
    const promotion = this.promotionRepository.create(data);
    return this.promotionRepository.save(promotion);
  }

  async updatePromotion(id: string, data: any) {
    await this.promotionRepository.update(id, data);
    return this.getPromotion(id);
  }

  // Lead Source Management
  async getLeadSources(tenantId: string) {
    return this.leadSourceRepository.find({
      where: { tenant: { id: tenantId } },
    });
  }

  async createLeadSource(data: any) {
    const source = this.leadSourceRepository.create(data);
    return this.leadSourceRepository.save(source);
  }

  // Lead Management
  async getLeads(tenantId: string, filter: any = {}) {
    return this.leadRepository.find({
      where: { tenant: { id: tenantId }, ...filter },
      relations: ['source', 'assignedTo'],
    });
  }

  async getLead(id: string) {
    return this.leadRepository.findOne({
      where: { id },
      relations: ['source', 'assignedTo', 'gym'],
    });
  }

  async createLead(data: any) {
    const lead = this.leadRepository.create(data);
    return this.leadRepository.save(lead);
  }

  async updateLead(id: string, data: any) {
    await this.leadRepository.update(id, data);
    return this.getLead(id);
  }

  // Marketing Analytics
  async getLeadSourceStats(tenantId: string, dateRange: any) {
    const { startDate, endDate } = dateRange;
    return this.leadRepository
      .createQueryBuilder('lead')
      .select('source.name', 'sourceName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('lead.status', 'status')
      .leftJoin('lead.source', 'source')
      .where('lead.gym.id = :tenantId', { tenantId })
      .andWhere('lead.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('source.name')
      .addGroupBy('lead.status')
      .getRawMany();
  }

  async getCampaignStats(campaignId: string) {
    const campaign = await this.getCampaign(campaignId);
    if (!campaign) return null;

    const leads = await this.leadRepository.find({
      where: { campaign: { id: campaignId } },
    });

    return {
      campaignName: campaign.name,
      totalLeads: leads.length,
      conversionRate:
        (leads.filter((l) => l.status === 'converted').length / leads.length) *
        100,
      // Add more metrics as needed
    };
  }
}