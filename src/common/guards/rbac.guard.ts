import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from '../../user/user.entity';
// import { AuthenticatedUser } from '../../types/interfaces';

@Injectable()
export class RBACGuard implements CanActivate {
  private readonly logger = new Logger(RBACGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request - authentication required');
      return false;
    }

    // Handle both new User entity and old AuthenticatedUser interface
    if (this.isUserEntity(user)) {
      // New system with User entity
      // Check roles
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = user.hasAnyRole(requiredRoles);
        if (!hasRole) {
          this.logger.warn(
            `User ${user.id} with roles ${user.roles?.map((r) => r.name).join(', ')} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
          );
          throw new ForbiddenException(
            `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
          );
        }
      }

      // Check permissions
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.every((permission) =>
          user.hasPermission(permission),
        );
        if (!hasPermission) {
          this.logger.warn(
            `User ${user.id} with permissions ${user.permissions?.join(', ')} attempted to access resource requiring permissions: ${requiredPermissions.join(', ')}`,
          );
          throw new ForbiddenException(
            `Insufficient permissions. Required permissions: ${requiredPermissions.join(', ')}`,
          );
        }
      }

      return true;
    } else {
      // Legacy system with AuthenticatedUser
      if (requiredRoles && requiredRoles.length > 0) {
        if (!user.role) {
          this.logger.warn(`User ${user.userId} has no role assigned`);
          return false;
        }

        const hasRequiredRole = requiredRoles.some(
          (role) => role === user.role,
        );

        if (!hasRequiredRole) {
          this.logger.warn(
            `User ${user.userId} with role ${user.role} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
          );
          return false;
        }

        return true;
      }

      // If we're checking permissions on a legacy user that doesn't have permissions
      if (requiredPermissions && requiredPermissions.length > 0) {
        this.logger.warn(
          `Legacy user ${user.userId} cannot be checked for permissions`,
        );
        return false;
      }

      return true;
    }
  }

  private isUserEntity(user: any): user is User {
    return (
      user &&
      typeof user.hasPermission === 'function' &&
      typeof user.hasRole === 'function'
    );
  }
}
