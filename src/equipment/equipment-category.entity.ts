import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/entities/tenant.entity';

/**
 * Represents a category of equipment in the gym.
 */

@Entity('equipment_categories')
export class EquipmentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 30 })
  maintenanceIntervalDays: number;

  @CreateDateColumn()
  createdAt: Date;
}
