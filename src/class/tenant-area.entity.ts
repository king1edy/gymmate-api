import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';

@Entity('tenant_areas')
export class TenantArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @Column()
  name: string;

  @Column({ nullable: true })
  areaType: string;

  @Column({ nullable: true })
  capacity: number;

  @Column({ type: 'text', array: true, default: '{}' })
  amenities: string[];

  @Column({ default: false })
  requiresBooking: boolean;

  @Column({ default: 24 })
  advanceBookingHours: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
