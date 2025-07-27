import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { MembershipPlan } from './membership-plan.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity('member_subscriptions')
export class MemberMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member, { nullable: false })
  member: Member;

  @Column({ type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({ type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => MembershipPlan, { nullable: false })
  membershipPlan: MembershipPlan;

  @Column({ type: 'uuid' })
  membershipTypeId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  pricePaid: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'text', nullable: true })
  discountReason: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ default: false })
  isFrozen: boolean;

  @Column({ type: 'date', nullable: true })
  freezeStartDate: Date;

  @Column({ type: 'date', nullable: true })
  freezeEndDate: Date;

  @Column({ default: 0 })
  totalFreezeDays: number;

  @Column({ type: 'text', nullable: true })
  freezeReason: string;

  @Column({ type: 'date', nullable: true })
  cancellationDate: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cancellationType: string;

  @Column({ default: 0 })
  visitsUsed: number;

  @Column({ default: 0 })
  classesUsed: number;

  @Column({ type: 'date', nullable: true })
  lastVisitDate: Date;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'date', nullable: true })
  nextPaymentDate: Date;

  @Column({ type: 'date', nullable: true })
  lastPaymentDate: Date;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
