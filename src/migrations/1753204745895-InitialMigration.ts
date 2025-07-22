import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1753204745895 implements MigrationInterface {
    name = 'InitialMigration1753204745895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "communicationPreferences" SET DEFAULT '{"email": true, "sms": false, "push": true}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ALTER COLUMN "communicationPreferences" SET DEFAULT '{"sms": false, "push": true, "email": true}'`);
    }

}
