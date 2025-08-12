import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRbacTables1725362001234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "permissions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "description" varchar,
        "resource" varchar,
        "action" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      );
    `);

    // Modify roles table to support new RBAC system
    // Check if roles table exists
    const rolesTableExists = await queryRunner.hasTable('roles');

    if (!rolesTableExists) {
      // Create roles table if it doesn't exist
      await queryRunner.query(`
        CREATE TABLE "roles" (
          "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          "name" varchar NOT NULL UNIQUE,
          "description" varchar,
          "isActive" boolean NOT NULL DEFAULT true,
          "isSystem" boolean NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
      `);
    } else {
      // Check if needed columns exist and add them if they don't
      const roleColumns = await queryRunner.getTable('roles');

      if (!roleColumns.findColumnByName('isSystem')) {
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "isSystem" boolean NOT NULL DEFAULT false;`);
      }

      if (!roleColumns.findColumnByName('description')) {
        await queryRunner.query(`ALTER TABLE "roles" ADD COLUMN "description" varchar;`);
      }
    }

    // Create role_permissions join table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "role_permissions" (
        "roleId" uuid NOT NULL,
        "permissionId" uuid NOT NULL,
        PRIMARY KEY ("roleId", "permissionId"),
        CONSTRAINT "FK_role_permissions_role" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_role_permissions_permission" FOREIGN KEY ("permissionId") REFERENCES "permissions" ("id") ON DELETE CASCADE
      );
    `);

    // Create user_roles join table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_roles" (
        "userId" uuid NOT NULL,
        "roleId" uuid NOT NULL,
        PRIMARY KEY ("userId", "roleId"),
        CONSTRAINT "FK_user_roles_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_user_roles_role" FOREIGN KEY ("roleId") REFERENCES "roles" ("id") ON DELETE CASCADE
      );
    `);

    // Add refreshToken column to users table if it doesn't exist
    const usersTable = await queryRunner.getTable('users');
    if (!usersTable.findColumnByName('refreshToken')) {
      await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "refreshToken" varchar;`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop join tables first (due to foreign key constraints)
    await queryRunner.query(`DROP TABLE IF EXISTS "role_permissions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_roles";`);

    // Drop the new tables
    await queryRunner.query(`DROP TABLE IF EXISTS "permissions";`);

    // Remove the refreshToken column from users
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "refreshToken";`);

    // We don't drop the roles table in case it was pre-existing
  }
}
