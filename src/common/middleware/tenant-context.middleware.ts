// src/common/middleware/tenant-context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../../tenant/tenant.service';
import { CacheService } from '../service/cache.service';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      tenant?: any;
      tenantId?: string;
    }
  }
}

@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private readonly tenantService: TenantService,
    private readonly cacheService: CacheService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain or header
    const tenantIdentifier = this.extractTenantIdentifier(req);

    if (tenantIdentifier) {
      // Cache tenant data for performance
      const cacheKey = `tenant:${tenantIdentifier}`;
      let tenant = await this.cacheService.getTenantData<any>(
        tenantIdentifier,
        'info',
      );

      if (!tenant) {
        tenant = await this.tenantService.findByIdentifier(tenantIdentifier);
        if (tenant) {
          await this.cacheService.setTenantData(
            tenantIdentifier,
            'info',
            tenant,
            300,
          );
        }
      }

      if (tenant) {
        req.tenant = tenant;
        req.tenantId = tenant.id;
      }
    }

    next();
  }

  private extractTenantIdentifier(req: Request): string | null {
    // Try subdomain first: gym1.gymmate.app
    const host = req.get('host');
    const subdomain = host?.split('.')[0];

    // Fallback to custom header
    const tenantId =
      subdomain !== 'www' && subdomain !== 'localhost'
        ? subdomain
        : req.get('x-tenant-id');

    return tenantId || null;
  }
}
