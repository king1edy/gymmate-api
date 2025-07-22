import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Member } from '../membership/member.entity';
import { ClassSchedule } from './class-schedule.entity';

@Entity('class_waitlists')
export class ClassWaitlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member)
  member: Member;

  @ManyToOne(() => ClassSchedule)
  classSchedule: ClassSchedule;

  @Column()
  position: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  notifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: 'waiting' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
