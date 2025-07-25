import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';
import { GymArea } from '../class/gym-area.entity';

@Entity('access_control')
export class AccessControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @ManyToOne(() => GymArea)
  area: GymArea;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  controlType: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  model: string;

  @Column({ type: 'jsonb', nullable: true })
  configuration: {
    ipAddress?: string;
    port?: number;
    settings?: any;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  scheduleRestrictions: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  maintenanceHistory: {
    date: Date;
    type: string;
    notes: string;
    technician: string;
  }[];

  @Column({ type: 'timestamp', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextMaintenanceDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
