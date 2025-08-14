import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

/**
 * This interceptor helps with the migration from the old JWT token format to the new RBAC system.
 * It can be used during the transition period to ensure both token formats work.
 */
@Injectable()
export class TokenMigrationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TokenMigrationInterceptor.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Only process authenticated requests with a token
    if (request.user && request.headers.authorization) {
      const authHeader = request.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          // Decode (not verify) the token to check its structure
          const decoded = this.jwtService.decode(token);

          // If it's an old token format (has role but not roles/permissions)
          if (decoded && decoded.role && (!decoded.roles || !decoded.permissions)) {
            this.logger.log(`Detected legacy token format for user ${decoded.sub}`);
            // We could trigger token upgrade here if needed
          }
        } catch (error) {
          this.logger.error(`Error examining token: ${error.message}`);
        }
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Post-processing if needed
      }),
    );
  }
}
