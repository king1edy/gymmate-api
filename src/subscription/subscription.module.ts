import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { GymModule } from '../gym/gym.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    GymModule, // Import GymModule to use its TypeORM repository
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
