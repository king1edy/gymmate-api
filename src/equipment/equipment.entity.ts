import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';
import { EquipmentCategory } from './equipment-category.entity';
import { GymArea } from '../class/gym-area.entity';

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @ManyToOne(() => EquipmentCategory)
  category: EquipmentCategory;

  @ManyToOne(() => GymArea)
  area: GymArea;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
