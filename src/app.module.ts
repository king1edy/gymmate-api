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
import { TenantModule } from './tenant/tenant.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MembershipModule } from './membership/membership.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './class/class.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MarketingModule } from './marketing/marketing.module';
import { AccessModule } from './access/access.module';
import { FinancialModule } from './financial/financial.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

import { config } from 'dotenv';
import * as process from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';

config();

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
      useFactory: () => {
        const sslFlag =
          String(process.env.DB_SSL ?? 'true').toLowerCase() === 'true';

        // Load CA from PATH or B64, but don't call Buffer.from on undefined
        let ca: string | undefined;
        const caPath = process.env.DB_SSL_CA_PATH;
        const caB64 = process.env.DB_SSL_CA_B64;

        if (caPath) {
          ca = fs.readFileSync(path.resolve(caPath), 'utf8');
        } else if (caB64) {
          ca = Buffer.from(caB64, 'base64').toString('utf8');
        }

        if (sslFlag && !ca) {
          // Aiven typically requires SSL with a CA. Fail early with a clear message.
          throw new Error(
            'DB_SSL is true but no CA provided. Set DB_SSL_CA_PATH (file) or DB_SSL_CA_B64 (base64).'
          );
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 5432),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
          autoLoadEntities: true,
          ssl: sslFlag
            ? {
                ca, // guaranteed defined here if sslFlag is true
                rejectUnauthorized: true,
              }
            : undefined,
        };
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('database.host'),
    //     port: configService.get('database.port'),
    //     username: configService.get('database.username'),
    //     password: configService.get('database.password'),
    //     database: configService.get('database.name'),
    //     synchronize: false, // IMPORTANT: Set to false to prevent schema changes
    //     logging: process.env.NODE_ENV === 'development',
    //     autoLoadEntities: true,
    //     ssl:
    //       process.env.DB_SSL === 'true'
    //         ? {
    //             ca: process.env.DB_SSL_CA_PATH
    //               ? require('fs').readFileSync(
    //                   process.env.DB_SSL_CA_PATH,
    //                   'utf8',
    //                 )
    //               : Buffer.from(process.env.DB_SSL_CA_B64!, 'base64').toString(
    //                   'utf8',
    //                 ),
    //             rejectUnauthorized: true,
    //           }
    //         : undefined,
    //     migrations: ['dist/migrations/*.js'],
    //     migrationsRun: false,
    //     entities: ['dist/**/*.entity.js'],
    //   }),
    //   inject: [ConfigService],
    // }),

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
