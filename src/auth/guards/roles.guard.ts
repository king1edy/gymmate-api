import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { UserRole } from '../../user/dto/UserRole';
import { AuthenticatedUser } from '../../types/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      this.logger.warn('No user found in request - authentication required');
      return false;
    }

    if (!user.role) {
      this.logger.warn(`User ${user.userId} has no role assigned`);
      return false;
    }

    const hasRequiredRole = requiredRoles.some((role) => role === user.role);

    if (!hasRequiredRole) {
      this.logger.warn(
        `User ${user.userId} with role ${user.role} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRequiredRole;
  }
}
