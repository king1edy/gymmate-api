import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../types/interfaces'; // Adjust the import path as necessary

// Tenant Entity
@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  subdomain: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  settings: Record<string, any>;

  @Column({ name: 'business_info', type: 'jsonb', default: () => "'{}'" })
  businessInfo: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  address: Record<string, any>;

  @Column({
    name: 'subscription_plan',
    type: 'varchar',
    length: 50,
    default: 'starter',
  })
  subscriptionPlan: string;

  @Column({
    name: 'subscription_status',
    type: 'varchar',
    length: 20,
    default: 'trial',
  })
  subscriptionStatus: string;

  @Column({
    name: 'subscription_start_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  subscriptionStartDate: Date;

  @Column({
    name: 'subscription_end_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  subscriptionEndDate: Date;

  @Column({
    name: 'trial_ends_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  trialEndsAt: Date;

  @Column('text', {
    name: 'features_enabled',
    array: true,
    default: () =>
      "ARRAY['basic_membership','class_booking','payment_processing','email_notifications']",
  })
  featuresEnabled: string[];

  @Column({ name: 'limits', type: 'jsonb', default: () => "'{}'" })
  limits: Record<string, any>;

  @Column({ name: 'billing_info', type: 'jsonb', default: () => "'{}'" })
  billingInfo: Record<string, any>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
