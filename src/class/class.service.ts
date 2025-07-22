import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { ClassCategory } from './class-category.entity';
import { ClassSchedule } from './class-schedule.entity';
import { ClassBooking } from './class-booking.entity';
import { ClassWaitlist } from './class-waitlist.entity';
import { GymArea } from './gym-area.entity';

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
    @InjectRepository(GymArea)
    private gymAreaRepository: Repository<GymArea>,
  ) {}

  async getClasses(gymId: string) {
    return this.classRepository.find({
      where: { gym: { id: gymId } },
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

  async getSchedules(gymId: string, filter: any = {}) {
    return this.classScheduleRepository.find({
      where: { class: { gym: { id: gymId } }, ...filter },
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

  async getGymAreas(gymId: string) {
    return this.gymAreaRepository.find({
      where: { gym: { id: gymId } },
    });
  }

  async getCategories(gymId: string) {
    return this.classCategoryRepository.find({
      where: { gym: { id: gymId } },
    });
  }
}
