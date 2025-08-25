// src/common/service/cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRedis() private redis: Redis,
  ) {}

  // Tenant-specific caching
  async getTenantData<T>(tenantId: string, key: string): Promise<T | null> {
    const cacheKey = `tenant:${tenantId}:${key}`;
    const result = await this.cacheManager.get<T>(cacheKey);
    return result ?? null;
  }

  async setTenantData<T>(
    tenantId: string,
    key: string,
    data: T,
    ttl = 300,
  ): Promise<void> {
    const cacheKey = `tenant:${tenantId}:${key}`;
    await this.cacheManager.set(cacheKey, data, ttl);
  }

  async deleteTenantData(tenantId: string, key: string): Promise<void> {
    const cacheKey = `tenant:${tenantId}:${key}`;
    await this.cacheManager.del(cacheKey);
  }

  // Session management for real-time features
  async setUserSession(
    userId: string,
    tenantId: string,
    data: any,
  ): Promise<void> {
    const sessionKey = `session:${tenantId}:${userId}`;
    await this.redis.setex(sessionKey, 3600, JSON.stringify(data));
  }

  async getUserSession(userId: string, tenantId: string): Promise<any | null> {
    const sessionKey = `session:${tenantId}:${userId}`;
    const result = await this.redis.get(sessionKey);
    return result ? JSON.parse(result) : null;
  }

  async removeUserSession(userId: string, tenantId: string): Promise<void> {
    const sessionKey = `session:${tenantId}:${userId}`;
    await this.redis.del(sessionKey);
  }

  // Real-time booking locks
  async acquireBookingLock(
    classScheduleId: string,
    userId: string,
  ): Promise<boolean> {
    const lockKey = `booking_lock:${classScheduleId}`;
    const lockValue = `${userId}:${Date.now()}`;

    // Use Redis SET with NX and EX for atomic lock
    const result = await this.redis.set(lockKey, lockValue, 'EX', 30, 'NX');
    return result === 'OK';
  }

  async releaseBookingLock(classScheduleId: string): Promise<void> {
    const lockKey = `booking_lock:${classScheduleId}`;
    await this.redis.del(lockKey);
  }

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
