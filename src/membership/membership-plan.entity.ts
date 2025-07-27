import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

@Entity('membership_types')
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  setupFee: number;

  @Column()
  durationType: string;

  @Column({ nullable: true })
  durationValue: number;

  @Column({ default: 'unlimited' })
  accessType: string;

  @Column({ nullable: true })
  visitsPerPeriod: number;

  @Column({ nullable: true })
  periodType: string;

  @Column({ type: 'int', nullable: true })
  classCredits: number;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  benefits: any[];

  @Column({ type: 'jsonb', default: () => "'{}'" })
  restrictions: Record<string, any>;

  @Column({ default: false })
  allowsFreeze: boolean;

  @Column({ default: 0 })
  maxFreezeDays: number;

  @Column({ default: false })
  allowsGuestPasses: boolean;

  @Column({ default: 0 })
  guestPassesPerMonth: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
