import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gym/gym.entity';

@Entity('equipment_categories')
export class EquipmentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 30 })
  maintenanceIntervalDays: number;

  @CreateDateColumn()
  createdAt: Date;
}
