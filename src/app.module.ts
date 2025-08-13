import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
// import { GymModule } from './gym/gym.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MembershipModule } from './membership/membership.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './class/class.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MarketingModule } from './marketing/marketing.module';
import { AccessModule } from './access/access.module';
import { FinancialModule } from './financial/financial.module';
import { TenantModule } from './tenant/tenant.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),

    // Cache module
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 1000, // maximum number of items in cache
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        synchronize: false, // IMPORTANT: Set to false to prevent schema changes
        logging: process.env.NODE_ENV === 'development',
        migrations: ['dist/migrations/*.js'],
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),

    // Redis
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        password: configService.get('redis.password'),
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true, // Don't connect immediately
        // Handle connection errors gracefully
        retryDelayOnClusterDown: 300,
        enableOfflineQueue: false,
      }),
      inject: [ConfigService],
    }),

    // Other core modules
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),

    // Core modules
    // DatabaseModule,
    AuthModule,
    TenantModule,
    UserModule,

    // Business modules
    MembershipModule,
    StaffModule,
    ClassModule,
    SubscriptionModule,
    MarketingModule,
    EquipmentModule,
    FinancialModule,
    AccessModule,
    RolesModule,
    PermissionsModule,
    // BookingModule,
    // PaymentModule,
    // FitnessModule,
    // AnalyticsModule,
    // NotificationModule,

    // External services
    // StripeModule,
    // EmailModule,
    // SmsModule,
    // FileUploadModule,

    // GymModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Apply JWT guard globally
    },
  ],
})
export class AppModule {}
