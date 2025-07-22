import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-member')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createMember(@Body() body: { email: string; password: string; gymId: string }) {
    // This would delegate to a service in a real app
    return { message: `Member ${body.email} created for gym ${body.gymId} (stub)` };
  }

  @Get('list-trainers')
  @UseGuards(JwtAuthGuard)
  listTrainers() {
    // This would query the DB in a real app
    return [
      { id: 1, name: 'Trainer Alice' },
      { id: 2, name: 'Trainer Bob' },
    ];
  }

  @Post('book-class')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('member')
  bookClass(@Body() body: { classId: number }) {
    // This would book a class in a real app
    return { message: `Class ${body.classId} booked (stub)` };
  }
}
