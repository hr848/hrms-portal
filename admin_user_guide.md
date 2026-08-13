# Admin User Guide

Welcome to the HRMS Admin Portal. This comprehensive guide outlines all the functionalities available to Administrative users.

## 1. Dashboard Overview
Upon logging in, the Admin Dashboard provides a high-level summary of the organization's daily metrics:
- **Active Employees**: Total number of registered active employees.
- **Total Attendance**: Number of check-ins recorded for the day.
- **Total Activities**: Total number of activity reports logged.
- **Quick Navigation**: Tabbed interface to switch between Onboarding, Attendance, Leave/WFH, Activities, Holidays, and Settings.

## 2. Onboarding & Directory (`Onboarding` Tab)
```mermaid
graph LR
    A[Click 'Onboarding' Tab] --> B[View Employee Directory]
    B --> C[Click on an Employee Row]
    C --> D[View Profile & Bank Details]
    C --> E[Download ID/Passbook Attachments]
    B --> F[Group Column]
    F --> G[Select Group from Dropdown]
```
Manage employee profiles, onboarding details, and group assignments.
- **Employee Directory**: A searchable table listing all employees (Name, ID, Email, Department, Group, Office Location).
- **Profile Review**: Click on any employee to view their detailed profile, including basic info and submitted onboarding data (Personal details, Bank info, Address).
- **Attachment Review**: Review and download securely uploaded onboarding documents (ID proofs, passbooks, etc.).
- **Group Management**: Group employees into specific categories (e.g., Development, Marketing) to assign customized activity templates or workflows.

## 3. Attendance Management (`Attendance` Tab)
```mermaid
graph LR
    A[Click 'Attendance' Tab] --> B[View Live Check-in Feed]
    B --> C[Check GPS Coordinates & Distance]
    B --> D[Click 'Adjust' Button]
    D --> E[Manually Fix Missing Check-outs]
    A --> F[View Attendance Reports]
    F --> G[Filter by Daily or Monthly view]
```
Monitor and manage daily check-ins for all employees.
- **Live Attendance Feed**: View real-time check-in and check-out logs for all employees.
- **Attendance Reports**: View comprehensive daily or monthly attendance reports for all employees. Filter by specific dates or months to analyze workforce trends.
- **Location Tracking**: Check-in records display the geographical coordinates (Latitude/Longitude).
- **Geofencing / Office Distance**: If an office location is set for an employee, their check-in record will display their exact distance (in meters) from the designated office coordinate to verify physical presence.
- **Manual Adjustments**: Admins can manually adjust or override attendance records for employees (e.g., if an employee forgets to check out).

## 4. Leave & Work From Home (WFH) (`Leave/WFH` Tab)
```mermaid
graph LR
    A[Click 'Leave/WFH' Tab] --> B[View Pending Requests Queue]
    B --> C[Click 'Approve' or 'Reject' buttons]
    A --> D[Use Search & Date Filters]
    D --> E[View Past Employee Leaves]
    A --> F[View Monthly Leave Calendar]
    A --> G[View Detailed Reports]
    G --> H[Analyze Employee Time-Off Trends]
```
Manage all incoming time-off requests.
- **Request Processing**: View a queue of Pending Leave and WFH requests. Admins can `Approve` or `Reject` these requests directly.
- **Comprehensive Reports**: Access detailed leave and WFH reports. Generate insights across different time periods and filter down to specific employees.
- **Calendar View**: A visual monthly calendar displaying approved Leave and WFH days for all active employees.
- **Search & Filters**: Quickly filter past or pending requests by specific employees or date ranges.
- **Auto-Approval**: Admins can configure settings to automatically approve Leave or WFH requests to streamline workflows.

## 5. Activity & Productivity (`Activities` Tab)
```mermaid
graph LR
    A[Click 'Activities' Tab] --> B[View Submitted Timesheets]
    A --> C[Activity Templates]
    C --> D[Configure Group Client Options]
    D --> E[Enforce Client Selection for Employee Groups]
```
Track daily task submissions and configure project templates.
- **Activity Logs**: View submitted activity reports from employees, including hours spent, client/project picked, and detailed task descriptions.
- **Activity Templates**: Create and enforce structured templates for employees. 
- **Group Client Options**: Assign specific predefined "Client Options" or "Projects" to different employee groups. Employees in those groups will only be able to select from those assigned options when submitting their activity.

## 6. Holiday Management (`Holidays` Tab)
```mermaid
graph LR
    A[Click 'Holidays' Tab] --> B[Fill Holiday Date & Name]
    B --> C[Click 'Add Holiday' button]
    A --> D[Click 'Delete' on obsolete holiday]
```
Maintain the corporate holiday calendar.
- **Add Holidays**: Define new upcoming holidays (Date and Name).
- **Remove Holidays**: Delete obsolete or incorrect holidays.
- **Visibility**: These holidays automatically sync to the Employee dashboard so they are globally aware of off-days.

## 7. Feedback & Suggestions Tracker
```mermaid
graph LR
    A((Click Floating Feedback Icon)) --> B[View All Submitted Feedbacks]
    B --> C[Click Status Dropdown]
    C --> D[Change to 'Pending', 'WIP', or 'Fixed']
    B --> E[Click '+ Add new row']
    E --> F[Fill Bug/Idea details & Add Attachments]
    F --> G[Click 'Submit' button]
```
A dedicated space to track and resolve internal system feedback.
- **View All Feedbacks**: An Excel-like grid showing all submitted feedback from employees, including the page they submitted it from.
- **Status Updates**: Admins have exclusive access to change a feedback's status (`Pending`, `WIP`, `Fixed`).
- **Add New Feedback**: Admins can also log bugs or suggestions manually on behalf of users, complete with file attachments.

## 8. Settings & Configurations (`Settings` Tab)
```mermaid
graph LR
    A[Click 'Settings' Tab] --> B[Configure SMTP / Global Settings]
    A --> C[Click 'Download data' button]
    C --> D[Export Docx Reports]
    A --> E[Update Admin Password]
```
Global portal controls and data management.
- **Email Configurations**: Setup SMTP details to enable automated email logs and password reset emails.
- **Company Settings**: Toggle global features (e.g., Auto-approval for Leaves).
- **Data Export**: Admins can download employee data logs directly as Docx files.
- **Change Password**: Securely update the administrator password.
