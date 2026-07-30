import json
import sqlite3
from pathlib import Path

out = Path('outputs/database')
out.mkdir(parents=True, exist_ok=True)
db_path = out / 'hrms_demo.sqlite'
if db_path.exists():
    db_path.unlink()

TEMP_PASSWORD = 'welcome@123'
company = {'id': 'COMP-AVANZAR', 'company_name': 'Avanzar IT Consulting'}
admin = {'id': 'USR-ADMIN', 'name': 'System Admin', 'email': 'admin@hrms.local', 'password': TEMP_PASSWORD, 'role': 'admin'}
email_config = {'sender_name': 'HR Team', 'sender_email': '', 'smtp_host': 'smtp.gmail.com', 'smtp_port': '587', 'configured': 0}
offer_template = {
    'id': 'TPL-OFFER-DEFAULT',
    'subject': 'Offer Letter - {{companyName}}',
    'body': 'Dear {{employeeName}},\n\nWe are pleased to offer you the role of {{role}} in the {{department}} team at {{companyName}}.\n\nTemporary portal login:\nEmail: {{employeeEmail}}\nPassword: {{temporaryPassword}}\n\nPlease log in to the HRMS portal and accept your offer to continue onboarding.\n\nRegards,\n{{senderName}}'
}

holidays = [
    ('HOL-2026-01-01','01-01-2026','Thursday',"New Year's Day",'CH'),
    ('HOL-2026-01-26','26-01-2026','Monday','Republic Day','CH'),
    ('HOL-2026-03-03','03-03-2026','Tuesday','Doljatra','CH'),
    ('HOL-2026-03-21','21-03-2026','Saturday','Eid-Ul-Fitr','RH'),
    ('HOL-2026-04-15','15-04-2026','Wednesday',"Bengali New Year's Day",'CH'),
    ('HOL-2026-05-01','01-05-2026','Friday','May Day','CH'),
    ('HOL-2026-06-26','26-06-2026','Friday','Muharram','RH'),
    ('HOL-2026-07-16','16-07-2026','Thursday','Rath Yatra','RH'),
    ('HOL-2026-08-15','15-08-2026','Saturday','Independence Day','CH'),
    ('HOL-2026-09-04','04-09-2026','Friday','Janmashtami','RH'),
    ('HOL-2026-10-02','02-10-2026','Friday','Gandhi Jayanti','CH'),
    ('HOL-2026-10-19','19-10-2026','Monday','Maha Ashtami','CH'),
    ('HOL-2026-10-20','20-10-2026','Tuesday','Maha Navami','CH'),
    ('HOL-2026-10-21','21-10-2026','Wednesday','Dussehra','CH'),
    ('HOL-2026-12-25','25-12-2026','Friday','Christmas Day','CH'),
]

onboarding_fields = [
 ('legalName','Legal full name','text',1),('phone','Phone number','text',1),('designation','Designation','text',1),('location','Base location','text',1),('emergencyContact','Emergency contact','text',1),('bankName','Bank name','text',1),('accountNumber','Account number','text',1),('ifsc','IFSC code','text',1),('pan','PAN no.','text',1),('adharNo','Aadhar no.','text',1),('dateOfBirth','Date of birth','text',1),('personalMailId','Personal mail ID','text',1),('motherName',"Mother's name",'text',1),('fatherName',"Father's name",'text',1),('husbandGuardianName','Husband/Guardian name','text',1),('bloodGroup','Blood group','text',0),('maritalStatus','Marital status','text',1),('spouseName','Name of spouse','text',0),('numberOfChildren','No. of children','text',0),('PresentAddressLine1','Present Address line 1','textarea',1),('PresentAddressLine2','Present Address line 2','textarea',1),('PresentPostOffice','Present post office','text',1),('PresentPoliceStation','Present police station','text',1),('PresentDistrict','Present district','text',1),('PresentState','Present state','text',1),('PresentPin','Present PIN','text',1),('PermanentAddressLine1','Permanent Address line 1','textarea',1),('PermanentAddressLine2','Permanent Address line 2','textarea',1),('PermanentPostOffice','Permanent post office','text',1),('PermanentPoliceStation','Permanent police station','text',1),('PermanentDistrict','Permanent district','text',1),('PermanentState','Permanent state','text',1),('PermanentPin','Permanent PIN','text',1),('experienceType','Experienced/Fresher','text',1),('pfAvailable','PF available','text',1),('pfNo','PF no.','text',1),('uanNo','UAN no.','text',1)
]

