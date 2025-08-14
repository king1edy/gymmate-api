import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Campaign } from './campaign.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;
  
  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  promoCode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountAmount: number;

  @Column()
  discountType: string;

  @Column({ nullable: true })
  minimumPurchaseAmount: number;

  @Column({ nullable: true })
  maximumDiscountAmount: number;

  @Column({ default: -1 })
  usageLimit: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'text', array: true, default: '{}' })
  applicableServices: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  excludedServices: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  restrictions: {
    membershipTypes?: string[];
    newMembersOnly?: boolean;
    minimumMembershipDuration?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    views: number;
    redemptions: number;
    revenue: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
