import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './gym.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gym])],
  exports: [TypeOrmModule],
})
export class GymModule {} 