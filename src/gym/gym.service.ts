import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gym } from './gym.entity';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { GymResponseDto } from './dto/gym-response.dto';

@Injectable()
export class GymService {
  constructor(
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
  ) {}

  async create(createGymDto: CreateGymDto): Promise<GymResponseDto> {
    const gym = this.gymRepository.create(createGymDto);
    await this.gymRepository.save(gym);
    return this.toResponseDto(gym);
  }

  async findAll(): Promise<GymResponseDto[]> {
    const gyms = await this.gymRepository.find();
    return gyms.map((gym) => this.toResponseDto(gym));
  }

  async findOne(id: string): Promise<GymResponseDto> {
    const gym = await this.gymRepository.findOne({ where: { id } });
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    return this.toResponseDto(gym);
  }

  async update(
    id: string,
    updateGymDto: UpdateGymDto,
  ): Promise<GymResponseDto> {
    const gym = await this.gymRepository.findOne({ where: { id } });
    if (!gym) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
    const updatedGym = this.gymRepository.merge(gym, updateGymDto);
    await this.gymRepository.save(updatedGym);
    return this.toResponseDto(updatedGym);
  }

  async remove(id: string): Promise<void> {
    const result = await this.gymRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Gym with ID ${id} not found`);
    }
  }

  private toResponseDto(gym: Gym): GymResponseDto {
    const responseDto = new GymResponseDto();
    Object.assign(responseDto, gym);
    return responseDto;
  }
}
