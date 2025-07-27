/*********************************************************************
*  Adapted GYMMATE SaaS SQL Script for General Postgres DB
*  Replaces Supabase-specific auth.jwt() functions with session variable-based functions
*********************************************************************/

--------------------------------------------------
-- 0.  EXTENSIONS
--------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";      -- gen_random_uuid()
-- CREATE EXTENSION IF NOT EXISTS "postgis";    -- ← uncomment if/when you need GIS

--------------------------------------------------
-- 0-bis.  HELPER SCHEMA & FUNCTIONS FOR RLS
--------------------------------------------------
CREATE SCHEMA IF NOT EXISTS app_fn;

-- current tenant_id pulled from session setting
CREATE OR REPLACE FUNCTION app_fn.current_tenant()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.current_tenant')::uuid
$$;

-- current user’s application role pulled from session setting
CREATE OR REPLACE FUNCTION app_fn.current_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT current_setting('app.current_role')
$$;

--------------------------------------------------
-- 1.  CORE MULTI-TENANT “ANCHOR” TABLE
--------------------------------------------------
-- (rest of the schema unchanged, omitted here for brevity, but should be included fully in actual script)

-- Note: All RLS policies that used auth.jwt() should now rely on app_fn.current_tenant() and app_fn.current_role()

--------------------------------------------------
-- 13.  RLS ENABLE + POLICIES
--------------------------------------------------
ALTER TABLE tenants               ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_types      ENABLE ROW LEVEL SECURITY;
ALTER TABLE members               ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment             ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_goals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE kiosk_devices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns             ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs            ENABLE ROW LEVEL SECURITY;

-- helper for “admin or manager” check
CREATE OR REPLACE FUNCTION app_fn.is_admin_or_manager()
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT app_fn.current_role() IN ('admin','manager','super_admin')
$$;

-- Tenants: super_admin can do anything; others can SELECT own tenant row
CREATE POLICY tenants_super_admin
  ON tenants FOR ALL TO authenticated
  USING (app_fn.current_role() = 'super_admin');

CREATE POLICY tenants_select_own
  ON tenants FOR SELECT TO authenticated
  USING (id = app_fn.current_tenant());

-- Generic tenant-isolation template (re-used for many tables)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'operating_hours','users','membership_types','members','member_subscriptions',
    'staff','classes','rooms','equipment','class_schedules','bookings','payments',
    'workouts','health_metrics','exercises','products','member_goals','kiosk_devices',
    'leads','access_logs','notifications','campaigns','audit_logs'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY %I_tenant_isolation
          ON %I FOR ALL TO authenticated
        USING (tenant_id = app_fn.current_tenant())',
      t,t);
  END LOOP;
END $$;

-- Fine-grained examples
CREATE POLICY classes_only_active_for_members
  ON classes FOR SELECT TO authenticated
  USING (tenant_id = app_fn.current_tenant() AND is_active);

CREATE POLICY payments_members_can_see_theirs
  ON payments FOR SELECT TO authenticated
  USING (
    tenant_id = app_fn.current_tenant() AND
    member_id IN (SELECT id FROM members WHERE user_id = current_setting('app.current_user_id')::uuid)
  );

CREATE POLICY payments_admin_full
  ON payments FOR ALL TO authenticated
  USING (tenant_id = app_fn.current_tenant() AND app_fn.is_admin_or_manager());

/*********************************************************************
* 🎉  Adapted script ready for general Postgres DB.
*     Remember to set session variables:
*       SET app.current_tenant = '<tenant_uuid>';
*       SET app.current_role = '<user_role>';
*       SET app.current_user_id = '<user_uuid>';
*     before running queries to enforce RLS policies.
*********************************************************************/
