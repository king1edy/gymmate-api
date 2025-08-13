import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Check if role with this name already exists
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name ${createRoleDto.name} already exists`,
      );
    }

    // Create new role
    const role = this.rolesRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      isActive: createRoleDto.isActive ?? true,
      isSystem: createRoleDto.isSystem ?? false,
    });

    // Assign initial permissions if provided
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      const permissions = await this.permissionsRepository.findByIds(
        createRoleDto.permissionIds,
      );
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Prevent modifying system roles
    if (
      role.isSystem &&
      (updateRoleDto.name || updateRoleDto.isSystem === false)
    ) {
      throw new BadRequestException(
        'Cannot change name or system status of system roles',
      );
    }

    // Update basic properties
    if (updateRoleDto.name) role.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined)
      role.description = updateRoleDto.description;
    if (updateRoleDto.isActive !== undefined)
      role.isActive = updateRoleDto.isActive;
    if (updateRoleDto.isSystem !== undefined && !role.isSystem)
      role.isSystem = updateRoleDto.isSystem;

    // Update permissions if provided
    if (updateRoleDto.permissionIds) {
      const permissions = await this.permissionsRepository.findByIds(
        updateRoleDto.permissionIds,
      );
      role.permissions = permissions;
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new BadRequestException('Cannot delete system roles');
    }

    await this.rolesRepository.remove(role);
  }

  async assignPermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.findOne(roleId);
    const permission = await this.permissionsRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${permissionId} not found`,
      );
    }

    // Check if the permission is already assigned
    if (role.permissions.some((p) => p.id === permissionId)) {
      return role; // Permission already assigned, no change needed
    }

    // Add the permission
    role.permissions.push(permission);
    return this.rolesRepository.save(role);
  }

  async removePermission(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.findOne(roleId);

    // Filter out the permission to remove
    role.permissions = role.permissions.filter((p) => p.id !== permissionId);

    return this.rolesRepository.save(role);
  }
}
