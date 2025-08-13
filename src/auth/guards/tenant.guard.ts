// src/auth/guards/tenant.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { TenantService } from '../../tenant/tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('No tenant context');
    }

    try {
      // Verify tenant is active and user belongs to it
      const tenant = await this.tenantService.findOne(user.tenantId);
      if (!tenant || !tenant.isActive) {
        throw new ForbiddenException('Tenant not active');
      }

      // Add tenant to request for easy access
      request.tenant = tenant;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Invalid tenant access');
    }
  }
}
