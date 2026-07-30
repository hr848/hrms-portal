# HRMS Demo Database

Generated from the current project seed data in app.js. Existing application code was not modified.

Files:
- hrms_demo.sqlite: SQLite database with the demo data.
- schema.sql: table definitions.
- seed.sql: insert statements only.
- full_dump.sql: full SQLite dump.

Table counts:
- users: 2
- employees: 1
- employee_profiles: 1
- employee_onboarding_details: 1
- employee_hiring: 1
- attendance_records: 1
- activity_logs: 1
- employee_groups: 1
- holiday_calendar: 15
- tickets: 3
- wfh_requests: 0
- leave_requests: 0
- notifications: 0

Note: Passwords are stored as plaintext only because the current prototype uses demo password welcome@123. In production this must become password_hash.
