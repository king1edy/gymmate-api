import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from '../gym/gym.entity';

export type UserRole = 'admin' | 'manager' | 'trainer' | 'member';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Gym, { nullable: false })
  gym: Gym;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'member' })
  role: UserRole;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 