import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../roles/role.entity';
import { UserType } from 'src/types/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private toResponseDto(user: User): {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: Role[];
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  } {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, gymId, roleIds, ...userData } = createUserDto;
    const hash = await bcrypt.hash(password, 10);

    // Find the roles
    let roles: Role[] = [];
    if (roleIds && roleIds.length > 0) {
      roles = await this.roleRepository.findByIds(roleIds);
      if (roles.length !== roleIds.length) {
        throw new NotFoundException('One or more roles not found');
      }
    } else {
      // Assign default member role if no roles specified
      const defaultRole = await this.roleRepository.findOne({ where: { name: 'MEMBER' } });
      if (!defaultRole) {
        throw new NotFoundException('Default member role not found');
      }
      roles = [defaultRole];
    }

    const user = this.userRepository.create({
      ...userData,
      passwordHash: hash,
      tenantId: gymId,
      roles: roles,
      isActive: true,
    });

    await this.userRepository.save(user);
    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return this.toResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updated = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    return this.toResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async getDefaultRole(userType: UserType): Promise<Role | null> {
    const roleMap = {
      [UserType.MEMBER]: 'MEMBER',
      [UserType.TRAINER]: 'TRAINER',
      [UserType.STAFF]: 'STAFF',
      [UserType.TENANT_ADMIN]: 'TENANT_ADMIN',
      [UserType.SUPER_ADMIN]: 'SUPER_ADMIN',
    };

    const roleName = roleMap[userType];
    if (!roleName) return null;

    return this.roleRepository.findOne({ where: { name: roleName } });
  }
}