activity_fields = [
 ('sl_no','SL No.','text',0,1),('date','Date','date',1,0),('module','Module','text',1,0),('group_client','Group/Client','text',1,0),('ticket_number','Ticket Number','text',1,0),('issue_raised_by','Issue Raised by','text',1,0),('medium','Medium','text',1,0),('subject','Subject','text',1,0),('issue_description','Issue Description','textarea',1,0),('status','Status','select',1,0),('priority','Priority','select',1,0),('category','Category','text',1,0),('functional_consultant','Functional Consultant','text',1,0),('abap_consultant','ABAP Consultant','text',1,0),('planned_end_date','Planned End Date','date',1,0),('actual_end_date','Actual End Date','date',1,0),('final_remarks','Final Remarks','textarea',1,0),('functional_effort','Functional','number',1,0),('technical_effort','Technical','number',1,0),('total_effort_hrs','Total Effort Hrs','number',1,0),('tr_no','TR No. if any','text',1,0)
]

employee = {
 'id':'EMP-1001','full_name':'Aarav Mehta','email':'aarav@company.com','department':'Engineering','role':'Developer','location_policy':'On-site location required','signup_code':'JOIN1001','status':'Active','signed_up':1,
 'profile': {'phone':'9999991111','designation':'Frontend Engineer','location':'Mumbai','bio':'Works on client dashboards and internal tooling.'},
 'onboarding': {'legalName':'Aarav Mehta','phone':'9999991111','address':'Mumbai, Maharashtra','designation':'Frontend Engineer','location':'Mumbai','emergencyContact':'Priya Mehta - 9876500000','bankName':'Axis Bank','accountNumber':'XXXX4321','ifsc':'UTIB0001234','pan':'ABCDE1234F','adharNo':'1234 5678 9012','dateOfBirth':'08-07-1998','personalMailId':'aarav.personal@mail.com','motherName':'Sunita Mehta','fatherName':'Rakesh Mehta','husbandGuardianName':'Rakesh Mehta'},
 'hiring': {'offerStatus':'accepted','offerSentAt':'02-07-2026','offerAcceptedAt':'03-07-2026','onboardingSubmittedAt':'04-07-2026','profileEditAllowed':1,'profileReviewed':0,'offerDraftSubject':'','offerDraftBody':''},
 'attendance': {'id':'ATT-EMP-1001-1','type':'Check in','date':'14-07-2026','time':'09:18 AM','latitude':19.076,'longitude':72.8777,'accuracy':'18m'},
 'activity': {'rowId':'ACT-1001-1','slNo':1,'workflowStatus':'submitted','savedAt':'08-07-2026','submittedAt':'08-07-2026','values': {'date':'08-07-2026','module':'Core HRMS','group_client':'Core HRMS','ticket_number':'HRMS-101','issue_raised_by':'-','medium':'-','subject':'Completed profile edit flow prototype','issue_description':'Completed profile edit flow prototype','status':'Completed','priority':'High','category':'Enhancement','functional_consultant':'Priya Sharma','abap_consultant':'Aarav Mehta','planned_end_date':'08-07-2026','actual_end_date':'08-07-2026','final_remarks':'Ready for next changes','functional_effort':2,'technical_effort':5,'total_effort_hrs':7,'tr_no':''}}
}

