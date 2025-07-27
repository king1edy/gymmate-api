import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Gym } from '../gym/gym.entity';

@Entity('gym_areas')
export class GymArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

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
