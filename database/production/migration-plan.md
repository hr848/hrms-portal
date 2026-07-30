# Database Migration Plan

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