tickets = [
 ('#706','Fwd: Open Import PO Outstanding Payment Report','Problem','Medium','SAP Support','Assigned agent','Finance','John Doe','Open','Response Overdue','Resolve in 3 days','2 hours ago'),
 ('#705','Fwd: In-transit Qty. and Value Columns required in ZMMRO','Problem','Medium','SAP Support','Assigned agent','Operations','Dale Steyn','Awaiting Customer Response','Within SLA','SLA paused 6 hours ago','2 hours ago'),
 ('#702','Material not returned in stock after cancel of transfer invoice','Problem','Medium','SAP Support','Assigned agent','Store','Jack','WIP','Response Overdue','Resolve in 2 days','4 days ago'),
]

schema = r'''
PRAGMA foreign_keys = ON;
CREATE TABLE companies (id TEXT PRIMARY KEY, company_name TEXT NOT NULL);
CREATE TABLE users (id TEXT PRIMARY KEY, employee_id TEXT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, role TEXT NOT NULL, password_plaintext_demo TEXT NOT NULL, source TEXT NOT NULL);
CREATE TABLE admin_profiles (user_id TEXT PRIMARY KEY REFERENCES users(id), display_name TEXT NOT NULL);
CREATE TABLE email_config (id INTEGER PRIMARY KEY CHECK (id = 1), sender_name TEXT, sender_email TEXT, smtp_host TEXT, smtp_port TEXT, configured INTEGER NOT NULL DEFAULT 0);
CREATE TABLE offer_templates (id TEXT PRIMARY KEY, subject TEXT NOT NULL, body TEXT NOT NULL);
CREATE TABLE employees (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, department TEXT, role TEXT, location_policy TEXT, signup_code TEXT, status TEXT, signed_up INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE employee_profiles (employee_id TEXT PRIMARY KEY REFERENCES employees(id), phone TEXT, designation TEXT, location TEXT, bio TEXT);
CREATE TABLE employee_onboarding_details (employee_id TEXT PRIMARY KEY REFERENCES employees(id), legal_name TEXT, phone TEXT, date_of_birth TEXT, personal_mail_id TEXT, mother_name TEXT, father_name TEXT, husband_guardian_name TEXT, emergency_contact TEXT, bank_name TEXT, account_number TEXT, ifsc TEXT, pan TEXT, aadhar_no TEXT, raw_json TEXT NOT NULL);
CREATE TABLE employee_hiring (employee_id TEXT PRIMARY KEY REFERENCES employees(id), offer_status TEXT, offer_sent_at TEXT, offer_accepted_at TEXT, onboarding_submitted_at TEXT, profile_edit_allowed INTEGER, profile_reviewed INTEGER, offer_draft_subject TEXT, offer_draft_body TEXT);
CREATE TABLE onboarding_template_fields (field_key TEXT PRIMARY KEY, label TEXT NOT NULL, field_type TEXT NOT NULL, required INTEGER NOT NULL);
CREATE TABLE activity_template_fields (field_key TEXT PRIMARY KEY, label TEXT NOT NULL, field_type TEXT NOT NULL, required INTEGER NOT NULL, read_only INTEGER NOT NULL DEFAULT 0);
CREATE TABLE attendance_policy (id INTEGER PRIMARY KEY CHECK (id = 1), office_name TEXT, latitude TEXT, longitude TEXT, radius_meters INTEGER, check_in_time TEXT, check_in_grace_minutes TEXT, check_out_time TEXT, check_out_grace_minutes TEXT, timing_rule_enabled INTEGER, locked INTEGER);
CREATE TABLE attendance_records (id TEXT PRIMARY KEY, employee_id TEXT NOT NULL REFERENCES employees(id), type TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, latitude REAL, longitude REAL, accuracy TEXT);
CREATE TABLE activity_logs (row_id TEXT PRIMARY KEY, employee_id TEXT NOT NULL REFERENCES employees(id), sl_no INTEGER NOT NULL, workflow_status TEXT NOT NULL, saved_at TEXT, submitted_at TEXT, values_json TEXT NOT NULL);
CREATE TABLE employee_groups (id TEXT PRIMARY KEY, name TEXT NOT NULL, parent_id TEXT, created_at TEXT, is_default INTEGER NOT NULL DEFAULT 0);
CREATE TABLE group_members (group_id TEXT NOT NULL REFERENCES employee_groups(id), employee_id TEXT NOT NULL REFERENCES employees(id), PRIMARY KEY (group_id, employee_id));
CREATE TABLE wfh_policy (id INTEGER PRIMARY KEY CHECK (id = 1), weekly_limit INTEGER NOT NULL, monthly_limit INTEGER NOT NULL, request_window_months INTEGER NOT NULL, locked INTEGER NOT NULL DEFAULT 0);
CREATE TABLE leave_policy (id INTEGER PRIMARY KEY CHECK (id = 1), privilege_leave INTEGER NOT NULL, sick_leave INTEGER NOT NULL, request_window_months INTEGER NOT NULL, locked INTEGER NOT NULL DEFAULT 0);
CREATE TABLE wfh_requests (id TEXT PRIMARY KEY, employee_id TEXT REFERENCES employees(id), date TEXT, reason TEXT, status TEXT, submitted_at TEXT, reviewed_at TEXT, reviewed_by TEXT, revoked_at TEXT, created_by TEXT);
CREATE TABLE leave_requests (id TEXT PRIMARY KEY, employee_id TEXT REFERENCES employees(id), date TEXT, type TEXT, reason TEXT, status TEXT, submitted_at TEXT, reviewed_at TEXT, reviewed_by TEXT, revoked_at TEXT, created_by TEXT);
CREATE TABLE holiday_calendar (id TEXT PRIMARY KEY, date TEXT NOT NULL, day TEXT, name TEXT NOT NULL, type TEXT NOT NULL);
CREATE TABLE holiday_requests (id TEXT PRIMARY KEY, employee_id TEXT REFERENCES employees(id), date TEXT, holiday_name TEXT, reason TEXT, status TEXT, submitted_at TEXT, reviewed_at TEXT, reviewed_by TEXT);
CREATE TABLE tickets (id TEXT PRIMARY KEY, subject TEXT NOT NULL, category TEXT, priority TEXT, group_name TEXT, agent TEXT, department TEXT, requester TEXT, status TEXT, sla TEXT, due TEXT, created_at TEXT);
CREATE TABLE notifications (id TEXT PRIMARY KEY, recipient_role TEXT, employee_id TEXT, title TEXT, message TEXT, tone TEXT, resolved INTEGER DEFAULT 0, created_at TEXT);
CREATE TABLE attachments (id TEXT PRIMARY KEY, employee_id TEXT REFERENCES employees(id), document_name TEXT, file_name TEXT, uploaded_at TEXT);
'''

