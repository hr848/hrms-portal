import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'current-hrms-browser-data.json'
OUT = ROOT / 'database' / 'production'
STORAGE_KEY = 'hrms-portal-prototype-recovered-v2'

state = json.loads(DATA.read_text(encoding='utf-8'))

def sql_text(value):
    if value is None:
        return 'NULL'
    s = str(value)
    return "'" + s.replace("'", "''") + "'"

def sql_bool(value):
    return 'TRUE' if bool(value) else 'FALSE'

def sql_json(value):
    return sql_text(json.dumps(value if value is not None else {}, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'

def as_list(value):
    return value if isinstance(value, list) else []

def get(obj, key, default=None):
    return obj.get(key, default) if isinstance(obj, dict) else default

def normalize_date(value):
    if not value:
        return None
    s = str(value).strip()
    for fmt in ('%d-%m-%Y', '%Y-%m-%d', '%d/%m/%Y', '%d.%m.%Y'):
        try:
            return datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            pass
    return None

def parse_number(value):
    if value in (None, ''):
        return 'NULL'
    try:
        return str(float(value))
    except (TypeError, ValueError):
        return 'NULL'

def parse_int(value):
    if value in (None, ''):
        return 'NULL'
    try:
        return str(int(value))
    except (TypeError, ValueError):
        return 'NULL'

lines = []
lines.append('-- HRMS Portal current browser-data seed')
lines.append('-- Generated from current-hrms-browser-data.json for beta database migration planning.')
lines.append('BEGIN;')
lines.append("INSERT INTO companies (id, company_name, legal_name) VALUES ('00000000-0000-0000-0000-000000000001', 'Avanzar IT Consulting', 'Avanzar IT Consulting') ON CONFLICT DO NOTHING;")

admin = get(state, 'adminProfile', {}) or {}
admin_name = get(admin, 'name') or 'System Admin'
admin_email = get(admin, 'email') or 'admin@hrms.local'
lines.append(f"INSERT INTO users (id, full_name, email, role, status, raw_data) VALUES ('00000000-0000-0000-0000-0000000000ad', {sql_text(admin_name)}, {sql_text(admin_email)}, 'admin', 'active', {sql_json(admin)}) ON CONFLICT (email) DO NOTHING;")

for emp in as_list(get(state, 'employees')):
    emp_id = get(emp, 'id')
    if not emp_id:
        continue
    full_name = get(emp, 'fullName') or get(emp, 'directoryName') or emp_id
    email = get(emp, 'email') or f'{emp_id.lower()}@example.local'
    user_uuid_expr = 'gen_random_uuid()'
    lines.append(f"INSERT INTO users (id, employee_id, full_name, email, role, status, raw_data) VALUES ({user_uuid_expr}, {sql_text(emp_id)}, {sql_text(full_name)}, {sql_text(email)}, 'employee', {sql_text((get(emp, 'status') or 'active').lower())}, {sql_json({'employeeId': emp_id, 'source': 'hrms_employee'})}) ON CONFLICT (email) DO NOTHING;")
    lines.append(f"INSERT INTO employees (id, user_id, full_name, directory_name, email, department, role, location_policy, signup_code, status, signed_up, raw_data) VALUES ({sql_text(emp_id)}, (SELECT id FROM users WHERE employee_id = {sql_text(emp_id)} LIMIT 1), {sql_text(full_name)}, {sql_text(get(emp, 'directoryName'))}, {sql_text(email)}, {sql_text(get(emp, 'department'))}, {sql_text(get(emp, 'role'))}, {sql_text(get(emp, 'locationPolicy'))}, {sql_text(get(emp, 'signupCode'))}, {sql_text(get(emp, 'status') or 'Pending')}, {sql_bool(get(emp, 'signedUp'))}, {sql_json(emp)}) ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, raw_data = EXCLUDED.raw_data;")
    credentials = get(emp, 'credentials', {}) or {}
    if credentials:
        lines.append(f"INSERT INTO employee_credentials_demo (employee_id, demo_password) VALUES ({sql_text(emp_id)}, {sql_text(get(credentials, 'password'))}) ON CONFLICT (employee_id) DO UPDATE SET demo_password = EXCLUDED.demo_password;")
    profile = get(emp, 'profile', {}) or {}
    onboarding = get(emp, 'onboardingDetails', {}) or {}
    hiring = get(emp, 'hiring', {}) or {}
    def detail(*keys):
        for key in keys:
            val = get(onboarding, key)
            if val not in (None, ''):
                return val
            val = get(profile, key)
            if val not in (None, ''):
                return val
        return None
    dob = normalize_date(detail('dateOfBirth', 'dob'))
    lines.append(f"INSERT INTO employee_profiles (employee_id, phone, designation, base_location, legal_full_name, date_of_birth, personal_email, mother_name, father_name, husband_guardian_name, marital_status, blood_group, emergency_contact, bank_name, account_number, ifsc_code, pan, aadhar_no, experienced_fresher, pf_available, pf_no, uan_no, same_as_present_address, profile_edit_allowed, profile_reviewed, onboarding_submitted_at, raw_profile, raw_onboarding_details, raw_onboarding_labels) VALUES ({sql_text(emp_id)}, {sql_text(detail('phone', 'phoneNumber'))}, {sql_text(detail('designation'))}, {sql_text(detail('baseLocation', 'location'))}, {sql_text(detail('legalFullName', 'legalName', 'fullName'))}, {sql_text(dob)}, {sql_text(detail('personalMailId', 'personalEmail'))}, {sql_text(detail('motherName'))}, {sql_text(detail('fatherName'))}, {sql_text(detail('husbandGuardianName', 'fatherHusbandGuardianName'))}, {sql_text(detail('maritalStatus'))}, {sql_text(detail('bloodGroup'))}, {sql_text(detail('emergencyContact'))}, {sql_text(detail('bankName'))}, {sql_text(detail('accountNumber'))}, {sql_text(detail('ifscCode', 'ifsc'))}, {sql_text(detail('pan'))}, {sql_text(detail('aadharNo', 'aadhar'))}, {sql_text(detail('experiencedFresher'))}, {sql_text(detail('pfAvailable'))}, {sql_text(detail('pfNo'))}, {sql_text(detail('uanNo'))}, {sql_bool(detail('sameAsPresentAddress'))}, {sql_bool(get(hiring, 'profileEditAllowed', True))}, {sql_bool(get(hiring, 'profileReviewed'))}, {sql_text(get(hiring, 'onboardingSubmittedAt'))}, {sql_json(profile)}, {sql_json(onboarding)}, {sql_json(get(emp, 'onboardingFieldLabels', {}))}) ON CONFLICT (employee_id) DO UPDATE SET raw_profile = EXCLUDED.raw_profile, raw_onboarding_details = EXCLUDED.raw_onboarding_details;")
    for address_type, prefix in [('present', 'present'), ('permanent', 'permanent')]:
        raw = {k: v for k, v in onboarding.items() if k.lower().startswith(prefix)} if isinstance(onboarding, dict) else {}
        lines.append(f"INSERT INTO employee_addresses (employee_id, address_type, line1, line2, state, pin, raw_data) VALUES ({sql_text(emp_id)}, {sql_text(address_type)}, {sql_text(detail(prefix + 'AddressLine1', prefix + 'Address1'))}, {sql_text(detail(prefix + 'AddressLine2', prefix + 'Address2'))}, {sql_text(detail(prefix + 'State'))}, {sql_text(detail(prefix + 'PIN', prefix + 'Pin'))}, {sql_json(raw)}) ON CONFLICT (employee_id, address_type) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
    for idx, row in enumerate(as_list(get(onboarding, 'educationDetails') or get(profile, 'educationDetails')), start=1):
        lines.append(f"INSERT INTO employee_education (employee_id, degree, marks_obtained, university, city, year_of_passing, row_order, raw_data) VALUES ({sql_text(emp_id)}, {sql_text(get(row, 'degree') or get(row, 'degreePgDiploma'))}, {sql_text(get(row, 'marksObtained') or get(row, 'marks'))}, {sql_text(get(row, 'university'))}, {sql_text(get(row, 'city'))}, {sql_text(get(row, 'yearOfPassing'))}, {idx}, {sql_json(row)});")
    for idx, row in enumerate(as_list(get(onboarding, 'previousCompanyDetails') or get(profile, 'previousCompanyDetails')), start=1):
        lines.append(f"INSERT INTO employee_previous_companies (employee_id, company_name, address, designation, reporting, contact_details, row_order, raw_data) VALUES ({sql_text(emp_id)}, {sql_text(get(row, 'name') or get(row, 'companyName'))}, {sql_text(get(row, 'address'))}, {sql_text(get(row, 'designation'))}, {sql_text(get(row, 'reporting'))}, {sql_text(get(row, 'contactDetails'))}, {idx}, {sql_json(row)});")
    attachments = get(emp, 'attachments', {}) or {}
    if isinstance(attachments, dict):
        for key, value in attachments.items():
            if isinstance(value, dict):
                file_name = get(value, 'name') or get(value, 'fileName')
                uploaded_at = get(value, 'uploadedAt')
                raw = value
            else:
                file_name = str(value) if value else None
                uploaded_at = None
                raw = {'value': value}
            lines.append(f"INSERT INTO employee_attachments (employee_id, document_key, document_name, file_name, uploaded_at, raw_data) VALUES ({sql_text(emp_id)}, {sql_text(key)}, {sql_text(key)}, {sql_text(file_name)}, {sql_text(uploaded_at)}, {sql_json(raw)});")
    lines.append(f"INSERT INTO employee_hiring (employee_id, offer_status, offer_sent_at, offer_accepted_at, onboarding_submitted_at, offer_draft_subject, offer_draft_body, raw_data) VALUES ({sql_text(emp_id)}, {sql_text(get(hiring, 'offerStatus'))}, {sql_text(get(hiring, 'offerSentAt'))}, {sql_text(get(hiring, 'offerAcceptedAt'))}, {sql_text(get(hiring, 'onboardingSubmittedAt'))}, {sql_text(get(hiring, 'offerDraftSubject'))}, {sql_text(get(hiring, 'offerDraftBody'))}, {sql_json(hiring)}) ON CONFLICT (employee_id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
    for rec in as_list(get(emp, 'attendance')):
        rec_id = get(rec, 'id') or f"ATT-{emp_id}-{len(lines)}"
        coords = get(rec, 'coords', {}) or {}
        lines.append(f"INSERT INTO attendance_records (id, employee_id, attendance_type, attendance_date, attendance_time, latitude, longitude, distance_meters, raw_data) VALUES ({sql_text(rec_id)}, {sql_text(emp_id)}, {sql_text(get(rec, 'type'))}, {sql_text(normalize_date(get(rec, 'date')))}, {sql_text(get(rec, 'time'))}, {parse_number(get(rec, 'latitude') or get(coords, 'latitude'))}, {parse_number(get(rec, 'longitude') or get(coords, 'longitude'))}, {parse_number(get(rec, 'distanceMeters'))}, {sql_json(rec)}) ON CONFLICT (id) DO NOTHING;")
    for act in as_list(get(emp, 'activities')):
        act_id = get(act, 'id') or get(act, 'rowId') or f"ACT-{emp_id}-{get(act, 'slNo') or len(lines)}"
        vals = get(act, 'values', act)
        lines.append(f"INSERT INTO activity_logs (id, employee_id, sl_no, row_status, activity_date, saved_at, submitted_at, last_update, values_json, raw_data) VALUES ({sql_text(act_id)}, {sql_text(emp_id)}, {parse_int(get(act, 'slNo') or get(act, 'sl_no'))}, {sql_text(get(act, 'status') or get(act, 'rowStatus') or 'Draft')}, {sql_text(normalize_date(get(vals, 'date') or get(act, 'date')))}, {sql_text(get(act, 'savedAt'))}, {sql_text(get(act, 'submittedAt'))}, {sql_text(get(act, 'lastUpdate'))}, {sql_json(vals)}, {sql_json(act)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for idx, field in enumerate(as_list(get(get(state, 'onboardingTemplate', {}), 'fields')), start=1):
    key = get(field, 'key') or get(field, 'id') or f'onboarding_{idx}'
    lines.append(f"INSERT INTO onboarding_template_fields (field_key, label, field_type, required, row_order, raw_data) VALUES ({sql_text(key)}, {sql_text(get(field, 'label') or key)}, {sql_text(get(field, 'type') or 'text')}, {sql_bool(get(field, 'required'))}, {idx}, {sql_json(field)}) ON CONFLICT (field_key) DO UPDATE SET label = EXCLUDED.label, raw_data = EXCLUDED.raw_data;")

for idx, field in enumerate(as_list(get(get(state, 'activityTemplate', {}), 'fields')), start=1):
    key = get(field, 'key') or get(field, 'id') or f'activity_{idx}'
    lines.append(f"INSERT INTO activity_template_fields (field_key, label, field_type, required, read_only, dropdown_options, row_order, raw_data) VALUES ({sql_text(key)}, {sql_text(get(field, 'label') or key)}, {sql_text(get(field, 'type') or 'text')}, {sql_bool(get(field, 'required'))}, {sql_bool(get(field, 'readOnly'))}, {sql_json(get(field, 'options', []))}, {idx}, {sql_json(field)}) ON CONFLICT (field_key) DO UPDATE SET label = EXCLUDED.label, raw_data = EXCLUDED.raw_data;")

policy = get(state, 'attendancePolicy', {}) or {}
lines.append(f"INSERT INTO attendance_policy (office_name, latitude, longitude, radius_meters, check_in_time, check_in_grace_minutes, check_out_time, check_out_grace_minutes, timing_rule_enabled, location_rule_enabled, locked, raw_data) VALUES ({sql_text(get(policy, 'officeName'))}, {parse_number(get(policy, 'latitude'))}, {parse_number(get(policy, 'longitude'))}, {parse_int(get(policy, 'radiusMeters') or get(policy, 'radius')) or '15'}, {sql_text(get(policy, 'checkInTime'))}, {parse_int(get(policy, 'checkInGraceMinutes'))}, {sql_text(get(policy, 'checkOutTime'))}, {parse_int(get(policy, 'checkOutGraceMinutes'))}, {sql_bool(get(policy, 'timingRuleEnabled', True))}, {sql_bool(get(policy, 'locationRuleEnabled', True))}, {sql_bool(get(policy, 'locked'))}, {sql_json(policy)});")
for item in as_list(get(state, 'attendancePolicyHistory')):
    lines.append(f"INSERT INTO attendance_policy_history (updated_by, updated_at, raw_data) VALUES ({sql_text(get(item, 'updatedBy'))}, {sql_text(get(item, 'updatedAt'))}, {sql_json(item)});")

for key, table in [('wfhPolicy','wfh_policy'), ('leavePolicy','leave_policy')]:
    pol = get(state, key, {}) or {}
    if key == 'wfhPolicy':
        lines.append(f"INSERT INTO wfh_policy (weekly_limit, monthly_limit, request_window_months, locked, raw_data) VALUES ({parse_int(get(pol, 'weeklyLimit')) or '1'}, {parse_int(get(pol, 'monthlyLimit')) or '2'}, {parse_int(get(pol, 'requestWindowMonths')) or '6'}, {sql_bool(get(pol, 'locked', True))}, {sql_json(pol)});")
    else:
        lines.append(f"INSERT INTO leave_policy (privilege_leave_yearly_limit, sick_leave_yearly_limit, request_window_months, carry_forward_enabled, locked, raw_data) VALUES ({parse_int(get(pol, 'privilegeLeave')) or '16'}, {parse_int(get(pol, 'sickLeave')) or '7'}, {parse_int(get(pol, 'requestWindowMonths')) or '6'}, TRUE, {sql_bool(get(pol, 'locked', True))}, {sql_json(pol)});")
for item in as_list(get(state, 'wfhPolicyHistory')):
    lines.append(f"INSERT INTO wfh_policy_history (updated_by, updated_at, raw_data) VALUES ({sql_text(get(item, 'updatedBy'))}, {sql_text(get(item, 'updatedAt'))}, {sql_json(item)});")
for item in as_list(get(state, 'leavePolicyHistory')):
    lines.append(f"INSERT INTO leave_policy_history (updated_by, updated_at, raw_data) VALUES ({sql_text(get(item, 'updatedBy'))}, {sql_text(get(item, 'updatedAt'))}, {sql_json(item)});")

for req in as_list(get(state, 'attendanceClaims')):
    lines.append(f"INSERT INTO attendance_adjustment_claims (id, employee_id, attendance_date, claim_type, proposed_time, proposed_check_in_time, proposed_check_out_time, reason, status, submitted_at, resolved_at, resolved_by, raw_data) VALUES ({sql_text(get(req, 'id'))}, {sql_text(get(req, 'employeeId'))}, {sql_text(normalize_date(get(req, 'attendanceDate')))}, {sql_text(get(req, 'claimType'))}, {sql_text(get(req, 'proposedTime'))}, {sql_text(get(req, 'proposedCheckInTime'))}, {sql_text(get(req, 'proposedCheckOutTime'))}, {sql_text(get(req, 'reason') or '-')}, {sql_text(get(req, 'status') or 'Pending')}, {sql_text(get(req, 'submittedAt'))}, {sql_text(get(req, 'resolvedAt'))}, {sql_text(get(req, 'resolvedBy'))}, {sql_json(req)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for req in as_list(get(state, 'wfhRequests')):
    lines.append(f"INSERT INTO wfh_requests (id, employee_id, request_date, reason, status, submitted_at, reviewed_at, reviewed_by, revoked_at, created_by, is_special, raw_data) VALUES ({sql_text(get(req, 'id'))}, {sql_text(get(req, 'employeeId'))}, {sql_text(normalize_date(get(req, 'date')))}, {sql_text(get(req, 'reason'))}, {sql_text(get(req, 'status') or 'pending')}, {sql_text(get(req, 'submittedAt'))}, {sql_text(get(req, 'reviewedAt'))}, {sql_text(get(req, 'reviewedBy'))}, {sql_text(get(req, 'revokedAt'))}, {sql_text(get(req, 'createdBy'))}, {sql_bool(get(req, 'isSpecial') or get(req, 'special'))}, {sql_json(req)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for req in as_list(get(state, 'leaveRequests')):
    lines.append(f"INSERT INTO leave_requests (id, employee_id, leave_date, leave_type, reason, status, submitted_at, reviewed_at, reviewed_by, revoked_at, created_by, is_special, raw_data) VALUES ({sql_text(get(req, 'id'))}, {sql_text(get(req, 'employeeId'))}, {sql_text(normalize_date(get(req, 'date')))}, {sql_text(get(req, 'type') or get(req, 'leaveType'))}, {sql_text(get(req, 'reason'))}, {sql_text(get(req, 'status') or 'pending')}, {sql_text(get(req, 'submittedAt'))}, {sql_text(get(req, 'reviewedAt'))}, {sql_text(get(req, 'reviewedBy'))}, {sql_text(get(req, 'revokedAt'))}, {sql_text(get(req, 'createdBy'))}, {sql_bool(get(req, 'isSpecial') or get(req, 'special'))}, {sql_json(req)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for idx, holiday in enumerate(as_list(get(state, 'holidayCalendar')), start=1):
    hid = get(holiday, 'id') or f'HOL-{idx:03d}'
    lines.append(f"INSERT INTO holidays (id, holiday_date, day_name, holiday_name, holiday_type, raw_data) VALUES ({sql_text(hid)}, {sql_text(normalize_date(get(holiday, 'date')))}, {sql_text(get(holiday, 'day'))}, {sql_text(get(holiday, 'holiday') or get(holiday, 'name'))}, {sql_text(get(holiday, 'comment') or get(holiday, 'type') or 'CH')}, {sql_json(holiday)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
for req in as_list(get(state, 'holidayRequests')):
    lines.append(f"INSERT INTO holiday_requests (id, employee_id, holiday_date, holiday_name, reason, status, submitted_at, reviewed_at, reviewed_by, raw_data) VALUES ({sql_text(get(req, 'id'))}, {sql_text(get(req, 'employeeId'))}, {sql_text(normalize_date(get(req, 'date')))}, {sql_text(get(req, 'holidayName'))}, {sql_text(get(req, 'reason'))}, {sql_text(get(req, 'status') or 'pending')}, {sql_text(get(req, 'submittedAt'))}, {sql_text(get(req, 'reviewedAt'))}, {sql_text(get(req, 'reviewedBy'))}, {sql_json(req)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for group in as_list(get(state, 'employeeGroups')):
    gid = get(group, 'id')
    if not gid:
        continue
    lines.append(f"INSERT INTO employee_groups (id, name, parent_id, is_default, created_at, raw_data) VALUES ({sql_text(gid)}, {sql_text(get(group, 'name'))}, {sql_text(get(group, 'parentId'))}, {sql_bool(get(group, 'isDefault'))}, {sql_text(get(group, 'createdAt'))}, {sql_json(group)}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, raw_data = EXCLUDED.raw_data;")
for group in as_list(get(state, 'employeeGroups')):
    gid = get(group, 'id')
    for member in as_list(get(group, 'members')):
        lines.append(f"INSERT INTO employee_group_members (group_id, employee_id) VALUES ({sql_text(gid)}, {sql_text(member)}) ON CONFLICT DO NOTHING;")

for user in as_list(get(state, 'ticketUsers')):
    uid = get(user, 'id')
    if not uid:
        continue
    lines.append(f"INSERT INTO ticket_users (id, full_name, email, role, client_name, mobile_number, demo_password, raw_data) VALUES ({sql_text(uid)}, {sql_text(get(user, 'fullName') or get(user, 'name') or uid)}, {sql_text(get(user, 'email') or f'{uid.lower()}@example.local')}, {sql_text(get(user, 'role') or 'Employee')}, {sql_text(get(user, 'clientName'))}, {sql_text(get(user, 'mobileNumber'))}, {sql_text(get(user, 'password'))}, {sql_json(user)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
for group in as_list(get(state, 'ticketGroups')):
    gid = get(group, 'id')
    if not gid:
        continue
    lines.append(f"INSERT INTO ticket_groups (id, name, is_hrms_group, raw_data) VALUES ({sql_text(gid)}, {sql_text(get(group, 'name') or gid)}, {sql_bool(get(group, 'isHrmsGroup'))}, {sql_json(group)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
    for member in as_list(get(group, 'members')):
        mtype = 'ticket_only' if str(member).startswith('TKT-') else 'employee'
        lines.append(f"INSERT INTO ticket_group_members (ticket_group_id, member_ref, member_type) VALUES ({sql_text(gid)}, {sql_text(member)}, {sql_text(mtype)}) ON CONFLICT DO NOTHING;")
for ticket in as_list(get(state, 'ticketTickets')):
    tid = get(ticket, 'id')
    if not tid:
        continue
    lines.append(f"INSERT INTO tickets (id, subject, description, category, priority, group_id, agent_ref, department, requester_ref, status, sla_status, due_at, created_at, updated_at, raw_data) VALUES ({sql_text(tid)}, {sql_text(get(ticket, 'subject') or tid)}, {sql_text(get(ticket, 'description'))}, {sql_text(get(ticket, 'category'))}, {sql_text(get(ticket, 'priority'))}, {sql_text(get(ticket, 'groupId') or get(ticket, 'group'))}, {sql_text(get(ticket, 'agentId') or get(ticket, 'agent'))}, {sql_text(get(ticket, 'department'))}, {sql_text(get(ticket, 'requesterId') or get(ticket, 'requester'))}, {sql_text(get(ticket, 'status') or 'Open')}, {sql_text(get(ticket, 'sla'))}, {sql_text(get(ticket, 'due'))}, {sql_text(get(ticket, 'createdAt'))}, {sql_text(get(ticket, 'updatedAt'))}, {sql_json(ticket)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")

for note in as_list(get(state, 'notifications')):
    nid = get(note, 'id')
    if not nid:
        continue
    lines.append(f"INSERT INTO notifications (id, recipient_role, employee_id, title, message, tone, category, resolved, created_at, raw_data) VALUES ({sql_text(nid)}, {sql_text(get(note, 'recipientRole'))}, {sql_text(get(note, 'employeeId'))}, {sql_text(get(note, 'title') or 'Notification')}, {sql_text(get(note, 'message') or '')}, {sql_text(get(note, 'tone'))}, {sql_text(get(note, 'category'))}, {sql_bool(get(note, 'resolved'))}, {sql_text(get(note, 'createdAt'))}, {sql_json(note)}) ON CONFLICT (id) DO UPDATE SET resolved = EXCLUDED.resolved, raw_data = EXCLUDED.raw_data;")

email_config = get(state, 'emailConfig', {}) or {}
lines.append(f"INSERT INTO email_config (sender_name, sender_email, smtp_host, smtp_port, configured, raw_data) VALUES ({sql_text(get(email_config, 'senderName'))}, {sql_text(get(email_config, 'senderEmail'))}, {sql_text(get(email_config, 'smtpHost'))}, {sql_text(get(email_config, 'smtpPort'))}, {sql_bool(get(email_config, 'configured'))}, {sql_json(email_config)});")
offer_template = get(state, 'offerTemplate', {}) or {}
if offer_template:
    lines.append(f"INSERT INTO email_templates (id, template_name, subject, body, variables, raw_data) VALUES ('offer-letter', 'Offer Letter', {sql_text(get(offer_template, 'subject') or 'Offer Letter')}, {sql_text(get(offer_template, 'body') or '')}, {sql_json(['employeeName','role','department','companyName','employeeEmail','temporaryPassword','senderName'])}, {sql_json(offer_template)}) ON CONFLICT (id) DO UPDATE SET raw_data = EXCLUDED.raw_data;")
for email in as_list(get(state, 'recentEmails')):
    lines.append(f"INSERT INTO email_logs (recipient_email, recipient_name, subject, body, status, sent_at, raw_data) VALUES ({sql_text(get(email, 'to') or get(email, 'recipientEmail'))}, {sql_text(get(email, 'recipientName'))}, {sql_text(get(email, 'subject') or '-')}, {sql_text(get(email, 'body'))}, {sql_text(get(email, 'status') or 'logged')}, {sql_text(get(email, 'sentAt'))}, {sql_json(email)});")

lines.append(f"INSERT INTO app_state_snapshots (snapshot_name, storage_key, state_json) VALUES ('latest-browser-export-2026-07-30', {sql_text(STORAGE_KEY)}, {sql_json(state)});")
lines.append('COMMIT;')

(OUT / 'seed.current.sql').write_text('\n'.join(lines) + '\n', encoding='utf-8')

counts = {
    'employees': len(as_list(get(state, 'employees'))),
    'ticket_users': len(as_list(get(state, 'ticketUsers'))),
    'employee_groups': len(as_list(get(state, 'employeeGroups'))),
    'ticket_groups': len(as_list(get(state, 'ticketGroups'))),
    'attendance_claims': len(as_list(get(state, 'attendanceClaims'))),
    'wfh_requests': len(as_list(get(state, 'wfhRequests'))),
    'leave_requests': len(as_list(get(state, 'leaveRequests'))),
    'holiday_requests': len(as_list(get(state, 'holidayRequests'))),
    'notifications': len(as_list(get(state, 'notifications'))),
    'tickets': len(as_list(get(state, 'ticketTickets'))),
    'company_holidays': len(as_list(get(state, 'holidayCalendar'))),
}
summary = ['# Current Browser Data Summary', '', 'Generated from `current-hrms-browser-data.json`.', '', '## Record Counts', '']
for key, value in counts.items():
    summary.append(f'- {key}: {value}')
summary.extend(['', '## Employees', ''])
for emp in as_list(get(state, 'employees')):
    summary.append(f"- {get(emp, 'id')}: {get(emp, 'fullName')} | {get(emp, 'email')} | {get(emp, 'department')} | {get(emp, 'role')} | {get(emp, 'status')}")
summary.extend(['', '## Important Notes', '', '- This export reflects browser localStorage data, not the older SQLite demo snapshot.', '- Demo/plain passwords are stored only for migration planning and must be replaced with a real authentication provider before production.', '- Complex profile/activity/ticket data is preserved in JSONB columns so future field changes do not lose information.'])
(OUT / 'current-data-summary.md').write_text('\n'.join(summary) + '\n', encoding='utf-8')

plan = '''# Database Migration Plan

## Recommended database
PostgreSQL, preferably Supabase PostgreSQL for beta because it also provides authentication and file storage.

## Current status
The uploaded `outputs/database` folder contains an older SQLite demo snapshot. The latest truth is `current-hrms-browser-data.json`, exported from browser localStorage key `hrms-portal-prototype-recovered-v2`.

## Migration steps
1. Create a PostgreSQL database project.
2. Run `database/production/schema.postgres.sql`.
3. Run `database/production/seed.current.sql` for beta/demo data.
4. Replace prototype plaintext credentials with authentication-provider users.
5. Move uploaded employee documents/profile photos to object storage and store storage paths in `employee_attachments`.
6. Convert frontend localStorage reads/writes to backend API calls.
7. Add audit logs and role-based access controls before real employee rollout.

## Data handling rule
Do not use real employee personal documents in trial deployment until authentication, storage permissions, and backup policy are active.
'''
(OUT / 'migration-plan.md').write_text(plan, encoding='utf-8')

print('Generated:', OUT / 'schema.postgres.sql')
print('Generated:', OUT / 'seed.current.sql')
print('Generated:', OUT / 'current-data-summary.md')
print('Generated:', OUT / 'migration-plan.md')
print(json.dumps(counts, indent=2))
