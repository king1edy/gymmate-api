import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const TENANT_HEADER = 'x-tenant-id';

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers[TENANT_HEADER.toLowerCase()];

    if (!tenantId) {
      this.logger.warn('No tenant ID provided in request headers');
      throw new UnauthorizedException('Tenant ID is required');
    }

    // Validate tenant ID format (basic validation)
    if (typeof tenantId !== 'string' || tenantId.trim() === '') {
      this.logger.warn('Invalid tenant ID format');
      throw new UnauthorizedException('Invalid tenant ID format');
    }

    // Attach tenant to request for downstream use
    request['tenant'] = { id: tenantId };

    return true;
  }
}
