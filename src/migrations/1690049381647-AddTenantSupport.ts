import { MigrationInterface, QueryRunner } from "typeorm"

export class AddTenantSupport1690049381647 implements MigrationInterface {
    name = 'AddTenantSupport1690049381647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tenant enum types
        await queryRunner.query(`
            CREATE TYPE "public"."subscription_plan_enum" AS ENUM (
                'starter',
                'professional',
                'enterprise'
            )
        `);

        await queryRunner.query(`
            CREATE TYPE "public"."subscription_status_enum" AS ENUM (
                'active',
                'trialing',
                'past_due',
                'canceled',
                'expired'
            )
        `);

        // Create tenants table
        await queryRunner.query(`
            CREATE TABLE "tenants" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "subdomain" varchar NOT NULL,
                "name" varchar NOT NULL,
                "settings" jsonb NOT NULL DEFAULT '{}',
                "subscriptionPlan" "public"."subscription_plan_enum" NOT NULL DEFAULT 'starter',
                "subscriptionStatus" "public"."subscription_status_enum" NOT NULL DEFAULT 'active',
                "subscriptionExpiresAt" TIMESTAMP,
                "featuresEnabled" text[] NOT NULL DEFAULT '{}',
                "maxMembers" integer NOT NULL,
                "maxStaff" integer NOT NULL,
                "billingInfo" jsonb,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id")
            )
        `);

        // Create unique index on subdomain
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_tenant_subdomain" ON "tenants" ("subdomain")
        `);

        // Add tenant_id to users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "tenant_id" uuid,
            ADD CONSTRAINT "FK_users_tenant" 
            FOREIGN KEY ("tenant_id") 
            REFERENCES "tenants"("id") 
            ON DELETE CASCADE
        `);

        // Create index on tenant_id and email for users
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_users_tenant_email" 
            ON "users" ("tenant_id", "email")
            WHERE "tenant_id" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_users_tenant_email"`);
        await queryRunner.query(`DROP INDEX "IDX_tenant_subdomain"`);

        // Remove tenant_id from users
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP CONSTRAINT "FK_users_tenant",
            DROP COLUMN "tenant_id"
        `);

        // Drop tenants table
        await queryRunner.query(`DROP TABLE "tenants"`);

        // Drop enum types
        await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_plan_enum"`);
    }
}
