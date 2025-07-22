import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './gym.entity';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Gym])],
  controllers: [GymController],
  providers: [GymService],
  exports: [TypeOrmModule],
})
export class GymModule {}