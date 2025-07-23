import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionPlan, SubscriptionStatus } from './types';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    subdomain: string;

    @Column()
    name: string;

    @Column({ type: 'jsonb', default: '{}' })
    settings: Record<string, any>;

    @Column({
        type: 'enum',
        enum: SubscriptionPlan,
        default: SubscriptionPlan.STARTER
    })
    subscriptionPlan: SubscriptionPlan;

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.ACTIVE
    })
    subscriptionStatus: SubscriptionStatus;

    @Column({ nullable: true })
    subscriptionExpiresAt: Date;

    @Column('text', { array: true, default: '{}' })
    featuresEnabled: string[];

    @Column({ type: 'integer' })
    maxMembers: number;

    @Column({ type: 'integer' })
    maxStaff: number;

    @Column({ type: 'jsonb', nullable: true })
    billingInfo: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
