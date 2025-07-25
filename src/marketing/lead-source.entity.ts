import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';

@Entity('lead_sources')
export class LeadSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  acquisitionCost: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    totalLeads: number;
    convertedLeads: number;
    averageConversionTime: number;
    costPerLead: number;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
