import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../user/entities/user.entity';
import { UserStatus } from '../../types/interfaces';
import { Role } from '../../roles/role.entity';
import { Permission } from '../../permissions/permission.entity';
import { UserRole } from '../../user/dto/UserRole';

@Injectable()
export class DefaultDataSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async seed() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedUsers();
  }

  private async seedPermissions() {
    const permissions = [
      // User permissions
      {
        name: 'users:create',
        description: 'Create users',
        resource: 'users',
        action: 'create',
      },
      {
        name: 'users:read',
        description: 'Read users',
        resource: 'users',
        action: 'read',
      },
      {
        name: 'users:update',
        description: 'Update users',
        resource: 'users',
        action: 'update',
      },
      {
        name: 'users:delete',
        description: 'Delete users',
        resource: 'users',
        action: 'delete',
      },

      // Role permissions
      {
        name: 'roles:create',
        description: 'Create roles',
        resource: 'roles',
        action: 'create',
      },
      {
        name: 'roles:read',
        description: 'Read roles',
        resource: 'roles',
        action: 'read',
      },
      {
        name: 'roles:update',
        description: 'Update roles',
        resource: 'roles',
        action: 'update',
      },
      {
        name: 'roles:delete',
        description: 'Delete roles',
        resource: 'roles',
        action: 'delete',
      },

      // Gym-specific permissions
      {
        name: 'gym:manage',
        description: 'Manage gym settings',
        resource: 'gym',
        action: 'manage',
      },
      {
        name: 'members:manage',
        description: 'Manage gym members',
        resource: 'members',
        action: 'manage',
      },
      {
        name: 'classes:manage',
        description: 'Manage gym classes',
        resource: 'classes',
        action: 'manage',
      },
      {
        name: 'trainers:manage',
        description: 'Manage trainers',
        resource: 'trainers',
        action: 'manage',
      },
      {
        name: 'equipment:manage',
        description: 'Manage equipment',
        resource: 'equipment',
        action: 'manage',
      },
      {
        name: 'reports:view',
        description: 'View reports',
        resource: 'reports',
        action: 'view',
      },
    ];

    for (const permissionData of permissions) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permissionData.name },
      });

      if (!existingPermission) {
        const permission = this.permissionRepository.create(permissionData);
        await this.permissionRepository.save(permission);
      }
    }
  }

  private async seedRoles() {
    const rolesData = [
      {
        name: UserRole.ADMIN,
        description: 'Administrator with most permissions',
        isSystem: true,
        permissions: await this.permissionRepository.find({
          where: [
            { resource: 'users' },
            { resource: 'gym' },
            { resource: 'members' },
            { resource: 'classes' },
            { resource: 'trainers' },
            { resource: 'equipment' },
            { resource: 'reports' },
          ],
        }),
      },
      {
        name: UserRole.MANAGER,
        description: 'Gym Manager with operational permissions',
        isSystem: true,
        permissions: await this.permissionRepository.find({
          where: [
            { name: 'users:read' },
            { name: 'members:manage' },
            { name: 'classes:manage' },
            { name: 'trainers:manage' },
            { name: 'equipment:manage' },
            { name: 'reports:view' },
          ],
        }),
      },
      {
        name: UserRole.TRAINER,
        description: 'Gym Trainer with limited permissions',
        isSystem: true,
        permissions: await this.permissionRepository.find({
          where: [
            { name: 'users:read' },
            { name: 'classes:manage' },
            { name: 'reports:view' },
          ],
        }),
      },
      {
        name: UserRole.MEMBER,
        description: 'Gym Member with basic permissions',
        isSystem: true,
        permissions: [], // No admin permissions
      },
    ];

    for (const roleData of rolesData) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
  }

  private async seedUsers() {
    const adminRole = await this.roleRepository.findOne({
      where: { name: UserRole.ADMIN },
    });

    const memberRole = await this.roleRepository.findOne({
      where: { name: UserRole.MEMBER },
    });

    const users = [
      {
        email: 'admin@gymmate.com',
        passwordHash: await bcrypt.hash('Admin123!', 12),
        firstName: 'Super',
        lastName: 'Admin',
        status: UserStatus.ACTIVE,
        emailVerified: true,
        roles: adminRole ? [adminRole] : [],
        tenantId: '00000000-0000-0000-0000-000000000000', // Default tenant
      },
      {
        email: 'user@example.com',
        passwordHash: await bcrypt.hash('User123!', 12),
        firstName: 'John',
        lastName: 'Doe',
        status: UserStatus.ACTIVE,
        emailVerified: true,
        roles: memberRole ? [memberRole] : [],
        tenantId: '00000000-0000-0000-0000-000000000000', // Default tenant
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }
    }
  }
}
