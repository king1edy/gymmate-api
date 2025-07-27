import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { MembershipPlan } from './membership-plan.entity';
import { MemberMembership } from './member-membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(MembershipPlan)
    private planRepository: Repository<MembershipPlan>,
    @InjectRepository(MemberMembership)
    private membershipRepository: Repository<MemberMembership>,
  ) {}

  async getMembers(gymId: string, filter: any = {}) {
    return this.memberRepository.find({
      where: { user: { tenantId: gymId }, ...filter },
      relations: ['user'],
    });
  }

  async getMemberById(id: string) {
    return this.memberRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createMember(data: any) {
    const member = this.memberRepository.create(data);
    return this.memberRepository.save(member);
  }

  async updateMember(id: string, data: any) {
    await this.memberRepository.update(id, data);
    return this.getMemberById(id);
  }

  async getPlans(gymId: string) {
    return this.planRepository.find({
      where: { tenantId: gymId },
    });
  }

  async getPlanById(id: string) {
    return this.planRepository.findOne({
      where: { id },
      relations: [],
    });
  }

  async createPlan(data: any) {
    const plan = this.planRepository.create(data);
    return this.planRepository.save(plan);
  }

  async updatePlan(id: string, data: any) {
    await this.planRepository.update(id, data);
    return this.getPlanById(id);
  }

  async getMemberMemberships(memberId: string) {
    return this.membershipRepository.find({
      where: { member: { id: memberId } },
      relations: ['membershipPlan'],
    });
  }

  async createMembership(data: any) {
    const membership = this.membershipRepository.create(data);
    return this.membershipRepository.save(membership);
  }

  async updateMembership(id: string, data: any) {
    await this.membershipRepository.update(id, data);
    return this.membershipRepository.findOne({
      where: { id },
      relations: ['membershipPlan', 'member'],
    });
  }
}
