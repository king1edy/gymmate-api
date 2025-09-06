import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacSeeder } from './seeders/rbac.seeder';
import { Role } from '../roles/role.entity';
import { Permission } from '../permissions/permission.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [RbacSeeder],
  exports: [RbacSeeder],
})
export class SeederModule {}
