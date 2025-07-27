import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1753198891228 implements MigrationInterface {
  name = 'InitialMigration1753198891228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gyms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "address" character varying, "city" character varying, "state" character varying, "country" character varying, "postalCode" character varying, "phone" character varying, "email" character varying, "website" character varying, "logoUrl" character varying, "timezone" character varying NOT NULL DEFAULT 'UTC', "currency" character varying NOT NULL DEFAULT 'USD', "businessHours" jsonb, "subscriptionPlan" character varying NOT NULL DEFAULT 'starter', "subscriptionStatus" character varying NOT NULL DEFAULT 'active', "subscriptionExpiresAt" TIMESTAMP, "maxMembers" integer NOT NULL DEFAULT '200', "featuresEnabled" jsonb NOT NULL DEFAULT '[]', "isActive" boolean NOT NULL DEFAULT true, "onboardingCompleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f048c4d4b9d5e1cc25cd1db8ba1" UNIQUE ("slug"), CONSTRAINT "PK_fe765086496cf3c8475652cddcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "emailVerificationToken" character varying, "passwordResetToken" character varying, "passwordResetExpires" TIMESTAMP, "firstName" character varying, "lastName" character varying, "phone" character varying, "dateOfBirth" date, "gender" character varying, "profilePhotoUrl" character varying, "role" character varying NOT NULL DEFAULT 'member', "status" character varying NOT NULL DEFAULT 'active', "preferences" jsonb NOT NULL DEFAULT '{}', "twoFactorEnabled" boolean NOT NULL DEFAULT false, "twoFactorSecret" character varying, "lastLoginAt" TIMESTAMP, "loginAttempts" integer NOT NULL DEFAULT '0', "lockedUntil" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trainers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specializations" text array NOT NULL DEFAULT '{}', "bio" text, "hourlyRate" numeric(10,2), "commissionRate" numeric(5,2) NOT NULL DEFAULT '0', "certifications" jsonb NOT NULL DEFAULT '[]', "defaultAvailability" jsonb, "hireDate" date, "employmentType" character varying, "isActive" boolean NOT NULL DEFAULT true, "isAcceptingClients" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_198da56395c269936d351ab774b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "membershipNumber" character varying NOT NULL, "joinDate" date NOT NULL DEFAULT ('now'::text)::date, "status" character varying NOT NULL DEFAULT 'active', "emergencyContactName" character varying, "emergencyContactPhone" character varying, "emergencyContactRelationship" character varying, "medicalConditions" text array NOT NULL DEFAULT '{}', "allergies" text array NOT NULL DEFAULT '{}', "medications" text array NOT NULL DEFAULT '{}', "fitnessGoals" text array NOT NULL DEFAULT '{}', "experienceLevel" character varying, "preferredWorkoutTimes" jsonb, "communicationPreferences" jsonb NOT NULL DEFAULT '{"email": true, "sms": false, "push": true}', "waiverSigned" boolean NOT NULL DEFAULT false, "waiverSignedDate" date, "photoConsent" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_95c5fee394c1b5e687f62c11c6f" UNIQUE ("membershipNumber"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "membership_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "billingCycle" character varying NOT NULL, "durationMonths" integer, "classCredits" integer, "guestPasses" integer NOT NULL DEFAULT '0', "trainerSessions" integer NOT NULL DEFAULT '0', "amenities" jsonb NOT NULL DEFAULT '[]', "peakHoursAccess" boolean NOT NULL DEFAULT true, "offPeakOnly" boolean NOT NULL DEFAULT false, "specificAreas" jsonb, "isActive" boolean NOT NULL DEFAULT true, "isFeatured" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_85ca9d6f4262a6bbff2a540c640" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member_memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" date NOT NULL, "endDate" date, "monthlyAmount" numeric(10,2) NOT NULL, "billingCycle" character varying NOT NULL, "nextBillingDate" date, "classCreditsRemaining" integer, "guestPassesRemaining" integer, "trainerSessionsRemaining" integer, "status" character varying NOT NULL DEFAULT 'active', "autoRenew" boolean NOT NULL DEFAULT true, "isFrozen" boolean NOT NULL DEFAULT false, "frozenUntil" date, "freezeReason" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" uuid, "membershipPlanId" uuid, CONSTRAINT "PK_a1ae11530c8ba3f5036ea3ff359" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" character varying, "department" character varying, "hourlyWage" numeric(10,2), "hireDate" date, "employmentType" character varying, "defaultSchedule" jsonb, "permissions" jsonb NOT NULL DEFAULT '[]', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lead_sources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "category" character varying NOT NULL, "acquisitionCost" numeric(10,2) NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "metrics" jsonb, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_bc885a4409ec70ee5a810dbbd6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "promoCode" character varying NOT NULL, "discountAmount" numeric(10,2) NOT NULL, "discountType" character varying NOT NULL, "minimumPurchaseAmount" integer, "maximumDiscountAmount" integer, "usageLimit" integer NOT NULL DEFAULT '-1', "usageCount" integer NOT NULL DEFAULT '0', "applicableServices" text array NOT NULL DEFAULT '{}', "excludedServices" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, "restrictions" jsonb, "metrics" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "campaignId" uuid, CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "startDate" date NOT NULL, "endDate" date NOT NULL, "budget" numeric(10,2) NOT NULL, "spent" numeric(10,2) NOT NULL DEFAULT '0', "targetAudience" text array NOT NULL DEFAULT '{}', "goals" jsonb, "channels" text array NOT NULL DEFAULT '{}', "status" character varying NOT NULL DEFAULT 'draft', "metrics" jsonb, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "status" character varying NOT NULL DEFAULT 'new', "potentialValue" numeric(10,2), "interests" text, "preferences" jsonb, "interactions" jsonb NOT NULL DEFAULT '[]', "notes" text, "lastContactedAt" TIMESTAMP, "nextFollowUpDate" TIMESTAMP, "convertedAt" TIMESTAMP, "conversionValue" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "sourceId" uuid, "campaignId" uuid, "assignedToId" uuid, CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNumber" character varying NOT NULL, "subtotal" numeric(10,2) NOT NULL, "taxAmount" numeric(10,2) NOT NULL DEFAULT '0', "discountAmount" numeric(10,2) NOT NULL DEFAULT '0', "totalAmount" numeric(10,2) NOT NULL, "invoiceDate" date NOT NULL, "dueDate" date NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "paidAmount" numeric(10,2) NOT NULL DEFAULT '0', "paidDate" date, "description" text, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "memberId" uuid, CONSTRAINT "UQ_bf8e0f9dd4558ef209ec111782d" UNIQUE ("invoiceNumber"), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "methodType" character varying NOT NULL, "cardToken" character varying, "cardLastFour" character varying(4), "cardBrand" character varying, "cardExpiresMonth" integer, "cardExpiresYear" integer, "bankToken" character varying, "bankRoutingLastFour" character varying(4), "bankAccountLastFour" character varying(4), "walletType" character varying, "walletEmail" character varying, "isDefault" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, "verifiedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" uuid, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_line_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "itemType" character varying, "itemId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" uuid, CONSTRAINT "PK_4e8ccaadaf5d0619db9d219b061" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipment_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "maintenanceIntervalDays" integer NOT NULL DEFAULT '30', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_323deb47d671c21e7666532c36c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gym_areas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "areaType" character varying, "capacity" integer, "amenities" text array NOT NULL DEFAULT '{}', "requiresBooking" boolean NOT NULL DEFAULT false, "advanceBookingHours" integer NOT NULL DEFAULT '24', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_efd3a92dc5d4a3e4da4c4fa236b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "brand" character varying, "model" character varying, "serialNumber" character varying, "purchaseDate" date, "purchasePrice" numeric(10,2), "vendor" character varying, "warrantyExpires" date, "dimensions" jsonb, "weightKg" numeric(8,2), "powerRequirements" character varying, "status" character varying NOT NULL DEFAULT 'operational', "conditionRating" integer, "lastMaintenanceDate" date, "nextMaintenanceDate" date, "maintenanceNotes" text, "qrCode" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "categoryId" uuid, "areaId" uuid, CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipment_maintenance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "maintenanceDate" date NOT NULL, "maintenanceType" character varying, "description" text NOT NULL, "partsReplaced" text array NOT NULL DEFAULT '{}', "cost" numeric(10,2), "vendor" character varying, "statusBefore" character varying, "statusAfter" character varying, "nextMaintenanceDate" date, "receiptUrl" character varying, "photos" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, "performedById" uuid, CONSTRAINT "PK_ea3b5d19cc04640d2aa3e3e7311" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "color" character varying(7), "icon" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, CONSTRAINT "PK_ba203e5ea5c793704ba1c8abf84" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "durationMinutes" integer NOT NULL, "capacity" integer NOT NULL DEFAULT '20', "price" numeric(10,2) NOT NULL DEFAULT '0', "creditsRequired" integer NOT NULL DEFAULT '1', "skillLevel" character varying, "ageRestriction" character varying, "equipmentNeeded" text array NOT NULL DEFAULT '{}', "imageUrl" character varying, "videoUrl" character varying, "instructions" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "categoryId" uuid, CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "capacityOverride" integer, "priceOverride" numeric(10,2), "status" character varying NOT NULL DEFAULT 'scheduled', "cancellationReason" text, "instructorNotes" text, "adminNotes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "classId" uuid, "trainerId" uuid, "areaId" uuid, CONSTRAINT "PK_2300f700f17303f84f7f4df153b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_waitlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer NOT NULL, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "notifiedAt" TIMESTAMP, "expiresAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'waiting', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" uuid, "classScheduleId" uuid, CONSTRAINT "PK_0aba9b4120b0585de1460694cc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_control" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "controlType" character varying NOT NULL, "serialNumber" character varying, "manufacturer" character varying, "model" character varying, "configuration" jsonb, "isActive" boolean NOT NULL DEFAULT true, "scheduleRestrictions" jsonb, "maintenanceHistory" jsonb, "lastMaintenanceDate" TIMESTAMP, "nextMaintenanceDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "gymId" uuid, "areaId" uuid, CONSTRAINT "PK_b9de1f7fe64190ed206929a6d24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cardId" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "isSuccessful" boolean NOT NULL, "failureReason" character varying, "direction" character varying, "metadata" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accessPointId" uuid, "memberId" uuid, CONSTRAINT "PK_73016a99e25b421f7bca271ca86" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "class_bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bookingDate" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'confirmed', "creditsUsed" integer NOT NULL DEFAULT '1', "amountPaid" numeric(10,2) NOT NULL DEFAULT '0', "checkedInAt" TIMESTAMP, "checkedOutAt" TIMESTAMP, "cancelledAt" TIMESTAMP, "cancellationReason" text, "memberNotes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" uuid, "classScheduleId" uuid, CONSTRAINT "PK_f7e9a0dc46cfa49284159436d19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cardId" character varying NOT NULL, "cardType" character varying, "isActive" boolean NOT NULL DEFAULT true, "activatedAt" TIMESTAMP, "deactivatedAt" TIMESTAMP, "deactivationReason" character varying, "expiresAt" TIMESTAMP, "restrictions" jsonb, "cardDetails" jsonb, "deposit" numeric(10,2), "depositPaidAt" TIMESTAMP, "depositRefundedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "memberId" uuid, CONSTRAINT "UQ_c047554d237d541dceb2beceac7" UNIQUE ("cardId"), CONSTRAINT "PK_7f7b4000c15036378cd91cd0e24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c2eb2f3b7991ab4186947ebf6ad" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainers" ADD CONSTRAINT "FK_df0f86b968a8e5d73a9cab39278" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_839756572a2c38eb5a3b563126e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership_plans" ADD CONSTRAINT "FK_c5bad6a0f6a4496f5b31b79ca64" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_memberships" ADD CONSTRAINT "FK_6d6f3d0cf81b401adb77da69df6" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_memberships" ADD CONSTRAINT "FK_ceb4c63f12c5e3fef9dea54f73b" FOREIGN KEY ("membershipPlanId") REFERENCES "membership_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_sources" ADD CONSTRAINT "FK_aa5b42df10e9d376104e6f11447" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotions" ADD CONSTRAINT "FK_2058a920f2a6c50eb32d44a48ed" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotions" ADD CONSTRAINT "FK_3b31e6ae52c00fe24d294b32e89" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_528d8bb06e801ce76da4db5a7d4" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_32da1918a3f32083e78f484ee82" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_94e6a188031415c57878687a7ef" FOREIGN KEY ("sourceId") REFERENCES "lead_sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_6873e5924bc699a1a65b4fb099a" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "FK_533da3a3887638192a5dfa2c176" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_172d3acb2f508c644ab31e36f2b" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" ADD CONSTRAINT "FK_868e5c599793133d24ec3508ee3" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" ADD CONSTRAINT "FK_9b935340377695c8406b9cdb4c1" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_items" ADD CONSTRAINT "FK_2ec8b1cda36ed79a7ded49bd913" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_categories" ADD CONSTRAINT "FK_946d1bb0656afb18be3f37d7680" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_areas" ADD CONSTRAINT "FK_b0ec1606a57f79b60c98fc6a39c" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_e0c87403de1cfe80ea3e5e7cc02" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_e9a70380dd18202c3f3fe854b08" FOREIGN KEY ("categoryId") REFERENCES "equipment_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" ADD CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b" FOREIGN KEY ("areaId") REFERENCES "gym_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_73b7d8b4873cb152d35db890124" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_60966db9cda14313f760dfe8601" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_categories" ADD CONSTRAINT "FK_bdc0e877387dddc8869a4b59ddd" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_888ef7551efecef2f01dfda1694" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" ADD CONSTRAINT "FK_ddee27d3d060238d54eced3b24a" FOREIGN KEY ("categoryId") REFERENCES "class_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_f128816d75ea74b7df510a82bd2" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_5eec95e02d031620c738283c4e4" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" ADD CONSTRAINT "FK_13236b05ccc44ace7c64cdc50a3" FOREIGN KEY ("areaId") REFERENCES "gym_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_waitlists" ADD CONSTRAINT "FK_eac49d88ff4c0dd494508f58dd6" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_waitlists" ADD CONSTRAINT "FK_28f989fc858bbc254e07c95e150" FOREIGN KEY ("classScheduleId") REFERENCES "class_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_41f301497d2e123e262bb88f12e" FOREIGN KEY ("gymId") REFERENCES "gyms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" ADD CONSTRAINT "FK_7d88fca3b5e04c22164b87eaa60" FOREIGN KEY ("areaId") REFERENCES "gym_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_logs" ADD CONSTRAINT "FK_e79508816a5e396904627e43f9b" FOREIGN KEY ("accessPointId") REFERENCES "access_control"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_logs" ADD CONSTRAINT "FK_89b97a3a385b745f5125aeb7105" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_bookings" ADD CONSTRAINT "FK_61230d13e7122b615f1f7990a10" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_bookings" ADD CONSTRAINT "FK_c807a6662de84fc0e4182516d1b" FOREIGN KEY ("classScheduleId") REFERENCES "class_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_cards" ADD CONSTRAINT "FK_d6344c6df2f19e0d15839660fa1" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "access_cards" DROP CONSTRAINT "FK_d6344c6df2f19e0d15839660fa1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_bookings" DROP CONSTRAINT "FK_c807a6662de84fc0e4182516d1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_bookings" DROP CONSTRAINT "FK_61230d13e7122b615f1f7990a10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_logs" DROP CONSTRAINT "FK_89b97a3a385b745f5125aeb7105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_logs" DROP CONSTRAINT "FK_e79508816a5e396904627e43f9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_7d88fca3b5e04c22164b87eaa60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_control" DROP CONSTRAINT "FK_41f301497d2e123e262bb88f12e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_waitlists" DROP CONSTRAINT "FK_28f989fc858bbc254e07c95e150"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_waitlists" DROP CONSTRAINT "FK_eac49d88ff4c0dd494508f58dd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_13236b05ccc44ace7c64cdc50a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_5eec95e02d031620c738283c4e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_f128816d75ea74b7df510a82bd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_ddee27d3d060238d54eced3b24a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_888ef7551efecef2f01dfda1694"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_categories" DROP CONSTRAINT "FK_bdc0e877387dddc8869a4b59ddd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_60966db9cda14313f760dfe8601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_73b7d8b4873cb152d35db890124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_63108a7875b1edbd0e3d2a6086b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_e9a70380dd18202c3f3fe854b08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment" DROP CONSTRAINT "FK_e0c87403de1cfe80ea3e5e7cc02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gym_areas" DROP CONSTRAINT "FK_b0ec1606a57f79b60c98fc6a39c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_categories" DROP CONSTRAINT "FK_946d1bb0656afb18be3f37d7680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_line_items" DROP CONSTRAINT "FK_2ec8b1cda36ed79a7ded49bd913"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_methods" DROP CONSTRAINT "FK_9b935340377695c8406b9cdb4c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_868e5c599793133d24ec3508ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoices" DROP CONSTRAINT "FK_172d3acb2f508c644ab31e36f2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_533da3a3887638192a5dfa2c176"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_6873e5924bc699a1a65b4fb099a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_94e6a188031415c57878687a7ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_32da1918a3f32083e78f484ee82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_528d8bb06e801ce76da4db5a7d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotions" DROP CONSTRAINT "FK_3b31e6ae52c00fe24d294b32e89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotions" DROP CONSTRAINT "FK_2058a920f2a6c50eb32d44a48ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_sources" DROP CONSTRAINT "FK_aa5b42df10e9d376104e6f11447"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_memberships" DROP CONSTRAINT "FK_ceb4c63f12c5e3fef9dea54f73b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_memberships" DROP CONSTRAINT "FK_6d6f3d0cf81b401adb77da69df6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "membership_plans" DROP CONSTRAINT "FK_c5bad6a0f6a4496f5b31b79ca64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_839756572a2c38eb5a3b563126e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trainers" DROP CONSTRAINT "FK_df0f86b968a8e5d73a9cab39278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c2eb2f3b7991ab4186947ebf6ad"`,
    );
    await queryRunner.query(`DROP TABLE "access_cards"`);
    await queryRunner.query(`DROP TABLE "class_bookings"`);
    await queryRunner.query(`DROP TABLE "access_logs"`);
    await queryRunner.query(`DROP TABLE "access_control"`);
    await queryRunner.query(`DROP TABLE "class_waitlists"`);
    await queryRunner.query(`DROP TABLE "class_schedules"`);
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TABLE "class_categories"`);
    await queryRunner.query(`DROP TABLE "equipment_maintenance"`);
    await queryRunner.query(`DROP TABLE "equipment"`);
    await queryRunner.query(`DROP TABLE "gym_areas"`);
    await queryRunner.query(`DROP TABLE "equipment_categories"`);
    await queryRunner.query(`DROP TABLE "invoice_line_items"`);
    await queryRunner.query(`DROP TABLE "payment_methods"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TABLE "promotions"`);
    await queryRunner.query(`DROP TABLE "lead_sources"`);
    await queryRunner.query(`DROP TABLE "staff"`);
    await queryRunner.query(`DROP TABLE "member_memberships"`);
    await queryRunner.query(`DROP TABLE "membership_plans"`);
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(`DROP TABLE "trainers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "gyms"`);
  }
}
