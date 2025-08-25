import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantModule } from '../tenant/tenant.module';
import { LeadSource } from './lead-source.entity';
import { Campaign } from './campaign.entity';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @ManyToOne(() => LeadSource)
  source: LeadSource;

  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @ManyToOne(() => User)
  assignedTo: User;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  potentialValue: number;

  @Column({ type: 'text', nullable: true })
  interests: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    membershipType?: string;
    preferredContactMethod?: string;
    bestTimeToContact?: string[];
    services?: string[];
  };

  @Column({ type: 'jsonb', default: '[]' })
  interactions: {
    date: Date;
    type: string;
    notes: string;
    outcome: string;
    followUpDate?: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  lastContactedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextFollowUpDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  convertedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  conversionValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
