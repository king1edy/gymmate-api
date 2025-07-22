import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GymModule } from './gym/gym.module';
import { MembershipModule } from './membership/membership.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './class/class.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MarketingModule } from './marketing/marketing.module';
import { AccessModule } from './access/access.module';
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    GymModule,
    MembershipModule,
    StaffModule,
    ClassModule,
    EquipmentModule,
    MarketingModule,
    AccessModule,
    FinancialModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: require('./auth/roles.guard').RolesGuard,
    },
  ],
})
export class AppModule {}
