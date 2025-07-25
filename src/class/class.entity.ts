import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';
import { ClassCategory } from './class-category.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym)
  gym: Gym;

  @ManyToOne(() => ClassCategory)
  category: ClassCategory;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  durationMinutes: number;

  @Column({ default: 20 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  price: number;

  @Column({ default: 1 })
  creditsRequired: number;

  @Column({ nullable: true })
  skillLevel: string;

  @Column({ nullable: true })
  ageRestriction: string;

  @Column({ type: 'text', array: true, default: '{}' })
  equipmentNeeded: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
