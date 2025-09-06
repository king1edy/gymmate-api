// src/middleware/tenant.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant from subdomain or header
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];

    // Add tenant to request object
    req['tenant'] = {
      id: subdomain,
      subdomain: subdomain,
    };

    next();
  }
}
