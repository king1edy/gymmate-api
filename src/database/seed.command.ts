import { Command, CommandRunner } from 'nest-commander';
import { RbacSeeder } from './seeders/rbac.seeder';

@Command({ name: 'seed', description: 'Seed initial data' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly rbacSeeder: RbacSeeder) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.rbacSeeder.seed();
      console.log('✅ Database seeding completed successfully');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      process.exit(1);
    }
    process.exit();
  }
}
