import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ unique: true })
  membershipNumber: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  joinDate: Date;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  emergencyContactName: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ nullable: true })
  emergencyContactRelationship: string;

  @Column({ type: 'text', array: true, default: '{}' })
  medicalConditions: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  allergies: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  medications: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  fitnessGoals: string[];

  @Column({ nullable: true })
  experienceLevel: string;

  @Column({ type: 'jsonb', nullable: true })
  preferredWorkoutTimes: string[];

  @Column({ type: 'jsonb', default: '{"email": true, "sms": false, "push": true}' })
  communicationPreferences: Record<string, boolean>;

  @Column({ default: false })
  waiverSigned: boolean;

  @Column({ type: 'date', nullable: true })
  waiverSignedDate: Date;

  @Column({ default: false })
  photoConsent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
