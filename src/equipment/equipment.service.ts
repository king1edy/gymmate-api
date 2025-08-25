import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  FindOptionsWhere,
  Between,
} from 'typeorm';
import { Equipment } from './equipment.entity';
import { EquipmentCategory } from './equipment-category.entity';
import { EquipmentMaintenance } from './equipment-maintenance.entity';
import { EquipmentFilter } from '../types/interfaces';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(EquipmentCategory)
    private categoryRepository: Repository<EquipmentCategory>,
    @InjectRepository(EquipmentMaintenance)
    private maintenanceRepository: Repository<EquipmentMaintenance>,
  ) {}

  async getEquipment(tenantId: string, filter: EquipmentFilter = {}) {
    const where: FindOptionsWhere<Equipment> = {
      tenant: { id: tenantId },
    };

    // Build the where clause based on the filter
    if (filter.category) {
      where.category = { name: filter.category };
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.areaId) {
      where.area = { id: filter.areaId };
    }

    // Handle condition rating range
    if (
      filter.minConditionRating !== undefined ||
      filter.maxConditionRating !== undefined
    ) {
      if (
        filter.minConditionRating !== undefined &&
        filter.maxConditionRating !== undefined
      ) {
        where.conditionRating = Between(
          filter.minConditionRating,
          filter.maxConditionRating,
        );
      } else if (filter.minConditionRating !== undefined) {
        where.conditionRating = LessThanOrEqual(filter.minConditionRating);
      } else if (filter.maxConditionRating !== undefined) {
        where.conditionRating = LessThanOrEqual(filter.maxConditionRating);
      }
    }

    return this.equipmentRepository.find({
      where,
      relations: ['category', 'area'],
    });
  }

  async getEquipmentById(id: string) {
    return this.equipmentRepository.findOne({
      where: { id },
      relations: ['category', 'area', 'tenant'],
    });
  }

  async createEquipment(data: any) {
    const equipment = this.equipmentRepository.create(data);
    return this.equipmentRepository.save(equipment);
  }

  async updateEquipment(id: string, data: any) {
    await this.equipmentRepository.update(id, data);
    return this.getEquipmentById(id);
  }

  async getCategories(tenantId: string) {
    return this.categoryRepository.find({
      where: { tenant: { id: tenantId } },
    });
  }

  async createCategory(data: any) {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async getMaintenanceHistory(equipmentId: string) {
    return this.maintenanceRepository.find({
      where: { equipment: { id: equipmentId } },
      relations: ['performedBy'],
      order: { maintenanceDate: 'DESC' },
    });
  }

  async logMaintenance(data: any) {
    const maintenance = this.maintenanceRepository.create(data);
    return this.maintenanceRepository.save(maintenance);
  }

  async getUpcomingMaintenance(tenantId: string) {
    const today = new Date();
    const upcomingDate = new Date(today.setDate(today.getDate() + 30));
    return this.equipmentRepository.find({
      where: {
        tenant: { id: tenantId },
        nextMaintenanceDate: LessThanOrEqual(upcomingDate),
      },
      relations: ['category', 'area'],
    });
  }
}