conn = sqlite3.connect(db_path)
conn.execute('PRAGMA foreign_keys = ON')
conn.executescript(schema)
cur = conn.cursor()
cur.execute('INSERT INTO companies VALUES (?,?)', (company['id'], company['company_name']))
cur.execute('INSERT INTO users VALUES (?,?,?,?,?,?,?)', (admin['id'], None, admin['name'], admin['email'], admin['role'], admin['password'], 'hrms-admin'))
cur.execute('INSERT INTO admin_profiles VALUES (?,?)', (admin['id'], admin['name']))
cur.execute('INSERT INTO email_config VALUES (1,?,?,?,?,?)', (email_config['sender_name'], email_config['sender_email'], email_config['smtp_host'], email_config['smtp_port'], email_config['configured']))
cur.execute('INSERT INTO offer_templates VALUES (?,?,?)', (offer_template['id'], offer_template['subject'], offer_template['body']))
cur.execute('INSERT INTO employees VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)', (employee['id'], employee['full_name'], employee['email'], employee['department'], employee['role'], employee['location_policy'], employee['signup_code'], employee['status'], employee['signed_up']))
cur.execute('INSERT INTO users VALUES (?,?,?,?,?,?,?)', ('USR-EMP-1001', employee['id'], employee['full_name'], employee['email'], 'employee', TEMP_PASSWORD, 'hrms-employee'))
cur.execute('INSERT INTO employee_profiles VALUES (?,?,?,?,?)', (employee['id'], employee['profile']['phone'], employee['profile']['designation'], employee['profile']['location'], employee['profile']['bio']))
o = employee['onboarding']
cur.execute('INSERT INTO employee_onboarding_details VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (employee['id'], o.get('legalName'), o.get('phone'), o.get('dateOfBirth'), o.get('personalMailId'), o.get('motherName'), o.get('fatherName'), o.get('husbandGuardianName'), o.get('emergencyContact'), o.get('bankName'), o.get('accountNumber'), o.get('ifsc'), o.get('pan'), o.get('adharNo'), json.dumps(o, ensure_ascii=False)))
h = employee['hiring']
cur.execute('INSERT INTO employee_hiring VALUES (?,?,?,?,?,?,?,?,?)', (employee['id'], h['offerStatus'], h['offerSentAt'], h['offerAcceptedAt'], h['onboardingSubmittedAt'], h['profileEditAllowed'], h['profileReviewed'], h['offerDraftSubject'], h['offerDraftBody']))
cur.executemany('INSERT INTO onboarding_template_fields VALUES (?,?,?,?)', onboarding_fields)
cur.executemany('INSERT INTO activity_template_fields VALUES (?,?,?,?,?)', activity_fields)
cur.execute('INSERT INTO attendance_policy VALUES (1,?,?,?,?,?,?,?,?,?,?)', ('Office','', '', 15, '', '', '', '', 1, 0))
a = employee['attendance']
cur.execute('INSERT INTO attendance_records VALUES (?,?,?,?,?,?,?,?)', (a['id'], employee['id'], a['type'], a['date'], a['time'], a['latitude'], a['longitude'], a['accuracy']))
act = employee['activity']
cur.execute('INSERT INTO activity_logs VALUES (?,?,?,?,?,?,?)', (act['rowId'], employee['id'], act['slNo'], act['workflowStatus'], act['savedAt'], act['submittedAt'], json.dumps(act['values'], ensure_ascii=False)))
cur.execute('INSERT INTO employee_groups VALUES (?,?,?,?,?)', ('GRP-ADMIN','Admin','', 'System default', 1))
cur.execute('INSERT INTO wfh_policy VALUES (1,?,?,?,?)', (1,2,6,0))
cur.execute('INSERT INTO leave_policy VALUES (1,?,?,?,?)', (16,7,6,0))
cur.executemany('INSERT INTO holiday_calendar VALUES (?,?,?,?,?)', holidays)
cur.executemany('INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', tickets)
conn.commit()

with open(out / 'schema.sql', 'w', encoding='utf-8') as f:
    f.write(schema.strip() + '\n')
with open(out / 'seed.sql', 'w', encoding='utf-8') as f:
    for line in conn.iterdump():
        if line.startswith('CREATE TABLE') or line.startswith('PRAGMA') or line.startswith('BEGIN') or line.startswith('COMMIT'):
            continue
        f.write(line + '\n')
with open(out / 'full_dump.sql', 'w', encoding='utf-8') as f:
    for line in conn.iterdump():
        f.write(line + '\n')
counts = {name: conn.execute(f'SELECT COUNT(*) FROM {name}').fetchone()[0] for name in ['users','employees','employee_profiles','employee_onboarding_details','employee_hiring','attendance_records','activity_logs','employee_groups','holiday_calendar','tickets','wfh_requests','leave_requests','notifications']}
with open(out / 'README.md', 'w', encoding='utf-8') as f:
    f.write('# HRMS Demo Database\n\n')
    f.write('Generated from the current project seed data in app.js. Existing application code was not modified.\n\n')
    f.write('Files:\n')
    f.write('- hrms_demo.sqlite: SQLite database with the demo data.\n')
    f.write('- schema.sql: table definitions.\n')
    f.write('- seed.sql: insert statements only.\n')
    f.write('- full_dump.sql: full SQLite dump.\n\n')
    f.write('Table counts:\n')
    for k, v in counts.items():
        f.write(f'- {k}: {v}\n')
    f.write('\nNote: Passwords are stored as plaintext only because the current prototype uses demo password welcome@123. In production this must become password_hash.\n')
conn.close()
print(json.dumps({'database': str(db_path), 'counts': counts}, indent=2))
