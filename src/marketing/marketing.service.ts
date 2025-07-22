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
  async getCampaigns(gymId: string) {
    return this.campaignRepository.find({
      where: { gym: { id: gymId } },
      relations: ['promotions'],
    });
  }

  async getCampaign(id: string) {
    return this.campaignRepository.findOne({
      where: { id },
      relations: ['promotions', 'gym'],
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
  async getPromotions(gymId: string, filter: any = {}) {
    const now = new Date();
    return this.promotionRepository.find({
      where: {
        gym: { id: gymId },
        ...filter,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
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
  async getLeadSources(gymId: string) {
    return this.leadSourceRepository.find({
      where: { gym: { id: gymId } },
    });
  }

  async createLeadSource(data: any) {
    const source = this.leadSourceRepository.create(data);
    return this.leadSourceRepository.save(source);
  }

  // Lead Management
  async getLeads(gymId: string, filter: any = {}) {
    return this.leadRepository.find({
      where: { gym: { id: gymId }, ...filter },
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
  async getLeadSourceStats(gymId: string, dateRange: any) {
    const { startDate, endDate } = dateRange;
    return this.leadRepository
      .createQueryBuilder('lead')
      .select('source.name', 'sourceName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('lead.status', 'status')
      .leftJoin('lead.source', 'source')
      .where('lead.gym.id = :gymId', { gymId })
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
      conversionRate: (leads.filter(l => l.status === 'converted').length / leads.length) * 100,
      // Add more metrics as needed
    };
  }
}
