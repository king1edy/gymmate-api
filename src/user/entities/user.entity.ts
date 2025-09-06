import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { BaseEntity, UserStatus, UserType } from '../../types/interfaces';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/role.entity';

@Entity('users')
@Unique(['email', 'phone', 'tenantId'])
export class User extends BaseEntity {
  @ManyToOne(() => Tenant, { nullable: false })
  tenant: Tenant;

  @Column({ type: 'uuid', nullable: false })
  tenantId: string;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ unique: false })
  email: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'varchar', nullable: true })
  gender: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @Column({ type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.MEMBER,
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING_VERIFICATION,
  })
  status: UserStatus;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'text', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  lastLoginIp: string | null;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ default: true })
  isActive: boolean;

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get permissions(): string[] {
    if (!this.roles || this.roles.length === 0) return [];
    return this.roles.reduce((perms, role) => {
      if (role.permissions && role.permissions.length > 0) {
        return [...perms, ...role.permissions.map((p) => p.name)];
      }
      return perms;
    }, []);
  }

  get isSuperAdmin(): boolean {
    return this.userType === UserType.SUPER_ADMIN;
  }

  get isTenantAdmin(): boolean {
    return this.userType === UserType.TENANT_ADMIN;
  }

  hasPermission(permission: string): boolean {
    if (this.isSuperAdmin) return true;
    return this.permissions.includes(permission);
  }

  hasRole(roleName: string): boolean {
    return this.roles?.some((role) => role.name === roleName) || false;
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((roleName) => this.hasRole(roleName));
  }

  canAccessTenant(tenantId: string): boolean {
    if (this.isSuperAdmin) return true;
    return this.tenantId === tenantId;
  }
}
