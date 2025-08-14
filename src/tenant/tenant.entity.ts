import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  subdomain: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  settings: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  businessInfo: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  address: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'starter' })
  subscriptionPlan: string;

  @Column({ type: 'varchar', length: 20, default: 'trial' })
  subscriptionStatus: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  subscriptionStartDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  subscriptionEndDate: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  trialEndsAt: Date;

  @Column('text', {
    array: true,
    default: () =>
      "ARRAY['basic_membership','class_booking','payment_processing','email_notifications']",
  })
  featuresEnabled: string[];

  @Column({ type: 'jsonb', default: () => "'{}'" })
  limits: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  billingInfo: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
