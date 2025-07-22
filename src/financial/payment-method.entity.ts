import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Member } from '../membership/member.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Member)
  member: Member;

  @Column()
  methodType: string;

  @Column({ nullable: true })
  cardToken: string;

  @Column({ length: 4, nullable: true })
  cardLastFour: string;

  @Column({ nullable: true })
  cardBrand: string;

  @Column({ nullable: true })
  cardExpiresMonth: number;

  @Column({ nullable: true })
  cardExpiresYear: number;

  @Column({ nullable: true })
  bankToken: string;

  @Column({ length: 4, nullable: true })
  bankRoutingLastFour: string;

  @Column({ length: 4, nullable: true })
  bankAccountLastFour: string;

  @Column({ nullable: true })
  walletType: string;

  @Column({ nullable: true })
  walletEmail: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
