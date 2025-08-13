import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../roles/role.entity';
import { Permission } from '../../permissions/permission.entity';
import { User } from '../../user/user.entity';
import { UserType, UserStatus } from '../../types/interfaces';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RbacSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    // Create default permissions
    const permissions = await this.seedPermissions();

    // Create default roles
    const roles = await this.seedRoles(permissions);

    // Create super admin user if it doesn't exist
    await this.seedSuperAdmin(roles);
  }

  private async seedPermissions(): Promise<Permission[]> {
    const defaultPermissions = [
      // User management permissions
      { name: 'users:create', description: 'Create users', resource: 'users', action: 'create' },
      { name: 'users:read', description: 'View users', resource: 'users', action: 'read' },
      { name: 'users:update', description: 'Update users', resource: 'users', action: 'update' },
      { name: 'users:delete', description: 'Delete users', resource: 'users', action: 'delete' },
      
      // Role management permissions
      { name: 'roles:create', description: 'Create roles', resource: 'roles', action: 'create' },
      { name: 'roles:read', description: 'View roles', resource: 'roles', action: 'read' },
      { name: 'roles:update', description: 'Update roles', resource: 'roles', action: 'update' },
      { name: 'roles:delete', description: 'Delete roles', resource: 'roles', action: 'delete' },
      
      // Member management permissions
      { name: 'members:create', description: 'Create members', resource: 'members', action: 'create' },
      { name: 'members:read', description: 'View members', resource: 'members', action: 'read' },
      { name: 'members:update', description: 'Update members', resource: 'members', action: 'update' },
      { name: 'members:delete', description: 'Delete members', resource: 'members', action: 'delete' },
      
      // Class management permissions
      { name: 'classes:create', description: 'Create classes', resource: 'classes', action: 'create' },
      { name: 'classes:read', description: 'View classes', resource: 'classes', action: 'read' },
      { name: 'classes:update', description: 'Update classes', resource: 'classes', action: 'update' },
      { name: 'classes:delete', description: 'Delete classes', resource: 'classes', action: 'delete' },
      
      // Equipment management permissions
      { name: 'equipment:create', description: 'Create equipment', resource: 'equipment', action: 'create' },
      { name: 'equipment:read', description: 'View equipment', resource: 'equipment', action: 'read' },
      { name: 'equipment:update', description: 'Update equipment', resource: 'equipment', action: 'update' },
      { name: 'equipment:delete', description: 'Delete equipment', resource: 'equipment', action: 'delete' },
      
      // Financial permissions
      { name: 'finances:create', description: 'Create financial records', resource: 'finances', action: 'create' },
      { name: 'finances:read', description: 'View financial records', resource: 'finances', action: 'read' },
      { name: 'finances:update', description: 'Update financial records', resource: 'finances', action: 'update' },
      { name: 'finances:delete', description: 'Delete financial records', resource: 'finances', action: 'delete' },
      
      // Marketing permissions
      { name: 'marketing:create', description: 'Create marketing campaigns', resource: 'marketing', action: 'create' },
      { name: 'marketing:read', description: 'View marketing campaigns', resource: 'marketing', action: 'read' },
      { name: 'marketing:update', description: 'Update marketing campaigns', resource: 'marketing', action: 'update' },
      { name: 'marketing:delete', description: 'Delete marketing campaigns', resource: 'marketing', action: 'delete' },
      
      // Access control permissions
      { name: 'access:create', description: 'Create access rules', resource: 'access', action: 'create' },
      { name: 'access:read', description: 'View access logs', resource: 'access', action: 'read' },
      { name: 'access:update', description: 'Update access rules', resource: 'access', action: 'update' },
      { name: 'access:delete', description: 'Delete access rules', resource: 'access', action: 'delete' },
    ];

    const savedPermissions: Permission[] = [];
    for (const permission of defaultPermissions) {
      let existing = await this.permissionRepository.findOne({
        where: { name: permission.name },
      });

      if (!existing) {
        existing = await this.permissionRepository.save(
          this.permissionRepository.create(permission),
        );
      }
      savedPermissions.push(existing);
    }

    return savedPermissions;
  }

  private async seedRoles(permissions: Permission[]): Promise<Role[]> {
    const roleConfigs = [
      {
        name: 'super_admin',
        description: 'Super Administrator with full system access',
        permissions: permissions, // All permissions
        isSystem: true,
      },
      {
        name: 'admin',
        description: 'Gym Administrator',
        permissions: permissions.filter(p => !p.name.startsWith('system:')),
        isSystem: true,
      },
      {
        name: 'manager',
        description: 'Gym Manager',
        permissions: permissions.filter(p => 
          p.name.startsWith('members:') ||
          p.name.startsWith('classes:') ||
          p.name.startsWith('equipment:') ||
          p.name === 'access:read'
        ),
        isSystem: true,
      },
      {
        name: 'trainer',
        description: 'Fitness Trainer',
        permissions: permissions.filter(p => 
          p.name.startsWith('classes:read') ||
          p.name.startsWith('members:read') ||
          p.name.startsWith('equipment:read')
        ),
        isSystem: true,
      },
      {
        name: 'staff',
        description: 'Front Desk Staff',
        permissions: permissions.filter(p => 
          p.name === 'members:read' ||
          p.name === 'classes:read' ||
          p.name === 'access:read'
        ),
        isSystem: true,
      },
      {
        name: 'member',
        description: 'Gym Member',
        permissions: permissions.filter(p => 
          p.name === 'classes:read'
        ),
        isSystem: true,
      },
    ];

    const savedRoles: Role[] = [];
    for (const roleConfig of roleConfigs) {
      let role = await this.roleRepository.findOne({
        where: { name: roleConfig.name },
      });

      if (!role) {
        role = this.roleRepository.create({
          name: roleConfig.name,
          description: roleConfig.description,
          isSystem: roleConfig.isSystem,
        });
      }

      role.permissions = roleConfig.permissions;
      await this.roleRepository.save(role);
      savedRoles.push(role);
    }

    return savedRoles;
  }

  private async seedSuperAdmin(roles: Role[]) {
    const superAdminRole = roles.find(role => role.name === 'super_admin');
    if (!superAdminRole) {
      throw new Error('Super Admin role not found');
    }

    const existingSuperAdmin = await this.userRepository.findOne({
      where: { email: 'admin@gymmate.com' },
    });

    if (!existingSuperAdmin) {
      const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);

      const superAdmin = this.userRepository.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@gymmate.com',
        passwordHash,
        userType: UserType.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        roles: [superAdminRole],
        isActive: true,
      });

      await this.userRepository.save(superAdmin);
    }
  }
}
