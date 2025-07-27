import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Gym } from '../gym/gym.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, (gym) => gym.id)
  gym: Gym;

  @Column()
  planName: string;

  @Column()
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  billingCycle: string; // monthly, yearly, etc.

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  features: string[];

  @Column({ type: 'int' })
  maxMembers: number;

  @Column({ nullable: true })
  canceledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentHistory: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
