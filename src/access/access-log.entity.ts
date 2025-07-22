import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AccessControl } from './access-control.entity';
import { Member } from '../membership/member.entity';

@Entity('access_logs')
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AccessControl)
  accessPoint: AccessControl;

  @ManyToOne(() => Member)
  member: Member;

  @Column()
  cardId: string;

  @Column()
  timestamp: Date;

  @Column()
  isSuccessful: boolean;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  direction: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    deviceId?: string;
    ipAddress?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };

  @CreateDateColumn()
  createdAt: Date;
}
