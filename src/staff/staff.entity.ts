import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { StaffSchedule } from '../types/interfaces';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyWage: number;

  @Column({ type: 'date', nullable: true })
  hireDate: Date;

  @Column({ nullable: true })
  employmentType: string;

  @Column({ type: 'jsonb', nullable: true })
  defaultSchedule: StaffSchedule[]; // trainers schedule

  @Column({ type: 'jsonb', default: '[]' })
  permissions: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
