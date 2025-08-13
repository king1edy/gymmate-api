import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Role } from '../roles/role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  resource: string; // e.g., 'users', 'roles', 'gym'

  @Column({ nullable: true })
  action: string; // e.g., 'create', 'read', 'update', 'delete'

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to get full permission name
  getFullPermissionName(): string {
    if (this.resource && this.action) {
      return `${this.resource}:${this.action}`;
    }
    return this.name;
  }
}
