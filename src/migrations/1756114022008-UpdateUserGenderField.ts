import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserGenderField1756114022008 implements MigrationInterface {
  name = 'UpdateUserGenderField1756114022008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the gender column exists and what type it is
    const table = await queryRunner.getTable('users');
    const genderColumn = table?.findColumnByName('gender');

    if (genderColumn) {
      // If column exists but is wrong type, alter it
      await queryRunner.query(
        `ALTER TABLE "users" ALTER COLUMN "gender" TYPE varchar`,
      );
    } else {
      // If column doesn't exist, add it
      await queryRunner.query(
        `ALTER TABLE "users" ADD COLUMN "gender" varchar`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the changes - this depends on your previous state
    // If the column didn't exist before, drop it
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "gender"`,
    );
  }
}
