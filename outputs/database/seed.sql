INSERT INTO "activity_logs" VALUES('ACT-1001-1','EMP-1001',1,'submitted','08-07-2026','08-07-2026','{"date": "08-07-2026", "module": "Core HRMS", "group_client": "Core HRMS", "ticket_number": "HRMS-101", "issue_raised_by": "-", "medium": "-", "subject": "Completed profile edit flow prototype", "issue_description": "Completed profile edit flow prototype", "status": "Completed", "priority": "High", "category": "Enhancement", "functional_consultant": "Priya Sharma", "abap_consultant": "Aarav Mehta", "planned_end_date": "08-07-2026", "actual_end_date": "08-07-2026", "final_remarks": "Ready for next changes", "functional_effort": 2, "technical_effort": 5, "total_effort_hrs": 7, "tr_no": ""}');
INSERT INTO "activity_template_fields" VALUES('sl_no','SL No.','text',0,1);
INSERT INTO "activity_template_fields" VALUES('date','Date','date',1,0);
INSERT INTO "activity_template_fields" VALUES('module','Module','text',1,0);
INSERT INTO "activity_template_fields" VALUES('group_client','Group/Client','text',1,0);
INSERT INTO "activity_template_fields" VALUES('ticket_number','Ticket Number','text',1,0);
INSERT INTO "activity_template_fields" VALUES('issue_raised_by','Issue Raised by','text',1,0);
INSERT INTO "activity_template_fields" VALUES('medium','Medium','text',1,0);
INSERT INTO "activity_template_fields" VALUES('subject','Subject','text',1,0);
INSERT INTO "activity_template_fields" VALUES('issue_description','Issue Description','textarea',1,0);
INSERT INTO "activity_template_fields" VALUES('status','Status','select',1,0);
INSERT INTO "activity_template_fields" VALUES('priority','Priority','select',1,0);
INSERT INTO "activity_template_fields" VALUES('category','Category','text',1,0);
INSERT INTO "activity_template_fields" VALUES('functional_consultant','Functional Consultant','text',1,0);
INSERT INTO "activity_template_fields" VALUES('abap_consultant','ABAP Consultant','text',1,0);
INSERT INTO "activity_template_fields" VALUES('planned_end_date','Planned End Date','date',1,0);
INSERT INTO "activity_template_fields" VALUES('actual_end_date','Actual End Date','date',1,0);
INSERT INTO "activity_template_fields" VALUES('final_remarks','Final Remarks','textarea',1,0);
INSERT INTO "activity_template_fields" VALUES('functional_effort','Functional','number',1,0);
INSERT INTO "activity_template_fields" VALUES('technical_effort','Technical','number',1,0);
INSERT INTO "activity_template_fields" VALUES('total_effort_hrs','Total Effort Hrs','number',1,0);
INSERT INTO "activity_template_fields" VALUES('tr_no','TR No. if any','text',1,0);
INSERT INTO "admin_profiles" VALUES('USR-ADMIN','System Admin');
INSERT INTO "attendance_policy" VALUES(1,'Office','','',15,'','','','',1,0);
INSERT INTO "attendance_records" VALUES('ATT-EMP-1001-1','EMP-1001','Check in','14-07-2026','09:18 AM',19.076,72.8777,'18m');
INSERT INTO "companies" VALUES('COMP-AVANZAR','Avanzar IT Consulting');
INSERT INTO "email_config" VALUES(1,'HR Team','','smtp.gmail.com','587',0);
INSERT INTO "employee_groups" VALUES('GRP-ADMIN','Admin','','System default',1);
INSERT INTO "employee_hiring" VALUES('EMP-1001','accepted','02-07-2026','03-07-2026','04-07-2026',1,0,'','');
INSERT INTO "employee_onboarding_details" VALUES('EMP-1001','Aarav Mehta','9999991111','08-07-1998','aarav.personal@mail.com','Sunita Mehta','Rakesh Mehta','Rakesh Mehta','Priya Mehta - 9876500000','Axis Bank','XXXX4321','UTIB0001234','ABCDE1234F','1234 5678 9012','{"legalName": "Aarav Mehta", "phone": "9999991111", "address": "Mumbai, Maharashtra", "designation": "Frontend Engineer", "location": "Mumbai", "emergencyContact": "Priya Mehta - 9876500000", "bankName": "Axis Bank", "accountNumber": "XXXX4321", "ifsc": "UTIB0001234", "pan": "ABCDE1234F", "adharNo": "1234 5678 9012", "dateOfBirth": "08-07-1998", "personalMailId": "aarav.personal@mail.com", "motherName": "Sunita Mehta", "fatherName": "Rakesh Mehta", "husbandGuardianName": "Rakesh Mehta"}');
INSERT INTO "employee_profiles" VALUES('EMP-1001','9999991111','Frontend Engineer','Mumbai','Works on client dashboards and internal tooling.');
INSERT INTO "employees" VALUES('EMP-1001','Aarav Mehta','aarav@company.com','Engineering','Developer','On-site location required','JOIN1001','Active',1,'2026-07-27 08:02:15');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-01-01','01-01-2026','Thursday','New Year''s Day','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-01-26','26-01-2026','Monday','Republic Day','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-03-03','03-03-2026','Tuesday','Doljatra','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-03-21','21-03-2026','Saturday','Eid-Ul-Fitr','RH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-04-15','15-04-2026','Wednesday','Bengali New Year''s Day','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-05-01','01-05-2026','Friday','May Day','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-06-26','26-06-2026','Friday','Muharram','RH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-07-16','16-07-2026','Thursday','Rath Yatra','RH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-08-15','15-08-2026','Saturday','Independence Day','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-09-04','04-09-2026','Friday','Janmashtami','RH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-10-02','02-10-2026','Friday','Gandhi Jayanti','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-10-19','19-10-2026','Monday','Maha Ashtami','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-10-20','20-10-2026','Tuesday','Maha Navami','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-10-21','21-10-2026','Wednesday','Dussehra','CH');
INSERT INTO "holiday_calendar" VALUES('HOL-2026-12-25','25-12-2026','Friday','Christmas Day','CH');
INSERT INTO "leave_policy" VALUES(1,16,7,6,0);
INSERT INTO "offer_templates" VALUES('TPL-OFFER-DEFAULT','Offer Letter - {{companyName}}','Dear {{employeeName}},

We are pleased to offer you the role of {{role}} in the {{department}} team at {{companyName}}.

Temporary portal login:
Email: {{employeeEmail}}
Password: {{temporaryPassword}}

Please log in to the HRMS portal and accept your offer to continue onboarding.

Regards,
{{senderName}}');
INSERT INTO "onboarding_template_fields" VALUES('legalName','Legal full name','text',1);
INSERT INTO "onboarding_template_fields" VALUES('phone','Phone number','text',1);
INSERT INTO "onboarding_template_fields" VALUES('designation','Designation','text',1);
INSERT INTO "onboarding_template_fields" VALUES('location','Base location','text',1);
INSERT INTO "onboarding_template_fields" VALUES('emergencyContact','Emergency contact','text',1);
INSERT INTO "onboarding_template_fields" VALUES('bankName','Bank name','text',1);
INSERT INTO "onboarding_template_fields" VALUES('accountNumber','Account number','text',1);
INSERT INTO "onboarding_template_fields" VALUES('ifsc','IFSC code','text',1);
INSERT INTO "onboarding_template_fields" VALUES('pan','PAN no.','text',1);
INSERT INTO "onboarding_template_fields" VALUES('adharNo','Aadhar no.','text',1);
INSERT INTO "onboarding_template_fields" VALUES('dateOfBirth','Date of birth','text',1);
INSERT INTO "onboarding_template_fields" VALUES('personalMailId','Personal mail ID','text',1);
INSERT INTO "onboarding_template_fields" VALUES('motherName','Mother''s name','text',1);
INSERT INTO "onboarding_template_fields" VALUES('fatherName','Father''s name','text',1);
INSERT INTO "onboarding_template_fields" VALUES('husbandGuardianName','Husband/Guardian name','text',1);
INSERT INTO "onboarding_template_fields" VALUES('bloodGroup','Blood group','text',0);
INSERT INTO "onboarding_template_fields" VALUES('maritalStatus','Marital status','text',1);
INSERT INTO "onboarding_template_fields" VALUES('spouseName','Name of spouse','text',0);
INSERT INTO "onboarding_template_fields" VALUES('numberOfChildren','No. of children','text',0);
INSERT INTO "onboarding_template_fields" VALUES('PresentAddressLine1','Present Address line 1','textarea',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentAddressLine2','Present Address line 2','textarea',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentPostOffice','Present post office','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentPoliceStation','Present police station','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentDistrict','Present district','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentState','Present state','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PresentPin','Present PIN','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentAddressLine1','Permanent Address line 1','textarea',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentAddressLine2','Permanent Address line 2','textarea',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentPostOffice','Permanent post office','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentPoliceStation','Permanent police station','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentDistrict','Permanent district','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentState','Permanent state','text',1);
INSERT INTO "onboarding_template_fields" VALUES('PermanentPin','Permanent PIN','text',1);
INSERT INTO "onboarding_template_fields" VALUES('experienceType','Experienced/Fresher','text',1);
INSERT INTO "onboarding_template_fields" VALUES('pfAvailable','PF available','text',1);
INSERT INTO "onboarding_template_fields" VALUES('pfNo','PF no.','text',1);
INSERT INTO "onboarding_template_fields" VALUES('uanNo','UAN no.','text',1);
INSERT INTO "tickets" VALUES('#706','Fwd: Open Import PO Outstanding Payment Report','Problem','Medium','SAP Support','Assigned agent','Finance','John Doe','Open','Response Overdue','Resolve in 3 days','2 hours ago');
INSERT INTO "tickets" VALUES('#705','Fwd: In-transit Qty. and Value Columns required in ZMMRO','Problem','Medium','SAP Support','Assigned agent','Operations','Dale Steyn','Awaiting Customer Response','Within SLA','SLA paused 6 hours ago','2 hours ago');
INSERT INTO "tickets" VALUES('#702','Material not returned in stock after cancel of transfer invoice','Problem','Medium','SAP Support','Assigned agent','Store','Jack','WIP','Response Overdue','Resolve in 2 days','4 days ago');
INSERT INTO "users" VALUES('USR-ADMIN',NULL,'System Admin','admin@hrms.local','admin','welcome@123','hrms-admin');
INSERT INTO "users" VALUES('USR-EMP-1001','EMP-1001','Aarav Mehta','aarav@company.com','employee','welcome@123','hrms-employee');
INSERT INTO "wfh_policy" VALUES(1,1,2,6,0);
