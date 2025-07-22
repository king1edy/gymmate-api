import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from '../membership/member.entity';
import { ClassSchedule } from './class-schedule.entity';

@Entity('class_bookings')
export class ClassBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => ClassSchedule)
  classSchedule: ClassSchedule;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bookingDate: Date;

  @Column({ default: 'confirmed' })
  status: string;

  @Column({ default: 1 })
  creditsUsed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  amountPaid: number;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkedOutAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'text', nullable: true })
  memberNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
