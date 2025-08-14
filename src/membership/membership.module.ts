import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPlan } from './membership-plan.entity';
import { Member } from './member.entity';
import { MemberMembership } from './member-membership.entity';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPlan, Member, MemberMembership]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [TypeOrmModule, MembershipService],
})
export class MembershipModule {}
