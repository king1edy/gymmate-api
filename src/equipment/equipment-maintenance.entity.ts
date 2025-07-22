import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Equipment } from './equipment.entity';
import { User } from '../user/user.entity';

@Entity('equipment_maintenance')
export class EquipmentMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Equipment)
  equipment: Equipment;

  @ManyToOne(() => User)
  performedBy: User;

  @Column({ type: 'date' })
  maintenanceDate: Date;

  @Column({ nullable: true })
  maintenanceType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true, default: '{}' })
  partsReplaced: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  statusBefore: string;

  @Column({ nullable: true })
  statusAfter: string;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;
}
