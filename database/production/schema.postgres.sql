-- HRMS Portal production database schema
-- Target database: PostgreSQL / Supabase-compatible PostgreSQL
-- Generated for beta deployment planning from the current HRMS prototype modules.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  legal_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'employee', 'ticket_only')),
  status text NOT NULL DEFAULT 'active',
  auth_provider_id uuid,
  password_hash text,
  must_change_password boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employees (
  id text PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  directory_name text,
  email text NOT NULL UNIQUE,
  department text,
  role text,
  location_policy text,
  signup_code text,
  status text NOT NULL DEFAULT 'Pending',
  signed_up boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employee_credentials_demo (
  employee_id text PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  demo_password text,
  note text NOT NULL DEFAULT 'For prototype migration only. Replace with auth provider/password hash before production.'
);

CREATE TABLE employee_profiles (
  employee_id text PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  phone text,
  designation text,
  base_location text,
  legal_full_name text,
  date_of_birth date,
  personal_email text,
  mother_name text,
  father_name text,
  husband_guardian_name text,
  marital_status text,
  blood_group text,
  emergency_contact text,
  bank_name text,
  account_number text,
  ifsc_code text,
  pan text,
  aadhar_no text,
  experienced_fresher text,
  pf_available text,
  pf_no text,
  uan_no text,
  same_as_present_address boolean NOT NULL DEFAULT false,
  profile_edit_allowed boolean NOT NULL DEFAULT true,
  profile_reviewed boolean NOT NULL DEFAULT false,
  onboarding_submitted_at text,
  raw_profile jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_onboarding_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_onboarding_labels jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employee_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  address_type text NOT NULL CHECK (address_type IN ('present', 'permanent')),
  line1 text,
  line2 text,
  state text,
  pin text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(employee_id, address_type)
);

CREATE TABLE employee_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  degree text,
  marks_obtained text,
  university text,
  city text,
  year_of_passing text,
  row_order integer NOT NULL DEFAULT 0,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employee_previous_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_name text,
  address text,
  designation text,
  reporting text,
  contact_details text,
  row_order integer NOT NULL DEFAULT 0,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employee_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_key text,
  document_name text NOT NULL,
  file_name text,
  storage_path text,
  uploaded_at text,
  is_required boolean NOT NULL DEFAULT true,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employee_hiring (
  employee_id text PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  offer_status text,
  offer_sent_at text,
  offer_accepted_at text,
  onboarding_submitted_at text,
  offer_draft_subject text,
  offer_draft_body text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE onboarding_template_fields (
  field_key text PRIMARY KEY,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  required boolean NOT NULL DEFAULT false,
  row_order integer NOT NULL DEFAULT 0,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE activity_template_fields (
  field_key text PRIMARY KEY,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  required boolean NOT NULL DEFAULT false,
  read_only boolean NOT NULL DEFAULT false,
  dropdown_options jsonb NOT NULL DEFAULT '[]'::jsonb,
  row_order integer NOT NULL DEFAULT 0,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE activity_logs (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  sl_no integer,
  row_status text NOT NULL DEFAULT 'Draft',
  activity_date date,
  saved_at text,
  submitted_at text,
  last_update text,
  values_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE attendance_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  office_name text,
  latitude numeric,
  longitude numeric,
  radius_meters integer NOT NULL DEFAULT 15,
  check_in_time time,
  check_in_grace_minutes integer,
  check_out_time time,
  check_out_grace_minutes integer,
  timing_rule_enabled boolean NOT NULL DEFAULT true,
  location_rule_enabled boolean NOT NULL DEFAULT true,
  locked boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE attendance_policy_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_by text,
  updated_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE attendance_records (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_type text NOT NULL,
  attendance_date date,
  attendance_time text,
  latitude numeric,
  longitude numeric,
  distance_meters numeric,
  source text NOT NULL DEFAULT 'prototype',
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE attendance_adjustment_claims (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_date date,
  claim_type text NOT NULL,
  proposed_time text,
  proposed_check_in_time text,
  proposed_check_out_time text,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  submitted_at text,
  resolved_at text,
  resolved_by text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE wfh_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_limit integer NOT NULL DEFAULT 1,
  monthly_limit integer NOT NULL DEFAULT 2,
  request_window_months integer NOT NULL DEFAULT 6,
  locked boolean NOT NULL DEFAULT true,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE wfh_policy_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_by text,
  updated_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE leave_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  privilege_leave_yearly_limit integer NOT NULL DEFAULT 16,
  sick_leave_yearly_limit integer NOT NULL DEFAULT 7,
  request_window_months integer NOT NULL DEFAULT 6,
  carry_forward_enabled boolean NOT NULL DEFAULT true,
  locked boolean NOT NULL DEFAULT true,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE leave_policy_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_by text,
  updated_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE wfh_requests (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  request_date date,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at text,
  reviewed_at text,
  reviewed_by text,
  revoked_at text,
  created_by text,
  is_special boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE leave_requests (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_date date,
  leave_type text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at text,
  reviewed_at text,
  reviewed_by text,
  revoked_at text,
  created_by text,
  is_special boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE holiday_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id text,
  group_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE holidays (
  id text PRIMARY KEY,
  holiday_date date NOT NULL,
  day_name text,
  holiday_name text NOT NULL,
  holiday_type text NOT NULL CHECK (holiday_type IN ('CH', 'RH', 'Holiday', 'Sunday')),
  group_id text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE holiday_requests (
  id text PRIMARY KEY,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  holiday_date date,
  holiday_name text,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at text,
  reviewed_at text,
  reviewed_by text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employee_groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  parent_id text REFERENCES employee_groups(id) ON DELETE SET NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE employee_group_members (
  group_id text NOT NULL REFERENCES employee_groups(id) ON DELETE CASCADE,
  employee_id text NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, employee_id)
);

CREATE TABLE ticket_users (
  id text PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'Employee',
  client_name text,
  mobile_number text,
  password_hash text,
  demo_password text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ticket_groups (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  is_hrms_group boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ticket_group_members (
  ticket_group_id text NOT NULL REFERENCES ticket_groups(id) ON DELETE CASCADE,
  member_ref text NOT NULL,
  member_type text NOT NULL CHECK (member_type IN ('employee', 'ticket_only')),
  PRIMARY KEY (ticket_group_id, member_ref, member_type)
);

CREATE TABLE tickets (
  id text PRIMARY KEY,
  subject text NOT NULL,
  description text,
  category text,
  priority text,
  group_id text,
  agent_ref text,
  department text,
  requester_ref text,
  status text NOT NULL DEFAULT 'Open',
  sla_status text,
  due_at text,
  created_at text,
  updated_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE notifications (
  id text PRIMARY KEY,
  recipient_role text,
  employee_id text REFERENCES employees(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  tone text,
  category text,
  resolved boolean NOT NULL DEFAULT false,
  created_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE email_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text,
  sender_email text,
  smtp_host text,
  smtp_port text,
  configured boolean NOT NULL DEFAULT false,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE email_templates (
  id text PRIMARY KEY,
  template_name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text,
  subject text NOT NULL,
  body text,
  status text NOT NULL DEFAULT 'draft',
  sent_at text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE app_state_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_name text NOT NULL,
  storage_key text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  state_json jsonb NOT NULL
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_attendance_records_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_activity_logs_employee_date ON activity_logs(employee_id, activity_date);
CREATE INDEX idx_wfh_requests_employee_date ON wfh_requests(employee_id, request_date);
CREATE INDEX idx_leave_requests_employee_date ON leave_requests(employee_id, leave_date);
CREATE INDEX idx_notifications_employee_resolved ON notifications(employee_id, resolved);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_holidays_date ON holidays(holiday_date);
