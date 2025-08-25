import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAddressField1756112772038 implements MigrationInterface {
  name = 'UpdateUserAddressField1756112772038';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the address column exists and what type it is
    const table = await queryRunner.getTable('users');
    const addressColumn = table?.findColumnByName('address');

    if (addressColumn) {
      // If column exists but is wrong type, alter it
      await queryRunner.query(
        `ALTER TABLE "users" ALTER COLUMN "address" TYPE text`,
      );
    } else {
      // If column doesn't exist, add it
      await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "address" text`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes - this depends on your previous state
    // If the column didn't exist before, drop it
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "address"`,
    );

    // If it existed with a different type, you'd change it back:
    // await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" TYPE varchar`);
  }
}
