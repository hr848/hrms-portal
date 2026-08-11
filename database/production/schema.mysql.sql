-- HRMS Portal production database schema
-- Target database: MySQL 8.0+
-- MySQL conversion preserving the PostgreSQL schema structure and relationships.

CREATE TABLE companies (
  id CHAR(36) NOT NULL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  employee_id VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) NOT NULL CHECK (role IN ('admin', 'employee', 'ticket_only')),
  status VARCHAR(255) NOT NULL DEFAULT 'active',
  auth_provider_id CHAR(36),
  password_hash VARCHAR(255),
  must_change_password TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE employees (
  id VARCHAR(255) PRIMARY KEY,
  user_id CHAR(36) REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  directory_name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(255),
  role VARCHAR(255),
  location_policy VARCHAR(255),
  signup_code VARCHAR(255),
  status VARCHAR(255) NOT NULL DEFAULT 'Pending',
  signed_up TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE employee_credentials_demo (
  employee_id VARCHAR(255) PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  demo_password VARCHAR(255),
  note VARCHAR(255) NOT NULL DEFAULT 'For prototype migration only. Replace with auth provider/password hash before production.'
);

CREATE TABLE employee_profiles (
  employee_id VARCHAR(255) PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  phone VARCHAR(255),
  designation VARCHAR(255),
  base_location VARCHAR(255),
  legal_full_name VARCHAR(255),
  date_of_birth date,
  personal_email VARCHAR(255),
  mother_name VARCHAR(255),
  father_name VARCHAR(255),
  husband_guardian_name VARCHAR(255),
  marital_status VARCHAR(255),
  blood_group VARCHAR(255),
  emergency_contact VARCHAR(255),
  bank_name VARCHAR(255),
  account_number VARCHAR(255),
  ifsc_code VARCHAR(255),
  pan VARCHAR(255),
  aadhar_no VARCHAR(255),
  experienced_fresher VARCHAR(255),
  pf_available VARCHAR(255),
  pf_no VARCHAR(255),
  uan_no VARCHAR(255),
  same_as_present_address TINYINT(1) NOT NULL DEFAULT false,
  profile_edit_allowed TINYINT(1) NOT NULL DEFAULT true,
  profile_reviewed TINYINT(1) NOT NULL DEFAULT false,
  onboarding_submitted_at VARCHAR(255),
  raw_profile JSON NOT NULL DEFAULT (JSON_OBJECT()),
  raw_onboarding_details JSON NOT NULL DEFAULT (JSON_OBJECT()),
  raw_onboarding_labels JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE employee_addresses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  address_type VARCHAR(255) NOT NULL CHECK (address_type IN ('present', 'permanent')),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  state VARCHAR(255),
  pin VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  UNIQUE(employee_id, address_type)
);

CREATE TABLE employee_education (
  id CHAR(36) NOT NULL PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  degree VARCHAR(255),
  marks_obtained VARCHAR(255),
  university VARCHAR(255),
  city VARCHAR(255),
  year_of_passing VARCHAR(255),
  row_order INT NOT NULL DEFAULT 0,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE employee_previous_companies (
  id CHAR(36) NOT NULL PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  address VARCHAR(255),
  designation VARCHAR(255),
  reporting VARCHAR(255),
  contact_details VARCHAR(255),
  row_order INT NOT NULL DEFAULT 0,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE employee_attachments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_key VARCHAR(255),
  document_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255),
  storage_path VARCHAR(1024),
  uploaded_at VARCHAR(255),
  is_required TINYINT(1) NOT NULL DEFAULT true,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE employee_hiring (
  employee_id VARCHAR(255) PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
  offer_status VARCHAR(255),
  offer_sent_at VARCHAR(255),
  offer_accepted_at VARCHAR(255),
  onboarding_submitted_at VARCHAR(255),
  offer_draft_subject VARCHAR(255),
  offer_draft_body TEXT,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE onboarding_template_fields (
  field_key VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(255) NOT NULL DEFAULT 'VARCHAR(255)',
  required TINYINT(1) NOT NULL DEFAULT false,
  row_order INT NOT NULL DEFAULT 0,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE activity_template_fields (
  field_key VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  field_type VARCHAR(255) NOT NULL DEFAULT 'VARCHAR(255)',
  required TINYINT(1) NOT NULL DEFAULT false,
  read_only TINYINT(1) NOT NULL DEFAULT false,
  dropdown_options JSON NOT NULL DEFAULT (JSON_ARRAY()),
  row_order INT NOT NULL DEFAULT 0,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE activity_logs (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  sl_no INT,
  row_status VARCHAR(255) NOT NULL DEFAULT 'Draft',
  activity_date date,
  saved_at VARCHAR(255),
  submitted_at VARCHAR(255),
  last_update VARCHAR(255),
  values_json JSON NOT NULL DEFAULT (JSON_OBJECT()),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE attendance_policy (
  id CHAR(36) NOT NULL PRIMARY KEY,
  office_name VARCHAR(255),
  latitude DECIMAL(18,6),
  longitude DECIMAL(18,6),
  radius_meters INT NOT NULL DEFAULT 15,
  check_in_time time,
  check_in_grace_minutes INT,
  check_out_time time,
  check_out_grace_minutes INT,
  timing_rule_enabled TINYINT(1) NOT NULL DEFAULT true,
  location_rule_enabled TINYINT(1) NOT NULL DEFAULT true,
  locked TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE attendance_policy_history (
  id CHAR(36) NOT NULL PRIMARY KEY,
  updated_by VARCHAR(255),
  updated_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE attendance_records (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_type VARCHAR(255) NOT NULL,
  attendance_date date,
  attendance_time VARCHAR(255),
  latitude DECIMAL(18,6),
  longitude DECIMAL(18,6),
  distance_meters DECIMAL(18,6),
  source VARCHAR(255) NOT NULL DEFAULT 'prototype',
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE attendance_adjustment_claims (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  attendance_date date,
  claim_type VARCHAR(255) NOT NULL,
  proposed_time VARCHAR(255),
  proposed_check_in_time VARCHAR(255),
  proposed_check_out_time VARCHAR(255),
  reason TEXT NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'Pending',
  submitted_at VARCHAR(255),
  resolved_at VARCHAR(255),
  resolved_by VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE wfh_policy (
  id CHAR(36) NOT NULL PRIMARY KEY,
  weekly_limit INT NOT NULL DEFAULT 1,
  monthly_limit INT NOT NULL DEFAULT 2,
  request_window_months INT NOT NULL DEFAULT 6,
  locked TINYINT(1) NOT NULL DEFAULT true,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE wfh_policy_history (
  id CHAR(36) NOT NULL PRIMARY KEY,
  updated_by VARCHAR(255),
  updated_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE leave_policy (
  id CHAR(36) NOT NULL PRIMARY KEY,
  privilege_leave_yearly_limit INT NOT NULL DEFAULT 16,
  sick_leave_yearly_limit INT NOT NULL DEFAULT 7,
  request_window_months INT NOT NULL DEFAULT 6,
  carry_forward_enabled TINYINT(1) NOT NULL DEFAULT true,
  locked TINYINT(1) NOT NULL DEFAULT true,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE leave_policy_history (
  id CHAR(36) NOT NULL PRIMARY KEY,
  updated_by VARCHAR(255),
  updated_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE wfh_requests (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  request_date date,
  reason TEXT,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  submitted_at VARCHAR(255),
  reviewed_at VARCHAR(255),
  reviewed_by VARCHAR(255),
  revoked_at VARCHAR(255),
  created_by VARCHAR(255),
  is_special TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE leave_requests (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_date date,
  leave_type VARCHAR(255) NOT NULL,
  reason TEXT,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  submitted_at VARCHAR(255),
  reviewed_at VARCHAR(255),
  reviewed_by VARCHAR(255),
  revoked_at VARCHAR(255),
  created_by VARCHAR(255),
  is_special TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE holiday_groups (
  id CHAR(36) NOT NULL PRIMARY KEY,
  group_id VARCHAR(255),
  group_name VARCHAR(255) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE holidays (
  id VARCHAR(255) PRIMARY KEY,
  holiday_date date NOT NULL,
  day_name VARCHAR(255),
  holiday_name VARCHAR(255) NOT NULL,
  holiday_type VARCHAR(255) NOT NULL CHECK (holiday_type IN ('CH', 'RH', 'Holiday', 'Sunday')),
  group_id VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE holiday_requests (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  holiday_date date,
  holiday_name VARCHAR(255),
  reason TEXT,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  submitted_at VARCHAR(255),
  reviewed_at VARCHAR(255),
  reviewed_by VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE employee_groups (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id VARCHAR(255) REFERENCES employee_groups(id) ON DELETE SET NULL,
  is_default TINYINT(1) NOT NULL DEFAULT false,
  created_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE employee_group_members (
  group_id VARCHAR(255) NOT NULL REFERENCES employee_groups(id) ON DELETE CASCADE,
  employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  added_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (group_id, employee_id)
);

CREATE TABLE ticket_users (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) NOT NULL DEFAULT 'Employee',
  client_name VARCHAR(255),
  mobile_number VARCHAR(255),
  password_hash VARCHAR(255),
  demo_password VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE ticket_groups (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_hrms_group TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT()),
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE ticket_group_members (
  ticket_group_id VARCHAR(255) NOT NULL REFERENCES ticket_groups(id) ON DELETE CASCADE,
  member_ref VARCHAR(255) NOT NULL,
  member_type VARCHAR(255) NOT NULL CHECK (member_type IN ('employee', 'ticket_only')),
  PRIMARY KEY (ticket_group_id, member_ref, member_type)
);

CREATE TABLE tickets (
  id VARCHAR(255) PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  priority VARCHAR(255),
  group_id VARCHAR(255),
  agent_ref VARCHAR(255),
  department VARCHAR(255),
  requester_ref VARCHAR(255),
  status VARCHAR(255) NOT NULL DEFAULT 'Open',
  sla_status VARCHAR(255),
  due_at VARCHAR(255),
  created_at VARCHAR(255),
  updated_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  recipient_role VARCHAR(255),
  employee_id VARCHAR(255) REFERENCES employees(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  tone VARCHAR(255),
  category VARCHAR(255),
  resolved TINYINT(1) NOT NULL DEFAULT false,
  created_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE email_config (
  id CHAR(36) NOT NULL PRIMARY KEY,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  smtp_host VARCHAR(255),
  smtp_port VARCHAR(255),
  configured TINYINT(1) NOT NULL DEFAULT false,
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE email_templates (
  id VARCHAR(255) PRIMARY KEY,
  template_name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  variables JSON NOT NULL DEFAULT (JSON_ARRAY()),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE email_logs (
  id CHAR(36) NOT NULL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  body TEXT,
  status VARCHAR(255) NOT NULL DEFAULT 'draft',
  sent_at VARCHAR(255),
  raw_data JSON NOT NULL DEFAULT (JSON_OBJECT())
);

CREATE TABLE app_state_snapshots (
  id CHAR(36) NOT NULL PRIMARY KEY,
  snapshot_name VARCHAR(255) NOT NULL,
  storage_key VARCHAR(255) NOT NULL,
  captured_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  state_json JSON NOT NULL
);

-- Compatibility table used by the current portal API. The complete shared
-- state is stored here so existing frontend behavior is preserved while the
-- application is migrated to normalized tables in a later phase.
CREATE TABLE hrms_portal_state (
  app_key VARCHAR(255) NOT NULL PRIMARY KEY,
  payload JSON NOT NULL,
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE hrms_analytics_state (
  app_key VARCHAR(190) NOT NULL PRIMARY KEY,
  payload LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_attendance_records_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_activity_logs_employee_date ON activity_logs(employee_id, activity_date);
CREATE INDEX idx_wfh_requests_employee_date ON wfh_requests(employee_id, request_date);
CREATE INDEX idx_leave_requests_employee_date ON leave_requests(employee_id, leave_date);
CREATE INDEX idx_notifications_employee_resolved ON notifications(employee_id, resolved);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_holidays_date ON holidays(holiday_date);
