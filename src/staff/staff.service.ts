import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { Trainer } from './trainer.entity';
import {
  Availability,
  Certification,
  StaffFilter,
  StaffSchedule,
  TrainerFilter,
} from '../types/interfaces';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
  ) {}

  // Staff Management
  async getStaffMembers(gymId: string, filter: StaffFilter = {}) {
    return this.staffRepository.find({
      where: { user: { tenant: { id: gymId } }, ...filter },
      relations: ['user'],
    });
  }

  async getStaffMemberById(id: string) {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return staff;
  }

  async createStaffMember(data: Partial<Staff>) {
    const staff = this.staffRepository.create(data);
    return this.staffRepository.save(staff);
  }

  async updateStaffMember(id: string, data: Partial<Staff>) {
    const staff = await this.getStaffMemberById(id);
    Object.assign(staff, data);
    return this.staffRepository.save(staff);
  }

  // Trainer Management
  async getTrainers(gymId: string, filter: TrainerFilter = {}) {
    return this.trainerRepository.find({
      where: { user: { tenant: { id: gymId } }, ...filter },
      relations: ['user'],
    });
  }

  async getTrainerById(id: string) {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }

    return trainer;
  }

  async createTrainer(data: Partial<Trainer>) {
    const trainer = this.trainerRepository.create(data);
    return this.trainerRepository.save(trainer);
  }

  async updateTrainer(id: string, data: Partial<Trainer>) {
    const trainer = await this.getTrainerById(id);
    Object.assign(trainer, data);
    return this.trainerRepository.save(trainer);
  }

  // Specialized Queries
  async getAvailableTrainers(gymId: string) {
    return this.trainerRepository.find({
      where: {
        user: { tenant: { id: gymId } },
        isActive: true,
        isAcceptingClients: true,
      },
      relations: ['user'],
    });
  }

  async getTrainerSchedule(trainerId: string) {
    const trainer = await this.getTrainerById(trainerId);
    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found`);
    }

    // get the trainer schedule here ...
    trainer.defaultAvailability
    return trainer;
  }

  async getStaffSchedule(departmentId: string) {
    return this.staffRepository.find({
      where: {
        department: departmentId,
        isActive: true,
      },
      relations: ['user'],
    });
  }

  async updateTrainerAvailability(id: string, availability: Availability[]) {
    const trainer = await this.getTrainerById(id);
    trainer.defaultAvailability = availability;
    return this.trainerRepository.save(trainer);
  }

  async updateStaffSchedule(id: string, schedule: StaffSchedule[]) {
    const staff = await this.getStaffMemberById(id);
    staff.defaultSchedule = schedule;
    return this.staffRepository.save(staff);
  }

  // Certifications and Qualifications
  async updateTrainerCertifications(
    id: string,
    certifications: Certification[],
  ) {
    const trainer = await this.getTrainerById(id);
    trainer.certifications = certifications;
    return this.trainerRepository.save(trainer);
  }

  async getExpiredCertifications(gymId: string) {
    const today = new Date();
    const trainers = await this.trainerRepository.find({
      where: {
        user: { tenant: { id: gymId } },
        isActive: true,
      },
      relations: ['user'],
    });

    return trainers.filter((trainer) =>
      trainer.certifications.some(
        (cert: Certification) => new Date(cert.expiryDate) <= today,
      ),
    );
  }

  async softDeleteStaffMember(id: string) {
    const staff = await this.getStaffMemberById(id);
    staff.isActive = false;
    return this.staffRepository.save(staff);
  }
}
