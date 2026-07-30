# HRMS Portal Prototype

This is a static working prototype for an HRMS portal with:

- Admin and employee login
- Email-based sign in for both roles
- Offer-letter workflow with configurable sender email and app password storage
- Offer acceptance inside the employee portal
- Placeholder onboarding form that can be replaced with your final format later
- Profile locking after onboarding until admin grants edit permission
- Attendance capture with browser geolocation
- Activity tracking with a configurable template
- Local storage persistence for demo data

## Run

Open `index.html` in a browser.

## Local server

Use the batch files in this folder:

- `start-server.bat` starts a local static server on `http://127.0.0.1:4173`
- `stop-server.bat` stops the server using the saved PID file

You can double-click either file from File Explorer.

## Demo credentials

- Admin: `admin@hrms.local` / `welcome@123`
- Employee: `aarav@company.com` / `welcome@123`

## Notes

- Offer emails are simulated inside the prototype. Email configuration and app password are stored locally so a real sender can be wired later.
- Attendance is blocked until the browser location permission is allowed.
- The onboarding form is a placeholder until the final employee detail format is shared.
- The activity form can be changed from the admin `Activity template` screen by editing the JSON field list.
