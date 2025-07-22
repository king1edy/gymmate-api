import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';

@Entity('membership_plans')
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  billingCycle: string;

  @Column({ nullable: true })
  durationMonths: number;

  @Column({ nullable: true })
  classCredits: number;

  @Column({ default: 0 })
  guestPasses: number;

  @Column({ default: 0 })
  trainerSessions: number;

  @Column({ type: 'jsonb', default: '[]' })
  amenities: string[];

  @Column({ default: true })
  peakHoursAccess: boolean;

  @Column({ default: false })
  offPeakOnly: boolean;

  @Column({ type: 'jsonb', nullable: true })
  specificAreas: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
