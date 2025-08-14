import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassCategory } from './class-category.entity';
import { Class } from './class.entity';
import { TenantArea } from './tenant-area.entity';
import { ClassSchedule } from './class-schedule.entity';
import { ClassBooking } from './class-booking.entity';
import { ClassWaitlist } from './class-waitlist.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassCategory,
      Class,
      TenantArea,
      ClassSchedule,
      ClassBooking,
      ClassWaitlist,
    ]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [TypeOrmModule, ClassService],
})
export class ClassModule {}
