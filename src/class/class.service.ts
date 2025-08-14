import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { ClassCategory } from './class-category.entity';
import { ClassSchedule } from './class-schedule.entity';
import { ClassBooking } from './class-booking.entity';
import { ClassWaitlist } from './class-waitlist.entity';
import { TenantArea } from '../class/tenant-area.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassCategory)
    private classCategoryRepository: Repository<ClassCategory>,
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(ClassBooking)
    private classBookingRepository: Repository<ClassBooking>,
    @InjectRepository(ClassWaitlist)
    private classWaitlistRepository: Repository<ClassWaitlist>,
    @InjectRepository(TenantArea)
    private tenantAreaRepository: Repository<TenantArea>,
  ) {}

  async getClasses(tenantId: string) {
    return this.classRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['category', 'gym'],
    });
  }

  async getClassById(id: string) {
    return this.classRepository.findOne({
      where: { id },
      relations: ['category', 'gym'],
    });
  }

  async createClass(data: any) {
    const newClass = this.classRepository.create(data);
    return this.classRepository.save(newClass);
  }

  // Update class method
  async updateClass(id: string, data: any) {
    await this.classRepository.update(id, data);
    return this.getClassById(id);
  }

  async getClassByCategory(categoryId: string) {
    return this.classRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'tenant', 'area'],
    });
  }

  async getClassByTenant(tenantId: string) {
    return this.classRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['area', 'tenant'],
    });
  }

  async getSchedules(tenantId: string, filter: any = {}) {
    return this.classScheduleRepository.find({
      where: { class: { tenant: { id: tenantId } }, ...filter },
      relations: ['class', 'trainer', 'area'],
    });
  }

  async getBookings(classScheduleId: string) {
    return this.classBookingRepository.find({
      where: { classSchedule: { id: classScheduleId } },
      relations: ['member', 'classSchedule'],
    });
  }

  async createBooking(data: any) {
    const booking = this.classBookingRepository.create(data);
    return this.classBookingRepository.save(booking);
  }

  async getTenantAreas(tenantId: string) {
    return this.tenantAreaRepository.find({
      where: { tenant: { id: tenantId } },
    });
  }

  async getCategories(tenantId: string) {
    return this.classCategoryRepository.find({
      where: { tenant: { id: tenantId } },
    });
  }
}
