import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { MembershipPlan } from './membership-plan.entity';

@Entity('member_memberships')
export class MemberMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => MembershipPlan)
  membershipPlan: MembershipPlan;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyAmount: number;

  @Column()
  billingCycle: string;

  @Column({ type: 'date', nullable: true })
  nextBillingDate: Date;

  @Column({ nullable: true })
  classCreditsRemaining: number;

  @Column({ nullable: true })
  guestPassesRemaining: number;

  @Column({ nullable: true })
  trainerSessionsRemaining: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ default: false })
  isFrozen: boolean;

  @Column({ type: 'date', nullable: true })
  frozenUntil: Date;

  @Column({ type: 'text', nullable: true })
  freezeReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
