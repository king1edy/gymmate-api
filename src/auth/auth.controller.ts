import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; role?: string; gymId: string }) {
    const allowedRoles = ['admin', 'manager', 'trainer', 'member'];
    const role = allowedRoles.includes(body.role) ? body.role as UserRole : 'member';
    return this.authService.register(body.email, body.password, role, body.gymId);
  }
} 