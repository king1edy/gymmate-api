import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Promotion } from './promotion.entity';
import { Lead } from './lead.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;
  

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  budget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  spent: number;

  @Column({ type: 'text', array: true, default: '{}' })
  targetAudience: string[];

  @Column({ type: 'jsonb', nullable: true })
  goals: {
    type: string;
    target: number;
    achieved: number;
  }[];

  @Column({ type: 'text', array: true, default: '{}' })
  channels: string[];

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    costPerAcquisition: number;
  };

  @OneToMany(() => Promotion, (promotion) => promotion.campaign)
  promotions: Promotion[];

  @OneToMany(() => Lead, (lead) => lead.campaign)
  leads: Lead[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
