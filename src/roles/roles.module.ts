import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Permission } from '../permissions/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]), // Uncomment if you have a Role entity
    PermissionsModule, // Import PermissionsModule if needed
  ],
  controllers: [RolesController],
  providers: [RolesService], // Add your services here
  exports: [RolesService], // Export any services or modules if needed
})
export class RolesModule {}
