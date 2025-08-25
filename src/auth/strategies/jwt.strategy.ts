// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../../types/interfaces';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwtSecret = configService.get<string>(
      'JWT_ACCESS_SECRET',
      'y0ur_s3cUr3_s3cret_k3y-min-256-bits',
    );
    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  // async validate(payload: JwtPayload) {
  //   // Extract custom claims from Keycloak token
  //   const user = {
  //     id: payload.sub,
  //     username: payload.preferred_username,
  //     email: payload.email,
  //     tenant_id: payload.tenant_id,
  //     gym_role: payload.gym_role,
  //     permissions: payload.permissions || [],
  //     member_id: payload.member_id,
  //     staff_id: payload.staff_id,
  //   };

  //   // Optionally sync with local user data
  //   return await this.userService.findOrCreateFromKeycloak(user);
  // }
}
