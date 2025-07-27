import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Staff } from './staff.entity';
import { Trainer } from './trainer.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
  ) {}

  // Staff Management
  async getStaffMembers(gymId: string, filter: any = {}) {
    return this.staffRepository.find({
      where: { user: { gym: { id: gymId } }, ...filter },
      relations: ['user'],
    });
  }

  async getStaffMemberById(id: string) {
    return this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createStaffMember(data: any) {
    const staff = this.staffRepository.create(data);
    return this.staffRepository.save(staff);
  }

  async updateStaffMember(id: string, data: any) {
    await this.staffRepository.update(id, data);
    return this.getStaffMemberById(id);
  }

  // Trainer Management
  async getTrainers(gymId: string, filter: any = {}) {
    return this.trainerRepository.find({
      where: { user: { gym: { id: gymId } }, ...filter },
      relations: ['user'],
    });
  }

  async getTrainerById(id: string) {
    return this.trainerRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createTrainer(data: any) {
    const trainer = this.trainerRepository.create(data);
    return this.trainerRepository.save(trainer);
  }

  async updateTrainer(id: string, data: any) {
    await this.trainerRepository.update(id, data);
    return this.getTrainerById(id);
  }

  // Specialized Queries
  async getAvailableTrainers(gymId: string, date: Date) {
    return this.trainerRepository.find({
      where: {
        user: { gym: { id: gymId } },
        isActive: true,
        isAcceptingClients: true,
      },
      relations: ['user'],
    });
  }

  async getTrainerSchedule(trainerId: string, startDate: Date, endDate: Date) {
    return this.trainerRepository.findOne({
      where: { id: trainerId },
      relations: ['user'],
    });
  }

  async getStaffSchedule(departmentId: string, date: Date) {
    return this.staffRepository.find({
      where: {
        department: departmentId,
        isActive: true,
      },
      relations: ['user'],
    });
  }

  async updateTrainerAvailability(id: string, availability: any) {
    return this.trainerRepository.update(id, {
      defaultAvailability: availability,
    });
  }

  async updateStaffSchedule(id: string, schedule: any) {
    return this.staffRepository.update(id, {
      defaultSchedule: schedule,
    });
  }

  // Certifications and Qualifications
  async updateTrainerCertifications(id: string, certifications: any[]) {
    const trainer = await this.getTrainerById(id);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    trainer.certifications = certifications;
    return this.trainerRepository.save(trainer);
  }

  async getExpiredCertifications(gymId: string) {
    const today = new Date();
    return this.trainerRepository
      .find({
        where: {
          user: { gym: { id: gymId } },
          isActive: true,
        },
        relations: ['user'],
      })
      .then((trainers) => {
        return trainers.filter((trainer) => {
          return trainer.certifications.some(
            (cert: any) => new Date(cert.expiryDate) <= today,
          );
        });
      });
  }
}
