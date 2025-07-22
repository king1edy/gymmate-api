import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentCategory } from './equipment-category.entity';
import { Equipment } from './equipment.entity';
import { EquipmentMaintenance } from './equipment-maintenance.entity';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EquipmentCategory,
      Equipment,
      EquipmentMaintenance,
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [TypeOrmModule, EquipmentService],
})
export class EquipmentModule {}
