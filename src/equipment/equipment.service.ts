import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Equipment } from './equipment.entity';
import { EquipmentCategory } from './equipment-category.entity';
import { EquipmentMaintenance } from './equipment-maintenance.entity';

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

  async getEquipment(gymId: string, filter: any = {}) {
    return this.equipmentRepository.find({
      where: { gym: { id: gymId }, ...filter },
      relations: ['category', 'area'],
    });
  }

  async getEquipmentById(id: string) {
    return this.equipmentRepository.findOne({
      where: { id },
      relations: ['category', 'area', 'gym'],
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

  async getCategories(gymId: string) {
    return this.categoryRepository.find({
      where: { gym: { id: gymId } },
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

  async getUpcomingMaintenance(gymId: string) {
    const today = new Date();
    const upcomingDate = new Date(today.setDate(today.getDate() + 30));
    return this.equipmentRepository.find({
      where: { 
        gym: { id: gymId },
        nextMaintenanceDate: LessThanOrEqual(upcomingDate),
      },
      relations: ['category', 'area'],
    });
  }
}
