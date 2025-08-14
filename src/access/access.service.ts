import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessControl } from './access-control.entity';
import { AccessLog } from './access-log.entity';
import { AccessCard } from './access-card.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessControl)
    private accessControlRepository: Repository<AccessControl>,
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(AccessCard)
    private accessCardRepository: Repository<AccessCard>,
  ) {}

  // Access Points Management
  async getAccessPoints(tenantId: string) {
    return this.accessControlRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['area'],
    });
  }

  async getAccessPoint(id: string) {
    return this.accessControlRepository.findOne({
      where: { id },
      relations: ['area', 'gym'],
    });
  }

  async createAccessPoint(data: any) {
    const accessPoint = this.accessControlRepository.create(data);
    return this.accessControlRepository.save(accessPoint);
  }

  async updateAccessPoint(id: string, data: any) {
    await this.accessControlRepository.update(id, data);
    return this.getAccessPoint(id);
  }

  // Access Cards Management
  async getAccessCards(filter: any = {}) {
    return this.accessCardRepository.find({
      where: filter,
      relations: ['member', 'member.user'],
    });
  }

  async getAccessCard(id: string) {
    return this.accessCardRepository.findOne({
      where: { id },
      relations: ['member', 'member.user'],
    });
  }

  async createAccessCard(data: any) {
    const card = this.accessCardRepository.create(data);
    return this.accessCardRepository.save(card);
  }

  async updateAccessCard(id: string, data: any) {
    await this.accessCardRepository.update(id, data);
    return this.getAccessCard(id);
  }

  async deactivateAccessCard(id: string, reason: string) {
    return this.updateAccessCard(id, {
      isActive: false,
      deactivationReason: reason,
      deactivatedAt: new Date(),
    });
  }

  // Access Logs Management
  async getAccessLogs(filter: any = {}, pagination: any = {}) {
    const { skip = 0, take = 50 } = pagination;
    return this.accessLogRepository.find({
      where: filter,
      relations: ['accessPoint', 'member', 'member.user'],
      skip,
      take,
      order: { timestamp: 'DESC' },
    });
  }

  async logAccess(data: any) {
    const log = this.accessLogRepository.create(data);
    return this.accessLogRepository.save(log);
  }

  // Access Control Functions
  async validateAccess(cardId: string, accessPointId: string) {
    const card = await this.accessCardRepository.findOne({
      where: { cardId },
      relations: ['member', 'member.user'],
    });

    if (!card || !card.isActive) {
      return { allowed: false, reason: 'Invalid or inactive card' };
    }

    const accessPoint = await this.accessControlRepository.findOne({
      where: { id: accessPointId },
      relations: ['area'],
    });

    if (!accessPoint || !accessPoint.isActive) {
      return { allowed: false, reason: 'Invalid or inactive access point' };
    }

    // Log the access attempt
    await this.logAccess({
      accessPoint,
      member: card.member,
      cardId: card.cardId,
      isSuccessful: true,
      timestamp: new Date(),
    });

    return { allowed: true };
  }

  async getAccessHistory(memberId: string, filter: any = {}) {
    return this.accessLogRepository.find({
      where: { member: { id: memberId }, ...filter },
      relations: ['accessPoint'],
      order: { timestamp: 'DESC' },
    });
  }
}
