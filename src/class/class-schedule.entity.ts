import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { Trainer } from '../staff/trainer.entity';
import { GymArea } from './gym-area.entity';

@Entity('class_schedules')
export class ClassSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Class)
  class: Class;

  @ManyToOne(() => Trainer)
  trainer: Trainer;

  @ManyToOne(() => GymArea)
  area: GymArea;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ nullable: true })
  capacityOverride: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceOverride: number;

  @Column({ default: 'scheduled' })
  status: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'text', nullable: true })
  instructorNotes: string;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
