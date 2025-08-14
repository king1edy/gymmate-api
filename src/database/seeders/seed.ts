import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { DefaultDataSeeder } from './default-data.seeder';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    logger.log('Seeding database...');
    const seeder = app.get(DefaultDataSeeder);
    await seeder.seed();
    logger.log('Seeding completed successfully');
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`, error.stack);
  } finally {
    await app.close();
  }
}

bootstrap();
