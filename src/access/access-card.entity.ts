import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../membership/member.entity';

@Entity('access_cards')
export class AccessCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member)
  member: Member;

  @Column({ unique: true })
  cardId: string;

  @Column({ nullable: true })
  cardType: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deactivatedAt: Date;

  @Column({ nullable: true })
  deactivationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  restrictions: {
    timeRestrictions?: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[];
    areaRestrictions?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  cardDetails: {
    manufacturer?: string;
    technology?: string;
    format?: string;
    serialNumber?: string;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  deposit: number;

  @Column({ type: 'timestamp', nullable: true })
  depositPaidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  depositRefundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
