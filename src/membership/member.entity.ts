import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ name: 'member_number', unique: true, nullable: true })
  memberNumber: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  joinDate: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  statusReason: string;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  emergencyContact: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  healthInfo: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  documents: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  referredBy: string;

  @Column({ name: 'referral_code', unique: true, nullable: true })
  referralCode: string;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
