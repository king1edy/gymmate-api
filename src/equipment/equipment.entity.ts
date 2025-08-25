import { Entity, Column, ManyToOne } from 'typeorm';
import { EquipmentCategory } from './equipment-category.entity';
import { TenantArea } from '../class/tenant-area.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { BaseEntity } from '../types/interfaces';

@Entity('equipment')
export class Equipment extends BaseEntity {
  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @ManyToOne(() => EquipmentCategory)
  category: EquipmentCategory;

  @ManyToOne(() => TenantArea)
  area: TenantArea;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ type: 'date', nullable: true })
  warrantyExpires: Date;

  @Column({ type: 'jsonb', nullable: true })
  dimensions: {
    length: number;
    width: number;
    height: number;
  };

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weightKg: number;

  @Column({ nullable: true })
  powerRequirements: string;

  @Column({ default: 'operational' })
  status: string;

  @Column({ type: 'integer', nullable: true })
  conditionRating: number;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'text', nullable: true })
  maintenanceNotes: string;

  @Column({ nullable: true })
  qrCode: string;
}
