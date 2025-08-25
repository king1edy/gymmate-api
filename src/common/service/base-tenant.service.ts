import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  DeepPartial,
} from 'typeorm';
import { CacheService } from './cache.service';
import { TenantAwareEntity } from 'src/types/interfaces';

@Injectable()
export abstract class BaseTenantService<T extends TenantAwareEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly cacheService: CacheService,
  ) {}

  protected async findByTenant(
    tenantId: string,
    options?: Omit<FindManyOptions<T>, 'where'> & {
      where?: Omit<FindOptionsWhere<T>, 'tenantId'>;
    },
  ): Promise<T[]> {
    return this.repository.find({
      ...options,
      where: {
        tenantId,
        ...(options?.where || {}),
      } as FindOptionsWhere<T>,
    });
  }

  protected async findOneByTenant(
    tenantId: string,
    options?: Omit<FindManyOptions<T>, 'where'> & {
      where?: Omit<FindOptionsWhere<T>, 'tenantId'>;
    },
  ): Promise<T | null> {
    return this.repository.findOne({
      ...options,
      where: {
        tenantId,
        ...(options?.where || {}),
      } as FindOptionsWhere<T>,
    });
  }

  protected async createWithTenant(
    tenantId: string,
    data: Omit<DeepPartial<T>, 'tenantId'>,
  ): Promise<T> {
    const entity = this.repository.create({
      ...data,
      tenantId,
    } as DeepPartial<T>);
    return this.repository.save(entity);
  }

  protected async updateByTenant(
    tenantId: string,
    id: string,
    data: Omit<Partial<T>, 'tenantId' | 'id'>,
  ): Promise<T | null> {
    await this.repository.update({ id, tenantId } as any, data as any);

    return this.findOneByTenant(tenantId, { where: { id } as any });
  }

  protected async deleteByTenant(
    tenantId: string,
    id: string,
  ): Promise<boolean> {
    const result = await this.repository.delete({ id, tenantId } as any);
    return !!(result.affected && result.affected > 0);
  }
}
