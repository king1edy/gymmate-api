import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { Promotion } from './promotion.entity';
import { LeadSource } from './lead-source.entity';
import { Lead } from './lead.entity';
import { MarketingController } from './marketing.controller';
import { MarketingService } from './marketing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      Promotion,
      LeadSource,
      Lead,
    ]),
  ],
  controllers: [MarketingController],
  providers: [MarketingService],
  exports: [TypeOrmModule, MarketingService],
})
export class MarketingModule {}
