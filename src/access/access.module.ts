import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControl } from './access-control.entity';
import { AccessLog } from './access-log.entity';
import { AccessCard } from './access-card.entity';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessControl, AccessLog, AccessCard])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [TypeOrmModule, AccessService],
})
export class AccessModule {}
