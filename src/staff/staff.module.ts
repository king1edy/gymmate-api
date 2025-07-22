import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { Trainer } from './trainer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Trainer]),
  ],
  exports: [TypeOrmModule],
})
export class StaffModule {}
