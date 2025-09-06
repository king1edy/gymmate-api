import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity('trainers')
export class Trainer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'text', array: true, default: '{}' })
  specializations: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  commissionRate: number;

  @Column({ type: 'jsonb', default: '[]' })
  certifications: any[];

  @Column({ type: 'jsonb', nullable: true })
  defaultAvailability: any;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ nullable: true })
  employmentType: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAcceptingClients: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
