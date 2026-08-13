const STORAGE_KEY = "hrms-portal-prototype-recovered-v2";
const LOCAL_API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port === "4173"
  ? "http://127.0.0.1:8000"
  : "";
const REMOTE_STATE_ENDPOINT = `${LOCAL_API_BASE}/api/state`;
const FEEDBACK_ENDPOINT = `${LOCAL_API_BASE}/api/feedback`;
const DOCX_PARSE_ENDPOINT = `${LOCAL_API_BASE}/api/parse-employee-docx`;
const LOCAL_SEED_STATE_ENDPOINT = "./database/production/current-hrms-browser-data.json";
const CLIENT_ONLY_STATE_KEYS = new Set([
  "session", "selectedLogin", "ticketLoginType", "ticketSession", "ticketFilter", "ticketDraftGroupId", "ticketSection", "ticketProfileOpen",
  "activeSection", "selectedEmployeeId", "selectedLeaveWfhEmployeeId", "adminEmployeeView", "selectedHolidayGroupId",
  "attendanceFilterDate", "attendanceFilterFrom", "attendanceFilterTo", "attendanceSearchQuery", "attendanceReportMode", "attendanceFilterMonth", "attendanceEmployeeStatusFilter", "employeeAttendanceCalendarMonth",
  "adjustmentHistoryFilterEmployee", "adjustmentHistoryFilterDate", "wfhHistoryFilterEmployee", "wfhHistoryFilterMonth",
  "adminLeaveWfhReportSearch", "adminLeaveWfhReportEmployeeId", "adminLeaveWfhReportDateMode", "adminLeaveWfhReportMonth", "adminLeaveWfhReportYear", "adminLeaveWfhReportFrom", "adminLeaveWfhReportTo", "adminLeaveWfhReportType",
  "adminLeaveWfhCalendarMonth", "adminLeaveWfhCalendarDate", "adminLeaveWfhCalendarEmployeeId",
  "wfhRequestDraft", "leaveRequestDraft", "leaveWfhCalendarMonth", "leaveWfhSelectedDates", "leaveWfhRequestType", "leaveWfhRequestReason", "leaveWfhDatePicker"
]);
const TEMP_PASSWORD = "welcome@123";

const DOCX_REQUIRED_FIELD_KEYS = new Set([
  "legalName", "phone", "emergencyContact", "dateOfBirth", "personalMailId", "motherName", "fatherName",
  "pan", "adharNo", "experienceType", "pfAvailable", "pfNo", "uanNo", "bankName",
  "accountNumber", "bankBranch", "accountType", "ifsc", "bankDetailsAttachment",
  "PresentAddressLine1", "PresentAddressLine2", "PresentPostOffice", "PresentPoliceStation", "PresentDistrict", "PresentState",
  "PresentPin", "PermanentAddressLine1", "PermanentAddressLine2", "PermanentPostOffice", "PermanentPoliceStation",
  "PermanentDistrict", "PermanentState", "PermanentPin", "educationalDetails"
]);

const EDUCATION_HEADERS = ["Degree / PG / Diploma", "Marks obtained", "University", "City", "Year of passing"];
const PREVIOUS_COMPANY_HEADERS = ["Name", "Address", "Designation", "Reporting", "Contact details"];
const PROFILE_ATTACHMENT_REQUIREMENTS = [
  { key: "passportPhoto", label: "PASSPORT SIZE PHOTO 1 COPY" },
  { key: "updatedResume", label: "LAST UPDATED RESUME" },
  { key: "qualificationCertificates", label: "ALL QUALIFICATION CERTIFICATE INCLUDING MARKSHEET" },
  { key: "latestOfferLetter", label: "LAST COMPANIES OFFER LETTER/APPOINTMENT LETTER", required: false },
  { key: "latestRelievingLetter", label: "LAST COMPANIES RELIEVING LETTER/EXPERIENCE LETTER", required: false },
  { key: "lastPayslips", label: "LAST 3 MONTHS PAYSLIP", required: false },
  { key: "form16OrBankStatement", label: "FORM 16 OR BANK STATEMENT (LAST 6 MONTHS)" },
  { key: "previousOfferAndRelease", label: "ALL PREVIOUS COMPANIES OFFER LETTER & RELEASE LETTER", required: false },
  { key: "voterId", label: "VOTER ID" },
  { key: "panCardAttachment", label: "PAN CARD" },
  { key: "adharCardAttachment", label: "ADHAR CARD" },
  { key: "passportAttachment", label: "PASSPORT", required: false },
  { key: "bankDetailsAttachment", label: "BANK DETAILS ATTACHMENT / CANCEL CHEQUE / PASSBOOK FRONT PAGE" }
];
const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed", "Separated", "Prefer not to say"];
const EXPERIENCE_OPTIONS = ["Fresher", "Experienced"];
const YES_NO_OPTIONS = ["Yes", "No"];
const LEAVE_TYPES = [
  { key: "privilege", label: "Privilege Leave", shortLabel: "PL", policyKey: "privilegeLeave" },
  { key: "sick", label: "Sick Leave", shortLabel: "SL", policyKey: "sickLeave" }
];
const ATTENDANCE_CLAIM_TYPES = ["Missed check in", "Missed check out", "Missed check in and check out", "Late check in", "Other"];
const DEFAULT_ADMIN_GROUP_ID = "GRP-ADMIN";
const DEFAULT_HOLIDAY_CALENDAR = [
  { id: "HOL-2026-01-01", date: "01-01-2026", day: "Thursday", name: "New Year's Day", type: "CH" },
  { id: "HOL-2026-01-26", date: "26-01-2026", day: "Monday", name: "Republic Day", type: "CH" },
  { id: "HOL-2026-03-03", date: "03-03-2026", day: "Tuesday", name: "Doljatra", type: "CH" },
  { id: "HOL-2026-03-21", date: "21-03-2026", day: "Saturday", name: "Eid-Ul-Fitr", type: "RH" },
  { id: "HOL-2026-04-15", date: "15-04-2026", day: "Wednesday", name: "Bengali New Year's Day", type: "CH" },
  { id: "HOL-2026-05-01", date: "01-05-2026", day: "Friday", name: "May Day", type: "CH" },
  { id: "HOL-2026-06-26", date: "26-06-2026", day: "Friday", name: "Muharram", type: "RH" },
  { id: "HOL-2026-07-16", date: "16-07-2026", day: "Thursday", name: "Rath Yatra", type: "RH" },
  { id: "HOL-2026-08-15", date: "15-08-2026", day: "Saturday", name: "Independence Day", type: "CH" },
  { id: "HOL-2026-09-04", date: "04-09-2026", day: "Friday", name: "Janmashtami", type: "RH" },
  { id: "HOL-2026-10-02", date: "02-10-2026", day: "Friday", name: "Gandhi Jayanti", type: "CH" },
  { id: "HOL-2026-10-19", date: "19-10-2026", day: "Monday", name: "Maha Ashtami", type: "CH" },
  { id: "HOL-2026-10-20", date: "20-10-2026", day: "Tuesday", name: "Maha Navami", type: "CH" },
  { id: "HOL-2026-10-21", date: "21-10-2026", day: "Wednesday", name: "Dussehra", type: "CH" },
  { id: "HOL-2026-12-25", date: "25-12-2026", day: "Friday", name: "Christmas Day", type: "CH" }
];
const PERSONAL_DETAIL_KEYS = ["legalName", "phone", "dateOfBirth", "personalMailId", "motherName", "fatherName", "bloodGroup", "maritalStatus", "spouseName", "numberOfChildren", "emergencyContact", "pan", "adharNo"];
const PRESENT_ADDRESS_KEYS = ["PresentAddressLine1", "PresentAddressLine2", "PresentPostOffice", "PresentPoliceStation", "PresentDistrict", "PresentState", "PresentPin"];
const PERMANENT_ADDRESS_KEYS = ["PermanentAddressLine1", "PermanentAddressLine2", "PermanentPostOffice", "PermanentPoliceStation", "PermanentDistrict", "PermanentState", "PermanentPin"];
const BANK_DETAIL_KEYS = ["bankName", "accountNumber", "bankBranch", "accountType", "ifsc"];
const EMPLOYMENT_DETAIL_KEYS = ["designation", "location", "experienceType", "pfAvailable", "pfNo", "uanNo"];

const defaultOnboardingFields = [
  { key: "legalName", label: "Legal full name", type: "text", required: true },
  { key: "phone", label: "Phone number", type: "text", required: true },
  { key: "designation", label: "Designation", type: "text", required: true },
  { key: "location", label: "Base location", type: "text", required: true },
  { key: "emergencyContact", label: "Emergency contact", type: "text", required: true },
  { key: "bankName", label: "Bank name", type: "text", required: true },
  { key: "accountNumber", label: "Account number", type: "text", required: true },
  { key: "ifsc", label: "IFSC code", type: "text", required: true },
  { key: "pan", label: "PAN no.", type: "text", required: true },
  { key: "adharNo", label: "Aadhar no.", type: "text", required: true },
  { key: "dateOfBirth", label: "Date of birth", type: "text", required: true },
  { key: "personalMailId", label: "Personal mail ID", type: "text", required: true },
  { key: "motherName", label: "Mother's name", type: "text", required: true },
  { key: "fatherName", label: "Father's name", type: "text", required: true },
  { key: "bloodGroup", label: "Blood group", type: "text", required: false },
  { key: "maritalStatus", label: "Marital status", type: "text", required: true },
  { key: "spouseName", label: "Name of spouse", type: "text", required: false },
  { key: "numberOfChildren", label: "No. of children", type: "text", required: false },
  { key: "PresentAddressLine1", label: "Address line 1", type: "textarea", required: true },
  { key: "PresentAddressLine2", label: "Address line 2", type: "textarea", required: false },
  { key: "PresentPostOffice", label: "Post office", type: "text", required: true },
  { key: "PresentPoliceStation", label: "Police station", type: "text", required: true },
  { key: "PresentDistrict", label: "District", type: "text", required: true },
  { key: "PresentState", label: "State", type: "text", required: true },
  { key: "PresentPin", label: "PIN", type: "text", required: true },
  { key: "PermanentAddressLine1", label: "Address line 1", type: "textarea", required: true },
  { key: "PermanentAddressLine2", label: "Address line 2", type: "textarea", required: false },
  { key: "PermanentPostOffice", label: "Post office", type: "text", required: true },
  { key: "PermanentPoliceStation", label: "Police station", type: "text", required: true },
  { key: "PermanentDistrict", label: "District", type: "text", required: true },
  { key: "PermanentState", label: "State", type: "text", required: true },
  { key: "PermanentPin", label: "PIN", type: "text", required: true },
  { key: "experienceType", label: "Experienced/Fresher", type: "text", required: true },
  { key: "pfAvailable", label: "PF available", type: "text", required: true },
  { key: "pfNo", label: "PF no.", type: "text", required: true },
  { key: "uanNo", label: "UAN no.", type: "text", required: false }
];

const defaultActivityFields = [
  { key: "sl_no", label: "SL No.", type: "text", required: false, readOnly: true },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "module", label: "Module", type: "text", required: true },
  { key: "group_client", label: "Group/Client", type: "groupClient", required: true },
  { key: "ticket_number", label: "Ticket Number", type: "text", required: true },
  { key: "issue_raised_by", label: "Issue Raised by", type: "text", required: true },
  { key: "medium", label: "Medium", type: "text", required: true },
  { key: "subject", label: "Subject", type: "text", required: true },
  { key: "issue_description", label: "Issue Description", type: "textarea", required: true },
  { key: "status", label: "Status", type: "select", required: true, options: ["WIP", "Completed", "Pending", "Hold", "Cancelled"] },
  { key: "priority", label: "Priority", type: "select", required: true, options: ["High", "Medium", "Low"] },
  { key: "category", label: "Category", type: "text", required: true },
  { key: "functional_consultant", label: "Functional Consultant", type: "text", required: true },
  { key: "abap_consultant", label: "ABAP Consultant", type: "text", required: true },
  { key: "planned_end_date", label: "Planned End Date", type: "date", required: true },
  { key: "actual_end_date", label: "Actual End Date", type: "date", required: true },
  { key: "final_remarks", label: "Final Remarks", type: "textarea", required: true },
  { key: "functional_effort", label: "Functional", type: "number", required: true },
  { key: "technical_effort", label: "Technical", type: "number", required: true },
  { key: "total_effort_hrs", label: "Total Effort Hrs", type: "number", required: true },
  { key: "tr_no", label: "TR No. if any", type: "text", required: true }
];

const defaultState = {
  session: null,
  selectedLogin: "employee",
  ticketLoginType: "employee",
  ticketSession: null,
  ticketUsers: [],
  ticketGroups: [],
  ticketFilter: "assigned",
  ticketDraftGroupId: "",
  ticketSection: "",
  ticketProfileOpen: false,
  activeSection: "overview",
  selectedEmployeeId: "EMP-1001",
  wfhHistoryFilterEmployee: "EMP-1001",
  wfhHistoryFilterMonth: new Date().toISOString().slice(0, 7),
  adminLeaveWfhReportSearch: "",
  adminLeaveWfhReportEmployeeId: "",
  adminLeaveWfhReportDateMode: "all",
  adminLeaveWfhReportMonth: new Date().toISOString().slice(0, 7),
  adminLeaveWfhReportYear: String(new Date().getFullYear()),
  adminLeaveWfhReportFrom: "",
  adminLeaveWfhReportTo: "",
  adminLeaveWfhReportType: "",
  adminLeaveWfhCalendarMonth: new Date().toISOString().slice(0, 7),
  adminLeaveWfhCalendarDate: todayDdMmYyyy(),
  adminLeaveWfhCalendarEmployeeId: "",
  adminEmployeeView: null,
  adminProfile: { name: "System Admin", email: "admin@hrms.local", password: TEMP_PASSWORD },
  adminEmails: ["admin@hrms.local"],
  companyProfile: { companyName: "Avanzar IT Consulting" },
  emailConfig: { senderName: "HR Team", senderEmail: "", smtpHost: "smtp.gmail.com", smtpPort: "587", appPassword: "", configured: false },
  offerTemplate: {
    subject: "Offer Letter - {{companyName}}",
    body: "Dear {{employeeName}},\n\nWe are pleased to offer you the role of {{role}} in the {{department}} team at {{companyName}}.\n\nTemporary portal login:\nEmail: {{employeeEmail}}\nPassword: {{temporaryPassword}}\n\nPlease log in to the HRMS portal and accept your offer to continue onboarding.\n\nRegards,\n{{senderName}}"
  },
  onboardingTemplate: {
    title: "Employee onboarding form",
    instructions: "Fill the onboarding form carefully. Fields marked with * are mandatory.",
    fields: defaultOnboardingFields
  },
  activityTemplate: {
    title: "Activity Log",
    instructions: "Fill the activity sheet row by row. Draft rows can be saved and updated later, while submitted rows lock automatically.",
    fields: defaultActivityFields,
    groupClientOptions: ["Core HRMS"]
  },
  wfhPolicy: { weeklyLimit: 1, monthlyLimit: 2, requestWindowMonths: 6, locked: false },
  wfhPolicyHistory: [],
  wfhAutoApproval: false,
  leaveAutoApproval: false,
  leavePolicy: { privilegeLeave: 16, sickLeave: 7, requestWindowMonths: 6, locked: false },
  leavePolicyHistory: [],
  leaveRequests: [],
  leaveRequestDraft: { date: "", fromDate: "", toDate: "", type: "privilege", reason: "" },
  leaveWfhCalendarMonth: new Date().toISOString().slice(0, 7),
  leaveWfhSelectedDates: [],
  leaveWfhRequestType: "wfh",
  leaveWfhRequestReason: "",
  leaveWfhDatePicker: null,
  holidayCalendar: DEFAULT_HOLIDAY_CALENDAR,
  holidayGroupCalendars: {},
  selectedHolidayGroupId: "",
  holidayRequests: [],
  recentEmails: [],
  ticketTickets: [
    { id: "#706", subject: "Fwd: Open Import PO Outstanding Payment Report", category: "Problem", priority: "Medium", group: "SAP Support", agent: "Assigned agent", department: "Finance", requester: "John Doe", status: "Open", sla: "Response Overdue", due: "Resolve in 3 days", createdAt: "2 hours ago" },
    { id: "#705", subject: "Fwd: In-transit Qty. and Value Columns required in ZMMRO", category: "Problem", priority: "Medium", group: "SAP Support", agent: "Assigned agent", department: "Operations", requester: "Dale Steyn", status: "Awaiting Customer Response", sla: "Within SLA", due: "SLA paused 6 hours ago", createdAt: "2 hours ago" },
    { id: "#702", subject: "Material not returned in stock after cancel of transfer invoice", category: "Problem", priority: "Medium", group: "SAP Support", agent: "Assigned agent", department: "Store", requester: "Jack", status: "WIP", sla: "Response Overdue", due: "Resolve in 2 days", createdAt: "4 days ago" }
  ],
  employeeGroups: [{ id: DEFAULT_ADMIN_GROUP_ID, name: "Admin", parentId: "", members: [], createdAt: "System default", isDefault: true }],
  employees: [{
    id: "EMP-1001",
    fullName: "Aarav Mehta",
    email: "aarav@company.com",
    department: "Engineering",
    role: "Developer",
    locationPolicy: "On-site location required",
    signupCode: "JOIN1001",
    status: "Active",
    signedUp: true,
    profile: { phone: "9999991111", designation: "Frontend Engineer", location: "Mumbai", bio: "Works on client dashboards and internal tooling." },
    onboardingDetails: {
      legalName: "Aarav Mehta", phone: "9999991111", address: "Mumbai, Maharashtra", designation: "Frontend Engineer",
      location: "Mumbai", emergencyContact: "Priya Mehta - 9876500000", bankName: "Axis Bank", accountNumber: "XXXX4321",
      ifsc: "UTIB0001234", pan: "ABCDE1234F", adharNo: "1234 5678 9012", dateOfBirth: "08-07-1998",
      personalMailId: "aarav.personal@mail.com", motherName: "Sunita Mehta", fatherName: "Rakesh Mehta", husbandGuardianName: "Rakesh Mehta"
    },
    onboardingFieldLabels: {},
    attachments: {},
    attendance: [{ type: "Check in", date: "14-07-2026", time: "09:18 AM", latitude: 19.076, longitude: 72.8777, accuracy: "18m" }],
    activities: [{ rowId: "ACT-1001-1", slNo: 1, workflowStatus: "submitted", values: { date: "08-07-2026", module: "Core HRMS", group_client: "Core HRMS", ticket_number: "HRMS-101", issue_raised_by: "-", medium: "-", subject: "Completed profile edit flow prototype", issue_description: "Completed profile edit flow prototype", status: "Completed", priority: "High", category: "Enhancement", functional_consultant: "Priya Sharma", abap_consultant: "Aarav Mehta", planned_end_date: "08-07-2026", actual_end_date: "08-07-2026", final_remarks: "Ready for next changes", functional_effort: 2, technical_effort: 5, total_effort_hrs: 7, tr_no: "" }, savedAt: "08-07-2026", submittedAt: "08-07-2026" }],
    credentials: { password: TEMP_PASSWORD },
    hiring: { offerStatus: "accepted", offerSentAt: "02-07-2026", offerAcceptedAt: "03-07-2026", onboardingSubmittedAt: "04-07-2026", profileEditAllowed: true, profileReviewed: false, offerDraftSubject: "", offerDraftBody: "" }
  }]
};

const app = document.querySelector("#app");
const logoutBtn = document.querySelector("#logoutBtn");
const notificationBtn = document.querySelector("#notificationBtn");
const notificationBadge = document.querySelector("#notificationBadge");
const notificationCountLabel = document.querySelector("#notificationCountLabel");
let remoteStateConfigured = false;
let remoteSaveTimer = null;
let localSeedState = null;
let state = loadState();
let groupPickerOutsideClickBound = false;
let activityGroupClientOutsideClickBound = false;

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function todayDdMmYyyy() { const d = new Date(); return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`; }
function formatTime(date = new Date()) { return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(date); }
function escapeHtml(value) { return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
function emptyState(message) { return `<div class="empty-state">${escapeHtml(message)}</div>`; }
function isPendingStatus(item) { return String(item?.status || "pending").toLowerCase() === "pending"; }
function getAdminNavPendingCount(section) {
  if (section === "employees") return (state.employees || []).filter((employee) => employee.hiring?.onboardingSubmittedAt && !employee.hiring?.profileReviewed).length;
  if (section === "employee_grouping") return 0;
  if (section === "leave_wfh") return (state.wfhRequests || []).filter(isPendingStatus).length + (state.leaveRequests || []).filter(isPendingStatus).length;
  if (section === "holiday") return (state.holidayRequests || []).filter(isPendingStatus).length;
  if (section === "attendance_adjustment") return getPendingAttendanceClaims().length;
  if (section === "activity_tracker") return 0;
  if (section === "hiring") return (state.employees || []).filter((employee) => employee.hiring?.offerStatus === "sent" && !employee.hiring?.offerAcceptedAt).length;
  return 0;
}
function getEmployeeActivityReminderCount(employee) {
  if (!employee) return 0;
  const parsedToday = parseDdMmYyyy(todayDdMmYyyy());
  if (!parsedToday || parsedToday.getDay() < 5) return 0;
  const weekRange = getWeekRangeForDate(todayDdMmYyyy());
  const weeklyRows = getEmployeeActivityRowsInRange(employee, weekRange.from, weekRange.to);
  return weeklyRows.some((row) => row.savedAt || row.submittedAt || row.workflowStatus === "submitted") ? 0 : 1;
}
function getEmployeeNavPendingCount(section) {
  const employee = getCurrentSessionEmployee();
  if (!employee) return 0;
  const pendingLeaveWfh = (state.wfhRequests || []).filter((request) => request.employeeId === employee.id && isPendingStatus(request)).length
    + (state.leaveRequests || []).filter((request) => request.employeeId === employee.id && isPendingStatus(request)).length;
  const pendingHoliday = (state.holidayRequests || []).filter((request) => request.employeeId === employee.id && isPendingStatus(request)).length;
  const pendingActivity = getEmployeeActivityReminderCount(employee);
  const pendingGroupUpdates = getCurrentNotifications().filter((item) => item.section === "groups" && !item.columnResolved).length;
  if (section === "overview") return 0;
  if (section === "groups") return pendingGroupUpdates;
  if (section === "leave_wfh") return pendingLeaveWfh;
  if (section === "holiday") return pendingHoliday;
  if (section === "activity") return pendingActivity;
  return 0;
}
function isAdminNavPendingTracked(section) {
  if (state.session?.role !== "admin") return ["groups", "leave_wfh", "holiday", "activity"].includes(section);
  return ["employees", "employee_grouping", "leave_wfh", "holiday", "attendance_adjustment", "activity_tracker", "hiring"].includes(section);
}
function navButton(section, label) {
  const adminPendingCount = section === "overview" ? ["employees", "employee_grouping", "leave_wfh", "holiday", "attendance_adjustment", "activity_tracker", "hiring"].reduce((total, item) => total + getAdminNavPendingCount(item), 0) : getAdminNavPendingCount(section);
  const pendingCount = state.session?.role === "admin" ? adminPendingCount : getEmployeeNavPendingCount(section);
  const badgeLabel = pendingCount + " pending " + (pendingCount === 1 ? "task" : "tasks");
  const badge = isAdminNavPendingTracked(section) && pendingCount > 0 ? `<span class="nav-pending-badge" aria-label="${escapeHtml(badgeLabel)}">${pendingCount > 99 ? "99+" : pendingCount}</span>` : "";
  const pendingClass = badge ? " has-pending" : "";
  return `<button class="nav-btn${pendingClass} ${state.activeSection === section ? "active" : ""}" data-section="${section}" type="button"><span class="nav-btn-label">${escapeHtml(label)}</span>${badge}</button>`;
}
function externalNavButton(label, href) { return `<a class="nav-btn external-nav-btn" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`; }
function formatDate(value) { if (!value) return "-"; return normalizeActivityDateValue(value) || value; }
function normalizeActivityDateValue(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) return raw;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) { const [y, m, d] = raw.split("-"); return `${d}-${m}-${y}`; }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return `${String(parsed.getDate()).padStart(2, "0")}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${parsed.getFullYear()}`;
}
function toDateInputValue(value) {
  const normalized = normalizeActivityDateValue(value || "");
  const match = normalized.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
}
function fromDateInputValue(value) {
  return normalizeActivityDateValue(value || "");
}
function parseDateSortValue(value) {
  const m = normalizeActivityDateValue(value).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00`).getTime();
}
function getMonthValueFromDate(value) {
  const m = normalizeActivityDateValue(value).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  return m ? `${m[3]}-${m[2]}` : "";
}
function interpolateTemplate(text, values) { return String(text || "").replace(/\{\{(.*?)\}\}/g, (_, key) => values[key.trim()] ?? ""); }
function getFeedbackSenderContext() {
  if (state.session?.role === "admin") {
    return { name: state.adminProfile?.name || "System Admin", role: "Admin", email: state.adminProfile?.email || "admin@hrms.local", employeeId: "" };
  }
  if (state.session?.role === "employee") {
    const employee = getCurrentEmployee();
    return { name: employee ? getEmployeeDisplayName(employee) : "Employee", role: "Employee", email: employee?.email || state.session.email || "", employeeId: employee?.id || "" };
  }
  if (state.ticketSession) {
    const ticketUser = getCurrentTicketUser();
    return { name: ticketUser?.name || state.ticketSession.name || "Raise Ticket user", role: `Raise Ticket ${state.ticketSession.role || "user"}`, email: ticketUser?.email || state.ticketSession.email || "", employeeId: ticketUser?.id || "" };
  }
  return { name: "Guest tester", role: "Guest", email: "", employeeId: "" };
}

function getFeedbackPageName() {
  if (isTicketStandalonePage()) return `Raise Ticket - ${getTicketActiveSection().replace(/_/g, " ")}`;
  if (!state.session) return "HRMS login page";
  const section = String(state.activeSection || "overview").replace(/_/g, " ");
  return `${state.session.role === "admin" ? "Admin" : "Employee"} - ${section}`;
}

function renderFeedbackWidget() {
  let widget = document.querySelector("#feedbackWidget");
  if (!widget) {
    widget = document.createElement("div");
    widget.id = "feedbackWidget";
    widget.className = "feedback-widget";
    widget.innerHTML = `<button class="feedback-trigger" id="feedbackTrigger" type="button" aria-label="Share portal feedback"><span>Feedback</span></button>`;
    document.body.appendChild(widget);
  }
  const trigger = widget.querySelector("#feedbackTrigger");
  if (trigger) trigger.onclick = openFeedbackDialog;
}

function closeFeedbackDialog() {
  document.querySelector("#feedbackPopover")?.remove();
}

async function readFeedbackAttachments(input) {
  const files = Array.from(input?.files || []);
  const maxSize = 5 * 1024 * 1024;
  if (files.some((file) => file.size > maxSize)) {
    throw new Error("Please keep every attachment below 5 MB for this temporary feedback log.");
  }
  return Promise.all(files.map(async (file) => ({
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    contentBase64: arrayBufferToBase64(await file.arrayBuffer())
  })));
}

function openFeedbackDialog(event) {
  event?.stopPropagation();
  const existing = document.querySelector("#feedbackPopover");
  if (existing) {
    closeFeedbackDialog();
    return;
  }
  
  const isAdmin = state.session?.role === "admin";
  let isAddingRow = false; // Will be set in renderContent if needed
  let isSubmitting = false;
  
  const box = document.createElement("div");
  box.id = "feedbackPopover";
  box.className = "feedback-modal-overlay";
  box.setAttribute("data-feedback-overlay", "true");
  
  const renderContent = () => {
    const feedbacks = state.feedbacks || [];
    if (feedbacks.length === 0 && !isAddingRow && box.innerHTML === "") {
        isAddingRow = true; // Default to true if no feedbacks on initial load
    }
    const nextSlNo = feedbacks.length > 0 ? Math.max(...feedbacks.map(f => parseInt(f.slNo) || 0)) + 1 : 1;
    return `
      <div class="feedback-modal-dialog" onclick="event.stopPropagation()">
        <div class="feedback-modal-header">
          <h2>Feedback & Suggestions Tracker</h2>
          <button class="icon-btn" id="feedbackCloseBtn" type="button" aria-label="Close feedback">&times;</button>
        </div>
        <div class="feedback-modal-body">
          <form id="portalFeedbackForm" style="display: flex; flex-direction: column; height: 100%;">
            <div class="feedback-table-wrap" style="flex: 1;">
              <table class="feedback-table">
                <thead>
                  <tr>
                    <th class="col-sl">Sl no</th>
                    <th class="col-type">Feedback type</th>
                    <th class="col-sharedby">Shared by</th>
                    <th class="col-page">Page</th>
                    <th class="col-message">Message</th>
                    <th class="col-status">Status</th>
                    <th class="col-attach">Attachment</th>
                    <th style="width: 100px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${feedbacks.length === 0 && !isAddingRow ? `<tr><td colspan="8" style="text-align: center; color: var(--muted); padding: 32px;">No feedback items yet. Click below to add one.</td></tr>` : 
                    feedbacks.map((fb, idx) => `
                    <tr>
                      <td>${escapeHtml(fb.slNo)}</td>
                      <td>${escapeHtml(fb.type)}</td>
                      <td>${escapeHtml(fb.sender?.name || (typeof fb.sender === 'string' ? fb.sender : '-'))}</td>
                      <td>${escapeHtml(fb.pageName || '-')}</td>
                      <td style="white-space: pre-wrap;">${escapeHtml(fb.message)}</td>
                      <td>
                        ${isAdmin ? `
                          <select class="feedback-status-select" data-index="${idx}" style="padding: 6px; border-radius: 4px; border: 1px solid var(--line); width: 100%; border: none; background: transparent;">
                            <option value="Pending" ${fb.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="WIP" ${fb.status === 'WIP' ? 'selected' : ''}>WIP</option>
                            <option value="Fixed" ${fb.status === 'Fixed' ? 'selected' : ''}>Fixed</option>
                          </select>
                        ` : `<span class="pill ${fb.status === 'Fixed' ? 'success' : fb.status === 'WIP' ? 'warning' : ''}">${escapeHtml(fb.status || 'Pending')}</span>`}
                      </td>
                      <td>
                        ${fb.attachments && fb.attachments.length > 0 ? 
                          `<a href="feedback-attachments/${escapeHtml(fb.attachments[0])}" target="_blank" download style="color: #2563eb; text-decoration: underline;">View</a>` : 
                          '<span class="muted">-</span>'}
                      </td>
                      <td><span class="muted">-</span></td>
                    </tr>
                  `).join('')}
                  ${isAddingRow ? `
                    <tr style="background: #f8fafc;">
                      <td style="font-weight: 600;">${nextSlNo}</td>
                      <td>
                        <select id="feedbackType" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line);" ${isSubmitting ? 'disabled' : ''}>
                          <option value="Bug">Bug</option>
                          <option value="Suggestion">Suggestion</option>
                          <option value="Improvement">Improvement</option>
                          <option value="Confusion">Confusion</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td style="color: var(--muted); font-size: 0.9rem;">${escapeHtml(getFeedbackSenderContext().name)}</td>
                      <td style="color: var(--muted); font-size: 0.9rem;">${escapeHtml(getFeedbackPageName())}</td>
                      <td>
                        <textarea id="feedbackMessage" rows="2" placeholder="Write feedback here..." style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); resize: vertical;" required ${isSubmitting ? 'disabled' : ''}></textarea>
                      </td>
                      <td>
                        ${isAdmin ? `
                          <select id="newFeedbackStatus" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line);" ${isSubmitting ? 'disabled' : ''}>
                            <option value="Pending">Pending</option>
                            <option value="WIP">WIP</option>
                            <option value="Fixed">Fixed</option>
                          </select>
                        ` : `<span class="pill">Pending</span><input type="hidden" id="newFeedbackStatus" value="Pending" />`}
                      </td>
                      <td>
                        <input id="feedbackAttachments" type="file" style="max-width: 200px; font-size: 0.85rem;" ${isSubmitting ? 'disabled' : ''} />
                      </td>
                      <td>
                        <button class="primary-btn" id="submitFeedbackBtn" type="submit" style="padding: 6px 12px; font-size: 0.9rem;" ${isSubmitting ? 'disabled' : ''}>
                          ${isSubmitting ? 'Saving...' : 'Submit'}
                        </button>
                      </td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>
            ${!isAddingRow ? `<div style="margin-top: 14px;"><button class="secondary-btn" id="addNewFeedbackRowBtn" type="button">+ Add new row</button></div>` : ''}
          </form>
        </div>
      </div>
    `;
  };
  
  const reRender = () => {
    box.innerHTML = renderContent();
    bindEvents();
  };
  
  const bindEvents = () => {
    box.querySelector("#feedbackCloseBtn")?.addEventListener("click", closeFeedbackDialog);
    
    box.querySelector("#addNewFeedbackRowBtn")?.addEventListener("click", () => {
      isAddingRow = true;
      reRender();
      setTimeout(() => box.querySelector("#feedbackMessage")?.focus(), 0);
    });
    
    // Status update (Admin only)
    if (isAdmin) {
      box.querySelectorAll(".feedback-status-select").forEach(select => {
        select.addEventListener("change", (e) => {
          const idx = parseInt(e.target.getAttribute("data-index"), 10);
          if (!state.feedbacks) state.feedbacks = [];
          if (state.feedbacks[idx]) {
            state.feedbacks[idx].status = e.target.value;
            scheduleRemoteStateSave();
            showModalMessage("Status updated", "The feedback status has been updated successfully.", "success", true);
          }
        });
      });
    }

    // Submit new feedback
    box.querySelector("#portalFeedbackForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!isAddingRow || isSubmitting) return;
      
      const message = box.querySelector("#feedbackMessage")?.value.trim() || "";
      if (!message) {
        showModalMessage("Feedback message missing", "Please write your feedback before submitting.");
        return;
      }
      
      isSubmitting = true;
      
      // Instead of fully re-rendering and detaching the DOM element (which cancels fetch in some browsers), just disable buttons.
      const submitBtn = box.querySelector("#submitFeedbackBtn");
      if (submitBtn) { submitBtn.textContent = "Saving..."; submitBtn.disabled = true; }
      
      try {
        if (!state.feedbacks) state.feedbacks = [];
        const nextSlNo = state.feedbacks.length > 0 ? Math.max(...state.feedbacks.map(f => parseInt(f.slNo) || 0)) + 1 : 1;
        
        const attachments = await readFeedbackAttachments(box.querySelector("#feedbackAttachments"));
        const response = await fetch(FEEDBACK_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slNo: nextSlNo,
            sender: getFeedbackSenderContext(),
            pageName: getFeedbackPageName(),
            feedbackType: box.querySelector("#feedbackType")?.value || "Other",
            message,
            attachments
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "Feedback could not be saved.");
        
        state.feedbacks.push({
          slNo: nextSlNo,
          type: box.querySelector("#feedbackType")?.value || "Other",
          sender: getFeedbackSenderContext(),
          pageName: getFeedbackPageName(),
          message: message,
          status: box.querySelector("#newFeedbackStatus")?.value || "Pending",
          attachments: result.savedAttachments || []
        });
        
        scheduleRemoteStateSave();
        
        isAddingRow = false;
        isSubmitting = false;
        reRender();
        showModalMessage("Feedback saved", "Thank you. Your feedback has been added to the tracker.", "success", true);
      } catch (error) {
        isSubmitting = false;
        reRender();
        showModalMessage("Feedback save failed", error.message || "The feedback could not be written to the server.");
      }
    });
  };
  
  reRender();
  document.body.appendChild(box);
}
function getCurrentEmployee() { return state.session?.role === "employee" ? state.employees.find((employee) => employee.email === state.session.email) || null : null; }
function getSelectedEmployee() { return state.employees.find((employee) => employee.id === state.selectedEmployeeId) || null; }
function getEmployeeDisplayName(employee) {
  if (!employee) return "";
  return String(employee.directoryName || employee.fullName || employee.onboardingDetails?.legalName || employee.email || employee.id || "").trim();
}

function makeGroupId() { return `GRP-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`; }
function normalizeEmployeeGroups(groups, employees = []) {
  const employeeIds = new Set((employees || []).map((employee) => employee.id));
  const source = Array.isArray(groups) ? groups : [];
  const byId = new Map();
  for (const group of source) {
    if (!group?.id) continue;
    const members = Array.from(new Set((group.members || []).filter((id) => employeeIds.has(id))));
    byId.set(group.id, { id: group.id, name: group.name || "Untitled group", parentId: group.parentId || "", members, createdAt: group.createdAt || todayDdMmYyyy(), isDefault: Boolean(group.isDefault) });
  }
  if (!byId.has(DEFAULT_ADMIN_GROUP_ID)) byId.set(DEFAULT_ADMIN_GROUP_ID, { id: DEFAULT_ADMIN_GROUP_ID, name: "Admin", parentId: "", members: [], createdAt: "System default", isDefault: true });
  const ids = new Set(byId.keys());
  return Array.from(byId.values()).map((group) => ({ ...group, parentId: ids.has(group.parentId) && group.parentId !== group.id ? group.parentId : "" })).sort((a, b) => (a.parentId || "").localeCompare(b.parentId || "") || a.name.localeCompare(b.name));
}
function getGroupById(groupId) { return (state.employeeGroups || []).find((group) => group.id === groupId) || null; }
function getGroupChildren(groupId) { return (state.employeeGroups || []).filter((group) => group.parentId === groupId); }
function getEmployeeGroups(employeeId) { return (state.employeeGroups || []).filter((group) => (group.members || []).includes(employeeId)); }
function getGroupPath(group) {
  const parts = [];
  let current = group;
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    parts.unshift(current.name);
    seen.add(current.id);
    current = current.parentId ? getGroupById(current.parentId) : null;
  }
  return parts.join(" / ");
}
function getGroupMemberEmployees(group) { return (group.members || []).map((id) => state.employees.find((employee) => employee.id === id)).filter(Boolean); }
function createGroupMembershipNotification(employeeId, group, action) {
  const title = action === "added" ? "Added to employee group" : "Removed from employee group";
  const message = action === "added" ? `You were added to ${getGroupPath(group)}.` : `You were removed from ${getGroupPath(group)}.`;
  return { ...createNotification({ recipientRole: "employee", employeeId, title, message }), section: "groups", columnResolved: false };
}
function parseDdMmYyyy(value) {
  const match = normalizeActivityDateValue(value).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  return new Date(`${match[3]}-${match[2]}-${match[1]}T00:00:00`);
}
function isSundayDate(value) { const date = parseDdMmYyyy(value); return Boolean(date) && date.getDay() === 0; }
function isHolidayDate(value) { const normalized = normalizeActivityDateValue(value); return Array.isArray(state.holidays) && state.holidays.map((item) => normalizeActivityDateValue(item)).includes(normalized); }
function isDateInRange(dateValue, fromValue, toValue) {
  const date = parseDdMmYyyy(dateValue);
  if (!date) return false;
  const from = fromValue ? parseDdMmYyyy(fromValue) : null;
  const to = toValue ? parseDdMmYyyy(toValue) : null;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}
function getDatesInRange(fromValue, toValue) {
  const from = parseDdMmYyyy(fromValue);
  const to = parseDdMmYyyy(toValue);
  if (!from || !to || from > to) return [];
  const out = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    out.push(`${String(cursor.getDate()).padStart(2, "0")}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${cursor.getFullYear()}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
function getWorkingDaysInRange(fromValue, toValue) { return getDatesInRange(fromValue, toValue).filter((date) => !isSundayDate(date) && !isHolidayDate(date)).length; }
function getCompanyHolidayDatesFromCalendar(calendar) {
  return (calendar || []).filter((holiday) => String(holiday.type || "CH").toUpperCase() === "CH").map((holiday) => normalizeActivityDateValue(holiday.date)).filter(Boolean);
}
function normalizeHolidayCalendar(calendar) {
  return (Array.isArray(calendar) && calendar.length ? calendar : DEFAULT_HOLIDAY_CALENDAR).map((holiday, index) => ({
    id: holiday.id || `HOL-${Date.now()}-${index}`,
    date: normalizeActivityDateValue(holiday.date || ""),
    day: holiday.day || "",
    name: holiday.name || holiday.holiday || "",
    type: String(holiday.type || holiday.comment || "CH").toUpperCase() === "RH" ? "RH" : "CH"
  })).filter((holiday) => holiday.date && holiday.name).sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
}
function getRestrictedHolidayOptions(calendar = state.holidayCalendar || []) { return (calendar || []).filter((holiday) => String(holiday.type || "").toUpperCase() === "RH").sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date)); }
function getSelectedHolidayGroupId() { return state.selectedHolidayGroupId || ""; }
function getHolidayCalendarForGroup(groupId = "") {
  if (!groupId) return state.holidayCalendar || [];
  return state.holidayGroupCalendars?.[groupId] || state.holidayCalendar || [];
}
function getHolidayConfigLabel(groupId = "") {
  if (!groupId) return "Company-wide";
  const group = getGroupById(groupId);
  return group ? getGroupPath(group) : "Selected group";
}
function getEmployeeHolidayCalendar(employee) {
  const group = getEmployeeGroups(employee?.id).find((item) => state.holidayGroupCalendars?.[item.id]);
  return { calendar: group ? getHolidayCalendarForGroup(group.id) : (state.holidayCalendar || []), group };
}
function isEmployeeHolidayDate(employee, dateValue) {
  const normalized = normalizeActivityDateValue(dateValue);
  const calendarDates = getCompanyHolidayDatesFromCalendar(getEmployeeHolidayCalendar(employee).calendar);
  const acceptedRhDates = (state.holidayRequests || [])
    .filter((request) => request.employeeId === employee?.id && String(request.status || "").toLowerCase() === "accepted")
    .map((request) => normalizeActivityDateValue(request.date));
  return [...calendarDates, ...acceptedRhDates].includes(normalized);
}
function getLeaveWfhDateLockReason(employee, dateValue) {
  if (isSundayDate(dateValue)) return "Sunday";
  if (isEmployeeHolidayDate(employee, dateValue)) return "Holiday";
  if (getActiveWfhRequestForDate(employee.id, dateValue)) return "WFH locked";
  if (getActiveLeaveRequestForDate(employee.id, dateValue)) return "Leave locked";
  return "";
}
function getLeaveWfhRangeConflictReason(employee, dateValue) {
  if (getActiveWfhRequestForDate(employee.id, dateValue)) return "WFH locked";
  if (getActiveLeaveRequestForDate(employee.id, dateValue)) return "Leave locked";
  return "";
}
function getLeaveWfhSelectionLockReason(employee, target, dateValue, fromDate = "", toDate = "") {
  const directReason = getLeaveWfhDateLockReason(employee, dateValue);
  if (directReason) return directReason;
  const normalizedDate = normalizeActivityDateValue(dateValue);
  const normalizedFrom = normalizeActivityDateValue(fromDate);
  const normalizedTo = normalizeActivityDateValue(toDate);
  let range = [];
  if (target === "leaveTo" && normalizedFrom && parseDateSortValue(normalizedDate) >= parseDateSortValue(normalizedFrom)) {
    range = getDatesInRange(normalizedFrom, normalizedDate);
  }
  if (target === "leaveFrom" && normalizedTo && parseDateSortValue(normalizedDate) <= parseDateSortValue(normalizedTo)) {
    range = getDatesInRange(normalizedDate, normalizedTo);
  }
  const blocked = range.find((date) => date !== normalizedDate && getLeaveWfhRangeConflictReason(employee, date));
  return blocked ? `Range includes booked date ${blocked}` : "";
}
function renderLeaveWfhDatePicker(employee, target, value, fromDate = "", toDate = "") {
  const picker = state.leaveWfhDatePicker || {};
  if (picker.target !== target) return "";
  const current = parseDdMmYyyy(value) || new Date();
  const year = Number(picker.year || current.getFullYear());
  const month = Number(picker.month || current.getMonth() + 1);
  const mode = picker.mode || "months";
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const title = target === "wfh" ? "Select WFH date" : target === "leaveFrom" ? "Select leave from date" : "Select leave to date";
  const yearHeader = `<div class="leave-wfh-picker-header"><div class="leave-wfh-nav-group"><button type="button" class="leave-wfh-nav-btn" data-leave-wfh-picker-year="${year - 1}" aria-label="Previous year">&lsaquo;</button><button type="button" class="leave-wfh-nav-btn" data-leave-wfh-picker-year="${year + 1}" aria-label="Next year">&rsaquo;</button></div><strong>${escapeHtml(String(year))}</strong><button type="button" class="leave-wfh-close-btn" data-leave-wfh-picker-close="true" aria-label="Close date picker">&times;</button></div>`;
  if (mode === "days") {
    const previousMonth = month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year };
    const nextMonth = month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };
    const monthHeader = `<div class="leave-wfh-picker-header"><div class="leave-wfh-nav-group"><button type="button" class="leave-wfh-nav-btn" data-leave-wfh-picker-month-shift="${previousMonth.month}" data-leave-wfh-picker-shift-year="${previousMonth.year}" aria-label="Previous month">&lsaquo;</button><button type="button" class="leave-wfh-nav-btn" data-leave-wfh-picker-month-shift="${nextMonth.month}" data-leave-wfh-picker-shift-year="${nextMonth.year}" aria-label="Next month">&rsaquo;</button></div><strong>${escapeHtml(monthNames[month - 1])} ${escapeHtml(String(year))}</strong><button type="button" class="leave-wfh-close-btn" data-leave-wfh-picker-close="true" aria-label="Close date picker">&times;</button></div>`;
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDay = new Date(year, month, 0).getDate();
    const blanks = Array.from({ length: firstDay }, () => `<span class="leave-wfh-day is-empty"></span>`).join("");
    const days = Array.from({ length: lastDay }, (_, index) => {
      const day = index + 1;
      const date = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
      const reason = getLeaveWfhSelectionLockReason(employee, target, date, fromDate, toDate);
      const selected = normalizeActivityDateValue(value) === date;
      return `<button type="button" class="leave-wfh-day ${reason ? "locked" : ""} ${selected ? "selected" : ""}" data-leave-wfh-picker-select="${escapeHtml(date)}" ${reason ? `title="${escapeHtml(reason)}" aria-label="${escapeHtml(`${date} locked`)}" disabled` : `aria-label="Select ${escapeHtml(date)}"`}><span>${day}</span></button>`;
    }).join("");
    return `<div class="leave-wfh-picker"><p class="eyebrow">${escapeHtml(title)}</p>${monthHeader}<button type="button" class="leave-wfh-picker-month-title" data-leave-wfh-picker-mode="months">Change month</button><div class="leave-wfh-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="leave-wfh-days">${blanks}${days}</div></div>`;
  }
  const months = monthNames.map((name, index) => `<button type="button" class="leave-wfh-month" data-leave-wfh-picker-month="${index + 1}">${escapeHtml(name)}</button>`).join("");
  return `<div class="leave-wfh-picker"><p class="eyebrow">${escapeHtml(title)}</p>${yearHeader}<div class="leave-wfh-months">${months}</div></div>`;
}
function getHolidayYear(value) { const parsed = parseDdMmYyyy(value); return parsed ? String(parsed.getFullYear()) : ""; }
function getEmployeeHolidayRequests(employeeId) { return (state.holidayRequests || []).filter((request) => request.employeeId === employeeId).sort((a, b) => parseDateSortValue(b.date) - parseDateSortValue(a.date)); }
function hasActiveRestrictedHolidayForYear(employeeId, year) {
  return (state.holidayRequests || []).some((request) => request.employeeId === employeeId && getHolidayYear(request.date) === String(year) && ["pending", "accepted"].includes(String(request.status || "pending").toLowerCase()));
}
function getRhGroupRecipientIds(employeeId) { return getWfhGroupRecipientIds(employeeId); }
function createRestrictedHolidayNotifications(employee, request) {
  const groupNotifications = getRhGroupRecipientIds(employee.id).map((employeeId) => createNotification({ recipientRole: "employee", employeeId, title: "Group member RH request", message: `${getEmployeeDisplayName(employee)} requested restricted holiday on ${request.date}.` }));
  return [createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Restricted holiday request raised", message: `${getEmployeeDisplayName(employee)} requested restricted holiday on ${request.date}.` }), ...groupNotifications];
}
function getAttendanceUniqueDates(records) { return Array.from(new Set((records || []).map((record) => record.date).filter(Boolean))); }
function isWorkFromHomeRecord(record) { return String(record?.type || "").toLowerCase() === "work from home" || String(record?.workMode || "").toLowerCase() === "work from home" || String(record?.status || "").toLowerCase() === "work from home"; }
function getTodayAttendanceRecords(employee) { return (employee?.attendance || []).filter((record) => record.date === todayDdMmYyyy()); }
function hasTodayAttendanceRecord(employee, type) { return getTodayAttendanceRecords(employee).some((record) => record.type === type); }
function getAttendanceSearchParams() {
  return {
    date: state.attendanceFilterDate || todayDdMmYyyy(),
    from: state.attendanceFilterFrom || "",
    to: state.attendanceFilterTo || "",
    query: String(state.attendanceSearchQuery || "").trim().toLowerCase(),
    mode: state.attendanceReportMode || "daily",
    month: state.attendanceFilterMonth || new Date().toISOString().slice(0, 7)
  };
}
function getMonthDateRange(monthValue) {
  const value = String(monthValue || new Date().toISOString().slice(0, 7));
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    const today = todayDdMmYyyy();
    return { month: new Date().toISOString().slice(0, 7), from: `01-${today.slice(3)}`, to: today, totalDays: Number(today.slice(0, 2)) };
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const lastDay = new Date(year, month, 0).getDate();
  const now = new Date();
  const sameCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
  const effectiveLastDay = sameCurrentMonth ? now.getDate() : lastDay;
  return { month: value, from: `01-${String(month).padStart(2, "0")}-${year}`, to: `${String(effectiveLastDay).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`, totalDays: effectiveLastDay };
}
function getMonthLabel(monthValue) {
  const match = String(monthValue || "").match(/^(\d{4})-(\d{2})$/);
  if (!match) return "Current month";
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
}
function shiftMonthValue(monthValue, offset) {
  const match = String(monthValue || new Date().toISOString().slice(0, 7)).match(/^(\d{4})-(\d{2})$/);
  const base = match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : new Date();
  base.setMonth(base.getMonth() + offset);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`;
}
function getAcceptedLeaveRequestForDate(employeeId, date) {
  return (state.leaveRequests || []).find((request) => request.employeeId === employeeId && normalizeActivityDateValue(request.date) === normalizeActivityDateValue(date) && String(request.status || "").toLowerCase() === "accepted") || null;
}
function getEmployeeCalendarDayStatus(employee, date) {
  const parsed = parseDdMmYyyy(date);
  const today = parseDdMmYyyy(todayDdMmYyyy());
  const summary = getAttendanceDaySummary(employee, date);
  const acceptedLeave = getAcceptedLeaveRequestForDate(employee.id, date);
  const checkInDone = Boolean(summary.checkInTime && summary.checkInTime !== "-" && summary.checkInTime !== "Work From Home");
  const checkOutDone = Boolean(summary.checkOutTime && summary.checkOutTime !== "-" && summary.checkOutTime !== "Work From Home");
  if (isSundayDate(date)) return { tone: "sunday", label: "Sunday", detail: "Weekly off" };
  if (isHolidayDate(date)) return { tone: "holiday", label: "Holiday", detail: "Company holiday" };
  if (summary.status === "Work from home") return { tone: "wfh", label: "WFH", detail: "Work From Home" };
  if (acceptedLeave) return { tone: "leave", label: "Leave", detail: getLeaveTypeConfig(acceptedLeave.type).shortLabel };
  if (checkInDone && checkOutDone) return { tone: "present", label: "Present", detail: `In ${summary.checkInTime} | Out ${summary.checkOutTime}` };
  if (parsed && today && parsed <= today && (checkInDone || checkOutDone || summary.status === "Absent")) return { tone: "missing", label: "Missing", detail: `${checkInDone ? `In ${summary.checkInTime}` : "No check in"} | ${checkOutDone ? `Out ${summary.checkOutTime}` : "No check out"}` };
  return { tone: "neutral", label: "", detail: "" };
}
function renderEmployeeAttendanceCalendar(employee) {
  const monthValue = state.employeeAttendanceCalendarMonth || new Date().toISOString().slice(0, 7);
  const fullRange = getFullMonthDateRange(monthValue);
  const match = String(monthValue).match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const month = match ? Number(match[2]) : new Date().getMonth() + 1;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const dates = getDatesInRange(fullRange.from, fullRange.to);
  const blanks = Array.from({ length: firstDay }, () => '<div class="attendance-calendar-cell is-empty"></div>');
  const cells = dates.map((date) => {
    const status = getEmployeeCalendarDayStatus(employee, date);
    const day = date.slice(0, 2);
    return `<div class="attendance-calendar-cell ${status.tone}"><div class="attendance-calendar-day">${escapeHtml(day)}</div>${status.label ? `<div class="attendance-calendar-status">${escapeHtml(status.label)}</div>` : ""}${status.detail ? `<div class="attendance-calendar-detail">${escapeHtml(status.detail)}</div>` : ""}</div>`;
  });
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="attendance-calendar-weekday">${day}</div>`).join("");
  return `<div class="attendance-calendar"><div class="attendance-calendar-toolbar"><button class="secondary-btn attendance-calendar-nav" type="button" data-attendance-calendar-month="${escapeHtml(shiftMonthValue(monthValue, -1))}">Previous</button><div><h3>${escapeHtml(getMonthLabel(monthValue))}</h3><p class="helper">Green: complete entry and exit, Red: missing timing, Yellow: WFH, Sky: Leave, Orange: Holiday.</p></div><button class="secondary-btn attendance-calendar-nav" type="button" data-attendance-calendar-month="${escapeHtml(shiftMonthValue(monthValue, 1))}">Next</button></div><div class="attendance-calendar-legend"><span class="legend-dot present"></span>Present<span class="legend-dot missing"></span>Missing<span class="legend-dot wfh"></span>WFH<span class="legend-dot leave"></span>Leave<span class="legend-dot holiday"></span>Holiday<span class="legend-dot sunday"></span>Sunday</div><div class="attendance-calendar-grid">${weekdayLabels}${blanks.join("")}${cells.join("")}</div></div>`;
}
function getAttendanceDistanceMeters(lat1, lon1, lat2, lon2) {
  const toRad = (value) => Number(value) * Math.PI / 180;
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function getAttendancePolicyStatus() {
  const lat = Number(state.attendancePolicy?.latitude);
  const lon = Number(state.attendancePolicy?.longitude);
  const radius = Number(state.attendancePolicy?.radiusMeters || 15);
  return { lat, lon, radius, locationRuleEnabled: state.attendancePolicy?.locationRuleEnabled !== false, configured: Number.isFinite(lat) && Number.isFinite(lon) && Number.isFinite(radius) && radius > 0 };
}
function parseTimeToMinutes(value) {
  const match = String(value || "").trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
function getAttendancePolicyTimingStatus() {
  const checkInTime = parseTimeToMinutes(state.attendancePolicy?.checkInTime);
  const checkOutTime = parseTimeToMinutes(state.attendancePolicy?.checkOutTime);
  const checkInGraceMinutes = Number(state.attendancePolicy?.checkInGraceMinutes || 0);
  const checkOutGraceMinutes = Number(state.attendancePolicy?.checkOutGraceMinutes || 0);
  return {
    enabled: state.attendancePolicy?.timingRuleEnabled !== false,
    checkInTime,
    checkOutTime,
    checkInGraceMinutes: Number.isFinite(checkInGraceMinutes) ? checkInGraceMinutes : 0,
    checkOutGraceMinutes: Number.isFinite(checkOutGraceMinutes) ? checkOutGraceMinutes : 0
  };
}
function getCurrentTimeInMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
function getAcceptedAttendanceClaimsForDate(employee, date) {
  return (state.attendanceClaims || []).filter((claim) => claim.employeeId === employee.id && claim.attendanceDate === date && ["accepted", "resolved"].includes(String(claim.status || "").toLowerCase()));
}
function getClaimAdjustedTimes(checkIn, checkOut, claims) {
  let checkInTime = checkIn?.time || "";
  let checkOutTime = checkOut?.time || "";
  for (const claim of claims) {
    const claimType = String(claim.claimType || "").toLowerCase();
    if (claimType === "missed check in and check out") {
      checkInTime = claim.proposedCheckInTime || checkInTime;
      checkOutTime = claim.proposedCheckOutTime || checkOutTime;
    } else if (claimType === "missed check in" || claimType === "late check in") {
      checkInTime = claim.proposedTime || checkInTime;
    } else if (claimType === "missed check out") {
      checkOutTime = claim.proposedTime || checkOutTime;
    }
  }
  return { checkInTime, checkOutTime };
}
function getAttendanceDaySummary(employee, date) {
  const records = (employee.attendance || []).filter((record) => record.date === date);
  const checkIn = records.find((record) => record.type === "Check in" || isWorkFromHomeRecord(record));
  const checkOut = records.find((record) => record.type === "Check out");
  const claims = getAcceptedAttendanceClaimsForDate(employee, date);
  const acceptedWfh = getAcceptedWfhRequestForDate(employee, date);
  const adjusted = getClaimAdjustedTimes(checkIn, checkOut, claims);
  const isWorkFromHome = Boolean(acceptedWfh || (checkIn && isWorkFromHomeRecord(checkIn)));
  const status = isHolidayDate(date) ? "Holiday" : isSundayDate(date) ? "Sunday" : isWorkFromHome ? "Work from home" : (adjusted.checkInTime || adjusted.checkOutTime) ? "Present" : "Absent";
  return { date, records, checkIn, checkOut, acceptedClaims: claims, acceptedWfh, status, isWorkFromHome, checkInTime: acceptedWfh ? "Work From Home" : (adjusted.checkInTime || "-"), checkOutTime: isWorkFromHome ? "Work From Home" : (adjusted.checkOutTime || "-"), hasTiming: Boolean(acceptedWfh || adjusted.checkInTime || adjusted.checkOutTime) };
}
function getAttendanceSummaryForDate(employee, date) { return getAttendanceDaySummary(employee, date); }
function getAttendanceDailyReport(date = todayDdMmYyyy()) {
  const employees = state.employees.filter((item) => item.status === "Active");
  const present = employees.filter((employee) => getAttendanceDaySummary(employee, date).status === "Present");
  const workFromHome = employees.filter((employee) => getAttendanceDaySummary(employee, date).status === "Work from home");
  const absent = isSundayDate(date) || isHolidayDate(date) ? [] : employees.filter((employee) => getAttendanceDaySummary(employee, date).status === "Absent");
  return { employees, present, workFromHome, absent };
}
function getAttendanceMonthlyReport(monthValue) {
  const employees = state.employees.filter((item) => item.status === "Active");
  const range = getMonthDateRange(monthValue);
  const fullMonthRange = getFullMonthDateRange(monthValue);
  const rows = employees.map((employee) => {
    const reportDates = mergeDatesWithAcceptedWfh(getDatesInRange(range.from, range.to), employee.id, fullMonthRange.from, fullMonthRange.to);
    const days = reportDates.map((date) => getAttendanceDaySummary(employee, date));
    return { employee, presentCount: days.filter((row) => row.status === "Present").length, absentCount: days.filter((row) => row.status === "Absent").length, workFromHomeCount: days.filter((row) => row.status === "Work from home").length, holidayCount: days.filter((row) => row.status === "Holiday").length, markedCount: days.filter((row) => row.hasTiming || row.status === "Work from home").length, days };
  });
  return { range, fullMonthRange, employees, rows, totalPresent: rows.reduce((sum, row) => sum + row.presentCount, 0), totalAbsent: rows.reduce((sum, row) => sum + row.absentCount, 0), totalWorkFromHome: rows.reduce((sum, row) => sum + row.workFromHomeCount, 0), totalHoliday: rows.reduce((sum, row) => sum + row.holidayCount, 0), workingDays: getWorkingDaysInRange(range.from, range.to) };
}

function normalizeGroupClientOptions(options) {
  const values = [];
  (Array.isArray(options) ? options : []).forEach((option) => {
    const value = String(option || "").trim();
    if (value) values.push(value);
  });
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
function deriveGroupClientOptionsFromActivities(employees = []) {
  const values = [...(defaultState.activityTemplate.groupClientOptions || [])];
  (employees || []).forEach((employee) => {
    (employee.activities || []).forEach((row) => {
      const value = String(row.values?.group_client || "").trim();
      if (value) values.push(value);
    });
  });
  return normalizeGroupClientOptions(values);
}
function getGroupClientOptions() {
  return normalizeGroupClientOptions(state.activityTemplate?.groupClientOptions || []);
}
function normalizeActivityValues(values, fields = defaultActivityFields) {
  const out = {};
  for (const field of fields) {
    if (field.key === "sl_no") continue;
    out[field.key] = field.type === "date" ? normalizeActivityDateValue(values[field.key] || "") : (values[field.key] ?? "");
  }
  return out;
}
function normalizeActivityRows(rows, fields = defaultActivityFields) {
  return (rows || []).map((row, index) => ({
    rowId: row.rowId || `ACT-${Date.now()}-${index}`,
    slNo: row.slNo || index + 1,
    workflowStatus: row.workflowStatus || "draft",
    values: normalizeActivityValues(row.values || row, fields),
    savedAt: row.savedAt || "",
    submittedAt: row.submittedAt || ""
  }));
}
function mergeTemplateFields(defaultFields, savedFields) {
  if (!Array.isArray(savedFields)) return clone(defaultFields);
  const sanitizedSavedFields = savedFields.filter((field) => field?.key && !["guardianName", "address"].includes(field.key));
  const savedByKey = new Map(sanitizedSavedFields.map((field) => [field.key, field]));
  const mergedDefaults = defaultFields.map((field) => ({ ...field, ...(savedByKey.get(field.key) || {}) }));
  const defaultKeys = new Set(defaultFields.map((field) => field.key));
  const extraSaved = sanitizedSavedFields.filter((field) => field?.key && !defaultKeys.has(field.key));
  return [...mergedDefaults, ...extraSaved];
}

function normalizeLegacyOnboardingDetails(details) {
  const normalized = { ...(details || {}) };
  if (!normalized.husbandGuardianName && normalized.guardianName) normalized.husbandGuardianName = normalized.guardianName;
  delete normalized.guardianName;
  return normalized;
}
function normalizeState(input) {
  const normalized = { ...clone(defaultState), ...input };
  normalized.onboardingTemplate = { ...clone(defaultState.onboardingTemplate), ...(input.onboardingTemplate || {}) };
  normalized.onboardingTemplate.fields = mergeTemplateFields(defaultOnboardingFields, normalized.onboardingTemplate.fields);
  
  normalized.onboardingTemplate.fields = normalized.onboardingTemplate.fields.map((field) => {
    if (["PresentAddressLine1", "PresentAddressLine2", "PresentPostOffice", "PresentPoliceStation", "PresentDistrict", "PresentState", "PresentPin", "PermanentAddressLine1", "PermanentAddressLine2", "PermanentPostOffice", "PermanentPoliceStation", "PermanentDistrict", "PermanentState", "PermanentPin"].includes(field.key)) {
      if (field.label) {
        field.label = field.label.replace("Present ", "").replace("Permanent ", "");
        if (field.label.toLowerCase().includes("address line")) field.label = field.label.replace(/address line/i, "Address line");
        if (field.label.toLowerCase().includes("post office")) field.label = "Post office";
        if (field.label.toLowerCase().includes("police station")) field.label = "Police station";
        if (field.label.toLowerCase().includes("district")) field.label = "District";
        if (field.label.toLowerCase().includes("state")) field.label = "State";
        if (field.label.toLowerCase().includes("pin")) field.label = "PIN";
      }
    }
    if (["PresentAddressLine2", "PermanentAddressLine2"].includes(field.key)) {
      field.required = false;
    }
    return field;
  });
  normalized.activityTemplate = { ...clone(defaultState.activityTemplate), ...(input.activityTemplate || {}) };
  normalized.activityTemplate.fields = mergeTemplateFields(defaultActivityFields, normalized.activityTemplate.fields).map((field) => field.key === "group_client" ? { ...field, type: "groupClient", required: true } : field);
  normalized.employees = (normalized.employees || []).map((employee) => ({
    ...employee,
    profile: { phone: "", designation: "", location: "", bio: "", ...(employee.profile || {}) },
    onboardingDetails: normalizeLegacyOnboardingDetails(employee.onboardingDetails || {}),
    onboardingFieldLabels: { ...(employee.onboardingFieldLabels || {}) },
    attachments: { ...(employee.attachments || {}) },
    attendance: employee.attendance || [],
    activities: normalizeActivityRows(employee.activities || [], normalized.activityTemplate.fields),
    credentials: { password: employee.credentials?.password || TEMP_PASSWORD },
    hiring: { offerStatus: "not_sent", offerSentAt: "", offerAcceptedAt: "", onboardingSubmittedAt: "", profileEditAllowed: false, profileReviewed: false, offerDraftSubject: "", offerDraftBody: "", ...(employee.hiring || {}) }
  }));
  const savedGroupClientOptions = input.activityTemplate && Array.isArray(input.activityTemplate.groupClientOptions) ? input.activityTemplate.groupClientOptions : null;
  normalized.activityTemplate.groupClientOptions = savedGroupClientOptions ? normalizeGroupClientOptions(savedGroupClientOptions) : deriveGroupClientOptionsFromActivities(normalized.employees);
  normalized.employeeGroups = normalizeEmployeeGroups(normalized.employeeGroups, normalized.employees);
  normalized.attendancePolicy = { officeName: "Office", latitude: "", longitude: "", radiusMeters: 15, checkInTime: "", checkInGraceMinutes: "", checkOutTime: "", checkOutGraceMinutes: "", timingRuleEnabled: true, locked: false, ...(normalized.attendancePolicy || {}) };
  normalized.attendancePolicyHistory = normalized.attendancePolicyHistory || [];
  normalized.wfhPolicy = { weeklyLimit: 1, monthlyLimit: 2, requestWindowMonths: 6, locked: false, ...(normalized.wfhPolicy || {}) };
  normalized.wfhPolicy.weeklyLimit = Math.max(0, Number(normalized.wfhPolicy.weeklyLimit || 0));
  normalized.wfhPolicy.monthlyLimit = Math.max(0, Number(normalized.wfhPolicy.monthlyLimit || 0));
  normalized.wfhPolicy.requestWindowMonths = Math.max(1, Number(normalized.wfhPolicy.requestWindowMonths || 6));
  normalized.wfhPolicyHistory = normalized.wfhPolicyHistory || [];
  normalized.wfhAutoApproval = Boolean(normalized.wfhAutoApproval);
  normalized.leaveAutoApproval = Boolean(normalized.leaveAutoApproval);
  normalized.adminLeaveWfhCalendarMonth = normalized.adminLeaveWfhCalendarMonth || new Date().toISOString().slice(0, 7);
  normalized.adminLeaveWfhCalendarDate = normalizeActivityDateValue(normalized.adminLeaveWfhCalendarDate || todayDdMmYyyy());
  normalized.adminLeaveWfhCalendarEmployeeId = normalized.adminLeaveWfhCalendarEmployeeId || "";
  normalized.leavePolicy = { privilegeLeave: 16, sickLeave: 7, requestWindowMonths: 6, locked: false, ...(normalized.leavePolicy || {}) };
  normalized.leavePolicy.privilegeLeave = Math.max(0, Number(normalized.leavePolicy.privilegeLeave || 0));
  normalized.leavePolicy.sickLeave = Math.max(0, Number(normalized.leavePolicy.sickLeave || 0));
  normalized.leavePolicy.requestWindowMonths = Math.max(1, Number(normalized.leavePolicy.requestWindowMonths || 6));
  normalized.leavePolicyHistory = normalized.leavePolicyHistory || [];
  normalized.leaveRequests = normalized.leaveRequests || [];
  normalized.attendanceClaims = normalized.attendanceClaims || [];
  normalized.wfhRequests = normalized.wfhRequests || [];
  normalized.notifications = normalized.notifications || [];
  normalized.ticketLoginType = normalized.ticketLoginType || "employee";
  normalized.ticketSession = normalized.ticketSession || null;
  normalized.ticketUsers = normalized.ticketUsers || [];
  normalized.adminEmails = normalized.adminEmails || (normalized.adminProfile?.email ? [normalized.adminProfile.email] : ["admin@hrms.local"]);
  normalized.ticketGroups = normalized.ticketGroups || [];
  normalized.ticketFilter = normalized.ticketFilter || "assigned";
  normalized.ticketDraftGroupId = normalized.ticketDraftGroupId || "";
  normalized.ticketSection = normalized.ticketSection || "";
  normalized.ticketProfileOpen = Boolean(normalized.ticketProfileOpen);
  normalized.ticketTickets = normalized.ticketTickets || clone(defaultState.ticketTickets);
  normalized.holidayCalendar = normalizeHolidayCalendar(normalized.holidayCalendar || DEFAULT_HOLIDAY_CALENDAR);
  normalized.holidayGroupCalendars = normalized.holidayGroupCalendars || {};
  Object.keys(normalized.holidayGroupCalendars).forEach((groupId) => { normalized.holidayGroupCalendars[groupId] = normalizeHolidayCalendar(normalized.holidayGroupCalendars[groupId]); });
  normalized.selectedHolidayGroupId = normalized.selectedHolidayGroupId || "";
  normalized.holidayRequests = normalized.holidayRequests || [];
  normalized.holidays = getCompanyHolidayDatesFromCalendar(normalized.holidayCalendar);
  normalized.attendanceFilterDate = normalized.attendanceFilterDate || todayDdMmYyyy();
  normalized.attendanceFilterMonth = normalized.attendanceFilterMonth || new Date().toISOString().slice(0, 7);
  normalized.attendanceReportMode = normalized.attendanceReportMode || "daily";
  normalized.attendanceSearchQuery = normalized.attendanceSearchQuery || "";
  normalized.attendanceFilterFrom = normalized.attendanceFilterFrom || "";
  normalized.attendanceFilterTo = normalized.attendanceFilterTo || "";
  normalized.attendanceEmployeeStatusFilter = normalized.attendanceEmployeeStatusFilter || "all";
  normalized.employeeAttendanceCalendarMonth = normalized.employeeAttendanceCalendarMonth || new Date().toISOString().slice(0, 7);
  normalized.adjustmentHistoryFilterEmployee = normalized.adjustmentHistoryFilterEmployee || "";
  normalized.adjustmentHistoryFilterDate = normalized.adjustmentHistoryFilterDate || "";
  normalized.attendanceClaimDraft = { attendanceDate: todayDdMmYyyy(), claimType: "", proposedTime: "", proposedCheckInTime: "", proposedCheckOutTime: "", reason: "", ...(normalized.attendanceClaimDraft || {}) };
  normalized.wfhRequestDraft = { date: todayDdMmYyyy(), reason: "", ...(normalized.wfhRequestDraft || {}) };
  normalized.leaveRequestDraft = { date: todayDdMmYyyy(), fromDate: "", toDate: "", type: "privilege", reason: "", ...(normalized.leaveRequestDraft || {}) };
  normalized.leaveWfhCalendarMonth = normalized.leaveWfhCalendarMonth || new Date().toISOString().slice(0, 7);
  normalized.leaveWfhSelectedDates = Array.from(new Set((normalized.leaveWfhSelectedDates || []).map(normalizeActivityDateValue).filter(Boolean))).sort((a, b) => parseDateSortValue(a) - parseDateSortValue(b));
  normalized.leaveWfhRequestType = ["wfh", "sick", "privilege"].includes(normalized.leaveWfhRequestType) ? normalized.leaveWfhRequestType : "wfh";
  normalized.leaveWfhRequestReason = normalized.leaveWfhRequestReason || "";
  normalized.leaveWfhDatePicker = normalized.leaveWfhDatePicker || null;
  normalized.wfhHistoryFilterEmployee = normalized.wfhHistoryFilterEmployee || normalized.selectedLeaveWfhEmployeeId || normalized.selectedEmployeeId || normalized.employees[0]?.id || "";
  normalized.wfhHistoryFilterMonth = normalized.wfhHistoryFilterMonth || new Date().toISOString().slice(0, 7);
  normalized.adminLeaveWfhReportSearch = normalized.adminLeaveWfhReportSearch || "";
  normalized.adminLeaveWfhReportEmployeeId = normalized.adminLeaveWfhReportEmployeeId || "";
  normalized.adminLeaveWfhReportDateMode = ["all", "month", "year", "custom"].includes(normalized.adminLeaveWfhReportDateMode) ? normalized.adminLeaveWfhReportDateMode : "all";
  normalized.adminLeaveWfhReportMonth = /^\d{4}-\d{2}$/.test(normalized.adminLeaveWfhReportMonth || "") ? normalized.adminLeaveWfhReportMonth : new Date().toISOString().slice(0, 7);
  normalized.adminLeaveWfhReportYear = /^\d{4}$/.test(String(normalized.adminLeaveWfhReportYear || "")) ? String(normalized.adminLeaveWfhReportYear) : String(new Date().getFullYear());
  normalized.adminLeaveWfhReportFrom = normalizeActivityDateValue(normalized.adminLeaveWfhReportFrom || "");
  normalized.adminLeaveWfhReportTo = normalizeActivityDateValue(normalized.adminLeaveWfhReportTo || "");
  normalized.adminLeaveWfhReportType = ["", "wfh", "privilege", "sick"].includes(normalized.adminLeaveWfhReportType) ? normalized.adminLeaveWfhReportType : "";
  normalized.selectedLeaveWfhEmployeeId = normalized.selectedLeaveWfhEmployeeId || normalized.selectedEmployeeId || normalized.employees[0]?.id || null;
  if (!normalized.selectedEmployeeId) normalized.selectedEmployeeId = normalized.employees[0]?.id || null;
  return normalized;
}
function pickStateKeys(source, keys) {
  return Object.fromEntries(Array.from(keys).filter((key) => Object.prototype.hasOwnProperty.call(source || {}, key)).map((key) => [key, source[key]]));
}
function getClientStateSnapshot(source = state) {
  return pickStateKeys(source || {}, CLIENT_ONLY_STATE_KEYS);
}
function getSharedStateSnapshot(source = state) {
  return Object.fromEntries(Object.entries(source || {}).filter(([key]) => !CLIENT_ONLY_STATE_KEYS.has(key)));
}
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeState({ ...clone(defaultState), ...JSON.parse(saved) }) : normalizeState(clone(defaultState));
  } catch {
    return normalizeState(clone(defaultState));
  }
}
function getCachedGroupClientOptions() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(cached?.activityTemplate?.groupClientOptions) ? normalizeGroupClientOptions(cached.activityTemplate.groupClientOptions) : null;
  } catch {
    return null;
  }
}
function saveClientState() {
  const snapshot = remoteStateConfigured
    ? { ...getClientStateSnapshot(state), activityTemplate: { groupClientOptions: getGroupClientOptions() } }
    : state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
function scheduleRemoteStateSave(sharedState = getSharedStateSnapshot(state), immediate = false) {
  if (!remoteStateConfigured) return;
  window.clearTimeout(remoteSaveTimer);
  const persist = async () => {
    try {
      const response = await fetch(REMOTE_STATE_ENDPOINT, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": "hr848-secure-api-key-2026"
        },
        body: JSON.stringify({ state: sharedState })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) throw new Error(data.detail || data.message || "Shared database save failed.");
    } catch (error) {
      console.warn("Shared HRMS state was not saved to the database.", error);
    }
  };
  remoteSaveTimer = window.setTimeout(persist, immediate ? 0 : 450);
}
function saveState() {
  saveClientState();
  scheduleRemoteStateSave();
}
function setState(patch) { state = normalizeState({ ...state, ...patch }); saveState(); render(); }
async function loadLocalSeedState() {
  if (localSeedState) return clone(localSeedState);
  const response = await fetch(LOCAL_SEED_STATE_ENDPOINT, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load local HRMS seed data.");
  const payload = await response.json();
  localSeedState = normalizeState({ ...clone(defaultState), ...payload });
  return clone(localSeedState);
}

async function applyLocalSeedState() {
  const clientState = getClientStateSnapshot(state);
  const persistedAutoApprovalSettings = { wfhAutoApproval: state.wfhAutoApproval, leaveAutoApproval: state.leaveAutoApproval };
  const persistedNotifications = state.notifications;
  const cachedGroupClientOptions = getCachedGroupClientOptions();
  const seedState = await loadLocalSeedState();
  state = normalizeState({
    ...clone(defaultState),
    ...seedState,
    ...clientState,
    ...persistedAutoApprovalSettings,
    notifications: persistedNotifications,
    ...(cachedGroupClientOptions ? { activityTemplate: { ...(seedState.activityTemplate || {}), groupClientOptions: cachedGroupClientOptions } } : {})
  });
  saveClientState();
  render();
}

function createEmptySharedState() {
  const emptyState = clone(defaultState);
  emptyState.employees = [];
  emptyState.ticketTickets = [];
  emptyState.notifications = [];
  emptyState.wfhRequests = [];
  emptyState.leaveRequests = [];
  emptyState.holidayRequests = [];
  emptyState.attendance = [];
  return emptyState;
}

async function initializeSharedState() {
  try {
    const response = await fetch(REMOTE_STATE_ENDPOINT, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Unable to load shared database state.");
    remoteStateConfigured = Boolean(data.configured);
    if (!remoteStateConfigured) return;
    if (data.state && typeof data.state === "object") {
      const clientState = getClientStateSnapshot(state);
      const remoteState = { ...data.state };
      state = normalizeState({ ...clone(defaultState), ...remoteState, ...clientState });
      saveClientState();
      render();
      return;
    }
    state = normalizeState({ ...createEmptySharedState(), ...getClientStateSnapshot(state) });
    saveClientState();
    render();
  } catch (error) {
    remoteStateConfigured = true;
    state = normalizeState({ ...createEmptySharedState(), ...getClientStateSnapshot(state) });
    saveClientState();
    render();
    console.warn("Shared HRMS MySQL database is not available. The portal did not load local JSON data.", error);
  }
}
function buildOfferContent(employee) {
  return {
    subject: interpolateTemplate(employee.hiring.offerDraftSubject || state.offerTemplate.subject, {
      companyName: state.companyProfile.companyName,
      employeeName: getEmployeeDisplayName(employee),
      employeeEmail: employee.email,
      role: employee.role,
      department: employee.department,
      temporaryPassword: employee.credentials.password,
      senderName: state.emailConfig.senderName || "HR Team"
    }),
    body: interpolateTemplate(employee.hiring.offerDraftBody || state.offerTemplate.body, {
      companyName: state.companyProfile.companyName,
      employeeName: getEmployeeDisplayName(employee),
      employeeEmail: employee.email,
      role: employee.role,
      department: employee.department,
      temporaryPassword: employee.credentials.password,
      senderName: state.emailConfig.senderName || "HR Team"
    })
  };
}
function pushEmailLog(employee, offerContent) {
  return [{ employeeId: employee.id, employeeName: getEmployeeDisplayName(employee), employeeEmail: employee.email, sentAt: `${todayDdMmYyyy()} ${formatTime()}`, subject: offerContent.subject }, ...(state.recentEmails || [])].slice(0, 20);
}
function getOnboardingFieldEntries(employee) {
  const templateEntries = state.onboardingTemplate.fields.map((field) => ({ key: field.key, label: field.label, required: Boolean(field.required) }));
  const templateKeys = new Set(templateEntries.map((field) => field.key));
  const extraEntries = Object.keys(employee.onboardingDetails || {}).filter((key) => !templateKeys.has(key)).map((key) => ({ key, label: employee.onboardingFieldLabels?.[key] || key, required: DOCX_REQUIRED_FIELD_KEYS.has(key) }));
  return [...templateEntries, ...extraEntries];
}
function mergeOnboardingIntoProfile(employee, details) {
  return { ...employee.profile, phone: details.phone || employee.profile.phone || "", designation: details.designation || employee.profile.designation || employee.role || "", location: details.location || employee.profile.location || "", bio: employee.profile.bio || `Onboarding completed on ${todayDdMmYyyy()}.` };
}
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer); let binary = ""; const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}
async function parseEmployeeDocx(file) {
  const response = await fetch(DOCX_PARSE_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, contentBase64: arrayBufferToBase64(await file.arrayBuffer()) }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The DOCX file could not be parsed.");
  return data;
}
async function importEmployeeDocxData(employee, file) {
  const parsed = await parseEmployeeDocx(file);
  const mergedDetails = { ...employee.onboardingDetails, ...(parsed.fields || {}) };
  return { ...employee, profile: mergeOnboardingIntoProfile(employee, mergedDetails), onboardingDetails: mergedDetails, onboardingFieldLabels: { ...(employee.onboardingFieldLabels || {}), ...(parsed.labels || {}) }, signedUp: true, hiring: { ...employee.hiring, onboardingSubmittedAt: employee.hiring.onboardingSubmittedAt || "", profileEditAllowed: true, profileReviewed: false } };
}

function buildTimestamp() { return `${todayDdMmYyyy()} ${formatTime()}`; }
function getCurrentSessionEmployee() { return state.session?.role === "employee" ? getCurrentEmployee() : null; }
function getCurrentNotifications() {
  if (!state.session) return [];
  if (state.session.role === "admin") return (state.notifications || []).filter((item) => item.recipientRole === "admin");
  const employee = getCurrentSessionEmployee();
  return (state.notifications || []).filter((item) => item.recipientRole === "employee" && item.employeeId === employee?.id);
}
function getUnreadNotificationCount() { return getCurrentNotifications().filter((item) => !item.resolved).length; }
function createNotification({ recipientRole, employeeId = null, title, message, claimId = null }) {
  return { id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, recipientRole, employeeId, title, message, claimId, createdAt: buildTimestamp(), resolved: false };
}
function getPasswordRecoveryMessage(role) {
  return role === "admin"
    ? "Admin forgot-password reset will send a secure reset link after email integration is enabled. For now, update the admin password from Admin console > Settings once logged in."
    : "Employee forgot-password reset will send a secure reset link after email integration is enabled. For now, ask an admin to reset the temporary password from Employee details.";
}
function getActivityRowDate(row) {
  return normalizeActivityDateValue(row?.values?.date || "");
}
function getEmployeeActivityRowsInRange(employee, fromDate, toDate) {
  return (employee.activities || []).filter((row) => {
    const rowDate = getActivityRowDate(row);
    return rowDate && isDateInRange(rowDate, fromDate, toDate);
  });
}
function createRuleNotification(ruleKey, payload) {
  if ((state.notifications || []).some((item) => item.ruleKey === ruleKey)) return null;
  return { ...createNotification(payload), ruleKey };
}
function buildActivityComplianceNotifications() {
  const today = todayDdMmYyyy();
  const parsedToday = parseDdMmYyyy(today);
  if (!parsedToday) return [];
  const notifications = [];
  const activeEmployees = (state.employees || []).filter((employee) => employee.status === "Active");
  const weekRange = getWeekRangeForDate(today);
  if (parsedToday.getDay() >= 5) {
    activeEmployees.forEach((employee) => {
      const weeklyRows = getEmployeeActivityRowsInRange(employee, weekRange.from, weekRange.to);
      const hasSavedWeeklyLog = weeklyRows.some((row) => row.savedAt || row.submittedAt || row.workflowStatus === "submitted");
      if (!hasSavedWeeklyLog) {
        const note = createRuleNotification(`activity-weekly-${employee.id}-${weekRange.from}-${weekRange.to}`, {
          recipientRole: "employee",
          employeeId: employee.id,
          title: "Activity log reminder",
          message: "Please fill your weekly activity log as earliest as possible."
        });
        if (note) notifications.push(note);
      }
    });
  }

  return notifications;
}
function ensureActivityComplianceNotifications() {
  const currentNotifications = (state.notifications || []).filter((item) => !String(item.ruleKey || "").startsWith("activity-monthly-") && item.title !== "Monthly activity submission required");
  const generatedNotifications = buildActivityComplianceNotifications();
  if (!generatedNotifications.length && currentNotifications.length === (state.notifications || []).length) return;
  state = normalizeState({ ...state, notifications: [...generatedNotifications, ...currentNotifications] });
  saveState();
}
function getEmployeeClaims(employeeId) { return (state.attendanceClaims || []).filter((claim) => claim.employeeId === employeeId); }
function getWeekRangeForDate(dateValue) {
  const parsed = parseDdMmYyyy(dateValue) || parseDdMmYyyy(todayDdMmYyyy());
  const day = parsed.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(parsed);
  start.setDate(parsed.getDate() + mondayOffset);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const format = (value) => `${String(value.getDate()).padStart(2, "0")}-${String(value.getMonth() + 1).padStart(2, "0")}-${value.getFullYear()}`;
  return { from: format(start), to: format(end) };
}
function getEmployeeWeeklyClaimCount(employeeId, dateValue) {
  const range = getWeekRangeForDate(dateValue || todayDdMmYyyy());
  return getEmployeeClaims(employeeId).filter((claim) => {
    const submittedDate = normalizeActivityDateValue(String(claim.submittedAt || "").split(" ")[0] || "");
    const effectiveDate = submittedDate || normalizeActivityDateValue(claim.attendanceDate || "");
    return isDateInRange(effectiveDate, range.from, range.to);
  }).length;
}
function getAttendanceButtonState(employee) {
  const todayRecords = getTodayAttendanceRecords(employee);
  const acceptedWfhToday = Boolean(getAcceptedWfhRequestForDate(employee, todayDdMmYyyy()));
  return {
    checkInDone: acceptedWfhToday || todayRecords.some((record) => String(record.type || "").toLowerCase() === "check in" || isWorkFromHomeRecord(record)),
    checkOutDone: acceptedWfhToday || todayRecords.some((record) => String(record.type || "").toLowerCase() === "check out"),
    isSunday: isSundayDate(todayDdMmYyyy()),
    isHoliday: isHolidayDate(todayDdMmYyyy())
  };
}
function getAttendanceClaimStatusTone(status) {
  const value = String(status || "pending").toLowerCase();
  if (["accepted", "resolved"].includes(value)) return "success";
  if (value === "rejected") return "danger";
  return "warning";
}

function getWfhStatusTone(status) {
  const value = String(status || "pending").toLowerCase();
  if (value === "accepted") return "success";
  if (value === "rejected") return "danger";
  if (value === "revoked") return "";
  return "warning";
}
function getEmployeeWfhRequests(employeeId) {
  return (state.wfhRequests || []).filter((request) => request.employeeId === employeeId).sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
}
function isWfhRequestActive(request) {
  return ["pending", "accepted"].includes(String(request?.status || "pending").toLowerCase());
}
function getActiveWfhRequests(employeeId) {
  return getEmployeeWfhRequests(employeeId).filter(isWfhRequestActive);
}
function getWfhPolicy() {
  const weeklyLimit = Math.max(0, Number(state.wfhPolicy?.weeklyLimit ?? 1));
  const monthlyLimit = Math.max(0, Number(state.wfhPolicy?.monthlyLimit ?? 2));
  const requestWindowMonths = Math.max(1, Number(state.wfhPolicy?.requestWindowMonths ?? 6));
  return { weeklyLimit, monthlyLimit, requestWindowMonths, locked: Boolean(state.wfhPolicy?.locked) };
}
function getAcceptedWfhRequestForDate(employee, date) {
  return (state.wfhRequests || []).find((request) => request.employeeId === employee.id && normalizeActivityDateValue(request.date) === normalizeActivityDateValue(date) && String(request.status || "").toLowerCase() === "accepted") || null;
}
function countEmployeeWfhDatesInRange(employeeId, fromValue, toValue) {
  const employeeRef = { id: employeeId };
  return getDatesInRange(fromValue, toValue).filter((date) => Boolean(getActiveWfhRequestForDate(employeeId, date) || getAcceptedWfhRequestForDate(employeeRef, date))).length;
}
function countEmployeeAcceptedWfhDatesInRange(employeeId, fromValue, toValue) {
  return getAcceptedWfhDatesInRange(employeeId, fromValue, toValue).length;
}
function getEmployeeAcceptedWfhCountForWeek(employeeId, dateValue) {
  const range = getWeekRangeForDate(dateValue || todayDdMmYyyy());
  return countEmployeeAcceptedWfhDatesInRange(employeeId, range.from, range.to);
}
function getEmployeeAcceptedWfhCountForMonth(employeeId, dateValue) {
  const normalized = normalizeActivityDateValue(dateValue || todayDdMmYyyy());
  const parsed = parseDdMmYyyy(normalized) || parseDdMmYyyy(todayDdMmYyyy());
  const monthValue = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  const range = getFullMonthDateRange(monthValue);
  return countEmployeeAcceptedWfhDatesInRange(employeeId, range.from, range.to);
}
function getEmployeeAcceptedWfhCountForYear(employeeId, dateValue) {
  const parsed = parseDdMmYyyy(dateValue || todayDdMmYyyy()) || parseDdMmYyyy(todayDdMmYyyy());
  const year = parsed.getFullYear();
  return countEmployeeAcceptedWfhDatesInRange(employeeId, `01-01-${year}`, `31-12-${year}`);
}
function getEmployeeWfhCountForWeek(employeeId, dateValue) {
  const range = getWeekRangeForDate(dateValue || todayDdMmYyyy());
  return countEmployeeWfhDatesInRange(employeeId, range.from, range.to);
}
function getEmployeeWfhCountForMonth(employeeId, dateValue) {
  const normalized = normalizeActivityDateValue(dateValue || todayDdMmYyyy());
  const parsed = parseDdMmYyyy(normalized) || parseDdMmYyyy(todayDdMmYyyy());
  const monthValue = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
  const range = getFullMonthDateRange(monthValue);
  return countEmployeeWfhDatesInRange(employeeId, range.from, range.to);
}
function getEmployeeWfhCountForYear(employeeId, dateValue) {
  const parsed = parseDdMmYyyy(dateValue || todayDdMmYyyy()) || parseDdMmYyyy(todayDdMmYyyy());
  const year = parsed.getFullYear();
  return countEmployeeWfhDatesInRange(employeeId, `01-01-${year}`, `31-12-${year}`);
}
function getEmployeeWfhBalance(employeeId, dateValue = todayDdMmYyyy()) {
  const policy = getWfhPolicy();
  const weekUsed = getEmployeeAcceptedWfhCountForWeek(employeeId, dateValue);
  const monthUsed = getEmployeeAcceptedWfhCountForMonth(employeeId, dateValue);
  const yearUsed = getEmployeeAcceptedWfhCountForYear(employeeId, dateValue);
  const year = getHolidayYear(dateValue || todayDdMmYyyy()) || String(new Date().getFullYear());
  const leaveBalance = getEmployeeLeaveBalance(employeeId, dateValue);
  const monthRemaining = Math.max(0, policy.monthlyLimit - monthUsed);
  const weekRemaining = monthRemaining <= 0 ? 0 : Math.max(0, policy.weeklyLimit - weekUsed);
  return { weekUsed, weekRemaining, monthUsed, monthRemaining, yearUsed, year, yearlyLeaveUsed: leaveBalance.totalUsed, leaveBalance, weeklyLimit: policy.weeklyLimit, monthlyLimit: policy.monthlyLimit };
}
function renderWfhBalanceVisual(balance) {
  const weeklyLimit = Math.max(1, Number(balance.weeklyLimit || 1));
  const monthlyLimit = Math.max(1, Number(balance.monthlyLimit || 1));
  const weekPercent = Math.min(100, Math.round((balance.weekUsed / weeklyLimit) * 100));
  const monthPercent = Math.min(100, Math.round((balance.monthUsed / monthlyLimit) * 100));
  const chart = (label, used, total, percent, tone) => `<div class="wfh-chart-card"><div class="wfh-donut ${tone}" style="--value:${percent};"><span>${used}/${total}</span></div><div><strong>${label}</strong><span class="muted">${percent}% used</span></div></div>`;
  return `<div class="wfh-visual-grid">${chart("Weekly WFH", balance.weekUsed, balance.weeklyLimit, weekPercent, weekPercent >= 100 ? "danger" : "success")}${chart("Monthly WFH", balance.monthUsed, balance.monthlyLimit, monthPercent, monthPercent >= 100 ? "danger" : "success")}</div>`;
}
function canRevokeWfhRequest(request) {
  if (!request || String(request.status || "pending").toLowerCase() !== "pending") return false;
  const today = parseDdMmYyyy(todayDdMmYyyy());
  const requestDate = parseDdMmYyyy(request.date);
  return Boolean(today && requestDate && requestDate > today);
}
function isFutureDateOnly(dateValue) {
  const today = parseDdMmYyyy(todayDdMmYyyy());
  const requested = parseDdMmYyyy(dateValue);
  return Boolean(today && requested && requested > today);
}
function isWithinRequestWindow(dateValue, months) {
  const today = parseDdMmYyyy(todayDdMmYyyy());
  const requested = parseDdMmYyyy(dateValue);
  if (!today || !requested) return false;
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + Math.max(1, Number(months || 6)));
  maxDate.setHours(23, 59, 59, 999);
  return requested <= maxDate;
}
function getFullMonthDateRange(monthValue) {
  const value = String(monthValue || new Date().toISOString().slice(0, 7));
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return getMonthDateRange(monthValue);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const lastDay = new Date(year, month, 0).getDate();
  return { month: value, from: `01-${String(month).padStart(2, "0")}-${year}`, to: `${String(lastDay).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`, totalDays: lastDay };
}
function getMonthKeyFromDateValue(dateValue) {
  const parsed = parseDdMmYyyy(dateValue);
  return parsed ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}` : "";
}
function getAcceptedWfhDatesInRange(employeeId, fromValue, toValue) {
  return Array.from(new Set((state.wfhRequests || [])
    .filter((request) => request.employeeId === employeeId && String(request.status || "").toLowerCase() === "accepted" && isDateInRange(request.date, fromValue, toValue))
    .map((request) => normalizeActivityDateValue(request.date))));
}
function mergeDatesWithAcceptedWfh(baseDates, employeeId, fromValue, toValue) {
  const dates = new Set(baseDates);
  getAcceptedWfhDatesInRange(employeeId, fromValue, toValue).forEach((date) => dates.add(date));
  return Array.from(dates).sort((a, b) => parseDateSortValue(a) - parseDateSortValue(b));
}
function getPendingWfhRequestForDate(employeeId, dateValue) {
  const date = normalizeActivityDateValue(dateValue || "");
  return (state.wfhRequests || []).find((request) => request.employeeId === employeeId && normalizeActivityDateValue(request.date) === date && String(request.status || "pending").toLowerCase() === "pending") || null;
}
function getActiveWfhRequestForDate(employeeId, dateValue) {
  const date = normalizeActivityDateValue(dateValue || "");
  return (state.wfhRequests || []).find((request) => request.employeeId === employeeId && normalizeActivityDateValue(request.date) === date && isWfhRequestActive(request)) || null;
}
function getWfhGroupRecipientIds(employeeId) {
  const recipients = new Set();
  getEmployeeGroups(employeeId).forEach((group) => {
    getGroupMemberEmployees(group).forEach((member) => {
      if (member.id !== employeeId) recipients.add(member.id);
    });
  });
  return Array.from(recipients);
}
function getEmployeeGroupMemberIds(employeeId) {
  const members = new Set();
  getEmployeeGroups(employeeId).forEach((group) => {
    getGroupMemberEmployees(group).forEach((member) => {
      if (member.id !== employeeId) members.add(member.id);
    });
  });
  return Array.from(members);
}
function isAdminMarkedLeaveWfh(request) {
  return String(request?.createdBy || "").toLowerCase() === "admin";
}
function getLeaveWfhCalendarTypeLabel(request, kind) {
  if (kind === "wfh") return isAdminMarkedLeaveWfh(request) ? "Special WFH" : "WFH";
  return isAdminMarkedLeaveWfh(request) ? "Special Leave" : getLeaveTypeConfig(request.type).shortLabel;
}
function getLeaveWfhFullTypeLabel(request, kind) {
  if (kind === "wfh") return isAdminMarkedLeaveWfh(request) ? "Special WFH" : "Work From Home";
  return isAdminMarkedLeaveWfh(request) ? "Special Leave" : getLeaveTypeConfig(request.type).label;
}
function getGroupLeaveWfhEventsForDate(employeeId, dateValue) {
  const date = normalizeActivityDateValue(dateValue || "");
  const memberIds = new Set(getEmployeeGroupMemberIds(employeeId));
  const wfhEvents = (state.wfhRequests || []).filter((request) => memberIds.has(request.employeeId) && normalizeActivityDateValue(request.date) === date && isWfhRequestActive(request)).map((request) => ({ ...request, kind: "wfh", label: getLeaveWfhFullTypeLabel(request, "wfh"), calendarLabel: getLeaveWfhCalendarTypeLabel(request, "wfh") }));
  const leaveEvents = (state.leaveRequests || []).filter((request) => memberIds.has(request.employeeId) && normalizeActivityDateValue(request.date) === date && isLeaveRequestActive(request)).map((request) => ({ ...request, kind: "leave", label: getLeaveWfhFullTypeLabel(request, "leave"), calendarLabel: getLeaveWfhCalendarTypeLabel(request, "leave") }));
  return [...wfhEvents, ...leaveEvents].sort((a, b) => String(a.employeeId).localeCompare(String(b.employeeId)) || a.kind.localeCompare(b.kind));
}
function getGroupLeaveWfhAwarenessMessage(employee, dateValue) {
  const events = getGroupLeaveWfhEventsForDate(employee.id, dateValue);
  if (!events.length) return "";
  const lines = events.map((event) => {
    const member = state.employees.find((item) => item.id === event.employeeId);
    const name = getEmployeeDisplayName(member) || event.employeeId;
    const date = normalizeActivityDateValue(event.date);
    const isAccepted = String(event.status || "").toLowerCase() === "accepted";
    if (isAccepted) {
      const statusLabel = event.kind === "wfh" ? "WFH" : event.label;
      return `${name} is on ${statusLabel} on ${date}.`;
    }
    return `${name} has also applied for ${event.label} on ${date}.`;
  });
  return `${lines.join("\n")}\nPlease coordinate with the team.`;
}
function getEmployeeGroupLeaveWfhReportRows(employee, fromDate, toDate) {
  const memberIds = new Set(getEmployeeGroupMemberIds(employee.id));
  const getReportType = (request, kind) => {
    const createdByAdmin = String(request.createdBy || "").toLowerCase() === "admin";
    if (kind === "wfh") return createdByAdmin ? "Special WFH" : "WFH";
    if (createdByAdmin) return "Special Leave";
    return getLeaveTypeConfig(request.type).shortLabel;
  };
  const normalizeRow = (request, kind) => {
    const date = normalizeActivityDateValue(request.date);
    const member = state.employees.find((item) => item.id === request.employeeId);
    return {
      sort: parseDateSortValue(date),
      date,
      employeeName: getEmployeeDisplayName(member) || request.employeeId,
      type: getReportType(request, kind),
      reason: request.reason || "-"
    };
  };
  const wfhRows = (state.wfhRequests || [])
    .filter((request) => memberIds.has(request.employeeId) && isWfhRequestActive(request) && isDateInRange(request.date, fromDate, toDate))
    .map((request) => normalizeRow(request, "wfh"));
  const leaveRows = (state.leaveRequests || [])
    .filter((request) => memberIds.has(request.employeeId) && isLeaveRequestActive(request) && isDateInRange(request.date, fromDate, toDate))
    .map((request) => normalizeRow(request, "leave"));
  return [...wfhRows, ...leaveRows]
    .sort((a, b) => a.sort - b.sort || a.employeeName.localeCompare(b.employeeName) || a.type.localeCompare(b.type))
    .map(({ sort, ...row }) => row);
}
function createWfhRequestNotifications(employee, request) {
  const groupMemberNotifications = getWfhGroupRecipientIds(employee.id).map((employeeId) => createNotification({
    recipientRole: "employee",
    employeeId,
    title: "Group member WFH request",
    message: `${getEmployeeDisplayName(employee)} requested Work From Home on ${request.date}.`
  }));
  return [
    createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Work From Home request raised", message: `${getEmployeeDisplayName(employee)} requested Work From Home on ${request.date}.` }),
    ...groupMemberNotifications
  ];
}
function getLeavePolicy() {
  const privilegeLeave = Math.max(0, Number(state.leavePolicy?.privilegeLeave ?? 16));
  const sickLeave = Math.max(0, Number(state.leavePolicy?.sickLeave ?? 7));
  const requestWindowMonths = Math.max(1, Number(state.leavePolicy?.requestWindowMonths ?? 6));
  return { privilegeLeave, sickLeave, requestWindowMonths, locked: Boolean(state.leavePolicy?.locked) };
}
function getLeaveTypeConfig(type) {
  return LEAVE_TYPES.find((item) => item.key === type) || LEAVE_TYPES[0];
}
function getEmployeeLeaveRequests(employeeId) {
  return (state.leaveRequests || []).filter((request) => request.employeeId === employeeId).sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
}
function isLeaveRequestActive(request) {
  return ["pending", "accepted"].includes(String(request?.status || "pending").toLowerCase());
}
function getActiveLeaveRequests(employeeId) {
  return getEmployeeLeaveRequests(employeeId).filter(isLeaveRequestActive);
}
function getActiveLeaveRequestForDate(employeeId, dateValue, type = "") {
  const date = normalizeActivityDateValue(dateValue || "");
  return (state.leaveRequests || []).find((request) => request.employeeId === employeeId && normalizeActivityDateValue(request.date) === date && (!type || request.type === type) && isLeaveRequestActive(request)) || null;
}
function getPendingLeaveRequestForDate(employeeId, dateValue, type = "") {
  const date = normalizeActivityDateValue(dateValue || "");
  return (state.leaveRequests || []).find((request) => request.employeeId === employeeId && normalizeActivityDateValue(request.date) === date && (!type || request.type === type) && String(request.status || "pending").toLowerCase() === "pending") || null;
}
function canRevokeLeaveRequest(request) {
  if (!request || String(request.status || "pending").toLowerCase() !== "pending") return false;
  const today = parseDdMmYyyy(todayDdMmYyyy());
  const requestDate = parseDdMmYyyy(request.date);
  return Boolean(today && requestDate && requestDate > today);
}
function getAcceptedLeaveRequests(employeeId) {
  return getEmployeeLeaveRequests(employeeId).filter((request) => String(request.status || "").toLowerCase() === "accepted");
}
function getEmployeeLeaveCountForYear(employeeId, type, dateValue = todayDdMmYyyy()) {
  const year = getHolidayYear(dateValue || todayDdMmYyyy()) || String(new Date().getFullYear());
  return getAcceptedLeaveRequests(employeeId).filter((request) => request.type === type && getHolidayYear(request.date) === year).length;
}
function getEmployeeLeaveBalance(employeeId, dateValue = todayDdMmYyyy()) {
  const policy = getLeavePolicy();
  const year = getHolidayYear(dateValue || todayDdMmYyyy()) || String(new Date().getFullYear());
  const privilegeUsed = getEmployeeLeaveCountForYear(employeeId, "privilege", dateValue);
  const sickUsed = getEmployeeLeaveCountForYear(employeeId, "sick", dateValue);
  const privilegeRemaining = Math.max(0, policy.privilegeLeave - privilegeUsed);
  const sickRemaining = Math.max(0, policy.sickLeave - sickUsed);
  const totalRemaining = Math.max(0, policy.privilegeLeave + policy.sickLeave - privilegeUsed - sickUsed);
  return {
    year,
    privilegeLimit: policy.privilegeLeave,
    sickLimit: policy.sickLeave,
    privilegeCarryForward: privilegeRemaining,
    sickCarryForward: sickRemaining,
    carryForwardTotal: totalRemaining,
    privilegeUsed,
    sickUsed,
    privilegeRemaining,
    sickRemaining,
    totalUsed: privilegeUsed + sickUsed,
    totalRemaining
  };
}
function renderLeaveBalanceVisual(balance) {
  const chart = (label, used, total, tone) => {
    const safeTotal = Math.max(1, Number(total || 0));
    const percent = Math.min(100, Math.round((Number(used || 0) / safeTotal) * 100));
    return `<div class="wfh-chart-card"><div class="wfh-donut ${tone}" style="--value:${percent};"><span>${used}/${total}</span></div><div><strong>${label}</strong><span class="muted">${percent}% used</span></div></div>`;
  };
  return `<div class="wfh-visual-grid">${chart("Privilege Leave", balance.privilegeUsed, balance.privilegeLimit, balance.privilegeRemaining <= 0 ? "danger" : "success")}${chart("Sick Leave", balance.sickUsed, balance.sickLimit, balance.sickRemaining <= 0 ? "danger" : "success")}</div>`;
}
function createLeaveRequestNotifications(employee, request) {
  const leaveType = getLeaveTypeConfig(request.type).label;
  const groupMemberNotifications = getWfhGroupRecipientIds(employee.id).map((employeeId) => createNotification({
    recipientRole: "employee",
    employeeId,
    title: "Group member leave request",
    message: `${getEmployeeDisplayName(employee)} requested ${leaveType} on ${request.date}.`
  }));
  return [
    createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Leave request raised", message: `${getEmployeeDisplayName(employee)} requested ${leaveType} on ${request.date}.` }),
    ...groupMemberNotifications
  ];
}
function getPendingAttendanceClaims() { return (state.attendanceClaims || []).filter((claim) => String(claim.status || "pending").toLowerCase() === "pending"); }
function getAdjustmentHistoryRows() {
  const employeeFilter = String(state.adjustmentHistoryFilterEmployee || "").trim().toLowerCase();
  const dateFilter = normalizeActivityDateValue(state.adjustmentHistoryFilterDate || "");
  return (state.attendanceClaims || []).filter((claim) => {
    if (String(claim.status || "pending").toLowerCase() === "pending") return false;
    const employee = state.employees.find((item) => item.id === claim.employeeId);
    const haystack = `${employee?.fullName || ""} ${employee?.id || ""}`.toLowerCase();
    if (employeeFilter && !haystack.includes(employeeFilter)) return false;
    if (dateFilter && normalizeActivityDateValue(claim.attendanceDate) !== dateFilter) return false;
    return true;
  });
}
function getClaimTimeSummary(claim) {
  if (String(claim?.claimType || "") === "Missed check in and check out") return `Check in ${claim.proposedCheckInTime || "-"} | Check out ${claim.proposedCheckOutTime || "-"}`;
  return claim?.proposedTime || "-";
}
function getNotificationTone(item) {
  if (item?.resolved) return "resolved";
  const text = `${item?.title || ""} ${item?.message || ""}`.toLowerCase();
  if (text.includes("activity")) return "urgent";
  if (text.includes("work from home") || text.includes("wfh") || text.includes("leave") || text.includes("restricted holiday") || text.includes("rh ")) return "info";
  return "default";
}
function openNotificationDialog() {
  const notifications = getCurrentNotifications().filter((item) => !item.resolved);
  const existing = document.querySelector("[data-modal-overlay='true']");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.setAttribute("data-modal-overlay", "true");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(15, 23, 42, 0.38)";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.padding = "24px";
  overlay.style.zIndex = "9999";
  const box = document.createElement("div");
  box.className = "panel notification-dialog";
  box.style.width = "min(760px, 100%)";
  box.style.maxHeight = "80vh";
  box.style.overflow = "auto";
  const body = notifications.length ? notifications.map((item) => `<div class="notification-card notification-card--${getNotificationTone(item)}"><div class="notification-card__body"><p class="eyebrow notification-card__eyebrow">${escapeHtml(item.createdAt || "Notification")}</p><h3>${escapeHtml(item.title || "Notification")}</h3><p class="muted">${escapeHtml(item.message || "")}</p></div><label class="notification-resolve"><input type="checkbox" data-notification-resolve="${item.id}" />Viewed</label></div>`).join("") : emptyState("No notifications available.");
  box.innerHTML = `<div class="section-header"><div><p class="eyebrow">Notifications</p><h2>${state.session?.role === "admin" ? "Admin notifications" : "Employee notifications"}</h2></div><span class="pill">${notifications.length} unseen</span></div><div class="stack">${body}</div><div class="actions" style="margin-top:16px;"><button type="button" class="secondary-btn" id="notificationCloseBtn">Close</button></div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener("click", (event) => { if (!box.contains(event.target)) close(); });
  box.addEventListener("click", (event) => event.stopPropagation());
  box.querySelector("#notificationCloseBtn")?.addEventListener("click", close);
  box.querySelectorAll("[data-notification-resolve]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const notificationId = checkbox.dataset.notificationResolve;
      state = normalizeState({
        ...state,
        notifications: state.notifications.map((item) => item.id === notificationId ? { ...item, resolved: checkbox.checked } : item)
      });
      saveState();
      scheduleRemoteStateSave(getSharedStateSnapshot(state), true);
      const openCount = getUnreadNotificationCount();
      const openPill = box.querySelector(".section-header .pill");
      if (openPill) openPill.textContent = `${openCount} open`;
      notificationBadge?.classList.toggle("hidden", openCount === 0);
      if (notificationBadge) notificationBadge.textContent = String(openCount);
      if (notificationCountLabel) notificationCountLabel.textContent = String(openCount);
      const card = checkbox.closest(".notification-card");
      if (card) {
        card.classList.toggle("notification-card--resolved", checkbox.checked);
        card.classList.toggle("notification-card--urgent", !checkbox.checked && getNotificationTone(state.notifications.find((item) => item.id === notificationId)) === "urgent");
        card.classList.toggle("notification-card--info", !checkbox.checked && getNotificationTone(state.notifications.find((item) => item.id === notificationId)) === "info");
      }
    });
  });
}

function enhancePasswordFields(root = document) {
  root.querySelectorAll('input[type="password"]:not([data-password-toggle-attached])').forEach((input) => {
    const wrapper = document.createElement("div");
    wrapper.className = "password-field-wrap";
    input.parentNode?.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.dataset.passwordToggleAttached = "true";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "password-visibility-toggle";
    button.setAttribute("aria-label", "Show password");
    button.title = "Show password";
    button.innerHTML = `<span aria-hidden="true">&#128065;</span>`;
    button.addEventListener("click", () => {
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.classList.toggle("is-visible", visible);
      button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
      button.title = visible ? "Hide password" : "Show password";
    });
    wrapper.appendChild(button);
  });
}

function render() {
  ensureActivityComplianceNotifications();
  const isTicketPage = isTicketStandalonePage();
  const hasSession = Boolean(state.session) && !isTicketPage;
  const unreadCount = hasSession ? getUnreadNotificationCount() : 0;
  logoutBtn.classList.toggle("hidden", !hasSession);
  notificationBtn?.classList.toggle("hidden", !hasSession);
  notificationBadge?.classList.toggle("hidden", !hasSession || unreadCount === 0);
  if (notificationBadge) notificationBadge.textContent = String(unreadCount);
  if (notificationCountLabel) notificationCountLabel.textContent = String(unreadCount);
  if (isTicketPage) {
    app.innerHTML = renderTicketStandalonePage();
    enhancePasswordFields(app);
    bindTicketEvents();
    renderFeedbackWidget();
    return;
  }
  if (!state.session) {
    if (state.activeAuthView === "forgotPassword") {
      app.innerHTML = renderForgotPassword();
      enhancePasswordFields(app);
      bindForgotPasswordEvents();
    } else {
      app.innerHTML = renderLogin();
      enhancePasswordFields(app);
      bindLoginEvents();
    }
    return;
  }
  app.innerHTML = state.session.role === "admin" ? renderAdminDashboard() : renderEmployeeDashboard();
  enhancePasswordFields(app);
  bindDashboardEvents();
  renderFeedbackWidget();
}

function isTicketStandalonePage() {
  return new URLSearchParams(window.location.search).has("ticket");
}
function getTicketActiveSection() {
  const requested = new URLSearchParams(window.location.search).get("ticket");
  const section = state.ticketSection || requested || "raise";
  if (section === "users" && state.ticketSession?.role !== "admin") return "dashboard";
  return section;
}
function getTicketDirectory() {
  const hrmsAdmin = [{ id: "TKT-ADMIN", role: "admin", source: "hrms-admin", name: state.adminProfile.name, email: state.adminProfile.email, password: state.adminProfile.password, department: "Administration" }];
  const hrmsEmployees = (state.employees || []).map((employee) => ({ id: employee.id, role: "employee", source: "hrms-employee", name: getEmployeeDisplayName(employee), email: employee.email, password: employee.credentials?.password || TEMP_PASSWORD, department: employee.department || "" }));
  const ticketOnlyUsers = (state.ticketUsers || []).map((user) => ({ ...user, source: "ticket-only" }));
  return [...hrmsAdmin, ...hrmsEmployees, ...ticketOnlyUsers];
}
function getCurrentTicketUser() {
  if (!state.ticketSession) return null;
  return getTicketDirectory().find((user) => user.email.toLowerCase() === String(state.ticketSession.email || "").toLowerCase() && user.role === state.ticketSession.role) || state.ticketSession;
}
function renderTicketLoginPage() {
  return `<div class="ticket-login-shell"><div class="ticket-login-card"><div class="section-header"><div><p class="eyebrow">Raise Ticket</p><h2>Sign in to support desk</h2></div><a class="ticket-hrms-link" href="/index.html"><span class="ticket-back-arrow">&#8592;</span> Back</a></div><p class="helper">Use the same credentials as HRMS. Admin and employee access are synced automatically from the HRMS portal.</p><div class="login-switch"><button class="tab-btn ${state.ticketLoginType === "admin" ? "active" : ""}" data-ticket-login-type="admin" type="button">Admin Login</button><button class="tab-btn ${state.ticketLoginType === "employee" ? "active" : ""}" data-ticket-login-type="employee" type="button">Login</button></div><form id="ticketLoginForm" class="stack"><div class="field"><label for="ticketLoginEmail">Email</label><input id="ticketLoginEmail" type="email" value="${state.ticketLoginType === "admin" ? escapeHtml(state.adminProfile.email) : ""}" placeholder="${state.ticketLoginType === "admin" ? escapeHtml(state.adminProfile.email) : "employee@company.com"}" required /></div><div class="field"><label for="ticketLoginPassword">Password</label><input id="ticketLoginPassword" type="password" placeholder="${TEMP_PASSWORD}" required /></div><button class="primary-btn" type="submit">Enter Raise Ticket</button></form></div></div>`;
}
function renderTicketStandalonePage() {
  return `<div class="ticket-home-shell ticket-standalone-shell">${state.ticketSession ? renderTicketPortal() : renderTicketLoginPage()}</div>`;
}
function isTicketForCurrentUser(ticket) {
  if (state.ticketSession?.role === "admin") return true;
  const user = getCurrentTicketUser();
  if (!user) return false;
  const userName = String(user.name || "").toLowerCase();
  const userEmail = String(user.email || "").toLowerCase();
  return String(ticket.requester || "").toLowerCase() === userName || String(ticket.requesterEmail || "").toLowerCase() === userEmail || String(ticket.agent || "").toLowerCase() === userName || String(ticket.agentEmail || "").toLowerCase() === userEmail;
}
function getVisibleTicketTickets() {
  return (state.ticketTickets || []).filter(isTicketForCurrentUser);
}
function matchesTicketFilter(ticket, filter) {
  const status = String(ticket.status || "").toLowerCase();
  const sla = String(ticket.sla || "").toLowerCase();
  if (filter === "resolved") return status.includes("resolved");
  if (filter === "unresolved") return !status.includes("resolved");
  if (filter === "pending") return status.includes("pending");
  if (filter === "overdue") return sla.includes("overdue");
  if (filter === "unassigned") return !String(ticket.agent || "").trim() || String(ticket.agent || "").toLowerCase() === "unassigned";
  if (filter === "due_today") return String(ticket.due || "").toLowerCase().includes("today");
  if (filter === "due_tomorrow") return String(ticket.due || "").toLowerCase().includes("tomorrow");
  return true;
}
function getFilteredTicketTickets() {
  const filter = state.ticketFilter || "assigned";
  return getVisibleTicketTickets().filter((ticket) => matchesTicketFilter(ticket, filter));
}
function getTicketGroupOptions() {
  const hrmsGroups = (state.employeeGroups || []).filter((group) => group.id !== DEFAULT_ADMIN_GROUP_ID).map((group) => ({ id: group.id, source: "hrms", name: getGroupPath(group), raw: group }));
  const ticketGroups = (state.ticketGroups || []).map((group) => ({ id: group.id, source: "ticket", name: group.name, raw: group }));
  return [...hrmsGroups, ...ticketGroups];
}
function getSelectedTicketGroup() {
  const groups = getTicketGroupOptions();
  return groups.find((group) => group.id === state.ticketDraftGroupId) || groups[0] || null;
}
function getTicketAgentOptionsForGroup(group) {
  if (!group) return [];
  if (group.source === "ticket") {
    const members = new Set(group.raw.memberEmails || []);
    return getTicketDirectory().filter((user) => members.has(user.email));
  }
  return getGroupMemberEmployees(group.raw).map((employee) => ({ id: employee.id, name: getEmployeeDisplayName(employee), email: employee.email, department: employee.department || "", source: "hrms-employee" }));
}
function getTicketUserDisplayLabel(user) {
  const suffix = user.source === "ticket-only" ? "EXT" : (user.id ? user.id : user.email);
  return `${user.name} (${suffix})`;
}
function getHrmsEmployeeByTicketEmail(email) {
  const normalizedEmail = String(email || "").toLowerCase();
  if (!normalizedEmail) return null;
  return (state.employees || []).find((employee) => String(employee.email || "").toLowerCase() === normalizedEmail) || null;
}
function createTicketHrmsEmployeeNotification(email, title, message) {
  const employee = getHrmsEmployeeByTicketEmail(email);
  return employee ? createNotification({ recipientRole: "employee", employeeId: employee.id, title, message }) : null;
}
function createTicketHrmsEmployeeNotifications(emails, title, messageBuilder) {
  return Array.from(new Set(emails || [])).map((email) => {
    const employee = getHrmsEmployeeByTicketEmail(email);
    if (!employee) return null;
    const message = typeof messageBuilder === "function" ? messageBuilder(employee) : messageBuilder;
    return createNotification({ recipientRole: "employee", employeeId: employee.id, title, message });
  }).filter(Boolean);
}
function getTicketStats() {
  const tickets = getVisibleTicketTickets();
  return {
    assigned: tickets.length,
    resolved: tickets.filter((ticket) => matchesTicketFilter(ticket, "resolved")).length,
    unresolved: tickets.filter((ticket) => matchesTicketFilter(ticket, "unresolved")).length,
    unassigned: tickets.filter((ticket) => matchesTicketFilter(ticket, "unassigned")).length,
    pending: tickets.filter((ticket) => matchesTicketFilter(ticket, "pending")).length,
    overdue: tickets.filter((ticket) => matchesTicketFilter(ticket, "overdue")).length,
    dueToday: tickets.filter((ticket) => matchesTicketFilter(ticket, "due_today")).length,
    dueTomorrow: tickets.filter((ticket) => matchesTicketFilter(ticket, "due_tomorrow")).length
  };
}
function ticketNavButton(section, label, icon = "") {
  return `<button class="ticket-nav-btn ${getTicketActiveSection() === section ? "active" : ""}" data-ticket-section="${section}" type="button">${icon ? `<span class="ticket-nav-icon">${icon}</span>` : ""}<span>${escapeHtml(label)}</span></button>`;
}
function renderTicketPortal() {
  const section = getTicketActiveSection();
  const user = getCurrentTicketUser();
  const adminNav = state.ticketSession?.role === "admin" ? ticketNavButton("users", "Add user", "") : "";
  return `<section class="ticket-portal"><div class="ticket-topbar"><div class="ticket-brand"><strong>raiseaticket</strong><a class="ticket-hrms-link" href="/index.html"><span class="ticket-back-arrow">&#8592;</span> Back</a><span>|</span><span>AVANZAR IT ...</span></div><nav>${ticketNavButton("dashboard", "Dashboard", "")}${ticketNavButton("raise", "Raise a ticket", "+")}${ticketNavButton("tickets", "Tickets", "")}${ticketNavButton("reports", "Reports", "")}${ticketNavButton("resources", "Resources", "")}${adminNav}</nav><div class="ticket-profile-wrap"><button class="ticket-profile-btn" id="ticketProfileBtn" type="button"><span class="ticket-profile-user">${escapeHtml(user?.name || "Ticket User")}</span><span class="ticket-avatar-dot"></span></button>${state.ticketProfileOpen ? renderTicketProfileMenu() : ""}</div></div><div class="ticket-body">${renderTicketSection(section)}</div><button class="ticket-live-help" type="button">Live Help</button></section>`;
}
function renderTicketProfileMenu() {
  const user = getCurrentTicketUser();
  return `<div class="ticket-profile-menu"><div class="ticket-profile-name"><span class="ticket-profile-menu-user">${escapeHtml(user?.name || "Ticket User")}</span><span class="ticket-profile-email">${escapeHtml(user?.email || "")}</span></div><div class="ticket-timezones"><span>Portal Timezone<br /><strong>(+05:30) Kolkata</strong></span><span>Your Timezone<br /><strong>(+05:30) Kolkata</strong></span></div><button class="ticket-change-password" type="button">Change Password</button><div class="ticket-profile-actions"><button class="ticket-profile-action primary" type="button">My Profile</button><button class="ticket-profile-action danger" id="ticketLogoutBtn" type="button">Sign Out</button></div><p class="helper ticket-profile-links">Privacy Policy&nbsp;&nbsp;|&nbsp;&nbsp;End User Notice</p></div>`;
}
function renderTicketSection(section) {
  if (section === "raise") return renderTicketRaiseForm();
  if (section === "tickets") return renderTicketList();
  if (section === "reports") return renderTicketReports();
  if (section === "resources") return renderTicketResources();
  if (section === "users") return renderTicketUsers();
  return renderTicketDashboard();
}
function renderTicketDashboard() {
  const stats = getTicketStats();
  const cards = [
    ["assigned", "Assigned", stats.assigned],
    ["resolved", "Resolved", stats.resolved],
    ["unresolved", "Unresolved", stats.unresolved],
    ["unassigned", "Unassigned", stats.unassigned],
    ["pending", "Pending", stats.pending],
    ["overdue", "Overdue", stats.overdue],
    ["due_today", "Due Today", stats.dueToday],
    ["due_tomorrow", "Due Tomorrow", stats.dueTomorrow]
  ];
  const visibleScope = state.ticketSession?.role === "admin" ? "All Raise Ticket records" : "Only tickets assigned to you or requested by you";
  return `<div class="ticket-stack"><div class="ticket-stat-grid">${cards.map(([filter, label, value]) => `<button class="ticket-stat ticket-stat-btn ${state.ticketFilter === filter ? "active" : ""}" type="button" data-ticket-filter="${filter}"><span>${escapeHtml(label)}</span><strong>${value}</strong></button>`).join("")}</div><div class="ticket-toolbar"><span class="ticket-date-range">${escapeHtml(visibleScope)}</span><button class="ticket-blue-btn" type="button">Share Dashboard</button><select><option>All Groups</option></select></div><div class="ticket-panel"><div class="section-header"><div><h3>Assigned and Resolved</h3><p class="helper">Click any counter above to open that category list.</p></div><span class="pill">Live</span></div><div class="ticket-stat-grid compact"><div class="ticket-stat"><span>Assigned</span><strong>${stats.assigned}</strong></div><div class="ticket-stat"><span>Resolved in SLA</span><strong>${stats.resolved}</strong></div><div class="ticket-stat"><span>Resolved Outside SLA</span><strong>0</strong></div><div class="ticket-stat"><span>Avg. Resolution Time</span><strong>0 min</strong></div><div class="ticket-stat"><span>Min. Resolution Time</span><strong>0 min</strong></div><div class="ticket-stat"><span>Max. Resolution Time</span><strong>0 min</strong></div></div><div class="ticket-chart"><div class="ticket-chart-line"></div><div class="ticket-chart-legend"><span>Assigned</span><span>Resolved within SLA</span><span>Resolved outside SLA</span></div></div></div></div>`;
}
function renderTicketRaiseForm() {
  const groups = getTicketGroupOptions();
  const selectedGroup = getSelectedTicketGroup();
  const directory = getTicketDirectory().filter((user) => user.role !== "admin");
  const groupOptions = groups.map((group) => `<option value="${escapeHtml(group.id)}" data-search="${escapeHtml(group.name.toLowerCase())}" ${selectedGroup?.id === group.id ? "selected" : ""}>${escapeHtml(group.name)}</option>`).join("") || `<option value="">No groups available</option>`;
  const agents = getTicketAgentOptionsForGroup(selectedGroup);
  const agentOptions = agents.map((user) => `<option value="${escapeHtml(user.email || user.name)}">${escapeHtml(getTicketUserDisplayLabel(user))}</option>`).join("") || `<option value="Unassigned">No group members available</option>`;
  const departmentOptions = Array.from(new Set((agents.length ? agents : state.employees || []).map((item) => item.department || item.clientName).filter(Boolean))).map((department) => `<option>${escapeHtml(department)}</option>`).join("") || `<option>Operations</option>`;
  const createMemberRows = directory.map((user) => `<label class="ticket-member-row" data-search="${escapeHtml(`${user.name} ${user.id || ""} ${user.email}`.toLowerCase())}"><input type="checkbox" class="ticketCreateMemberCheck" value="${escapeHtml(user.email)}" /> <span>${escapeHtml(getTicketUserDisplayLabel(user))}</span><small>${escapeHtml(user.email)}</small></label>`).join("");
  const createGroupOption = state.ticketSession?.role === "admin" ? `<details class="ticket-create-group"><summary>+ Create group</summary><form id="ticketGroupCreateForm" class="stack"><div class="field"><label for="ticketGroupName">Group name *</label><input id="ticketGroupName" required /></div><div class="field ticket-member-search-scope"><label for="ticketCreateMemberSearch">Members *</label><input id="ticketCreateMemberSearch" class="ticket-member-search" placeholder="Search by name, employee ID, or email" type="search" /><div class="ticket-member-picker">${createMemberRows || emptyState("No users available.")}</div></div><button class="secondary-btn" type="submit">Create ticket group</button><p class="helper">This group is available only inside Raise Ticket and will not be added to HRMS.</p></form></details>` : "";
  let groupManager = "";
  if (state.ticketSession?.role === "admin" && selectedGroup?.source === "ticket") {
    const memberEmails = new Set(selectedGroup.raw.memberEmails || []);
    const memberRows = agents.map((user) => `<div class="ticket-member-row ticket-member-manage-row" data-search="${escapeHtml(`${user.name} ${user.id || ""} ${user.email}`.toLowerCase())}"><span><strong>${escapeHtml(getTicketUserDisplayLabel(user))}</strong><small>${escapeHtml(user.email)}</small></span><button class="ticket-mini-danger ticket-trash-btn" type="button" data-ticket-remove-member="${escapeHtml(user.email)}" title="Remove member" aria-label="Remove member">&#128465;</button></div>`).join("");
    const addRows = directory.filter((user) => !memberEmails.has(user.email)).map((user) => `<label class="ticket-member-row" data-search="${escapeHtml(`${user.name} ${user.id || ""} ${user.email}`.toLowerCase())}"><input type="checkbox" class="ticketAddMemberCheck" value="${escapeHtml(user.email)}" /> <span>${escapeHtml(getTicketUserDisplayLabel(user))}</span><small>${escapeHtml(user.email)}</small></label>`).join("");
    groupManager = `<div class="ticket-group-manager"><div class="ticket-group-manager-head"><strong>Manage selected group</strong><button class="ticket-mini-danger ticket-trash-btn" id="ticketDeleteGroupBtn" type="button" title="Delete group" aria-label="Delete group">&#128465;</button></div><div class="field ticket-member-search-scope"><label>Current members</label><input class="ticket-member-search" placeholder="Search members" type="search" /><div class="ticket-member-picker compact">${memberRows || emptyState("No members added yet.")}</div></div><div class="field ticket-member-search-scope"><label>Add members</label><input class="ticket-member-search" placeholder="Search by name, employee ID, or email" type="search" /><div class="ticket-member-picker compact">${addRows || emptyState("All users are already in this group.")}</div></div><button class="secondary-btn" id="ticketAddMembersBtn" type="button">Add selected members</button></div>`;
  } else if (state.ticketSession?.role === "admin" && selectedGroup?.source === "hrms") {
    groupManager = `<p class="helper ticket-group-note">This is an HRMS-synced group. Manage members from HRMS Employee grouping.</p>`;
  }
  return `<div class="ticket-raise"><div class="ticket-side-card"><label><input type="checkbox" /> Ticket by request</label><div class="field"><label>Category</label><select id="ticketCategory"><option>Problem</option><option>Request</option><option>Incident</option></select></div><div class="field"><label>Priority</label><select id="ticketPriority"><option>Medium</option><option>High</option><option>Low</option></select></div>${createGroupOption}<div class="field"><label>Group</label><input id="ticketGroupSearch" class="ticket-group-search" placeholder="Search group" type="search" /><select id="ticketGroup">${groupOptions}</select></div>${groupManager}<div class="field"><label>Agent</label><select id="ticketAgent">${agentOptions}</select></div><div class="field"><label>Department</label><select id="ticketDepartment">${departmentOptions}</select></div></div><form id="ticketRaiseForm" class="ticket-main-form"><div class="field"><label>Subject *</label><input id="ticketSubject" required /></div><div class="field"><label>Description optional</label><div class="ticket-editor-toolbar">B I U A | Align | List | Link</div><textarea id="ticketDescription"></textarea></div><div class="actions"><button class="primary-btn" type="submit">Create ticket</button><button class="secondary-btn" type="button" data-ticket-section="tickets">View tickets</button></div></form></div>`;
}
function renderTicketList() {
  const tickets = getFilteredTicketTickets();
  const filterLabel = String(state.ticketFilter || "assigned").replace(/_/g, " ");
  const rows = tickets.map((ticket) => `<div class="ticket-row"><div class="ticket-avatar">User<span>${escapeHtml(ticket.createdAt)}</span></div><div class="ticket-row-main"><strong>${escapeHtml(ticket.id)} - ${escapeHtml(ticket.subject)}</strong><span class="muted">Last activity: ${escapeHtml(ticket.status)} | Requester - ${escapeHtml(ticket.requester || "-")} | Department - ${escapeHtml(ticket.department || "-")}</span><div class="ticket-meta"><span>Category<br /><strong>${escapeHtml(ticket.category)}</strong></span><span>Priority<br /><strong>${escapeHtml(ticket.priority)}</strong></span><span>Group<br /><strong>${escapeHtml(ticket.group)}</strong></span><span>Agent<br /><strong>${escapeHtml(ticket.agent)}</strong></span></div></div><div class="ticket-row-status"><span class="pill ${String(ticket.sla).includes("Overdue") ? "danger" : ""}">${escapeHtml(ticket.status)}</span><small>${escapeHtml(ticket.sla)}<br />${escapeHtml(ticket.due)}</small></div></div>`).join("");
  return `<div class="ticket-panel"><div class="section-header"><div><h3>${escapeHtml(filterLabel.charAt(0).toUpperCase() + filterLabel.slice(1))} tickets (${tickets.length})</h3><p class="helper">${state.ticketSession?.role === "admin" ? "Admin view includes all ticket records." : "Your view includes only tickets assigned to you or requested by you."}</p></div><input class="ticket-search" placeholder="Search ticket" /></div><div class="ticket-filter-strip">Channel | Company | Category | Department | Priority | Status | Group | Agent | Requester | Tag | Due By</div><div class="ticket-list">${rows || emptyState("No tickets found in this category.")}</div></div>`;
}
function renderTicketReports() {
  const fields = ["Rating", "Assigned count", "Reassigned count", "Resolved count", "Priority wise resolution", "Resolved within SLA", "Resolved outside SLA", "First response time", "Avg. resolution time", "Max resolution time", "Min resolution time", "Pending tickets", "Private notes", "Replies", "Tracked in OpenAI"];
  return `<div class="ticket-panel"><div class="section-header"><div><h3>Reports / Agent</h3></div><button class="secondary-btn" type="button">Schedules</button></div><div class="ticket-report-filter"><strong>Filters</strong><div class="grid-3"><select><option>Ticket assigned</option></select><select><option>></option></select><input value="0" /></div><button class="ticket-blue-btn" type="button">Add filter</button><button class="secondary-btn" type="button">Reset</button></div><div class="ticket-report-fields"><div class="section-header"><span>Select the required fields</span><input class="ticket-search" placeholder="Search" /></div><div class="ticket-checkbox-grid">${fields.map((field) => `<label><input type="checkbox" /> ${escapeHtml(field)}</label>`).join("")}</div></div></div>`;
}
function renderTicketResources() {
  return `<div class="ticket-resources"><div class="section-header"><div><h2>Resources</h2><p class="helper">Your self-service knowledge base where customers find answers and agents share what they know.</p></div><div class="ticket-resource-search"><select><option>Search in Articles</option></select><input placeholder="Enter Keyword" /></div></div><div class="ticket-resource-grid"><div class="ticket-resource-card"><div class="ticket-resource-icon blue">KB</div><h2>Articles</h2><p>Longer-form knowledge base content: how-tos, troubleshooting guides, documentation, and policies.</p></div><div class="ticket-resource-card"><div class="ticket-resource-icon purple">FAQ</div><h2>Frequently Asked Questions</h2><p>Short, punchy answers to common questions. Keep them simple and searchable.</p></div></div></div>`;
}
function renderTicketUsers() {
  const directory = getTicketDirectory();
  const ticketOnlyRows = (state.ticketUsers || []).map((user) => `<div class="table-row"><div><strong>${escapeHtml(user.name)}</strong><span class="muted">${escapeHtml(user.email)} | Client: ${escapeHtml(user.clientName || "-")} | Mobile: ${escapeHtml(user.mobileNumber || "-")}</span></div><span class="pill">Ticket only</span></div>`).join("");
  const syncedRows = directory.filter((user) => user.source !== "ticket-only").map((user) => `<div class="table-row"><div><strong>${escapeHtml(user.name)}</strong><span class="muted">${escapeHtml(user.email)} | ${user.role === "admin" ? "HRMS Admin" : `HRMS Employee ${escapeHtml(user.id)}`}</span></div><span class="pill success">Synced</span></div>`).join("");
  return `<div class="ticket-panel"><div class="section-header"><div><p class="eyebrow">Admin only</p><h3>Add user</h3><p class="helper">HRMS admin and employee credentials work here automatically. Add ticket-only users below when someone should access only Raise Ticket.</p></div><span class="pill">${directory.length} users</span></div><form id="ticketUserForm" class="stack ticket-user-form"><div class="grid-2"><div class="field"><label for="ticketUserName">Full name *</label><input id="ticketUserName" required /></div><div class="field"><label for="ticketUserEmail">Email *</label><input id="ticketUserEmail" type="email" required /></div></div><div class="grid-2"><div class="field"><label for="ticketUserClientName">Client name *</label><input id="ticketUserClientName" required /></div><div class="field"><label for="ticketUserMobile">Mobile number *</label><input id="ticketUserMobile" required /></div></div><div class="field"><label for="ticketUserPassword">Password *</label><input id="ticketUserPassword" value="${TEMP_PASSWORD}" required /></div><button class="secondary-btn" type="submit">Add ticket user</button></form><div class="split" style="margin-top:16px;"><div class="card"><h3>Synced from HRMS</h3><div class="list">${syncedRows || emptyState("No HRMS users found.")}</div></div><div class="card"><h3>Ticket-only users</h3><div class="list">${ticketOnlyRows || emptyState("No ticket-only users added yet.")}</div></div></div></div>`;
}
function renderLogin() {
  return `<section class="login-layout"><div class="panel"><p class="eyebrow">Welcome</p><h2>Choose your portal access</h2><p class="muted">Admins can manage employees, attendance, activity templates, and onboarding imports. Employees can accept offers, complete onboarding, upload the fixed DOCX form, and use the portal.</p><div class="login-switch"><button class="tab-btn ${state.selectedLogin === "admin" ? "active" : ""}" data-login-type="admin" type="button">Admin Login</button><button class="tab-btn ${state.selectedLogin === "employee" ? "active" : ""}" data-login-type="employee" type="button">Employee Login</button></div>${state.selectedLogin === "admin" ? renderAdminLoginForm() : renderEmployeeLoginForm()}<div class="ticket-entry-card"><p class="eyebrow">Support desk</p><h3>Need help?</h3><p class="helper">Raise and track internal support tickets without entering the HRMS console.</p><a class="primary-btn ticket-home-link" href="./index.html?ticket=raise" target="_blank" rel="noopener">Raise a Ticket</a></div></div><div class="panel"><div class="section-header"><div><p class="eyebrow">Prototype coverage</p><h2>Recovered workspace</h2></div><span class="pill success">Local data active</span></div><div class="grid-2"><div class="card"><h3>Offer workflow</h3><p class="muted">Create employees, edit draft emails, send offers, and mark acceptance.</p></div><div class="card"><h3>Employee profile</h3><p class="muted">Employees can review profile details and import the standard DOCX form.</p></div><div class="card"><h3>Attendance</h3><p class="muted">Attendance requires browser location permission before capture.</p></div><div class="card"><h3>Ticketing tool</h3><p class="muted">Dashboard, ticket creation, unresolved tickets, reports, and resources are available from the home page.</p></div></div><div class="card" style="margin-top:16px;"><h3>Demo accounts</h3><div class="stack"><div class="list-item"><div><strong>Admin</strong><span class="muted">admin@hrms.local / ${TEMP_PASSWORD}</span></div><span class="pill warning">Configure email before sending</span></div><div class="list-item"><div><strong>Employee</strong><span class="muted">aarav@company.com / ${TEMP_PASSWORD}</span></div><span class="pill">Email-based login</span></div></div></div></div></section>`;
}
function renderAdminLoginForm() { return `<form id="adminLoginForm" class="stack"><div class="field"><label for="adminEmail">Admin email</label><input id="adminEmail" type="email" required /></div><div class="field"><label for="adminPassword">Password</label><input id="adminPassword" type="password" required /></div><button class="primary-btn" type="submit">Enter admin portal</button><button class="link-btn auth-helper-btn" id="adminForgotPasswordBtn" type="button">Forgot password?</button></form>`; }
function renderEmployeeLoginForm() { return `<form id="employeeLoginForm" class="stack"><div class="field"><label for="employeeEmail">Employee email</label><input id="employeeEmail" type="email" required /></div><div class="field"><label for="employeePassword">Password</label><input id="employeePassword" type="password" required /></div><button class="primary-btn" type="submit">Enter employee portal</button><button class="link-btn auth-helper-btn" id="employeeForgotPasswordBtn" type="button">Forgot password?</button></form>`; }

function renderForgotPassword() {
  return `<section class="login-layout"><div class="panel" style="margin: auto;"><p class="eyebrow">Recovery</p><h2>Reset your password</h2><p class="muted">Enter your registered email address and your new password. Note: Only employee passwords can be reset here.</p>
  <form id="forgotPasswordForm" class="stack">
    <div class="field"><label for="fpEmail">Email address</label><input id="fpEmail" type="email" required /></div>
    <div class="field"><label for="fpNewPassword">New password</label><input id="fpNewPassword" type="password" minlength="6" required /></div>
    <div class="field"><label for="fpConfirmPassword">Confirm password</label><input id="fpConfirmPassword" type="password" minlength="6" required /></div>
    <button class="primary-btn" type="submit">Reset password</button>
    <button class="link-btn auth-helper-btn" id="fpBackBtn" type="button">Back to login</button>
  </form></div></section>`;
}
function renderAdminDashboard() {
  const activeEmployees = state.employees.filter((item) => item.status === "Active").length;
  const totalAttendance = state.employees.reduce((sum, item) => sum + item.attendance.length, 0);
  const totalActivities = state.employees.reduce((sum, item) => sum + item.activities.length, 0);
  return `<section class="dashboard"><aside class="panel sidebar"><p class="eyebrow">Admin console</p><h2>${escapeHtml(state.adminProfile.name)}</h2><p class="muted">${escapeHtml(state.session?.email || state.adminProfile.email)}</p><nav>${navButton("overview", "Overview")}${navButton("employees", "Employees")}${navButton("employee_grouping", "Employee grouping")}${navButton("attendance", "Attendance")}${externalNavButton("Attendance analytics", "/attendance-analytics/index.html")}${navButton("leave_wfh", "Leave and WFH")}${navButton("holiday", "Holiday")}${navButton("attendance_adjustment", "Attendance adjustment")}${navButton("activity", "Activity template")}${navButton("activity_tracker", "Activity tracker")}${navButton("hiring", "Hiring setup")}${navButton("settings", "Settings")}${navButton("guide", "User guide")}</nav></aside><div class="content">${renderAdminSection(activeEmployees, totalAttendance, totalActivities)}</div></section>`;
}
function renderAdminActivityTemplateSection() {
  const groupClientOptions = getGroupClientOptions();
  const groupClientRows = groupClientOptions.map((option) => `<div class="list-item"><div><strong>${escapeHtml(option)}</strong><span class="muted">Available in employee activity log dropdown</span></div><button class="secondary-btn" type="button" data-remove-group-client="${escapeHtml(option)}">Remove</button></div>`).join("");
  return `<div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Template</p><h2>Activity sheet format</h2></div><span class="pill success">${state.activityTemplate.fields.length} columns</span></div><div class="list">${state.activityTemplate.fields.map((field) => `<div class="list-item"><div><strong>${escapeHtml(field.label)}</strong><span class="muted">${escapeHtml(field.type === "groupClient" ? "search dropdown" : field.type)}${field.required ? " - required" : ""}</span></div><span class="pill">${escapeHtml(field.key)}</span></div>`).join("")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Group/Client</p><h2>Manage dropdown values</h2></div><span class="pill">${groupClientOptions.length} options</span></div><form id="groupClientOptionForm" class="stack"><div class="field"><label for="groupClientOptionName">Group/Client name</label><input id="groupClientOptionName" placeholder="Add group/client name" autocomplete="off" /></div><button class="secondary-btn" type="submit">Add group/client</button></form><div class="list" style="margin-top:14px;">${groupClientRows || emptyState("No group/client names configured yet.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Reminder readiness</p><h2>Draft vs submitted rows</h2></div><span class="pill warning">Rule-ready</span></div><div class="stack"><div class="empty-state">Draft rows remain editable after Save.</div><div class="empty-state">Submitted rows lock automatically for that specific serial number.</div><div class="empty-state">Admin-managed Group/Client values appear as a searchable employee dropdown.</div></div></div></div>`;
}
function renderAdminSection(activeEmployees, totalAttendance, totalActivities) {
  const selected = getSelectedEmployee();
  const offersPending = state.employees.filter((item) => item.hiring.offerStatus === "sent").length;
  const onboardingPending = state.employees.filter((item) => item.hiring.offerStatus === "accepted" && !item.hiring.onboardingSubmittedAt).length;
  
  if (state.activeSection === "guide") {
    setTimeout(() => renderMarkdownGuide("admin_user_guide.md"), 0);
    return `<div class="card" id="guideContainer" style="padding: 32px;"><p class="muted">Loading user guide...</p></div>`;
  }

  if (state.activeSection === "overview") return `<div class="section-grid"><div class="card stat"><p class="stat-label">Active employees</p><p class="stat-value">${activeEmployees}</p></div><div class="card stat"><p class="stat-label">Attendance entries</p><p class="stat-value">${totalAttendance}</p></div><div class="card stat"><p class="stat-label">Activity rows</p><p class="stat-value">${totalActivities}</p></div><div class="card wide"><h3>Recent employees</h3><div class="list">${state.employees.map((item) => renderEmployeeDirectoryRow(item, selected?.id)).join("")}</div></div><div class="card tall"><h3>Workflow health</h3><div class="stack"><div class="pill warning">Acceptance pending: ${offersPending}</div><div class="pill">Onboarding pending: ${onboardingPending}</div></div></div></div>`;
  if (state.activeSection === "employees") return `<div class="section-grid"><div class="card wide"><div class="section-header"><div><p class="eyebrow">Offer workflow</p><h2>Send offer</h2></div><span class="pill ${state.emailConfig.configured ? "success" : "warning"}">${state.emailConfig.configured ? "Email configured" : "Email not configured"}</span></div><form id="addEmployeeForm" class="stack"><div class="grid-2"><div class="field"><label for="newEmployeeName">Full name</label><input id="newEmployeeName" required /></div><div class="field"><label for="newEmployeeEmail">Email</label><input id="newEmployeeEmail" type="email" required /></div></div><div class="grid-2"><div class="field"><label for="newEmployeeDept">Department</label><input id="newEmployeeDept" value="Operations" required /></div><div class="field"><label for="newEmployeeRole">Role</label><input id="newEmployeeRole" value="Employee" required /></div></div><div class="grid-2"><div class="field"><label for="newEmployeeCode">Emp id</label><input id="newEmployeeCode" placeholder="EMP-1001" required /></div><div class="field"><label for="newEmployeePassword">Temporary password</label><input id="newEmployeePassword" value="${TEMP_PASSWORD}" required /></div></div><div class="actions"><button class="primary-btn" type="submit">Send offer</button><button class="secondary-btn" type="button" id="addEmployeeOnlyBtn">Add employee</button></div><p class="helper">This action creates the employee record. Send offer will also log the offer-letter email based on the configured template.</p></form></div><div class="card tall"><h3>Hiring summary</h3><div class="kpi-grid" style="grid-template-columns:1fr;"><div class="kpi"><p class="subtle">Total employees</p><p class="value">${state.employees.length}</p></div><div class="kpi"><p class="subtle">Offers awaiting acceptance</p><p class="value">${offersPending}</p></div><div class="kpi"><p class="subtle">Onboarding pending</p><p class="value">${onboardingPending}</p></div></div></div></div>${renderEmployeeDirectory()}`;
  if (state.activeSection === "admin_employee_details" && selected) return `<div class="card">${renderAdminEmployeeDetailsPanel(selected)}</div>`;
  if (state.activeSection === "employee_grouping") return renderAdminEmployeeGroupingConsole();
  if (state.activeSection === "admin_attendance_employee" && selected) return renderAdminAttendanceEmployeeDetails(selected);
  if (state.activeSection === "attendance") return renderAdminAttendanceConsole();
  if (state.activeSection === "leave_wfh") return renderAdminLeaveWfhConsole();
  if (state.activeSection === "holiday") return renderAdminHolidayConsole();
  if (state.activeSection === "attendance_adjustment") return renderAdminAttendanceAdjustmentConsole();
  if (state.activeSection === "activity") return renderAdminActivityTemplateSection();
  if (state.activeSection === "activity_tracker") return renderAdminActivityConsole();
  return `<div class="split"><div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Admin Access</p><h2>Manage admin emails</h2></div><span class="pill">${state.adminEmails.length} admins</span></div><div class="list" style="margin-bottom:14px;">${state.adminEmails.map(email => `<div class="list-item"><div><strong>${escapeHtml(email)}</strong><span class="muted">Admin portal access</span></div>${state.adminEmails.length > 1 ? `<button class="link-btn" type="button" style="color: var(--danger, #e53e3e); padding: 4px; display: flex; align-items: center;" title="Delete" data-remove-admin-email="${escapeHtml(email)}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>` : `<span class="muted">Primary</span>`}</div>`).join("")}</div><form id="addAdminEmailForm" class="stack"><div class="field"><input id="newAdminEmail" type="email" placeholder="New admin email" required /></div><button class="secondary-btn" type="submit">Add admin email</button></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Email config</p><h2>Configure sender email</h2></div><span class="pill ${state.emailConfig.configured ? "success" : "warning"}">${state.emailConfig.configured ? "Configured" : "Needs app password"}</span></div><form id="emailConfigForm" class="stack"><div class="grid-2"><div class="field"><label for="senderName">Sender name</label><input id="senderName" value="${escapeHtml(state.emailConfig.senderName)}" required /></div><div class="field"><label for="senderEmail">Sender email</label><input id="senderEmail" type="email" value="${escapeHtml(state.emailConfig.senderEmail)}" required /></div></div><div class="grid-2"><div class="field"><label for="smtpHost">SMTP host</label><input id="smtpHost" value="${escapeHtml(state.emailConfig.smtpHost)}" required /></div><div class="field"><label for="smtpPort">SMTP port</label><input id="smtpPort" value="${escapeHtml(state.emailConfig.smtpPort)}" required /></div></div><div class="field"><label for="appPassword">App password</label><input id="appPassword" type="password" value="${escapeHtml(state.emailConfig.appPassword)}" required /></div><button class="primary-btn" type="submit">Save email configuration</button></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Account security</p><h2>Admin password</h2></div><span class="pill warning">Email reset pending</span></div><form id="adminPasswordChangeForm" class="stack"><div class="field"><label for="adminCurrentPasswordChange">Current password</label><input id="adminCurrentPasswordChange" type="password" required /></div><div class="grid-2"><div class="field"><label for="adminNewPasswordChange">New password</label><input id="adminNewPasswordChange" type="password" minlength="6" required /></div><div class="field"><label for="adminConfirmPasswordChange">Confirm new password</label><input id="adminConfirmPasswordChange" type="password" minlength="6" required /></div></div><button class="secondary-btn" type="submit">Change admin password</button><p class="helper">Forgot-password reset links will be enabled after email integration. This form changes the admin password only while logged in.</p></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Offer template</p><h2>Predefined email content</h2></div><span class="pill">Editable template</span></div><form id="offerTemplateForm" class="stack"><div class="field"><label for="offerSubject">Email subject</label><input id="offerSubject" value="${escapeHtml(state.offerTemplate.subject)}" required /></div><div class="field"><label for="offerBody">Email body</label><textarea id="offerBody" required>${escapeHtml(state.offerTemplate.body)}</textarea></div><button class="primary-btn" type="submit">Save offer template</button></form></div></div><div class="card tall"><div class="section-header"><div><p class="eyebrow">Recent offer emails</p><h2>Dispatch preview</h2></div><span class="pill">${state.recentEmails.length} sent</span></div><div class="list">${state.recentEmails.map(renderEmailLogRow).join("") || emptyState("No offer emails sent yet.")}</div></div></div>`;
}
function renderAdminAttendanceConsole() {
  const filters = getAttendanceSearchParams();
  const policy = getAttendancePolicyStatus();
  const locked = Boolean(state.attendancePolicy?.locked);
  const isMonthly = filters.mode === "monthly";
  const dailyReport = getAttendanceDailyReport(filters.date);
  const monthlyReport = getAttendanceMonthlyReport(filters.month);
  const sourceEmployees = isMonthly ? monthlyReport.employees : dailyReport.employees;
  const filteredEmployees = sourceEmployees.filter((employee) => !filters.query || String(employee.fullName || "").toLowerCase().includes(filters.query) || String(employee.id || "").toLowerCase().includes(filters.query));
  const dailyRows = filteredEmployees.map((employee) => ({ employee, summary: getAttendanceSummaryForDate(employee, filters.date) }));
  const monthlyRows = monthlyReport.rows.filter((row) => filteredEmployees.some((employee) => employee.id === row.employee.id));
  const historyRows = (state.attendancePolicyHistory || []).map((entry) => `<div class="table-row"><div><strong>${escapeHtml(entry.updatedAt || "-")}</strong><span class="muted">Updated by ${escapeHtml(entry.updatedBy || state.adminProfile.name)}</span></div><div class="stack" style="gap:6px;"><span class="pill">${escapeHtml(entry.officeName || "Office")}</span><span class="pill">${escapeHtml(entry.latitude || "-")}, ${escapeHtml(entry.longitude || "-")}</span><span class="pill">Radius ${escapeHtml(String(entry.radiusMeters || 15))}m</span></div></div>`).join("");
  return `<div class="stack"><div class="section-grid"><div class="card stat"><p class="stat-label">Total employees</p><p class="stat-value">${sourceEmployees.length}</p><a class="helper" href="#attendanceFilterForm">View all employees</a></div><div class="card stat"><p class="stat-label">${isMonthly ? "Present this month" : "Present today"}</p><p class="stat-value">${isMonthly ? monthlyReport.totalPresent : dailyReport.present.length}</p><span class="pill success">${isMonthly ? escapeHtml(monthlyReport.range.month) : `${sourceEmployees.length ? Math.round((dailyReport.present.length / Math.max(sourceEmployees.length, 1)) * 100) : 0}% of total`}</span></div><div class="card stat"><p class="stat-label">Work from home</p><p class="stat-value">${isMonthly ? monthlyReport.totalWorkFromHome : dailyReport.workFromHome.length}</p><span class="pill">${isMonthly ? "Monthly report" : `${sourceEmployees.length ? Math.round((dailyReport.workFromHome.length / Math.max(sourceEmployees.length, 1)) * 100) : 0}% of total`}</span></div><div class="card stat"><p class="stat-label">${isMonthly ? "Absent this month" : "Absent today"}</p><p class="stat-value">${isMonthly ? monthlyReport.totalAbsent : dailyReport.absent.length}</p><span class="pill danger">${isMonthly ? `${monthlyReport.workingDays} working days` : `${sourceEmployees.length ? Math.round((dailyReport.absent.length / Math.max(sourceEmployees.length, 1)) * 100) : 0}% of total`}</span></div><div class="card stat"><p class="stat-label">Attendance date</p><p class="stat-value" style="font-size:1.25rem;">${escapeHtml(isMonthly ? monthlyReport.range.month : filters.date)}</p><span class="pill">${isMonthly ? "Monthly report" : "Daily report"}</span></div></div><div class="split"><div class="card"><div class="section-header"><div><h2>Attendance dashboard</h2></div><span class="pill">${isMonthly ? monthlyRows.length : dailyRows.length} visible</span></div><form id="attendanceFilterForm" class="stack"><div class="grid-2"><div class="field"><label for="attendanceFilterDate">Report date</label><input id="attendanceFilterDate" value="${escapeHtml(filters.date)}" placeholder="dd-mm-yyyy" ${isMonthly ? "disabled" : ""} /></div><div class="field"><label for="attendanceSearchQuery">Search employee</label><input id="attendanceSearchQuery" value="${escapeHtml(state.attendanceSearchQuery || "")}" placeholder="Name or employee ID" /></div></div><div class="grid-2"><div class="field"><label for="attendanceReportMode">View mode</label><select id="attendanceReportMode"><option value="daily" ${!isMonthly ? "selected" : ""}>Daily</option><option value="monthly" ${isMonthly ? "selected" : ""}>Monthly</option></select></div><div class="field"><label for="attendanceFilterMonth">Month</label><input id="attendanceFilterMonth" type="month" value="${escapeHtml(filters.month)}" ${isMonthly ? "" : "disabled"} /></div></div><button class="secondary-btn" type="submit">Apply filter</button></form><div class="admin-activity-table-wrap" style="margin-top:14px;"><table class="admin-activity-table attendance-report-table"><thead><tr>${isMonthly ? '<th>Employee</th><th>Present</th><th>Absent</th><th>Work from<br />home</th><th>Marked days</th>' : '<th>Employee</th><th>Status</th><th>Check in</th><th>Check out</th><th>Records</th>'}</tr></thead><tbody>${isMonthly ? monthlyRows.map((row) => `<tr data-attendance-employee-id="${row.employee.id}" class="attendance-report-row"><td><strong>${escapeHtml(row.employee.fullName)}</strong><br /><span class="muted">${escapeHtml(row.employee.signupCode || row.employee.id)}</span></td><td>${row.presentCount}</td><td>${row.absentCount}</td><td>${row.workFromHomeCount}</td><td>${row.markedCount}</td></tr>`).join("") || `<tr><td colspan="5">No employees match this search.</td></tr>` : dailyRows.map(({ employee, summary }) => `<tr data-attendance-employee-id="${employee.id}" class="attendance-report-row"><td><strong>${escapeHtml(employee.fullName)}</strong><br /><span class="muted">${escapeHtml(employee.signupCode || employee.id)}</span></td><td><span class="pill ${summary.status === "Absent" ? "danger" : summary.status === "Present" ? "success" : ""}">${summary.status}</span></td><td>${escapeHtml(summary.checkInTime)}</td><td>${escapeHtml(summary.checkOutTime)}</td><td>${summary.records.length}</td></tr>`).join("") || `<tr><td colspan="5">No employees match this search.</td></tr>`}</tbody></table></div></div><div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Office location</p><h2>Location rule</h2></div><span class="pill ${state.attendancePolicy.locationRuleEnabled === false ? "warning" : policy.configured ? "success" : "warning"}">${state.attendancePolicy.locationRuleEnabled === false ? "Location rule disabled" : policy.configured ? `${policy.radius}m radius active` : "Location not configured"}</span></div><form id="attendancePolicyForm" class="stack"><label class="policy-toggle"><input id="policyLocationEnabled" type="checkbox" ${state.attendancePolicy.locationRuleEnabled === false ? "" : "checked"} ${locked ? "disabled" : ""} /><span><strong>Enable location rule</strong><small>When enabled, employees must be physically present at the office location to mark attendance.</small></span></label><div class="grid-2"><div class="field"><label for="officeName">Office name</label><input id="officeName" value="${escapeHtml(state.attendancePolicy.officeName || "Office")}" ${locked ? "disabled" : ""} required /></div><div class="field"><label for="officeRadius">Allowed radius in meters</label><input id="officeRadius" type="number" min="1" value="${escapeHtml(String(state.attendancePolicy.radiusMeters || 15))}" ${locked ? "disabled" : ""} required /></div></div><div class="grid-2"><div class="field"><label for="officeLatitude">Latitude</label><input id="officeLatitude" value="${escapeHtml(state.attendancePolicy.latitude || "")}" placeholder="22.5726" ${locked ? "disabled" : ""} required /></div><div class="field"><label for="officeLongitude">Longitude</label><input id="officeLongitude" value="${escapeHtml(state.attendancePolicy.longitude || "")}" placeholder="88.3639" ${locked ? "disabled" : ""} required /></div></div><div class="actions"><button class="primary-btn" type="submit" ${locked ? "disabled" : ""}>Save office location</button>${policy.configured ? `<button class="secondary-btn" type="button" id="editAttendancePolicyBtn">${locked ? "Edit location" : "Cancel edit"}</button>` : ""}</div></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Attendance timing</p><h2>Timing rule</h2></div><span class="pill ${state.attendancePolicy.timingRuleEnabled === false ? "warning" : state.attendancePolicy.checkInTime || state.attendancePolicy.checkOutTime ? "success" : "warning"}">${state.attendancePolicy.timingRuleEnabled === false ? "Timing disabled" : state.attendancePolicy.checkInTime || state.attendancePolicy.checkOutTime ? "Timing policy active" : "Timing not configured"}</span></div><form id="attendanceTimingForm" class="stack"><label class="policy-toggle"><input id="policyTimingEnabled" type="checkbox" ${state.attendancePolicy.timingRuleEnabled === false ? "" : "checked"} ${locked ? "disabled" : ""} /><span><strong>Enable timing rule</strong><small>When enabled, employees must follow the scheduled check in and check out time windows.</small></span></label><div class="grid-2"><div class="field"><label for="policyCheckInTime">Check in time</label><input id="policyCheckInTime" type="time" value="${escapeHtml(state.attendancePolicy.checkInTime || "")}" ${locked ? "disabled" : ""} /></div><div class="field"><label for="policyCheckInGrace">Check in grace in minutes</label><input id="policyCheckInGrace" type="number" min="0" value="${escapeHtml(String(state.attendancePolicy.checkInGraceMinutes || ""))}" ${locked ? "disabled" : ""} /></div></div><div class="grid-2"><div class="field"><label for="policyCheckOutTime">Check out time</label><input id="policyCheckOutTime" type="time" value="${escapeHtml(state.attendancePolicy.checkOutTime || "")}" ${locked ? "disabled" : ""} /></div><div class="field"><label for="policyCheckOutGrace">Check out grace in minutes</label><input id="policyCheckOutGrace" type="number" min="0" value="${escapeHtml(String(state.attendancePolicy.checkOutGraceMinutes || ""))}" ${locked ? "disabled" : ""} /></div></div><div class="actions"><button class="primary-btn" type="submit" ${locked ? "disabled" : ""}>Save attendance timing</button>${policy.configured ? `<button class="secondary-btn" type="button" id="editAttendanceTimingBtn">${locked ? "Edit timing" : "Cancel edit"}</button>` : ""}</div><p class="helper">When enabled, check in can be marked only till the configured grace time after check in, and check out can start only from the configured grace time before check out. Disable this rule to allow check in and check out anytime.</p></form></div></div></div><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">${isMonthly ? "Monthly exceptions" : "Absent today"}</p><h2>${isMonthly ? "Employees with absences this month" : "Employees not marked present"}</h2></div><span class="pill danger">${isMonthly ? monthlyRows.filter((row) => row.absentCount > 0).length : dailyReport.absent.length} ${isMonthly ? "flagged" : "absent"}</span></div><div class="list">${isMonthly ? monthlyRows.filter((row) => row.absentCount > 0).map((row) => `<button type="button" class="table-row employee-row-btn" data-attendance-employee-id="${row.employee.id}"><div><strong>${escapeHtml(row.employee.fullName)}</strong><span class="muted">${escapeHtml(row.employee.signupCode || row.employee.id)}</span></div><span class="pill danger">${row.absentCount} absent days</span></button>`).join("") || emptyState("No monthly absences for this period.") : dailyReport.absent.map((employee) => `<button type="button" class="table-row employee-row-btn" data-attendance-employee-id="${employee.id}"><div><strong>${escapeHtml(employee.fullName)}</strong><span class="muted">${escapeHtml(employee.signupCode || employee.id)}</span></div><span class="pill danger">Absent on ${escapeHtml(filters.date)}</span></button>`).join("") || emptyState("No absent employees for this date.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Edit history</p><h2>Office location updates</h2></div><span class="pill">${(state.attendancePolicyHistory || []).length} updates</span></div><div class="list">${historyRows || emptyState("No office location updates have been saved yet.")}</div></div></div></div>`;
}
function renderAdminAttendanceEmployeeDetails(employee) {
  const filters = getAttendanceSearchParams();
  const isMonthly = filters.mode === "monthly";
  const monthRange = getMonthDateRange(filters.month);
  const effectiveFrom = isMonthly ? monthRange.from : (filters.from || filters.date);
  const effectiveTo = isMonthly ? monthRange.to : (filters.to || filters.date);
  const sameMonthPeriod = getMonthKeyFromDateValue(effectiveFrom) && getMonthKeyFromDateValue(effectiveFrom) === getMonthKeyFromDateValue(effectiveTo);
  const wfhRange = isMonthly ? getFullMonthDateRange(filters.month) : (sameMonthPeriod ? getFullMonthDateRange(getMonthKeyFromDateValue(effectiveFrom)) : { from: effectiveFrom, to: effectiveTo });
  const statusFilter = String(state.attendanceEmployeeStatusFilter || "all").toLowerCase();
  const detailDates = mergeDatesWithAcceptedWfh(getDatesInRange(effectiveFrom, effectiveTo), employee.id, wfhRange.from, wfhRange.to);
  const allRows = detailDates.map((date) => getAttendanceDaySummary(employee, date));
  const filteredRows = allRows.filter((row) => statusFilter === "all" || (statusFilter === "present" && row.status === "Present") || (statusFilter === "absent" && row.status === "Absent") || (statusFilter === "work_from_home" && row.status === "Work from home") || (statusFilter === "holiday" && row.status === "Holiday"));
  const presentCount = allRows.filter((row) => row.status === "Present").length;
  const absentCount = allRows.filter((row) => row.status === "Absent").length;
  const workFromHomeCount = allRows.filter((row) => row.status === "Work from home").length;
  const holidayCount = allRows.filter((row) => row.status === "Holiday").length;
  const statButton = (key, label, value, tone = "") => `<button type="button" class="card stat employee-attendance-stat-btn ${statusFilter === key ? "active" : ""}" data-attendance-status-filter="${key}"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><span class="pill ${tone}">${statusFilter === key ? "Filter active" : "Click to filter"}</span></button>`;
  return `<div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Attendance record</p><h2>${escapeHtml(employee.fullName)}</h2></div><button class="secondary-btn" type="button" id="backToAttendanceBtn">Back to attendance</button></div><p class="helper">Review check-in and check-out timings for the selected period. Sundays are excluded from absences, accepted attendance claims update the work timings automatically, and holidays will appear here once the holiday list is configured.</p><form id="attendanceEmployeeFilterForm" class="stack"><div class="grid-2"><div class="field"><label for="attendanceFilterFrom">From date</label><input id="attendanceFilterFrom" value="${escapeHtml(effectiveFrom)}" placeholder="dd-mm-yyyy" /></div><div class="field"><label for="attendanceFilterTo">To date</label><input id="attendanceFilterTo" value="${escapeHtml(effectiveTo)}" placeholder="dd-mm-yyyy" /></div></div><button class="secondary-btn" type="submit">Apply period</button></form></div><div class="section-grid">${statButton("present", "Present", presentCount, "success")}${statButton("absent", "Absent", absentCount, "danger")}${statButton("work_from_home", "Work from home", workFromHomeCount)}${statButton("holiday", "Holidays", holidayCount)}<button type="button" class="card stat employee-attendance-stat-btn ${statusFilter === "all" ? "active" : ""}" data-attendance-status-filter="all"><p class="stat-label">View</p><p class="stat-value" style="font-size:1.25rem;">${escapeHtml(isMonthly ? monthRange.month : `${effectiveFrom} to ${effectiveTo}`)}</p><span class="pill">${statusFilter === "all" ? "Showing all" : "Clear filter"}</span></button></div><div class="card"><div class="section-header"><div><p class="eyebrow">Timing log</p><h2>Work timings</h2></div><span class="pill">${statusFilter === "all" ? `${filteredRows.length} records` : `${filteredRows.length} filtered`}</span></div><div class="list">${filteredRows.map((row) => `<div class="table-row"><div><strong>${escapeHtml(row.date)}</strong><span class="muted">${escapeHtml(row.status)}</span>${row.acceptedClaims.length ? `<span class="muted">Accepted claim applied</span>` : ""}</div><div class="actions"><span class="pill ${row.status === "Absent" ? "danger" : row.status === "Present" ? "success" : ""}">Check in: ${escapeHtml(row.checkInTime)}</span><span class="pill ${row.status === "Absent" ? "danger" : row.status === "Present" ? "success" : ""}">Check out: ${escapeHtml(row.checkOutTime)}</span></div></div>`).join("") || emptyState("No attendance records found for this period and filter.")}</div></div></div>`;
}

function renderAdminAttendanceAdjustmentConsole() {
  const employeeOptions = state.employees.map((employee) => `<option value="${escapeHtml(employee.id)}" ${state.adjustmentHistoryFilterEmployee === employee.id ? "selected" : ""}>${escapeHtml(getEmployeeDisplayName(employee))} (${escapeHtml(employee.signupCode || employee.id)})</option>`).join("");
  const pendingClaims = getPendingAttendanceClaims();
  const historyClaims = getAdjustmentHistoryRows();
  return `<div class="stack"><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Attendance adjustment</p><h2>Active claims</h2></div><span class="pill warning">${pendingClaims.length} pending</span></div><div class="list">${pendingClaims.map((claim) => { const employee = state.employees.find((item) => item.id === claim.employeeId); return `<div class="table-row attendance-claim-row"><div class="attendance-claim-details"><div class="attendance-claim-summary"><strong>${escapeHtml(getEmployeeDisplayName(employee) || claim.employeeId)}</strong><span class="muted attendance-claim-meta">${escapeHtml(employee?.id || claim.employeeId)} | ${escapeHtml(claim.attendanceDate)} | ${escapeHtml(claim.claimType)}</span></div><div class="attendance-claim-reason"><span class="attendance-claim-reason-label">Reason</span><span class="muted">${escapeHtml(claim.reason || "-")}</span></div></div><div class="attendance-claim-actions"><div class="attendance-claim-time-line"><span class="pill">${escapeHtml(getClaimTimeSummary(claim))}</span></div><div class="attendance-claim-decision-line"><button class="secondary-btn attendance-claim-btn" type="button" data-claim-decision="accepted" data-claim-id="${claim.id}">Accept</button><button class="secondary-btn attendance-claim-btn" type="button" data-claim-decision="rejected" data-claim-id="${claim.id}">Reject</button></div></div></div>`; }).join("") || emptyState("No active attendance claims.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">History filter</p><h2>Claim history</h2></div><span class="pill">${historyClaims.length} records</span></div><form id="attendanceAdjustmentHistoryForm" class="stack"><div class="grid-2"><div class="field"><label for="adjustmentHistoryEmployee">Employee</label><select id="adjustmentHistoryEmployee"><option value="">All employees</option>${employeeOptions}</select></div><div class="field"><label for="adjustmentHistoryDate">Attendance date</label><input id="adjustmentHistoryDate" value="${escapeHtml(state.adjustmentHistoryFilterDate || "")}" placeholder="dd-mm-yyyy" /></div></div><button class="secondary-btn" type="submit">Apply filter</button></form><div class="list">${historyClaims.map((claim) => { const employee = state.employees.find((item) => item.id === claim.employeeId); return `<div class="table-row"><div class="attendance-claim-details"><div class="attendance-claim-summary"><strong>${escapeHtml(getEmployeeDisplayName(employee) || claim.employeeId)}</strong><span class="muted attendance-claim-meta">${escapeHtml(employee?.id || claim.employeeId)} | ${escapeHtml(claim.attendanceDate)} | ${escapeHtml(claim.claimType)}</span></div><div class="attendance-claim-reason"><span class="muted">${escapeHtml(claim.reason || "-")}</span></div></div><div class="actions"><span class="pill ${getAttendanceClaimStatusTone(claim.status)}">${escapeHtml(claim.status || "Pending")}</span><span class="pill">${escapeHtml(getClaimTimeSummary(claim))}</span></div></div>`; }).join("") || emptyState("No claim history found for the selected filters.")}</div></div></div></div>`;
}

function renderAdminEmployeeGroupingConsole() {
  const groupOptions = (state.employeeGroups || []).filter((group) => group.id !== DEFAULT_ADMIN_GROUP_ID).map((group) => `<option value="${escapeHtml(group.id)}">${escapeHtml(getGroupPath(group))}</option>`).join("");
  const parentOptions = `<option value="">Top-level group</option>${groupOptions}`;
  return `<div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Employee grouping</p><h2>Create employee groups</h2></div><span class="pill">${state.employeeGroups.length} groups</span></div><form id="employeeGroupCreateForm" class="stack"><div class="grid-2"><div class="field"><label for="newGroupName">Group name</label><input id="newGroupName" placeholder="e.g. Finance Team" required /></div><div class="field"><label for="newGroupParent">Parent group</label><select id="newGroupParent">${parentOptions}</select></div></div><button class="primary-btn" type="submit">Create group</button></form></div><div class="section-grid">${(state.employeeGroups || []).map((group) => renderAdminGroupCard(group)).join("") || emptyState("No employee groups available.")}</div></div>`;
}

async function renderMarkdownGuide(filename) {
  const container = document.getElementById("guideContainer");
  if (!container) return;
  try {
    if (!window.marked) {
      await new Promise((r) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        s.onload = r;
        document.head.appendChild(s);
      });
    }
    if (!window.mermaid) {
      await new Promise((r) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";
        s.onload = r;
        document.head.appendChild(s);
      });
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    }
    
    const response = await fetch(filename);
    const text = await response.text();
    const html = marked.parse(text);
    
    container.innerHTML = `<div class="user-guide-content" style="line-height: 1.6; font-size: 15px; color: #334155; padding-bottom: 24px;">${html}</div>`;
    
    // Style markdown output
    container.querySelectorAll('h1, h2, h3').forEach(el => el.style.color = '#0f172a');
    container.querySelectorAll('h1').forEach(el => el.style.borderBottom = '1px solid #e2e8f0');
    container.querySelectorAll('h1').forEach(el => el.style.paddingBottom = '8px');
    container.querySelectorAll('ul').forEach(el => el.style.paddingLeft = '24px');
    container.querySelectorAll('li').forEach(el => el.style.marginBottom = '6px');
    
    // Convert mermaid code blocks
    container.querySelectorAll('code.language-mermaid').forEach(code => {
      const pre = code.parentElement;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.style.background = '#f8fafc';
      div.style.padding = '16px';
      div.style.borderRadius = '8px';
      div.style.marginBottom = '20px';
      div.style.display = 'flex';
      div.style.justifyContent = 'center';
      div.textContent = code.textContent;
      pre.replaceWith(div);
    });
    
    setTimeout(() => {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }, 100);
    
  } catch (err) {
    console.error("Failed to load user guide:", err);
    container.innerHTML = `<p class="muted">Failed to load guide. Please make sure you are connected to the internet.</p>`;
  }
}

function renderAdminGroupCard(group) {
  const members = getGroupMemberEmployees(group);
  const availableEmployees = state.employees.filter((employee) => !(group.members || []).includes(employee.id));
  const childCount = getGroupChildren(group.id).length;
  const memberList = members.map((employee) => `<div class="group-member-chip"><div><strong>${escapeHtml(getEmployeeDisplayName(employee))}</strong><span class="muted">${escapeHtml(employee.id)} | ${escapeHtml(employee.department || "-")}</span></div><button class="secondary-btn group-icon-btn" type="button" data-group-remove-member="${escapeHtml(group.id)}" data-group-employee-id="${escapeHtml(employee.id)}" title="Remove employee from group">Remove</button></div>`).join("") || emptyState("No employees added to this group yet.");
  const employeeOptions = availableEmployees.map((employee) => `<button type="button" class="group-employee-option" data-group-employee-option="${escapeHtml(employee.id)}" data-search-text="${escapeHtml(`${getEmployeeDisplayName(employee)} ${employee.id} ${employee.department || ""} ${employee.email || ""}`.toLowerCase())}"><strong>${escapeHtml(getEmployeeDisplayName(employee))}</strong><span>${escapeHtml(employee.id)} | ${escapeHtml(employee.email || "-")}</span><small>${escapeHtml(employee.department || "-")} | ${escapeHtml(employee.role || "-")}</small></button>`).join("");
  return `<div class="card group-card"><div class="section-header"><div><p class="eyebrow">${group.parentId ? "Sub group" : "Group"}</p><h3>${escapeHtml(group.name)}</h3><p class="muted">${escapeHtml(getGroupPath(group))}</p></div><div class="actions"><span class="pill ${group.isDefault ? "success" : ""}">${group.isDefault ? "Default" : `${members.length} members`}</span>${group.isDefault ? "" : `<button class="secondary-btn group-delete-btn" type="button" data-group-delete="${escapeHtml(group.id)}" title="Delete group">Delete group</button>`}</div></div><div class="kpi-grid group-kpi-grid"><div class="kpi"><p class="subtle">Employees</p><p class="value">${members.length}</p></div><div class="kpi"><p class="subtle">Sub groups</p><p class="value">${childCount}</p></div></div><form class="group-add-member-form" data-group-add-member="${escapeHtml(group.id)}"><div class="field group-employee-picker"><label>Add employee</label><input class="group-employee-search" data-group-employee-picker="${escapeHtml(group.id)}" placeholder="Search or choose employee" autocomplete="off" ${availableEmployees.length ? "" : "disabled"} /><input type="hidden" data-group-employee-selected="${escapeHtml(group.id)}" /><div class="group-employee-options hidden">${employeeOptions}</div><p class="helper group-search-empty ${availableEmployees.length ? "hidden" : ""}">${availableEmployees.length ? "No matching employees found." : "All employees already added"}</p></div><button class="secondary-btn" type="submit" ${availableEmployees.length ? "" : "disabled"}>Add to group</button></form><form class="group-subgroup-form" data-group-create-subgroup="${escapeHtml(group.id)}"><div class="field"><label>Create sub group</label><input placeholder="Sub group name" required /></div><button class="secondary-btn" type="submit">Create sub group</button></form><div class="group-members-list">${memberList}</div></div>`;
}
function renderEmployeeGroups(employee) {
  const groups = getEmployeeGroups(employee.id);
  return `<div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Groups</p><h2>My groups</h2></div><span class="pill">${groups.length} groups</span></div><p class="helper">You can view group membership here. Only admins can create groups or update group members.</p></div><div class="section-grid">${groups.map((group) => renderEmployeeGroupCard(group, employee.id)).join("") || `<div class="card wide">${emptyState("You are not added to any employee group yet.")}</div>`}</div></div>`;
}
function renderEmployeeGroupCard(group, currentEmployeeId) {
  const members = getGroupMemberEmployees(group);
  return `<div class="card group-card"><div class="section-header"><div><p class="eyebrow">${group.parentId ? "Sub group" : "Group"}</p><h3>${escapeHtml(group.name)}</h3><p class="muted">${escapeHtml(getGroupPath(group))}</p></div><span class="pill">${members.length} members</span></div><div class="list">${members.map((member) => `<div class="list-item"><div><strong>${escapeHtml(getEmployeeDisplayName(member))}</strong><span class="muted">${escapeHtml(member.id)} | ${escapeHtml(member.department || "-")}</span></div>${member.id === currentEmployeeId ? '<span class="pill success">You</span>' : ""}</div>`).join("") || emptyState("No employees are currently listed in this group.")}</div></div>`;
}

function renderEmployeeDirectory() {
  const employee = getSelectedEmployee();
  return `<div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Directory</p><h2>Registered employees</h2></div><span class="pill">${state.employees.length} records</span></div><p class="helper">Choose Onboarded for quick review, or open Employee details to manage the employee on a separate page.</p><div class="list">${state.employees.map((item) => renderEmployeeDirectoryRow(item, employee?.id)).join("") || emptyState("No employees have been added yet.")}</div></div><div class="card">${employee && state.adminEmployeeView === "onboarding" ? renderEmployeeDetailPanel(employee, state.adminEmployeeView) : emptyState("Select Onboarded from an employee row, or open Employee details for the full editor page.")}</div></div>`;
}
function renderEmployeeDirectoryRow(employee, selectedId) {
  const isSelected = employee.id === selectedId;
  const isOnboarded = employee.status === "Active";
  const onboardingLabel = isOnboarded ? "Onboarded" : "Onboarding pending";
  const displayId = employee.signupCode || employee.id;
  return `<div class="table-row employee-row-btn ${isSelected ? "active" : ""}"><div><strong>${escapeHtml(getEmployeeDisplayName(employee))}</strong><span class="muted">${escapeHtml(employee.email)} | ${escapeHtml(employee.role)} | ${escapeHtml(employee.department)} | ${escapeHtml(displayId)}</span></div><div class="actions employee-row-actions"><button type="button" class="pill employee-action-btn ${isOnboarded ? "success" : "warning"} ${isSelected && state.adminEmployeeView === "onboarding" ? "is-active" : ""}" data-employee-action="onboarding" data-employee-id="${employee.id}">${onboardingLabel}</button><button type="button" class="pill employee-action-btn ${state.activeSection === "admin_employee_details" && isSelected ? "is-active" : ""}" data-employee-action="details" data-employee-id="${employee.id}">Employee details</button></div></div>`;
}
function renderEmployeeDetailPanel(employee, view) { return view === "onboarding" ? renderAdminOnboardingPanel(employee) : renderAdminEmployeeDetailsPanel(employee); }
function renderReadonlyProfileRow(label, value, options = {}) {
  const extraClass = options.wide ? " profile-row-wide" : "";
  return `<div class="list-item profile-row profile-row-readonly${extraClass}"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value || "-")}</span></div>`;
}
function renderAdminReadonlyFieldGroup(meta, employee, keys, options = {}) {
  return keys.map((key) => meta[key]).filter(Boolean).map((field) => renderReadonlyProfileRow(`${field.label}${field.required ? " *" : ""}`, employee.onboardingDetails[field.key] || "", options)).join("");
}
function renderAdminOnboardingInfoRows(employee) {
  const meta = getProfileFieldMeta(employee);
  const experienceValue = employee.onboardingDetails.experienceType || "";
  const personalRows = renderAdminReadonlyFieldGroup(meta, employee, PERSONAL_DETAIL_KEYS);
  const presentRows = renderAdminReadonlyFieldGroup(meta, employee, PRESENT_ADDRESS_KEYS, { wide: true });
  const permanentRows = renderAdminReadonlyFieldGroup(meta, employee, PERMANENT_ADDRESS_KEYS, { wide: true });
  const bankRows = renderAdminReadonlyFieldGroup(meta, employee, BANK_DETAIL_KEYS);
  const employmentKeys = experienceValue === "Experienced" ? EMPLOYMENT_DETAIL_KEYS : EMPLOYMENT_DETAIL_KEYS.filter((key) => !["pfAvailable", "pfNo"].includes(key));
  const employmentRows = renderAdminReadonlyFieldGroup(meta, employee, employmentKeys);
  return `<div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Personal details</p><h3>Personal details</h3></div></div><div class="stack">${personalRows || emptyState("No personal details saved yet.")}<div class="section-header profile-subsection"><div><p class="eyebrow">Address</p><h3>Present address</h3></div></div>${presentRows || emptyState("No present address saved yet.")}<div class="section-header profile-subsection"><div><p class="eyebrow">Address</p><h3>Permanent address</h3></div></div>${permanentRows || emptyState("No permanent address saved yet.")}</div></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Bank details</p><h3>Bank details</h3></div></div><div class="stack">${bankRows || emptyState("No bank details saved yet.")}</div></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Employment</p><h3>Employment details</h3></div></div><div class="stack">${employmentRows || emptyState("No employment details saved yet.")}</div></div>`;
}
function renderAdminAttachmentReviewSection(employee) {
  return `<div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Attachments</p><h3>Uploaded employee documents</h3></div><span class="pill">${PROFILE_ATTACHMENT_REQUIREMENTS.length} items</span></div><div class="admin-activity-table-wrap"><table class="admin-activity-table profile-attachment-table"><thead><tr><th>Required document</th><th>Current file</th></tr></thead><tbody>${PROFILE_ATTACHMENT_REQUIREMENTS.map((item) => { const current = employee.attachments?.[item.key]; return `<tr><td>${escapeHtml(item.label)}</td><td>${current ? `<span class="pill success">${escapeHtml(current.fileName)}</span><div class="muted">${escapeHtml(current.uploadedAt || "")}</div>${current.savedFileId ? `<button type="button" class="link-btn" style="padding:4px 0; margin-right: 8px;" onclick="viewSecureAttachment('${escapeHtml(current.savedFileId)}', '${escapeHtml(current.fileName)}')">View</button><button type="button" class="link-btn" style="padding:4px 0;" onclick="downloadSecureAttachment('${escapeHtml(current.savedFileId)}', '${escapeHtml(current.fileName)}')">Download</button>` : ''}` : `<span class="muted">Not uploaded</span>`}</td></tr>`; }).join("")}</tbody></table></div></div>`;
}
function renderAdminSubmittedProfileDetails(employee) {
  const educationTable = renderStructuredEntriesTable({ key: "adminEducationalDetails", eyebrow: "Education", title: "Educational details", headers: EDUCATION_HEADERS, displayHeaders: EDUCATION_HEADERS }, employee.onboardingDetails.educationalDetails || "", true);
  const experienceValue = employee.onboardingDetails.experienceType || "";
  const previousCompanyTable = renderStructuredEntriesTable({ key: "adminPreviousCompanyDetails", eyebrow: "Previous company", title: "Previous company details", headers: PREVIOUS_COMPANY_HEADERS, hidden: experienceValue !== "Experienced" }, employee.onboardingDetails.previousCompanyDetails || "", true);
  return `<div class="subtle-card admin-submitted-profile-card"><div class="section-header"><div><p class="eyebrow">Submitted profile</p><h3>Employee-entered profile details</h3></div><span class="pill ${employee.hiring.profileReviewed ? "success" : "warning"}">${employee.hiring.profileReviewed ? "Reviewed and saved" : "Draft / not reviewed"}</span></div><p class="helper">This section shows the complete profile information entered by the employee during onboarding.</p>${renderAdminOnboardingInfoRows(employee)}${educationTable}${previousCompanyTable}${renderAdminAttachmentReviewSection(employee)}</div>`;
}function renderAdminEmployeeDetailsPanel(employee) {
  const offerContent = buildOfferContent(employee);
  return `<div class="stack"><div class="section-header"><div><p class="eyebrow">Employee details</p><h2>${escapeHtml(getEmployeeDisplayName(employee))}</h2></div><span class="pill ${employee.status === "Active" ? "success" : "warning"}">${escapeHtml(employee.status)}</span></div><div class="actions">${employee.hiring.offerStatus === "sent" && !employee.hiring.offerAcceptedAt ? '<button class="secondary-btn" type="button" id="markAcceptedBtn">Mark offer accepted</button>' : ""}${employee.hiring.onboardingSubmittedAt && !employee.hiring.profileEditAllowed ? '<button class="secondary-btn" type="button" id="allowProfileEditBtn">Allow profile edits</button>' : ""}</div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Offer letter</p><h3>${employee.hiring.offerStatus === "not_sent" ? "Not sent yet" : employee.hiring.offerStatus === "sent" ? "Awaiting acceptance" : "Accepted"}</h3></div><span class="pill">${employee.hiring.offerSentAt ? `Sent ${escapeHtml(employee.hiring.offerSentAt)}` : "Draft only"}</span></div><form id="offerDraftForm" class="stack"><div class="field"><label for="offerDraftSubject">Email subject</label><input id="offerDraftSubject" value="${escapeHtml(offerContent.subject)}" required /></div><div class="field"><label for="offerDraftBody">Email body</label><textarea id="offerDraftBody" required>${escapeHtml(offerContent.body)}</textarea></div><div class="actions"><button class="secondary-btn" type="button" id="saveOfferDraftBtn">Save draft</button><button class="primary-btn" type="submit">${employee.hiring.offerSentAt ? "Resend offer" : "Send offer"}</button></div></form></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Account security</p><h3>Reset employee password</h3></div><span class="pill warning">Manual reset</span></div><form id="adminEmployeePasswordResetForm" class="stack"><div class="grid-2"><div class="field"><label for="adminEmployeeNewPassword">Employee's current password</label><input id="adminEmployeeNewPassword" type="password" minlength="6" value="${escapeHtml(employee.credentials.password)}" required /></div><div class="field"><label for="adminEmployeeConfirmPassword">Assign new password</label><input id="adminEmployeeConfirmPassword" type="password" minlength="6" value="${escapeHtml(employee.credentials.password)}" required /></div></div><button class="secondary-btn" type="submit">Reset employee password</button><p class="helper">Until email integration is enabled, admin can set a temporary password and share it with the employee through the approved company channel.</p></form></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Import onboarding DOCX</p><h3>Existing employee form upload</h3></div><span class="pill">Office Use Only ignored</span></div><form id="employeeDocImportForm" class="stack"><div class="field"><label for="employeeDocFile">DOCX file</label><input id="employeeDocFile" type="file" accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /></div><button class="secondary-btn" type="submit">Extract employee details</button><p class="helper">Upload the standard Avanzar employee details document. The portal will extract the same layout for every employee and skip the Office Use Only section.</p></form></div><form id="employeeDetailForm" class="stack"><div class="grid-2"><div class="field"><label for="detailFullName">Full name</label><input id="detailFullName" value="${escapeHtml(employee.fullName)}" required /></div><div class="field"><label for="detailEmail">Email</label><input id="detailEmail" type="email" value="${escapeHtml(employee.email)}" required /></div></div><div class="grid-2"><div class="field"><label for="detailDepartment">Department</label><input id="detailDepartment" value="${escapeHtml(employee.department)}" required /></div><div class="field"><label for="detailRole">Role</label><input id="detailRole" value="${escapeHtml(employee.role)}" required /></div></div><div class="grid-2"><div class="field"><label for="detailSignupCode">Emp id</label><input id="detailSignupCode" value="${escapeHtml(employee.signupCode)}" required /></div><div class="field"><label for="detailPassword">Password</label><input id="detailPassword" type="password" value="${escapeHtml(employee.credentials.password)}" required /></div></div><div class="grid-2"><div class="field"><label for="detailPhone">Phone</label><input id="detailPhone" value="${escapeHtml(employee.profile.phone || "")}" /></div><div class="field"><label for="detailDesignation">Designation</label><input id="detailDesignation" value="${escapeHtml(employee.profile.designation || "")}" /></div></div><div class="grid-2"><div class="field"><label for="detailLocation">Base location</label><input id="detailLocation" value="${escapeHtml(employee.profile.location || "")}" /></div><div class="field"><label for="detailStatus">Status</label><select id="detailStatus"><option ${employee.status === "Pending" ? "selected" : ""}>Pending</option><option ${employee.status === "Accepted" ? "selected" : ""}>Accepted</option><option ${employee.status === "Active" ? "selected" : ""}>Active</option><option ${employee.status === "Inactive" ? "selected" : ""}>Inactive</option></select></div></div><div class="field"><label for="detailBio">Bio</label><textarea id="detailBio">${escapeHtml(employee.profile.bio || "")}</textarea></div><button class="primary-btn" type="submit">Save employee details</button></form>${renderAdminSubmittedProfileDetails(employee)}</div>`;
}
function renderAdminOnboardingPanel(employee) {
  return `<div class="stack"><div class="section-header"><div><p class="eyebrow">Onboarded</p><h2>${escapeHtml(getEmployeeDisplayName(employee))}</h2></div><span class="pill ${employee.hiring.onboardingSubmittedAt ? "success" : "warning"}">${employee.hiring.onboardingSubmittedAt ? "Submitted" : "Pending"}</span></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Onboarding details</p><h3>${employee.hiring.onboardingSubmittedAt ? "Submitted details" : "Waiting for submission"}</h3></div></div><div class="list">${renderOnboardingSummary(employee)}</div></div></div>`;
}
function getAdminActivityColumns() {
  return [{ key: "employee_name", label: "Employee" }, { key: "employee_id", label: "Employee ID" }, { key: "department", label: "Department" }, { key: "sl_no", label: "SL No." }, { key: "date", label: "Date" }, { key: "module", label: "Module" }, { key: "group_client", label: "Group/Client" }, { key: "ticket_number", label: "Ticket Number" }, { key: "issue_raised_by", label: "Issue Raised by" }, { key: "medium", label: "Medium" }, { key: "subject", label: "Subject" }, { key: "issue_description", label: "Issue Description" }, { key: "status", label: "Status" }, { key: "priority", label: "Priority" }, { key: "category", label: "Category" }, { key: "functional_consultant", label: "Functional Consultant" }, { key: "abap_consultant", label: "ABAP Consultant" }, { key: "planned_end_date", label: "Planned End Date" }, { key: "actual_end_date", label: "Actual End Date" }, { key: "final_remarks", label: "Final Remarks" }, { key: "functional_effort", label: "Functional" }, { key: "technical_effort", label: "Technical" }, { key: "total_effort_hrs", label: "Total Effort Hrs" }, { key: "tr_no", label: "TR No. if any" }, { key: "row_status", label: "Row status" }, { key: "last_update", label: "Last update" }];
}
function getAdminActivityRows() {
  return state.employees.flatMap((employee) => employee.activities.map((activity) => ({ employee_name: getEmployeeDisplayName(employee), employee_id: employee.signupCode || employee.id, department: employee.department, sl_no: activity.slNo, date: activity.values.date || "", module: activity.values.module || "", group_client: activity.values.group_client || "", ticket_number: activity.values.ticket_number || "", issue_raised_by: activity.values.issue_raised_by || "", medium: activity.values.medium || "", subject: activity.values.subject || "", issue_description: activity.values.issue_description || "", status: activity.values.status || "", priority: activity.values.priority || "", category: activity.values.category || "", functional_consultant: activity.values.functional_consultant || "", abap_consultant: activity.values.abap_consultant || "", planned_end_date: activity.values.planned_end_date || "", actual_end_date: activity.values.actual_end_date || "", final_remarks: activity.values.final_remarks || "", functional_effort: activity.values.functional_effort || "", technical_effort: activity.values.technical_effort || "", total_effort_hrs: activity.values.total_effort_hrs || "", tr_no: activity.values.tr_no || "", row_status: activity.workflowStatus === "submitted" ? "Submitted" : "Draft", last_update: formatDate(activity.submittedAt || activity.savedAt || todayDdMmYyyy()) }))).sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
}
function renderAdminActivityConsole() {
  const columns = getAdminActivityColumns();
  const rows = getAdminActivityRows();
  return `<div class="stack"><div class="subtle-card activity-admin-sheet-card"><div class="section-header"><div><p class="eyebrow">Activity tracker</p><h2>All employee activity logs</h2></div><div class="actions"><button class="secondary-btn" type="button" id="downloadFilteredActivityExcelBtn">Download filtered Excel</button><button class="secondary-btn" type="button" id="downloadAllActivityExcelBtn">Download all Excel</button></div></div><p class="helper">This tracker shows employee activity rows in an Excel-like sheet. Use the header filters to narrow results, then download either the filtered view or the full log for everyone.</p><div class="admin-activity-table-wrap"><table class="admin-activity-table" id="adminActivityTable"><thead><tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}</tr><tr>${columns.map((column) => `<th class="admin-activity-filter-cell"><input data-admin-activity-filter="${column.key}" placeholder="Filter ${escapeHtml(column.label)}" /></th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr data-admin-activity-row="true">${columns.map((column) => `<td data-admin-col-key="${column.key}" data-filter-value="${escapeHtml(String(row[column.key] || "").toLowerCase())}">${escapeHtml(row[column.key] || "-")}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div></div>`;
}
function renderEmployeeDashboard() {
  const employee = getCurrentEmployee();
  const attendanceCount = employee?.attendance.length || 0;
  const activityCount = employee?.activities.length || 0;
  return `<section class="dashboard"><aside class="panel sidebar"><p class="eyebrow">Employee console</p><h2>${escapeHtml(getEmployeeDisplayName(employee) || "Employee")}</h2><p class="muted">${escapeHtml(employee?.department || "Department")} | ${escapeHtml(employee?.role || "Role")}</p><nav>${navButton("overview", "Overview")}${navButton("profile", "Profile")}${navButton("groups", "Group")}${navButton("attendance", "Attendance")}${navButton("leave_wfh", "Leave and WFH")}${navButton("holiday", "Holiday")}${navButton("activity", "Activity log")}${navButton("guide", "User guide")}</nav></aside><div class="content">${renderEmployeeSection(employee, attendanceCount, activityCount)}</div></section>`;
}
function renderEmployeeSection(employee, attendanceCount, activityCount) {
  if (!employee) return `<div class="card"><h2>Employee not found</h2></div>`;
  if (employee.hiring.offerStatus === "not_sent") return `<div class="card"><p class="eyebrow">Offer pending</p><h2>Your access is not active yet</h2><p class="muted">The admin has not sent your offer letter yet. Once the offer is sent, you can log in and continue onboarding.</p></div>`;
  if (employee.hiring.offerStatus === "sent" && !employee.hiring.offerAcceptedAt) { const offerContent = buildOfferContent(employee); return `<div class="card"><div class="section-header"><div><p class="eyebrow">Offer acceptance</p><h2>Review your offer letter</h2></div><span class="pill warning">Awaiting acceptance</span></div><div class="template-preview"><strong>${escapeHtml(offerContent.subject)}</strong><pre class="message-preview">${escapeHtml(offerContent.body)}</pre></div><div class="actions" style="margin-top:12px;"><button class="primary-btn" id="acceptOfferBtn" type="button">Accept offer</button></div><p class="helper">Once accepted, the portal will open your employee detail form so you can complete onboarding.</p></div>`; }
  
  if (state.activeSection === "guide") {
    setTimeout(() => renderMarkdownGuide("employee_user_guide.md"), 0);
    return `<div class="card" id="guideContainer" style="padding: 32px;"><p class="muted">Loading user guide...</p></div>`;
  }
  if (!employee.hiring.onboardingSubmittedAt && !employee.hiring.profileDraftSaved) return renderEmployeeProfile(employee);
  
  let prefixHTML = "";
  if (!employee.hiring.onboardingSubmittedAt && employee.hiring.profileDraftSaved) {
    prefixHTML = `<div class="card warning" style="margin-bottom: 24px; background: #fff5e6; border: 1px solid #ffcc80;"><div class="section-header"><div><p class="eyebrow" style="color: #e65100;">Action Required</p><h2 style="color: #e65100;">Complete your onboarding profile</h2></div></div><p style="color: #e65100; margin-top: 8px;">Your profile is currently saved as a draft. You can use the portal for attendance and other day-to-day tasks, but please go to the Profile section and fill all remaining fields to formally submit it.</p></div>`;
  }

  if (state.activeSection === "profile") return prefixHTML + renderEmployeeProfile(employee);
  if (state.activeSection === "groups") return prefixHTML + renderEmployeeGroups(employee);
  if (state.activeSection === "attendance") return prefixHTML + renderEmployeeAttendance(employee);
  if (state.activeSection === "leave_wfh") return prefixHTML + renderEmployeeLeaveWfh(employee);
  if (state.activeSection === "holiday") return prefixHTML + renderEmployeeHolidayConsole(employee);
  if (state.activeSection === "activity") return prefixHTML + renderEmployeeActivity(employee, activityCount);
  return prefixHTML + `<div class="section-grid"><div class="card stat"><p class="stat-label">Attendance records</p><p class="stat-value">${attendanceCount}</p></div><div class="card stat"><p class="stat-label">Activity logs</p><p class="stat-value">${activityCount}</p></div><div class="card stat"><p class="stat-label">Profile access</p><p class="stat-value" style="font-size:1.3rem;">${employee.hiring.profileEditAllowed ? "Editable" : "Locked"}</p></div><div class="card wide"><h3>Profile snapshot</h3><div class="list"><div class="list-item"><strong>Employee ID</strong><span>${escapeHtml(employee.signupCode || employee.id)}</span></div><div class="list-item"><strong>Department</strong><span>${escapeHtml(employee.department)}</span></div><div class="list-item"><strong>Role</strong><span>${escapeHtml(employee.role)}</span></div><div class="list-item"><strong>Onboarding submitted</strong><span>${formatDate(employee.hiring.onboardingSubmittedAt)}</span></div><div class="list-item"><strong>Check in policy</strong><span>${escapeHtml(state.attendancePolicy?.checkInTime || "Not configured")} ${state.attendancePolicy?.checkInTime ? `(Grace ${escapeHtml(String(state.attendancePolicy?.checkInGraceMinutes || 0))} mins)` : ""}</span></div><div class="list-item"><strong>Check out policy</strong><span>${escapeHtml(state.attendancePolicy?.checkOutTime || "Not configured")} ${state.attendancePolicy?.checkOutTime ? `(Grace ${escapeHtml(String(state.attendancePolicy?.checkOutGraceMinutes || 0))} mins)` : ""}</span></div></div></div><div class="card tall"><h3>Next actions</h3><div class="stack"><div class="pill ${employee.hiring.profileEditAllowed ? "success" : "warning"}">${employee.hiring.profileEditAllowed ? "Profile edit allowed" : "Profile locked"}</div><div class="pill">Open profile to view submitted onboarding details</div><div class="pill">Use attendance and activity modules normally</div></div></div></div>`;
}
function renderEmployeeOnboarding(employee) {
  return `<div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Onboarding</p><h2>${escapeHtml(state.onboardingTemplate.title)}</h2></div><span class="pill warning">Required before profile access</span></div><p class="muted">${escapeHtml(state.onboardingTemplate.instructions)}</p><form id="employeeOnboardingForm" class="stack">${renderOnboardingFields(employee.onboardingDetails)}<button class="primary-btn" type="submit">Submit onboarding details</button></form></div><div class="card"><h3>What happens next</h3><div class="stack"><div class="empty-state">After submission, these details will appear in your profile.</div><div class="empty-state">Your profile stays locked for edits until the admin grants permission.</div><div class="empty-state">Once onboarding is complete, attendance and activity tracking work as normal.</div></div></div></div>`;
}
function renderEmployeeProfile(employee) {
  const locked = employee.hiring.profileReviewed && !employee.hiring.profileEditAllowed;
  const educationTable = renderStructuredEntriesTable({ key: "educationalDetails", eyebrow: "Education", title: "Educational details", headers: EDUCATION_HEADERS, displayHeaders: EDUCATION_HEADERS }, employee.onboardingDetails.educationalDetails || "", locked);
  const experienceValue = employee.onboardingDetails.experienceType || "";
  const previousCompanyTable = renderStructuredEntriesTable({ key: "previousCompanyDetails", eyebrow: "Previous company", title: "Previous company details", headers: PREVIOUS_COMPANY_HEADERS, hidden: experienceValue !== "Experienced" }, employee.onboardingDetails.previousCompanyDetails || "", locked);
  return `<div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Import onboarding DOCX</p><h2>Upload employee form</h2></div><span class="pill">Office Use Only ignored</span></div><form id="employeeDocImportForm" class="stack"><div class="field"><label for="employeeDocFile">DOCX file</label><input id="employeeDocFile" type="file" accept=".doc,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></div><button class="secondary-btn" type="submit">Extract employee details</button><p class="helper">The extracted values will remain editable until you review and save the profile.</p></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Account security</p><h2>Password</h2></div><span class="pill warning">Email reset pending</span></div><form id="employeePasswordForm" class="stack"><div class="grid-2"><div class="field"><label for="employeeCurrentPassword">Current password</label><input id="employeeCurrentPassword" type="password" required /></div><div class="field"><label for="employeeNewPassword">New password</label><input id="employeeNewPassword" type="password" minlength="6" required /></div></div><div class="field"><label for="employeeConfirmPassword">Confirm new password</label><input id="employeeConfirmPassword" type="password" minlength="6" required /></div><div class="actions"><button class="secondary-btn" type="submit">Change password</button><button class="link-btn auth-helper-btn" id="employeeProfileForgotPasswordBtn" type="button">Forgot password?</button></div><p class="helper">Email-based reset links will be enabled after mail integration. This form changes your password only while you are logged in.</p></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Profile</p><h2>Onboarding information</h2></div><span class="pill ${locked ? "warning" : "success"}">${locked ? "Edit locked" : `${getOnboardingFieldEntries(employee).length} saved fields`}</span></div><p class="helper">${locked ? "These details are locked after employee review and save. An admin must allow edits to unlock them again." : "Review the extracted details in this format, update anything required, then save to lock the profile."}</p><form id="profileForm" class="stack">${renderOnboardingInfoRows(employee, locked)}${educationTable}${previousCompanyTable}${renderAttachmentUploadSection(employee, locked)}<div class="actions"><button class="primary-btn" type="submit" ${locked ? "disabled" : ""}>Save profile</button><button class="secondary-btn" id="saveProfileDraftBtn" type="button" ${locked ? "disabled" : ""}>Save as draft</button></div></form></div></div>`;
}
function renderEmployeeAttendance(employee) {
  const policy = getAttendancePolicyStatus();
  const today = todayDdMmYyyy();
  const buttonState = getAttendanceButtonState(employee);
  const draft = { attendanceDate: today, claimType: "", proposedTime: "", proposedCheckInTime: "", proposedCheckOutTime: "", reason: "", ...(state.attendanceClaimDraft || {}) };
  const weeklyClaims = getEmployeeWeeklyClaimCount(employee.id, todayDdMmYyyy());
  const showDoubleTimeFields = draft.claimType === "Missed check in and check out";
  const employeeClaims = getEmployeeClaims(employee.id);
  const isClaimLimitReached = weeklyClaims >= 2;
  const timingPolicy = getAttendancePolicyTimingStatus();
  const locationMessage = buttonState.isSunday ? "Sunday is auto-marked as weekly off. Attendance is not required today." : buttonState.isHoliday ? "This date is configured as a holiday. Attendance is not required today." : policy.configured ? `Attendance can only be marked within ${policy.radius} meters of ${state.attendancePolicy.officeName || "Office"}. ${timingPolicy.enabled ? `Check in policy ${state.attendancePolicy.checkInTime || "-"} with ${timingPolicy.checkInGraceMinutes} minutes grace and check out policy ${state.attendancePolicy.checkOutTime || "-"} with ${timingPolicy.checkOutGraceMinutes} minutes grace.` : "Timing restriction is currently disabled by admin, so check in and check out can be marked anytime."}` : "Admin has not configured the office location yet.";
  return `<div class="stack"><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Today</p><h2>Mark attendance</h2></div><span class="pill ${policy.configured ? "success" : "warning"}">${policy.configured ? `${policy.radius}m office radius` : "Location pending"}</span></div><p class="notice">${escapeHtml(locationMessage)}</p><div class="subtle-card"><strong>${escapeHtml(state.attendancePolicy.officeName || "Office")}</strong><div class="muted">Latitude ${escapeHtml(String(state.attendancePolicy?.latitude || "-"))}, Longitude ${escapeHtml(String(state.attendancePolicy?.longitude || "-"))}</div></div><div id="locationStatus" class="empty-state">Waiting to capture location.</div><div class="actions" style="margin-top:12px;"><button class="primary-btn" id="checkInBtn" type="button" ${buttonState.checkInDone || buttonState.isSunday || buttonState.isHoliday || !policy.configured ? "disabled" : ""}>${buttonState.checkInDone ? "Checked in" : "Check in"}</button><button class="secondary-btn" id="checkOutBtn" type="button" ${buttonState.checkOutDone || !buttonState.checkInDone || buttonState.isSunday || buttonState.isHoliday || !policy.configured ? "disabled" : ""}>${buttonState.checkOutDone ? "Checked out" : "Check out"}</button></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Adjustment claim</p><h2>Raise attendance adjustment</h2></div><span class="pill warning">${2 - Math.min(weeklyClaims, 2)} of 2 left this week</span></div><form id="attendanceClaimForm" class="stack"><div class="grid-2"><div class="field"><label for="claimAttendanceDate">Attendance date *</label><input id="claimAttendanceDate" value="${escapeHtml(draft.attendanceDate || today)}" placeholder="dd-mm-yyyy" /></div><div class="field"><label for="claimType">Claim type *</label><select id="claimType"><option value="">Select claim type</option>${ATTENDANCE_CLAIM_TYPES.map((option) => `<option value="${escapeHtml(option)}" ${draft.claimType === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></div></div>${showDoubleTimeFields ? `<div class="grid-2"><div class="field"><label for="claimCheckInTime">Actual check in time *</label><input id="claimCheckInTime" type="time" value="${escapeHtml(draft.proposedCheckInTime || "")}" /></div><div class="field"><label for="claimCheckOutTime">Actual check out time *</label><input id="claimCheckOutTime" type="time" value="${escapeHtml(draft.proposedCheckOutTime || "")}" /></div></div>` : `<div class="grid-2"><div class="field"><label for="claimProposedTime">Actual check in / out time *</label><input id="claimProposedTime" type="time" value="${escapeHtml(draft.proposedTime || "")}" /></div><div class="field"><label>Claim flow</label><div class="empty-state">Notification will go to admin</div></div></div>`}<div class="field"><label for="claimReason">Reason *</label><textarea id="claimReason">${escapeHtml(draft.reason || "")}</textarea></div><button class="primary-btn" type="submit" ${isClaimLimitReached ? "disabled" : ""}>Raise claim</button><p class="helper">Only two attendance adjustment requests can be raised in one week.</p></form></div></div><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Attendance history</p><h2>Monthly attendance calendar</h2></div><span class="pill">${escapeHtml(getMonthLabel(state.employeeAttendanceCalendarMonth || new Date().toISOString().slice(0, 7)))}</span></div>${renderEmployeeAttendanceCalendar(employee)}</div><div class="card"><div class="section-header"><div><p class="eyebrow">Claim history</p><h2>Previous claims</h2></div><span class="pill">${employeeClaims.length} records</span></div><div class="list">${employeeClaims.map((claim) => `<div class="table-row"><div><strong>${escapeHtml(claim.attendanceDate)}</strong><span class="muted">${escapeHtml(claim.claimType)} | ${escapeHtml(getClaimTimeSummary(claim))}</span><span class="muted">${escapeHtml(claim.reason || "")}</span></div><div class="actions"><span class="pill ${getAttendanceClaimStatusTone(claim.status)}">${escapeHtml(claim.status || "Pending")}</span></div></div>`).join("") || emptyState("No attendance claims raised yet.")}</div></div></div></div>`;
}

function renderAdminHolidayConsole() {
  const selectedGroupId = getSelectedHolidayGroupId();
  const visibleCalendar = getHolidayCalendarForGroup(selectedGroupId);
  const pendingRequests = (state.holidayRequests || []).filter((request) => String(request.status || "pending").toLowerCase() === "pending").sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
  const historyRequests = (state.holidayRequests || []).filter((request) => String(request.status || "pending").toLowerCase() !== "pending").sort((a, b) => parseDateSortValue(b.reviewedAt || b.date) - parseDateSortValue(a.reviewedAt || a.date));
  const groupOptions = [`<option value="" ${selectedGroupId ? "" : "selected"}>Company-wide holiday list</option>`, ...(state.employeeGroups || []).filter((group) => group.id !== DEFAULT_ADMIN_GROUP_ID).map((group) => `<option value="${escapeHtml(group.id)}" ${selectedGroupId === group.id ? "selected" : ""}>${escapeHtml(getGroupPath(group))}</option>`)].join("");
  const requestRow = (request, active = false) => {
    const employee = state.employees.find((item) => item.id === request.employeeId);
    return `<div class="table-row"><div><strong>${escapeHtml(getEmployeeDisplayName(employee) || request.employeeId)}</strong><span class="muted">${escapeHtml(employee?.id || request.employeeId)} | ${escapeHtml(request.date)} | ${escapeHtml(request.holidayName || "Restricted holiday")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions">${active ? `<button class="secondary-btn" type="button" data-rh-decision="accepted" data-rh-request-id="${request.id}">Accept</button><button class="secondary-btn" type="button" data-rh-decision="rejected" data-rh-request-id="${request.id}">Reject</button>` : `<span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span>`}</div></div>`;
  };
  const holidayRows = visibleCalendar.map((holiday, index) => {
    const locked = !isFutureDateOnly(holiday.date);
    return `<tr class="${locked ? "holiday-row-locked" : ""}"><td><input class="holiday-config-input" data-holiday-field="date" data-holiday-index="${index}" value="${escapeHtml(holiday.date)}" placeholder="dd-mm-yyyy" ${locked ? "disabled" : ""} /></td><td><input class="holiday-config-input" data-holiday-field="day" data-holiday-index="${index}" value="${escapeHtml(holiday.day)}" ${locked ? "disabled" : ""} /></td><td><input class="holiday-config-input" data-holiday-field="name" data-holiday-index="${index}" value="${escapeHtml(holiday.name)}" ${locked ? "disabled" : ""} /></td><td><select class="holiday-config-select ${holiday.type === "RH" ? "is-rh" : "is-ch"}" data-holiday-field="type" data-holiday-index="${index}" ${locked ? "disabled" : ""}><option value="CH" ${holiday.type === "CH" ? "selected" : ""}>CH</option><option value="RH" ${holiday.type === "RH" ? "selected" : ""}>RH</option></select><input type="hidden" data-holiday-field="id" data-holiday-index="${index}" value="${escapeHtml(holiday.id)}" /></td><td><button class="holiday-trash-btn" type="button" data-remove-holiday-id="${escapeHtml(holiday.id)}" ${locked ? "disabled" : ""} title="${locked ? "Past holidays cannot be removed" : "Remove holiday"}" aria-label="Remove holiday">&#128465;</button></td></tr>`;
  }).join("");
  return `<div class="stack"><div class="section-header"><div><p class="eyebrow">Holiday</p><h2>Holiday calendar</h2></div><span class="pill">${visibleCalendar.length} holidays</span></div><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Calendar setup</p><h2>Customize holiday list</h2></div><span class="pill">${escapeHtml(getHolidayConfigLabel(selectedGroupId))}</span></div><form id="holidayGroupSelectForm" class="stack"><div class="field"><label for="holidayGroupSelector">Holiday list scope</label><select id="holidayGroupSelector">${groupOptions}</select></div><button class="secondary-btn" type="submit">Load holiday list</button></form><form id="holidayCalendarForm" class="stack"><input type="hidden" id="holidayConfigGroupId" value="${escapeHtml(selectedGroupId)}" /><div class="admin-activity-table-wrap"><table class="admin-activity-table holiday-config-table"><thead><tr><th>Date</th><th>Day</th><th>Holiday</th><th>Comment</th><th>Remove</th></tr></thead><tbody>${holidayRows}</tbody></table></div><button class="primary-btn" type="submit">Save holiday list</button><p class="helper">Past holidays are locked and cannot be updated or removed. CH holidays are company holidays. RH holidays can be applied by employees as restricted holidays.</p></form><form id="holidayAddForm" class="stack subtle-card" style="margin-top:14px;"><h3>Add holiday to ${escapeHtml(getHolidayConfigLabel(selectedGroupId))}</h3><div class="grid-2"><div class="field"><label for="newHolidayDate">Date</label><input id="newHolidayDate" placeholder="dd-mm-yyyy" /></div><div class="field"><label for="newHolidayDay">Day</label><input id="newHolidayDay" placeholder="Monday" /></div></div><div class="grid-2"><div class="field"><label for="newHolidayName">Holiday</label><input id="newHolidayName" /></div><div class="field"><label for="newHolidayType">Comment</label><select id="newHolidayType"><option value="CH">CH</option><option value="RH">RH</option></select></div></div><button class="secondary-btn" type="submit">Add holiday</button></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">RH approval</p><h2>Restricted holiday requests</h2></div><span class="pill warning">${pendingRequests.length} pending</span></div><div class="list">${pendingRequests.map((request) => requestRow(request, true)).join("") || emptyState("No restricted holiday requests pending approval.")}</div></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>Restricted holiday decisions</h2></div><span class="pill">${historyRequests.length} records</span></div><div class="list">${historyRequests.map((request) => requestRow(request, false)).join("") || emptyState("No restricted holiday decisions yet.")}</div></div></div>`;
}

function renderEmployeeHolidayConsole(employee) {
  const employeeHolidayScope = getEmployeeHolidayCalendar(employee);
  const employeeHolidayCalendar = employeeHolidayScope.calendar;
  const rhOptions = getRestrictedHolidayOptions(employeeHolidayCalendar);
  const requests = getEmployeeHolidayRequests(employee.id);
  const selectedYear = String(new Date().getFullYear());
  const usedThisYear = hasActiveRestrictedHolidayForYear(employee.id, selectedYear);
  const optionRows = rhOptions.map((holiday) => `<option value="${escapeHtml(holiday.id)}">${escapeHtml(holiday.date)} - ${escapeHtml(holiday.name)}</option>`).join("");
  const calendarRows = employeeHolidayCalendar.map((holiday) => `<tr><td>${escapeHtml(holiday.date)}</td><td>${escapeHtml(holiday.day)}</td><td>${escapeHtml(holiday.name)}</td><td><span class="pill ${holiday.type === "RH" ? "warning" : "success"}">${escapeHtml(holiday.type)}</span></td></tr>`).join("");
  return `<div class="stack"><div class="section-header"><div><p class="eyebrow">Holiday</p><h2>Holiday calendar</h2></div><span class="pill">${requests.length} RH records</span></div><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">Calendar</p><h2>Company holidays and RH</h2></div><span class="pill">${employeeHolidayScope.group ? escapeHtml(getGroupPath(employeeHolidayScope.group)) : "Company-wide"}</span></div><div class="admin-activity-table-wrap"><table class="admin-activity-table"><thead><tr><th>Date</th><th>Day</th><th>Holiday</th><th>Comment</th></tr></thead><tbody>${calendarRows}</tbody></table></div><p class="helper">Employees can avail maximum 1 RH from the RH list. Total 12 holidays can be availed including 1 RH.</p></div><div class="card"><div class="section-header"><div><p class="eyebrow">Restricted holiday</p><h2>Apply for RH</h2></div><span class="pill ${usedThisYear ? "warning" : "success"}">${usedThisYear ? "RH already used" : "RH available"}</span></div><form id="restrictedHolidayForm" class="stack"><div class="field"><label for="restrictedHolidaySelect">Restricted holiday *</label><select id="restrictedHolidaySelect" ${usedThisYear ? "disabled" : ""}><option value="">Select RH</option>${optionRows}</select></div><div class="field"><label for="restrictedHolidayReason">Reason *</label><textarea id="restrictedHolidayReason" ${usedThisYear ? "disabled" : ""}></textarea></div><button class="primary-btn" type="submit" ${usedThisYear ? "disabled" : ""}>Apply restricted holiday</button><p class="helper">RH can be applied only before the selected holiday date. Admin approval is required.</p></form></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>My restricted holiday requests</h2></div><span class="pill">${requests.length} records</span></div><div class="list">${requests.map((request) => `<div class="table-row"><div><strong>${escapeHtml(request.date)}</strong><span class="muted">${escapeHtml(request.holidayName || "Restricted holiday")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions"><span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span></div></div>`).join("") || emptyState("No restricted holiday requests raised yet.")}</div></div></div>`;
}

function setLeaveWfhAutoApproval(kind, enabled) {
  const timestamp = buildTimestamp();
  if (kind === "wfh") {
    const pending = (state.wfhRequests || []).filter((request) => String(request.status || "pending").toLowerCase() === "pending");
    const updatedRequests = enabled ? (state.wfhRequests || []).map((request) => String(request.status || "pending").toLowerCase() === "pending" ? { ...request, status: "accepted", reviewedAt: timestamp, reviewedBy: `${state.adminProfile.name} (auto approval)` } : request) : (state.wfhRequests || []);
    const notifications = enabled ? pending.map((request) => createNotification({ recipientRole: "employee", employeeId: request.employeeId, title: "Work From Home request accepted", message: `Your Work From Home request for ${request.date} was auto-approved by admin.` })) : [];
    setState({ wfhAutoApproval: enabled, wfhRequests: updatedRequests, notifications: [...notifications, ...(state.notifications || [])], activeSection: "leave_wfh" });
    scheduleRemoteStateSave(getSharedStateSnapshot(state), true);
    showModalMessage("WFH auto approval updated", enabled ? "WFH auto approval is enabled. Pending WFH requests have been accepted and future WFH requests will be accepted automatically." : "WFH auto approval is disabled. Future WFH requests will need admin review.", "success");
    return;
  }
  const pending = (state.leaveRequests || []).filter((request) => String(request.status || "pending").toLowerCase() === "pending");
  const updatedRequests = enabled ? (state.leaveRequests || []).map((request) => String(request.status || "pending").toLowerCase() === "pending" ? { ...request, status: "accepted", reviewedAt: timestamp, reviewedBy: `${state.adminProfile.name} (auto approval)` } : request) : (state.leaveRequests || []);
  const notifications = enabled ? pending.map((request) => createNotification({ recipientRole: "employee", employeeId: request.employeeId, title: "Leave request accepted", message: `Your ${getLeaveTypeConfig(request.type).label} request for ${request.date} was auto-approved by admin.` })) : [];
  setState({ leaveAutoApproval: enabled, leaveRequests: updatedRequests, notifications: [...notifications, ...(state.notifications || [])], activeSection: "leave_wfh" });
  scheduleRemoteStateSave(getSharedStateSnapshot(state), true);
  showModalMessage("Leave auto approval updated", enabled ? "Leave auto approval is enabled. Pending leave requests have been accepted and future leave requests will be accepted automatically." : "Leave auto approval is disabled. Future leave requests will need admin review.", "success");
}
function renderAdminLeaveWfhConsole() {
  const activeEmployees = state.employees.filter((employee) => employee.status === "Active");
  const selectedId = state.selectedLeaveWfhEmployeeId || activeEmployees[0]?.id || state.selectedEmployeeId;
  const selected = activeEmployees.find((employee) => employee.id === selectedId) || activeEmployees[0] || null;
  const pendingRequests = (state.wfhRequests || []).filter((request) => String(request.status || "pending").toLowerCase() === "pending").sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
  const pendingLeaveRequests = (state.leaveRequests || []).filter((request) => String(request.status || "pending").toLowerCase() === "pending").sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
  const historyEmployeeFilter = state.wfhHistoryFilterEmployee || selected?.id || "";
  const historyMonthFilter = state.wfhHistoryFilterMonth || new Date().toISOString().slice(0, 7);
  const historyRequests = (state.wfhRequests || []).filter((request) => {
    if (String(request.status || "pending").toLowerCase() === "pending") return false;
    if (historyEmployeeFilter && request.employeeId !== historyEmployeeFilter) return false;
    if (historyMonthFilter && getMonthValueFromDate(request.date) !== historyMonthFilter) return false;
    return true;
  }).sort((a, b) => parseDateSortValue(b.reviewedAt || b.revokedAt || b.date) - parseDateSortValue(a.reviewedAt || a.revokedAt || a.date));
  const leaveHistoryRequests = (state.leaveRequests || []).filter((request) => {
    if (String(request.status || "pending").toLowerCase() === "pending") return false;
    if (historyEmployeeFilter && request.employeeId !== historyEmployeeFilter) return false;
    if (historyMonthFilter && getMonthValueFromDate(request.date) !== historyMonthFilter) return false;
    return true;
  }).sort((a, b) => parseDateSortValue(b.reviewedAt || b.revokedAt || b.date) - parseDateSortValue(a.reviewedAt || a.revokedAt || a.date));
  const balance = selected ? getEmployeeWfhBalance(selected.id) : null;
  const leaveBalance = selected ? getEmployeeLeaveBalance(selected.id) : null;
  const policy = getWfhPolicy();
  const leavePolicy = getLeavePolicy();
  const policyHistoryRows = (state.wfhPolicyHistory || []).map((entry) => `<div class="table-row"><div><strong>${escapeHtml(entry.updatedAt || "-")}</strong><span class="muted">Updated by ${escapeHtml(entry.updatedBy || state.adminProfile.name)}</span></div><div class="actions"><span class="pill">Weekly ${escapeHtml(String(entry.weeklyLimit ?? "-"))}</span><span class="pill">Monthly ${escapeHtml(String(entry.monthlyLimit ?? "-"))}</span><span class="pill">Window ${escapeHtml(String(entry.requestWindowMonths ?? 6))} months</span></div></div>`).join("");
  const leavePolicyHistoryRows = (state.leavePolicyHistory || []).map((entry) => `<div class="table-row"><div><strong>${escapeHtml(entry.updatedAt || "-")}</strong><span class="muted">Updated by ${escapeHtml(entry.updatedBy || state.adminProfile.name)}</span></div><div class="actions"><span class="pill">PL ${escapeHtml(String(entry.privilegeLeave ?? "-"))}</span><span class="pill">SL ${escapeHtml(String(entry.sickLeave ?? "-"))}</span><span class="pill">Window ${escapeHtml(String(entry.requestWindowMonths ?? 6))} months</span></div></div>`).join("");
  const employeeOptions = activeEmployees.map((employee) => `<option value="${escapeHtml(employee.id)}" ${selected?.id === employee.id ? "selected" : ""}>${escapeHtml(getEmployeeDisplayName(employee))} (${escapeHtml(employee.signupCode || employee.id)})</option>`).join("");
  const historyEmployeeOptions = activeEmployees.map((employee) => `<option value="${escapeHtml(employee.id)}" ${historyEmployeeFilter === employee.id ? "selected" : ""}>${escapeHtml(getEmployeeDisplayName(employee))} (${escapeHtml(employee.signupCode || employee.id)})</option>`).join("");
  const adminLeaveTypeOptions = LEAVE_TYPES.map((type) => `<option value="${escapeHtml(type.key)}">${escapeHtml(type.label)}</option>`).join("");
  const requestRow = (request, active = false) => {
    const employee = state.employees.find((item) => item.id === request.employeeId);
    const sourceLabel = request.createdBy === "admin" ? "Admin marked special WFH" : "Work From Home";
    return `<div class="table-row"><div><strong>${escapeHtml(getEmployeeDisplayName(employee) || request.employeeId)}</strong><span class="muted">${escapeHtml(employee?.id || request.employeeId)} | ${escapeHtml(request.date)} | ${escapeHtml(sourceLabel)}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions">${active ? `<button class="secondary-btn" type="button" data-wfh-decision="accepted" data-wfh-request-id="${request.id}">Accept</button><button class="secondary-btn" type="button" data-wfh-decision="rejected" data-wfh-request-id="${request.id}">Reject</button>` : `<span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span>`}</div></div>`;
  };
  const leaveRequestRow = (request, active = false) => {
    const employee = state.employees.find((item) => item.id === request.employeeId);
    const leaveType = getLeaveTypeConfig(request.type).label;
    return `<div class="table-row"><div><strong>${escapeHtml(getEmployeeDisplayName(employee) || request.employeeId)}</strong><span class="muted">${escapeHtml(employee?.id || request.employeeId)} | ${escapeHtml(request.date)} | ${escapeHtml(leaveType)}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions">${active ? `<button class="secondary-btn" type="button" data-leave-decision="accepted" data-leave-request-id="${request.id}">Accept</button><button class="secondary-btn" type="button" data-leave-decision="rejected" data-leave-request-id="${request.id}">Reject</button>` : `<span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span>`}</div></div>`;
  };
  return `<div class="stack"><div class="section-header"><div><p class="eyebrow">Leave and WFH</p><h2>Work From Home and leave requests</h2></div><span class="pill warning">${pendingRequests.length + pendingLeaveRequests.length} pending</span></div>${renderAdminLeaveWfhCalendar(activeEmployees)}<div class="split leave-wfh-even-split"><div class="card"><div class="section-header"><div><p class="eyebrow">Admin review</p><h2>Active WFH requests</h2></div><div class="actions"><label class="auto-approval-check"><input type="checkbox" id="wfhAutoApprovalCheck" ${state.wfhAutoApproval ? "checked" : ""} />Auto approval request</label><span class="pill">${pendingRequests.length} requests</span></div></div><div class="list">${pendingRequests.map((request) => requestRow(request, true)).join("") || emptyState("No active WFH requests pending review.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Admin review</p><h2>Active leave requests</h2></div><div class="actions"><label class="auto-approval-check"><input type="checkbox" id="leaveAutoApprovalCheck" ${state.leaveAutoApproval ? "checked" : ""} />Auto approval request</label><span class="pill">${pendingLeaveRequests.length} requests</span></div></div><div class="list">${pendingLeaveRequests.map((request) => leaveRequestRow(request, true)).join("") || emptyState("No active leave requests pending review.")}</div></div></div><div class="split leave-wfh-even-split"><div class="card"><div class="section-header"><div><p class="eyebrow">WFH policy</p><h2>Work From Home policy</h2></div><span class="pill ${policy.locked ? "success" : "warning"}">${policy.locked ? "Policy locked" : "Editing enabled"}</span></div><form id="wfhPolicyForm" class="stack"><div class="grid-2"><div class="field"><label for="wfhWeeklyLimit">Maximum WFH days per week</label><input id="wfhWeeklyLimit" type="number" min="0" value="${escapeHtml(String(policy.weeklyLimit))}" ${policy.locked ? "disabled" : ""} required /></div><div class="field"><label for="wfhMonthlyLimit">Maximum WFH days per month</label><input id="wfhMonthlyLimit" type="number" min="0" value="${escapeHtml(String(policy.monthlyLimit))}" ${policy.locked ? "disabled" : ""} required /></div><div class="field"><label for="wfhRequestWindowMonths">Apply allowed for next months</label><input id="wfhRequestWindowMonths" type="number" min="1" value="${escapeHtml(String(policy.requestWindowMonths))}" ${policy.locked ? "disabled" : ""} required /></div></div><div class="actions"><button class="primary-btn" type="submit" ${policy.locked ? "disabled" : ""}>Save WFH policy</button><button class="secondary-btn" type="button" id="editWfhPolicyBtn">${policy.locked ? "Edit WFH policy" : "Cancel edit"}</button></div><p class="helper">This policy controls employee WFH request limits and how many future months employees can apply for. Saving locks the policy until Edit WFH policy is clicked.</p></form><div class="subtle-card" style="margin-top:14px;"><div class="section-header"><div><p class="eyebrow">Policy log</p><h3>WFH policy updates</h3></div><span class="pill">${(state.wfhPolicyHistory || []).length} updates</span></div><div class="list">${policyHistoryRows || emptyState("No WFH policy updates have been saved yet.")}</div></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Leave policy</p><h2>Leave policy</h2></div><span class="pill ${leavePolicy.locked ? "success" : "warning"}">${leavePolicy.locked ? "Policy locked" : "Editing enabled"}</span></div><form id="leavePolicyForm" class="stack"><div class="grid-2"><div class="field"><label for="privilegeLeaveLimit">Privilege Leave yearly limit</label><input id="privilegeLeaveLimit" type="number" min="0" value="${escapeHtml(String(leavePolicy.privilegeLeave))}" ${leavePolicy.locked ? "disabled" : ""} required /></div><div class="field"><label for="sickLeaveLimit">Sick Leave yearly limit</label><input id="sickLeaveLimit" type="number" min="0" value="${escapeHtml(String(leavePolicy.sickLeave))}" ${leavePolicy.locked ? "disabled" : ""} required /></div><div class="field"><label for="leaveRequestWindowMonths">Apply allowed for next months</label><input id="leaveRequestWindowMonths" type="number" min="1" value="${escapeHtml(String(leavePolicy.requestWindowMonths))}" ${leavePolicy.locked ? "disabled" : ""} required /></div></div><div class="actions"><button class="primary-btn" type="submit" ${leavePolicy.locked ? "disabled" : ""}>Save leave policy</button><button class="secondary-btn" type="button" id="editLeavePolicyBtn">${leavePolicy.locked ? "Edit leave policy" : "Cancel edit"}</button></div><p class="helper">Default leave policy is 16 Privilege Leaves and 7 Sick Leaves per year, with employee applications allowed within the configured future month window. Saving locks the policy until Edit leave policy is clicked.</p></form><div class="subtle-card" style="margin-top:14px;"><div class="section-header"><div><p class="eyebrow">Policy log</p><h3>Leave policy updates</h3></div><span class="pill">${(state.leavePolicyHistory || []).length} updates</span></div><div class="list">${leavePolicyHistoryRows || emptyState("No leave policy updates have been saved yet.")}</div></div></div></div><div class="split leave-wfh-even-split"><div class="card"><div class="section-header"><div><p class="eyebrow">Admin only</p><h2>Mark special WFH</h2></div><span class="pill">Any date allowed</span></div><form id="adminSpecialWfhForm" class="stack"><div class="grid-2"><div class="field"><label for="specialWfhEmployee">Employee *</label><select id="specialWfhEmployee" required>${employeeOptions}</select></div><div class="field"><label for="specialWfhFromDate">From date *</label><input id="specialWfhFromDate" value="${escapeHtml(todayDdMmYyyy())}" placeholder="dd-mm-yyyy" required /></div><div class="field"><label for="specialWfhToDate">To date *</label><input id="specialWfhToDate" value="${escapeHtml(todayDdMmYyyy())}" placeholder="dd-mm-yyyy" required /></div></div><div class="field"><label for="specialWfhReason">Reason *</label><textarea id="specialWfhReason">Special WFH marked by admin</textarea></div><button class="secondary-btn" type="submit">Mark special WFH</button><p class="helper">This admin action can mark WFH for past, current, or future dates and will reflect in attendance counts.</p></form></div><div class="card"><div class="section-header"><div><p class="eyebrow">Admin only</p><h2>Mark additional leave</h2></div><span class="pill">Any date allowed</span></div><form id="adminSpecialLeaveForm" class="stack"><div class="grid-2"><div class="field"><label for="specialLeaveEmployee">Employee *</label><select id="specialLeaveEmployee" required>${employeeOptions}</select></div><div class="field"><label for="specialLeaveType">Leave type *</label><select id="specialLeaveType" required>${adminLeaveTypeOptions}</select></div><div class="field"><label for="specialLeaveFromDate">From date *</label><input id="specialLeaveFromDate" value="${escapeHtml(todayDdMmYyyy())}" placeholder="dd-mm-yyyy" required /></div><div class="field"><label for="specialLeaveToDate">To date *</label><input id="specialLeaveToDate" value="${escapeHtml(todayDdMmYyyy())}" placeholder="dd-mm-yyyy" required /></div></div><div class="field"><label for="specialLeaveReason">Reason *</label><textarea id="specialLeaveReason">Additional leave marked by admin</textarea></div><button class="secondary-btn" type="submit">Mark additional leave</button><p class="helper">This admin action can mark accepted leave for past, current, or future dates and will update the employee leave balance.</p></form></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Employee balance</p><h2>WFH and leave balance</h2></div><span class="pill">${activeEmployees.length} active employees</span></div><div class="list">${activeEmployees.map((employee) => `<button type="button" class="table-row employee-row-btn" data-wfh-balance-employee="${employee.id}"><div><strong>${escapeHtml(getEmployeeDisplayName(employee))}</strong><span class="muted">${escapeHtml(employee.signupCode || employee.id)}</span></div><span class="pill ${selected?.id === employee.id ? "success" : ""}">${selected?.id === employee.id ? "Selected" : "View balance"}</span></button>`).join("") || emptyState("No active employees available.")}</div>${selected && balance && leaveBalance ? `<div class="subtle-card" style="margin-top:14px;"><h3>${escapeHtml(getEmployeeDisplayName(selected))}</h3>${renderWfhBalanceVisual(balance)}${renderLeaveBalanceVisual(leaveBalance)}<div class="kpi-grid"><div class="kpi"><p class="subtle">WFH used this week</p><p class="value">${balance.weekUsed}</p></div><div class="kpi"><p class="subtle">WFH used this month</p><p class="value">${balance.monthUsed}</p></div><div class="kpi"><p class="subtle">Yearly WFH taken</p><p class="value">${balance.yearUsed}</p></div><div class="kpi"><p class="subtle">Privilege Leave left</p><p class="value">${leaveBalance.privilegeRemaining}</p></div><div class="kpi"><p class="subtle">Sick Leave left</p><p class="value">${leaveBalance.sickRemaining}</p></div><div class="kpi"><p class="subtle">Yearly leaves taken</p><p class="value">${leaveBalance.totalUsed}</p></div></div><p class="helper">Yearly data shown for ${escapeHtml(balance.year)}.</p></div>` : ""}</div></div>${renderAdminLeaveWfhReport(activeEmployees)}<div class="split leave-wfh-even-split hidden"><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>Previous WFH decisions</h2></div><span class="pill">${historyRequests.length} records</span></div><form id="wfhHistoryFilterForm" class="stack" style="margin-bottom:14px;"><div class="grid-2"><div class="field"><label for="wfhHistoryEmployeeFilter">Employee wise record</label><select id="wfhHistoryEmployeeFilter">${historyEmployeeOptions}</select></div><div class="field"><label for="wfhHistoryMonthFilter">Month wise record</label><input id="wfhHistoryMonthFilter" type="month" value="${escapeHtml(historyMonthFilter)}" /></div></div><button class="secondary-btn" type="submit">Apply history filter</button></form><div class="list">${historyRequests.map((request) => requestRow(request, false)).join("") || emptyState("No WFH request history found for the selected employee and month.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>Previous leave decisions</h2></div><span class="pill">${leaveHistoryRequests.length} records</span></div><div class="list">${leaveHistoryRequests.map((request) => leaveRequestRow(request, false)).join("") || emptyState("No leave request history found for the selected employee and month.")}</div></div></div></div>`;
}


function getCalendarRequestWindowMonths() {
  return Math.max(1, Math.min(Number(getWfhPolicy().requestWindowMonths || 6), Number(getLeavePolicy().requestWindowMonths || 6), 6));
}
function getLeaveWfhCalendarBounds() {
  const today = parseDdMmYyyy(todayDdMmYyyy()) || new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + getCalendarRequestWindowMonths());
  maxDate.setHours(23, 59, 59, 999);
  return { today, maxDate };
}
function isLeaveWfhDateSelectable(employee, dateValue) {
  const normalized = normalizeActivityDateValue(dateValue);
  const parsed = parseDdMmYyyy(normalized);
  const { today, maxDate } = getLeaveWfhCalendarBounds();
  if (!parsed) return { selectable: false, reason: "Invalid date" };
  if (parsed <= today) return { selectable: false, reason: "Past date" };
  if (parsed > maxDate) return { selectable: false, reason: "Outside 6 months" };
  if (isSundayDate(normalized)) return { selectable: false, reason: "Sunday" };
  if (isEmployeeHolidayDate(employee, normalized)) return { selectable: false, reason: "Holiday" };
  if (getActiveWfhRequestForDate(employee.id, normalized)) return { selectable: false, reason: "WFH booked" };
  if (getActiveLeaveRequestForDate(employee.id, normalized)) return { selectable: false, reason: "Leave booked" };
  return { selectable: true, reason: "" };
}
function getLeaveWfhCalendarMonth(employee) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthValue = state.leaveWfhCalendarMonth || currentMonth;
  const currentStart = new Date(`${currentMonth}-01T00:00:00`);
  const selectedStart = new Date(`${monthValue}-01T00:00:00`);
  const maxMonth = shiftMonthValue(currentMonth, getCalendarRequestWindowMonths());
  const maxStart = new Date(`${maxMonth}-01T00:00:00`);
  if (!Number.isFinite(selectedStart.getTime()) || selectedStart < currentStart) return currentMonth;
  if (selectedStart > maxStart) return maxMonth;
  return monthValue;
}
function renderLeaveWfhCalendar(employee) {
  const monthValue = getLeaveWfhCalendarMonth(employee);
  const fullRange = getFullMonthDateRange(monthValue);
  const match = String(monthValue).match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const month = match ? Number(match[2]) : new Date().getMonth() + 1;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const dates = getDatesInRange(fullRange.from, fullRange.to);
  const selectedDates = new Set(state.leaveWfhSelectedDates || []);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const maxMonth = shiftMonthValue(currentMonth, getCalendarRequestWindowMonths());
  const previousMonth = shiftMonthValue(monthValue, -1);
  const nextMonth = shiftMonthValue(monthValue, 1);
  const canGoPrevious = new Date(`${previousMonth}-01T00:00:00`) >= new Date(`${currentMonth}-01T00:00:00`);
  const canGoNext = new Date(`${nextMonth}-01T00:00:00`) <= new Date(`${maxMonth}-01T00:00:00`);
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="leave-wfh-calendar-weekday">${day}</div>`).join("");
  const blanks = Array.from({ length: firstDay }, () => '<div class="leave-wfh-calendar-cell is-empty"></div>').join("");
  const cells = dates.map((date) => {
    const status = isLeaveWfhDateSelectable(employee, date);
    const selected = selectedDates.has(date);
    const day = date.slice(0, 2);
    const wfh = getActiveWfhRequestForDate(employee.id, date);
    const leave = getActiveLeaveRequestForDate(employee.id, date);
    const groupEvents = getGroupLeaveWfhEventsForDate(employee.id, date);
    const groupWfhCount = groupEvents.filter((event) => event.kind === "wfh").length;
    const groupLeaveCount = groupEvents.filter((event) => event.kind === "leave").length;
    const groupLabel = groupEvents.length === 1 ? groupEvents[0].calendarLabel : groupWfhCount && groupLeaveCount ? `${groupWfhCount} WFH + ${groupLeaveCount} Leave` : groupWfhCount ? `${groupWfhCount} WFH` : groupLeaveCount ? `${groupLeaveCount} Leave` : "";
    const tone = selected ? "selected" : wfh ? "wfh" : leave ? "leave" : groupWfhCount && groupLeaveCount ? "mixed" : groupWfhCount ? "wfh" : groupLeaveCount ? "leave" : isSundayDate(date) ? "sunday" : isEmployeeHolidayDate(employee, date) ? "holiday" : status.selectable ? "open" : "blocked";
    const label = selected ? "Selected" : wfh ? getLeaveWfhCalendarTypeLabel(wfh, "wfh") : leave ? getLeaveWfhCalendarTypeLabel(leave, "leave") : groupLabel || (status.reason === "Past date" ? "" : status.reason);
    const titleParts = [label || date, ...groupEvents.map((event) => { const member = state.employees.find((item) => item.id === event.employeeId); return `${getEmployeeDisplayName(member) || event.employeeId}: ${event.label}`; })];
    return `<button class="leave-wfh-calendar-cell ${tone}" type="button" data-leave-wfh-calendar-date="${escapeHtml(date)}" ${status.selectable ? "" : "disabled"} title="${escapeHtml(titleParts.filter(Boolean).join(" | "))}"><strong>${escapeHtml(day)}</strong>${label ? `<span>${escapeHtml(label)}</span>` : ""}</button>`;
  }).join("");
  return `<div class="leave-wfh-calendar"><div class="attendance-calendar-toolbar"><button class="secondary-btn attendance-calendar-nav" type="button" data-leave-wfh-calendar-month="${escapeHtml(previousMonth)}" ${canGoPrevious ? "" : "disabled"}>Previous</button><div><h3>${escapeHtml(getMonthLabel(monthValue))}</h3><p class="helper">Select one or more available dates. Your own booked WFH/leave, Sundays, holidays, and past dates are blocked. Group member WFH/leave is visible for coordination.</p></div><button class="secondary-btn attendance-calendar-nav" type="button" data-leave-wfh-calendar-month="${escapeHtml(nextMonth)}" ${canGoNext ? "" : "disabled"}>Next</button></div><div class="attendance-calendar-legend"><span class="legend-dot selected"></span>Selected<span class="legend-dot wfh"></span>WFH / team WFH<span class="legend-dot leave"></span>Leave / team leave<span class="legend-dot mixed"></span>Team WFH + Leave<span class="legend-dot holiday"></span>Holiday<span class="legend-dot sunday"></span>Sunday</div><div class="leave-wfh-calendar-grid">${weekdayLabels}${blanks}${cells}</div></div>`;
}
function getAdminLeaveWfhCalendarMonth() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthValue = state.adminLeaveWfhCalendarMonth || currentMonth;
  const minMonth = shiftMonthValue(currentMonth, -6);
  const maxMonth = shiftMonthValue(currentMonth, 6);
  const selectedStart = new Date(`${monthValue}-01T00:00:00`);
  const minStart = new Date(`${minMonth}-01T00:00:00`);
  const maxStart = new Date(`${maxMonth}-01T00:00:00`);
  if (!Number.isFinite(selectedStart.getTime()) || selectedStart < minStart) return minMonth;
  if (selectedStart > maxStart) return maxMonth;
  return monthValue;
}
function getAdminLeaveWfhEvents() {
  const wfhEvents = (state.wfhRequests || []).filter(isWfhRequestActive).map((request) => ({ ...request, kind: "wfh", label: getLeaveWfhFullTypeLabel(request, "wfh"), calendarLabel: getLeaveWfhCalendarTypeLabel(request, "wfh") }));
  const leaveEvents = (state.leaveRequests || []).filter(isLeaveRequestActive).map((request) => ({ ...request, kind: "leave", label: getLeaveWfhFullTypeLabel(request, "leave"), calendarLabel: getLeaveWfhCalendarTypeLabel(request, "leave") }));
  return [...wfhEvents, ...leaveEvents].sort((a, b) => parseDateSortValue(a.date) - parseDateSortValue(b.date));
}
function getAdminLeaveWfhReportTypeLabel(value) {
  if (value === "wfh") return "Work From Home";
  if (value === "privilege") return "Privilege Leave";
  if (value === "sick") return "Sick Leave";
  return "All types";
}
function getAdminLeaveWfhReportYearOptions() {
  const years = new Set([String(new Date().getFullYear())]);
  getAdminLeaveWfhEvents().forEach((event) => {
    const match = normalizeActivityDateValue(event.date).match(/^\d{2}-\d{2}-(\d{4})$/);
    if (match) years.add(match[1]);
  });
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}
function getAdminLeaveWfhReportDateRange() {
  const mode = state.adminLeaveWfhReportDateMode || "all";
  if (mode === "month") return getFullMonthDateRange(state.adminLeaveWfhReportMonth || new Date().toISOString().slice(0, 7));
  if (mode === "year") {
    const year = /^\d{4}$/.test(String(state.adminLeaveWfhReportYear || "")) ? String(state.adminLeaveWfhReportYear) : String(new Date().getFullYear());
    return { from: `01-01-${year}`, to: `31-12-${year}` };
  }
  if (mode === "custom") {
    return {
      from: normalizeActivityDateValue(state.adminLeaveWfhReportFrom || ""),
      to: normalizeActivityDateValue(state.adminLeaveWfhReportTo || "")
    };
  }
  return { from: "", to: "" };
}
function getAdminLeaveWfhReportFilterLabel() {
  const mode = state.adminLeaveWfhReportDateMode || "all";
  if (mode === "month") return `Month: ${getMonthLabel(state.adminLeaveWfhReportMonth)}`;
  if (mode === "year") return `Year: ${state.adminLeaveWfhReportYear || new Date().getFullYear()}`;
  if (mode === "custom") {
    const range = getAdminLeaveWfhReportDateRange();
    if (range.from && range.to) return `${range.from} to ${range.to}`;
    if (range.from) return `From ${range.from}`;
    if (range.to) return `Until ${range.to}`;
    return "Custom dates";
  }
  return "All time";
}

function getAdminLeaveWfhPortalReportRows() {
  const search = String(state.adminLeaveWfhReportSearch || "").trim().toLowerCase();
  const employeeFilter = state.adminLeaveWfhReportEmployeeId || "";
  const dateRange = getAdminLeaveWfhReportDateRange();
  const fromDate = normalizeActivityDateValue(dateRange.from || "");
  const toDate = normalizeActivityDateValue(dateRange.to || "");
  const typeFilter = state.adminLeaveWfhReportType || "";
  const employeeById = new Map((state.employees || []).map((employee) => [employee.id, employee]));
  const eventTypeKey = (event) => event.kind === "wfh" ? "wfh" : getLeaveTypeConfig(event.type).key;
  return getAdminLeaveWfhEvents()
    .filter((event) => {
      const employee = employeeById.get(event.employeeId);
      const employeeSearch = `${getEmployeeDisplayName(employee) || ""} ${employee?.id || event.employeeId || ""}`.toLowerCase();
      if (employeeFilter && event.employeeId !== employeeFilter) return false;
      if (search && !employeeSearch.includes(search)) return false;
      if (fromDate && parseDateSortValue(event.date) < parseDateSortValue(fromDate)) return false;
      if (toDate && parseDateSortValue(event.date) > parseDateSortValue(toDate)) return false;
      if (typeFilter && eventTypeKey(event) !== typeFilter) return false;
      return true;
    })
    .map((event) => {
      const employee = employeeById.get(event.employeeId);
      return {
        sort: parseDateSortValue(event.date),
        date: normalizeActivityDateValue(event.date),
        employeeName: getEmployeeDisplayName(employee) || event.employeeId,
        employeeId: employee?.id || event.employeeId,
        type: getAdminLeaveWfhReportTypeLabel(eventTypeKey(event)),
        status: event.status || "Pending",
        reason: event.reason || "-"
      };
    })
    .sort((a, b) => a.sort - b.sort || a.employeeName.localeCompare(b.employeeName) || a.type.localeCompare(b.type));
}
function getAdminLeaveWfhReportEmployeeSuggestions(query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return [];
  return (state.employees || [])
    .filter((employee) => employee.status === "Active")
    .filter((employee) => `${getEmployeeDisplayName(employee)} ${employee.id} ${employee.email || ""}`.toLowerCase().includes(needle))
    .slice(0, 6);
}

function renderAdminLeaveWfhReportEmployeeSuggestionButtons(query) {
  return getAdminLeaveWfhReportEmployeeSuggestions(query)
    .map((employee) => `<button class="report-employee-suggestion" type="button" data-admin-leave-wfh-report-employee="${escapeHtml(`${getEmployeeDisplayName(employee)} ${employee.signupCode || employee.id}`)}"><strong>${escapeHtml(getEmployeeDisplayName(employee))}</strong><span>${escapeHtml(employee.signupCode || employee.id)}</span></button>`)
    .join("");
}
function renderAdminLeaveWfhReport(activeEmployees) {
  const rows = getAdminLeaveWfhPortalReportRows();
  const searchValue = state.adminLeaveWfhReportSearch || "";
  const employeeValue = state.adminLeaveWfhReportEmployeeId || "";
  const dateMode = state.adminLeaveWfhReportDateMode || "all";
  const monthValue = state.adminLeaveWfhReportMonth || new Date().toISOString().slice(0, 7);
  const yearValue = state.adminLeaveWfhReportYear || String(new Date().getFullYear());
  const fromValue = toDateInputValue(state.adminLeaveWfhReportFrom || "");
  const toValue = toDateInputValue(state.adminLeaveWfhReportTo || "");
  const typeValue = state.adminLeaveWfhReportType || "";
  const employeeOptions = [`<option value="" ${employeeValue ? "" : "selected"}>All employees</option>`, ...activeEmployees.map((employee) => `<option value="${escapeHtml(employee.id)}" ${employeeValue === employee.id ? "selected" : ""}>${escapeHtml(getEmployeeDisplayName(employee))} (${escapeHtml(employee.signupCode || employee.id)})</option>`)].join("");
  const yearOptions = getAdminLeaveWfhReportYearOptions().map((year) => `<option value="${escapeHtml(year)}" ${String(yearValue) === String(year) ? "selected" : ""}>${escapeHtml(year)}</option>`).join("");
  const monthDisabled = dateMode === "month" ? "" : "disabled";
  const yearDisabled = dateMode === "year" ? "" : "disabled";
  const customDisabled = dateMode === "custom" ? "" : "disabled";
  const rowsHtml = rows.map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.employeeName)}</td><td>${escapeHtml(row.employeeId)}</td><td>${escapeHtml(row.type)}</td><td><span class="pill ${getWfhStatusTone(row.status)}">${escapeHtml(row.status)}</span></td><td>${escapeHtml(row.reason)}</td></tr>`).join("");
  return `<div class="card admin-leave-wfh-report-card"><div class="section-header"><div><p class="eyebrow">Report</p><h2>Leave and WFH report</h2></div><span class="pill">${rows.length} records</span></div><form id="adminLeaveWfhReportFilterForm" class="admin-leave-wfh-report-filters"><div class="field"><label for="adminLeaveWfhReportEmployee">Employee</label><select id="adminLeaveWfhReportEmployee">${employeeOptions}</select></div><div class="field"><label for="adminLeaveWfhReportDateMode">Dates</label><select id="adminLeaveWfhReportDateMode"><option value="all" ${dateMode === "all" ? "selected" : ""}>All time</option><option value="month" ${dateMode === "month" ? "selected" : ""}>Month wise</option><option value="year" ${dateMode === "year" ? "selected" : ""}>Year wise</option><option value="custom" ${dateMode === "custom" ? "selected" : ""}>Custom dates</option></select></div><div class="field"><label for="adminLeaveWfhReportMonth">Month</label><input id="adminLeaveWfhReportMonth" type="month" value="${escapeHtml(monthValue)}" ${monthDisabled} /></div><div class="field"><label for="adminLeaveWfhReportYear">Year</label><select id="adminLeaveWfhReportYear" ${yearDisabled}>${yearOptions}</select></div><div class="field"><label for="adminLeaveWfhReportFrom">From</label><input id="adminLeaveWfhReportFrom" type="date" value="${escapeHtml(fromValue)}" ${customDisabled} /></div><div class="field"><label for="adminLeaveWfhReportTo">To</label><input id="adminLeaveWfhReportTo" type="date" value="${escapeHtml(toValue)}" ${customDisabled} /></div><div class="field"><label for="adminLeaveWfhReportType">Type</label><select id="adminLeaveWfhReportType"><option value="" ${typeValue ? "" : "selected"}>All types</option><option value="wfh" ${typeValue === "wfh" ? "selected" : ""}>Work From Home</option><option value="privilege" ${typeValue === "privilege" ? "selected" : ""}>Privilege Leave</option><option value="sick" ${typeValue === "sick" ? "selected" : ""}>Sick Leave</option></select></div><div class="field report-employee-search-field"><label for="adminLeaveWfhReportSearch">Search</label><input id="adminLeaveWfhReportSearch" value="${escapeHtml(searchValue)}" placeholder="Name or ID" autocomplete="off" /></div><div class="actions admin-leave-wfh-report-actions"><button class="primary-btn" type="submit">Go</button><button class="secondary-btn" type="button" id="resetAdminLeaveWfhReportFiltersBtn">Reset</button></div></form><div class="admin-activity-table-wrap admin-leave-wfh-report-wrap"><table class="admin-activity-table admin-leave-wfh-report-table"><thead><tr><th>Date</th><th>Emp name</th><th>Emp ID</th><th>Type</th><th>Status</th><th>Reason</th></tr></thead><tbody>${rowsHtml || `<tr><td colspan="6">No Leave or WFH records found for the selected filters.</td></tr>`}</tbody></table></div><div class="report-total-footer"><span>${escapeHtml(getAdminLeaveWfhReportFilterLabel())} | ${employeeValue ? "Selected employee" : "All employees"}</span><strong>${rows.length} ${rows.length === 1 ? "record" : "records"}</strong></div><p class="helper">Choose All employees with All time to view every active WFH and leave record.</p></div>`;
}
function renderAdminLeaveWfhCalendar(activeEmployees) {
  const monthValue = getAdminLeaveWfhCalendarMonth();
  const fullRange = getFullMonthDateRange(monthValue);
  const match = String(monthValue).match(/^(\d{4})-(\d{2})$/);
  const year = match ? Number(match[1]) : new Date().getFullYear();
  const month = match ? Number(match[2]) : new Date().getMonth() + 1;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const dates = getDatesInRange(fullRange.from, fullRange.to);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const minMonth = shiftMonthValue(currentMonth, -6);
  const maxMonth = shiftMonthValue(currentMonth, 6);
  const previousMonth = shiftMonthValue(monthValue, -1);
  const nextMonth = shiftMonthValue(monthValue, 1);
  const canGoPrevious = new Date(`${previousMonth}-01T00:00:00`) >= new Date(`${minMonth}-01T00:00:00`);
  const canGoNext = new Date(`${nextMonth}-01T00:00:00`) <= new Date(`${maxMonth}-01T00:00:00`);
  const events = getAdminLeaveWfhEvents();
  const selectedDate = normalizeActivityDateValue(state.adminLeaveWfhCalendarDate || todayDdMmYyyy());
  const selectedEmployeeId = state.adminLeaveWfhCalendarEmployeeId || state.selectedLeaveWfhEmployeeId || activeEmployees[0]?.id || "";
  const selectedEmployee = activeEmployees.find((employee) => employee.id === selectedEmployeeId) || activeEmployees[0] || null;
  const selectedDateEvents = events.filter((event) => normalizeActivityDateValue(event.date) === selectedDate);
  const employeeEvents = selectedEmployee ? events.filter((event) => event.employeeId === selectedEmployee.id) : [];
  const employeeById = new Map(activeEmployees.map((employee) => [employee.id, employee]));
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="leave-wfh-calendar-weekday">${day}</div>`).join("");
  const blanks = Array.from({ length: firstDay }, () => '<div class="leave-wfh-calendar-cell is-empty"></div>').join("");
  const cells = dates.map((date) => {
    const dayEvents = events.filter((event) => normalizeActivityDateValue(event.date) === date);
    const wfhCount = dayEvents.filter((event) => event.kind === "wfh").length;
    const leaveCount = dayEvents.filter((event) => event.kind === "leave").length;
    const tone = wfhCount && leaveCount ? "mixed" : wfhCount ? "wfh" : leaveCount ? "leave" : isEmployeeHolidayDate(activeEmployees[0] || {}, date) ? "holiday" : isSundayDate(date) ? "sunday" : "open";
    const isSelected = date === selectedDate;
    const label = dayEvents.length === 1 ? dayEvents[0].calendarLabel : wfhCount || leaveCount ? `${wfhCount ? `${wfhCount} WFH` : ""}${wfhCount && leaveCount ? " + " : ""}${leaveCount ? `${leaveCount} Leave` : ""}` : isSundayDate(date) ? "Sunday" : isEmployeeHolidayDate(activeEmployees[0] || {}, date) ? "Holiday" : "";
    return `<button class="leave-wfh-calendar-cell admin-calendar-cell ${tone} ${isSelected ? "selected" : ""}" type="button" data-admin-leave-wfh-date="${escapeHtml(date)}" title="${escapeHtml(label || date)}"><strong>${escapeHtml(date.slice(0, 2))}</strong>${label ? `<span>${escapeHtml(label)}</span>` : ""}</button>`;
  }).join("");
  const selectedDateRows = selectedDateEvents.map((event) => {
    const employee = employeeById.get(event.employeeId);
    return `<button class="table-row employee-row-btn" type="button" data-admin-leave-wfh-employee="${escapeHtml(event.employeeId)}"><div><strong>${escapeHtml(getEmployeeDisplayName(employee) || event.employeeId)}</strong><span class="muted">${escapeHtml(employee?.id || event.employeeId)} | ${escapeHtml(event.label)} | ${escapeHtml(event.status || "Pending")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(event.reason || "-")}</span></div><span class="pill ${event.kind === "wfh" ? "warning" : ""}">${escapeHtml(event.calendarLabel || (event.kind === "wfh" ? "WFH" : getLeaveTypeConfig(event.type).shortLabel))}</span></button>`;
  }).join("");
  const employeeRows = employeeEvents.map((event) => `<div class="table-row"><div><strong>${escapeHtml(event.date)}</strong><span class="muted">${escapeHtml(event.label)} | ${escapeHtml(event.status || "Pending")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(event.reason || "-")}</span></div><span class="pill ${getWfhStatusTone(event.status)}">${escapeHtml(event.status || "Pending")}</span></div>`).join("");
  return `<div class="card admin-leave-wfh-calendar-card"><div class="section-header"><div><p class="eyebrow">Calendar view</p><h2>Employee Leave and WFH calendar</h2></div><span class="pill">Past 6 + next 6 months</span></div><div class="leave-wfh-calendar"><div class="attendance-calendar-toolbar"><button class="secondary-btn attendance-calendar-nav" type="button" data-admin-leave-wfh-month="${escapeHtml(previousMonth)}" ${canGoPrevious ? "" : "disabled"}>Previous</button><div><h3>${escapeHtml(getMonthLabel(monthValue))}</h3><p class="helper">Click a date to see employees on WFH or leave. Click an employee to view their past and future WFH/leave records.</p></div><button class="secondary-btn attendance-calendar-nav" type="button" data-admin-leave-wfh-month="${escapeHtml(nextMonth)}" ${canGoNext ? "" : "disabled"}>Next</button></div><div class="attendance-calendar-legend"><span class="legend-dot wfh"></span>WFH<span class="legend-dot leave"></span>Leave<span class="legend-dot mixed"></span>WFH + Leave<span class="legend-dot holiday"></span>Holiday<span class="legend-dot sunday"></span>Sunday</div><div class="leave-wfh-calendar-grid">${weekdayLabels}${blanks}${cells}</div></div><div class="split leave-wfh-even-split admin-leave-wfh-drilldown"><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Selected date</p><h3>${escapeHtml(selectedDate)}</h3></div><span class="pill">${selectedDateEvents.length} records</span></div><div class="list">${selectedDateRows || emptyState("No WFH or leave records found on this date.")}</div></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Employee record</p><h3>${escapeHtml(selectedEmployee ? getEmployeeDisplayName(selectedEmployee) : "Select employee")}</h3></div><span class="pill">${employeeEvents.length} records</span></div><div class="list">${employeeRows || emptyState("Select an employee with WFH or leave records to view details.")}</div></div></div></div>`;
}
function renderEmployeeLeaveWfh(employee) {
  const requests = getEmployeeWfhRequests(employee.id).sort((a, b) => parseDateSortValue(b.date) - parseDateSortValue(a.date));
  const leaveRequests = getEmployeeLeaveRequests(employee.id).sort((a, b) => parseDateSortValue(b.date) - parseDateSortValue(a.date));
  const selectedDates = (state.leaveWfhSelectedDates || []).filter((date) => isLeaveWfhDateSelectable(employee, date).selectable);
  const requestType = state.leaveWfhRequestType || "wfh";
  const visibleCalendarMonth = getLeaveWfhCalendarMonth(employee);
  const visibleCalendarRange = getFullMonthDateRange(visibleCalendarMonth);
  const balanceDate = selectedDates[0] || visibleCalendarRange.from || todayDdMmYyyy();
  const visibleMonthWfhDates = getAcceptedWfhDatesInRange(employee.id, visibleCalendarRange.from, visibleCalendarRange.to);
  const weeklyBalanceDate = selectedDates[0] || todayDdMmYyyy();
  const baseBalance = getEmployeeWfhBalance(employee.id, weeklyBalanceDate);
  const visibleMonthWfhUsed = visibleMonthWfhDates.length;
  const visibleWeekRange = getWeekRangeForDate(weeklyBalanceDate);
  const visibleWeekWfhUsed = selectedDates[0] ? visibleMonthWfhDates.filter((date) => isDateInRange(date, visibleWeekRange.from, visibleWeekRange.to)).length : baseBalance.weekUsed;
  const adjustedWeekUsed = visibleWeekWfhUsed;
  const adjustedWeekRemaining = Math.max(0, baseBalance.weeklyLimit - visibleWeekWfhUsed);
  const balance = { ...baseBalance, weekUsed: adjustedWeekUsed, weekRemaining: adjustedWeekRemaining, monthUsed: visibleMonthWfhUsed, monthRemaining: Math.max(0, baseBalance.monthlyLimit - visibleMonthWfhUsed) };
  const leaveBalance = getEmployeeLeaveBalance(employee.id, balanceDate);
  const requestTypeOptions = [{ key: "wfh", label: "Work From Home" }, ...LEAVE_TYPES].map((type) => `<option value="${escapeHtml(type.key)}" ${requestType === type.key ? "selected" : ""}>${escapeHtml(type.label)}</option>`).join("");
  const selectedPills = selectedDates.map((date) => `<span class="pill selected">${escapeHtml(date)}<button type="button" data-leave-wfh-remove-date="${escapeHtml(date)}" aria-label="Remove ${escapeHtml(date)}">&times;</button></span>`).join("");
  return `<div class="stack leave-wfh-redesign"><div class="card"><div class="section-header"><div><p class="eyebrow">Leave and WFH</p><h2>Request calendar</h2></div><span class="pill">Next ${getCalendarRequestWindowMonths()} months only</span></div>${renderLeaveWfhCalendar(employee)}<div class="actions" style="margin-top:14px;"><button class="secondary-btn" type="button" id="downloadTeamLeaveWfhExcelBtn" disabled title="Employee download is disabled for now">Download team Leave/WFH Excel</button></div><div class="leave-wfh-request-panel"><div class="section-header"><div><p class="eyebrow">Request details</p><h3>${selectedDates.length ? `${selectedDates.length} date(s) selected` : "Select date(s) from calendar"}</h3></div><span class="pill">${balance.weekRemaining} weekly WFH left</span></div><div class="selected-date-strip">${selectedPills || '<span class="muted">No dates selected yet.</span>'}</div><form id="leaveWfhCalendarRequestForm" class="stack"><div class="grid-2"><div class="field"><label for="leaveWfhCalendarRequestType">Choose request type *</label><select id="leaveWfhCalendarRequestType">${requestTypeOptions}</select></div><div class="field"><label>Request flow</label><div class="empty-state">Notification will go to admin and your group members.</div></div></div><div class="field"><label for="leaveWfhCalendarReason">Reason *</label><textarea id="leaveWfhCalendarReason">${escapeHtml(state.leaveWfhRequestReason || "")}</textarea></div><div class="actions"><button class="primary-btn" type="submit" ${selectedDates.length ? "" : "disabled"}>Send request</button><button class="secondary-btn" type="button" id="clearLeaveWfhSelectionBtn" ${selectedDates.length ? "" : "disabled"}>Clear selected dates</button></div></form></div></div><div class="card"><div class="section-header"><div><p class="eyebrow">Balance</p><h2>WFH and leave balance</h2></div><span class="pill">${balance.monthRemaining} monthly WFH left</span></div>${renderWfhBalanceVisual(balance)}${renderLeaveBalanceVisual(leaveBalance)}<div class="kpi-grid wfh-balance-kpis"><div class="kpi"><p class="subtle">Yearly WFH taken</p><p class="value">${balance.yearUsed}</p></div><div class="kpi"><p class="subtle">Privilege Leave left</p><p class="value">${leaveBalance.privilegeRemaining}</p></div><div class="kpi"><p class="subtle">Sick Leave left</p><p class="value">${leaveBalance.sickRemaining}</p></div><div class="kpi"><p class="subtle">Yearly leaves taken</p><p class="value">${leaveBalance.totalUsed}</p></div></div><p class="helper">Yearly data shown for ${escapeHtml(balance.year)}.</p><div class="leave-carry-forward-note"><span>Carry-forward rule</span><strong>Balance leaves will be carried forward to the next year.</strong></div></div><div class="split"><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>Previous WFH requests</h2></div><span class="pill">${requests.length} records</span></div><div class="list">${requests.map((request) => `<div class="table-row"><div><strong>${escapeHtml(request.date)}</strong><span class="muted">Work From Home | ${escapeHtml(request.submittedAt || "-")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions"><span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span>${canRevokeWfhRequest(request) ? `<button class="secondary-btn" type="button" data-wfh-revoke-id="${request.id}">Revoke</button>` : ""}</div></div>`).join("") || emptyState("No WFH requests raised yet.")}</div></div><div class="card"><div class="section-header"><div><p class="eyebrow">History</p><h2>Previous leave requests</h2></div><span class="pill">${leaveRequests.length} records</span></div><div class="list">${leaveRequests.map((request) => `<div class="table-row"><div><strong>${escapeHtml(request.date)}</strong><span class="muted">${escapeHtml(getLeaveTypeConfig(request.type).label)} | ${escapeHtml(request.submittedAt || "-")}</span><span class="muted"><strong>Reason</strong> ${escapeHtml(request.reason || "-")}</span></div><div class="actions"><span class="pill ${getWfhStatusTone(request.status)}">${escapeHtml(request.status || "Pending")}</span>${canRevokeLeaveRequest(request) ? `<button class="secondary-btn" type="button" data-leave-revoke-id="${request.id}">Revoke</button>` : ""}</div></div>`).join("") || emptyState("No leave requests raised yet.")}</div></div></div></div>`;
}


function isActivityRowStale(row) {
  if (!row || row.workflowStatus === "submitted") return false;
  const rowDate = parseDateSortValue(row.values?.date || "");
  if (rowDate === Number.MAX_SAFE_INTEGER) return false;
  const threshold = new Date();
  threshold.setMonth(threshold.getMonth() - 1);
  const status = String(row.values?.status || "").trim().toLowerCase();
  const hasProgressStatus = status && !["-", "not started", "pending", "open", "to do", "todo"].includes(status);
  const hasProgressDate = Boolean(String(row.values?.actual_end_date || row.values?.final_remarks || "").trim());
  return rowDate <= threshold.getTime() && !hasProgressStatus && !hasProgressDate;
}
function renderEmployeeActivity(employee, activityCount) {
  return `<div class="stack"><div class="card"><div class="section-header"><div><p class="eyebrow">Activity</p><h2>${escapeHtml(state.activityTemplate.title)}</h2></div><div class="actions"><button class="secondary-btn" type="button" id="downloadEmployeeActivityExcelBtn">Download Excel</button><span class="pill">${activityCount} rows</span></div></div><p class="muted">${escapeHtml(state.activityTemplate.instructions)}</p>${renderEmployeeActivityTable(employee)}<div class="actions sheet-toolbar"><button class="secondary-btn" type="button" id="addActivityRowBtn">Add new row</button><span class="pill warning">${employee.activities.filter((row) => row.workflowStatus !== "submitted").length} draft</span><span class="pill success">${employee.activities.filter((row) => row.workflowStatus === "submitted").length} submitted</span></div><div class="sheet-footer"><p class="helper">Select one or more draft rows, enter or update their cells, then choose Save or Submit. Submitted rows cannot be edited again.</p><div class="actions"><button class="secondary-btn" type="button" id="saveActivityRowBtn">Save</button><button class="primary-btn" type="button" id="submitActivityRowBtn">Submit</button></div></div></div></div>`;
}
function renderEmployeeActivityTable(employee) {
  const fields = state.activityTemplate.fields;
  return `<div class="admin-activity-table-wrap"><table class="activity-sheet"><thead><tr><th class="sticky-col sticky-col-select">Select</th>${fields.map((field) => `<th class="${field.key === "sl_no" ? "sticky-col sticky-col-slno" : field.key === "date" ? "sticky-col sticky-col-date" : ""}">${escapeHtml(field.label)}${field.required ? " *" : ""}</th>`).join("")}<th>Row status</th><th>Last update</th><th>Delete</th></tr></thead><tbody>${employee.activities.map((row) => renderEmployeeActivityRow(row, fields)).join("")}</tbody></table></div>`;
}
function renderEmployeeActivityRow(row, fields) {
  const editable = row.workflowStatus !== "submitted";
  const rowClass = `${editable ? "sheet-row-draft" : "sheet-row-submitted"}${isActivityRowStale(row) ? " sheet-row-stale" : ""}`;
  return `<tr class="${rowClass}" data-activity-row="${row.rowId}"><td class="sticky-col sticky-col-select">${editable ? `<input type="checkbox" name="activeActivityRow" value="${row.rowId}" />` : `<span class="pill success">Locked</span>`}</td>${fields.map((field) => renderEmployeeActivityCell(field, row, editable)).join("")}<td>${row.workflowStatus === "submitted" ? "Submitted" : "Draft"}</td><td>${escapeHtml(formatDate(row.submittedAt || row.savedAt || todayDdMmYyyy()))}</td><td>${editable ? `<button class="activity-delete-btn" type="button" data-delete-activity-row="${row.rowId}" title="Delete row" aria-label="Delete activity row">&#128465;</button>` : ""}</td></tr>`;
}
function renderEmployeeActivityCell(field, row, editable) {
  const sticky = field.key === "sl_no" ? "sticky-col sticky-col-slno" : field.key === "date" ? "sticky-col sticky-col-date" : "";
  const value = field.key === "sl_no" ? row.slNo : row.values[field.key] || "";
  if (!editable || field.readOnly || field.key === "sl_no") return `<td class="${sticky}">${escapeHtml(value || "-")}</td>`;
  const id = `activity_${row.rowId}_${field.key}`;
  if (field.type === "groupClient") return renderActivityGroupClientPicker(id, value, sticky);
  if (field.type === "textarea") return `<td class="${sticky}"><textarea id="${id}" class="sheet-input sheet-area">${escapeHtml(value)}</textarea></td>`;
  if (field.type === "select") return `<td class="${sticky}"><select id="${id}" class="sheet-input">${renderSelectOptions(field, value)}</select></td>`;
  const type = field.type === "number" ? "number" : "text";
  const placeholder = field.type === "date" ? ' placeholder="dd-mm-yyyy"' : "";
  return `<td class="${sticky}"><input id="${id}" class="sheet-input" type="${type}" value="${escapeHtml(value)}"${placeholder} /></td>`;
}
function renderActivityGroupClientPicker(id, value, sticky) {
  const options = getGroupClientOptions();
  const selectedValue = options.includes(value) ? value : "";
  const displayValue = selectedValue || value || "";
  const optionRows = options.map((option) => `<button class="activity-group-client-option" type="button" data-activity-group-client-option="${escapeHtml(option)}" data-search-text="${escapeHtml(option.toLowerCase())}">${escapeHtml(option)}</button>`).join("");
  return `<td class="${sticky}"><div class="activity-group-client-picker" data-activity-group-client-picker><button class="activity-group-client-toggle" type="button" data-activity-group-client-toggle aria-label="Show Group/Client list">&#9662;</button><input id="${id}_search" class="sheet-input activity-group-client-search" data-activity-group-client-search="${id}" value="${escapeHtml(displayValue)}" placeholder="Search Group/Client" autocomplete="off" /><input id="${id}" type="hidden" value="${escapeHtml(selectedValue)}" data-activity-group-client-value /><div class="activity-group-client-options hidden">${optionRows}</div><span class="group-search-empty hidden">No matching Group/Client found.</span></div></td>`;
}
function renderSelectOptions(field, selectedValue) { return [`<option value="">Select value</option>`, ...(field.options || []).map((option) => `<option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>`)].join(""); }
function parseStructuredEntries(serialized, headers) {
  const lines = String(serialized || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => {
    const row = Object.fromEntries(headers.map((header) => [header, ""]));
    line.split(/;\s*/).forEach((part) => {
      const idx = part.indexOf(":");
      if (idx === -1) return;
      const label = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (headers.includes(label)) row[label] = value;
    });
    return row;
  }).filter((row) => !isStructuredHeaderRow(row, headers));
}
function isStructuredHeaderRow(row, headers) {
  const values = headers.map((header) => String(row?.[header] || "").trim().toLowerCase());
  return values.length > 0 && values.every((value, index) => value === String(headers[index] || "").trim().toLowerCase());
}
function serializeStructuredEntries(rows, headers) {
  return rows.filter((row) => !isStructuredHeaderRow(row, headers)).map((row) => headers.map((header) => row?.[header] ? `${header}: ${row[header]}` : "").filter(Boolean).join("; ")).filter(Boolean).join("\n");
}
function createStructuredEntryRow(tableKey, headers, displayHeaders, row, rowIndex, locked) {
  const deleteCell = locked ? "" : `<td class="structured-row-action-cell"><button class="secondary-btn structured-row-delete-btn" type="button" data-delete-structured-row="${tableKey}" data-delete-row-index="${rowIndex}" aria-label="Delete row" title="Delete row">&#128465;</button></td>`;
  return `<tr>${headers.map((header, index) => `<td><input class="sheet-input" data-structured-table="${tableKey}" data-structured-row="${rowIndex}" data-structured-header="${escapeHtml(header)}" value="${escapeHtml((row && row[header]) || "")}" ${locked ? "disabled" : ""} /></td>`).join("")}${deleteCell}</tr>`;
}
function reindexStructuredTableRows(tableKey) {
  app.querySelectorAll(`[data-structured-body="${tableKey}"] tr`).forEach((row, rowIndex) => {
    row.querySelectorAll(`[data-structured-table="${tableKey}"]`).forEach((input) => {
      input.dataset.structuredRow = String(rowIndex);
    });
    const deleteBtn = row.querySelector(`[data-delete-structured-row="${tableKey}"]`);
    if (deleteBtn) deleteBtn.dataset.deleteRowIndex = String(rowIndex);
  });
}
function renderStructuredEntriesTable(config, serialized, locked) {
  const displayHeaders = config.displayHeaders || config.headers;
  const parsedRows = parseStructuredEntries(serialized, config.headers);
  const rows = parsedRows.length ? parsedRows : [Object.fromEntries(config.headers.map((header) => [header, ""]))];
  const hiddenStyle = config.hidden ? ` style="display:none;"` : "";
  const actionHeader = locked ? "" : `<th class="structured-row-action-cell">Action</th>`;
  return `<div class="subtle-card" data-structured-card="${config.key}"${hiddenStyle}><div class="section-header"><div><p class="eyebrow">${escapeHtml(config.eyebrow)}</p><h3>${escapeHtml(config.title)}</h3></div>${locked ? "" : `<button class="secondary-btn" type="button" data-add-structured-row="${config.key}">+ Add row</button>`}</div><div class="admin-activity-table-wrap"><table class="admin-activity-table profile-detail-table"><thead><tr>${displayHeaders.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}${actionHeader}</tr></thead><tbody data-structured-body="${config.key}">${rows.map((row, rowIndex) => createStructuredEntryRow(config.key, config.headers, displayHeaders, row, rowIndex, locked)).join("")}</tbody></table></div></div>`;
}
function getProfileFieldMeta(employee) {
  return Object.fromEntries(getOnboardingFieldEntries(employee).map((field) => [field.key, field]));
}
function getFieldLabel(meta, key, fallback) {
  return meta[key]?.label || fallback;
}
function areProfileAddressesSame(details) {
  const hasPresentAddress = PRESENT_ADDRESS_KEYS.some((key) => String(details[key] || "").trim());
  return hasPresentAddress && PRESENT_ADDRESS_KEYS.every((key, index) => String(details[key] || "").trim() === String(details[PERMANENT_ADDRESS_KEYS[index]] || "").trim());
}
function renderProfileFieldControl(field, value, locked) {
  if (field.key === "maritalStatus") return `<select id="profile_detail_${field.key}" class="profile-row-input" data-profile-detail-key="${field.key}" ${locked ? "disabled" : ""}>${["", ...MARITAL_STATUS_OPTIONS].map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option || "Select marital status")}</option>`).join("")}</select>`;
  if (field.key === "experienceType") return `<select id="profile_detail_${field.key}" class="profile-row-input" data-profile-detail-key="${field.key}" ${locked ? "disabled" : ""}>${["", ...EXPERIENCE_OPTIONS].map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option || "Select experience type")}</option>`).join("")}</select>`;
  if (field.key === "pfAvailable") return `<select id="profile_detail_${field.key}" class="profile-row-input" data-profile-detail-key="${field.key}" ${locked ? "disabled" : ""}>${["", ...YES_NO_OPTIONS].map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option || "Select PF availability")}</option>`).join("")}</select>`;
  if (field.key === "dateOfBirth") return `<input id="profile_detail_${field.key}" class="profile-row-input" data-profile-detail-key="${field.key}" value="${escapeHtml(value)}" placeholder="dd-mm-yyyy" ${locked ? "disabled" : ""} />`;
  const isLong = /AddressLine|address|remarks|details/i.test(field.key);
  return isLong
    ? `<textarea id="profile_detail_${field.key}" class="profile-row-input profile-row-textarea" data-profile-detail-key="${field.key}" ${locked ? "disabled" : ""}>${escapeHtml(value)}</textarea>`
    : `<input id="profile_detail_${field.key}" class="profile-row-input" data-profile-detail-key="${field.key}" value="${escapeHtml(value)}" ${locked ? "disabled" : ""} />`;
}
function renderProfileFieldRow(field, employee, locked, options = {}) {
  const value = employee.onboardingDetails[field.key] || "";
  const label = `${field.label}${field.required ? " *" : ""}`;
  const isLong = /AddressLine|address|remarks|details/i.test(field.key);
  const extraClass = options.wide ? ' profile-row-wide' : '';
  return `<div class="list-item profile-row profile-row-${isLong ? "multiline" : "single"}${extraClass}" data-profile-field-row="${field.key}"><strong>${escapeHtml(label)}</strong><div class="profile-row-control${options.wide ? ' wide' : ''}">${renderProfileFieldControl(field, value, locked)}</div></div>`;
}
function renderFieldGroup(meta, employee, keys, locked, options = {}) {
  return keys.map((key) => meta[key]).filter(Boolean).map((field) => renderProfileFieldRow(field, employee, locked, options)).join("");
}
function renderOnboardingInfoRows(employee, locked) {
  const meta = getProfileFieldMeta(employee);
  const sameAsPresent = areProfileAddressesSame(employee.onboardingDetails);
  const experienceValue = employee.onboardingDetails.experienceType || "";
  const personalRows = renderFieldGroup(meta, employee, PERSONAL_DETAIL_KEYS, locked);
  const presentRows = renderFieldGroup(meta, employee, PRESENT_ADDRESS_KEYS, locked, { wide: true });
  const permanentRows = renderFieldGroup(meta, employee, PERMANENT_ADDRESS_KEYS, locked, { wide: true });
  const bankRows = renderFieldGroup(meta, employee, BANK_DETAIL_KEYS, locked);
  const employmentRows = EMPLOYMENT_DETAIL_KEYS.map((key) => meta[key]).filter(Boolean).map((field) => renderProfileFieldRow(field, employee, locked)).join("");
  return `<div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Personal details</p><h3>Personal details</h3></div></div><div class="stack">${personalRows}<div class="section-header profile-subsection"><div><p class="eyebrow">Address</p><h3>Present address</h3></div></div>${presentRows}<div class="section-header profile-subsection"><div><p class="eyebrow">Address</p><h3>Permanent address</h3></div><label class="sheet-select-all"><input id="sameAsPresentAddress" type="checkbox" ${sameAsPresent ? "checked" : ""} ${locked ? "disabled" : ""} />Same as present address</label></div>${permanentRows}</div></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Bank details</p><h3>Bank details</h3></div></div><div class="stack">${bankRows}</div></div><div class="subtle-card"><div class="section-header"><div><p class="eyebrow">Employment</p><h3>Employment details</h3></div></div><div class="stack">${employmentRows}</div></div>`;
}
function renderAttachmentUploadSection(employee, locked) {
  return `<div class="subtle-card" data-attachment-card="true"><div class="section-header"><div><p class="eyebrow">Attachments</p><h3>Upload employee documents</h3></div><span class="pill">${PROFILE_ATTACHMENT_REQUIREMENTS.filter(i => i.required !== false).length} mandatory items</span></div><div class="admin-activity-table-wrap"><table class="admin-activity-table profile-attachment-table"><thead><tr><th>Required document</th><th>Upload</th><th>Current file</th></tr></thead><tbody>${PROFILE_ATTACHMENT_REQUIREMENTS.map((item) => { const current = employee.attachments?.[item.key]; const reqStar = item.required !== false ? " *" : ""; return `<tr data-attachment-row="${item.key}"><td>${escapeHtml(item.label)}${reqStar}</td><td><input type="file" data-attachment-key="${item.key}" ${locked ? "disabled" : ""} /></td><td>${current ? `<span class="pill success">${escapeHtml(current.fileName)}</span><div class="muted">${escapeHtml(current.uploadedAt || "")}</div>${current.savedFileId ? `<button type="button" class="link-btn" style="padding:4px 0; margin-right: 8px;" onclick="viewSecureAttachment('${escapeHtml(current.savedFileId)}', '${escapeHtml(current.fileName)}')">View</button><button type="button" class="link-btn" style="padding:4px 0;" onclick="downloadSecureAttachment('${escapeHtml(current.savedFileId)}', '${escapeHtml(current.fileName)}')">Download</button>` : ''}` : `<span class="muted">Not uploaded</span>`}</td></tr>`; }).join("")}</tbody></table></div></div>`;
}
function validateStructuredTableRows(rows, headers, requireFirstRow) {
  const normalized = rows.map((row) => row || {});
  if (requireFirstRow && !normalized.length) return false;
  return normalized.every((row, index) => {
    const values = headers.map((header) => String(row[header] || "").trim());
    const hasAny = values.some(Boolean);
    if (!hasAny) return !requireFirstRow || index !== 0;
    return values.every(Boolean);
  });
}
function clearProfileValidationState() {
  app.querySelectorAll(".profile-row.is-missing").forEach((node) => node.classList.remove("is-missing"));
  app.querySelectorAll(".subtle-card.is-missing").forEach((node) => node.classList.remove("is-missing"));
  app.querySelectorAll(".sheet-input.is-missing").forEach((node) => node.classList.remove("is-missing"));
  app.querySelectorAll(".profile-row-input.is-missing").forEach((node) => { node.classList.remove("is-missing"); node.removeAttribute("aria-invalid"); });
  app.querySelectorAll(".profile-attachment-table tr.is-missing").forEach((node) => node.classList.remove("is-missing"));
}
function markProfileFieldMissing(fieldKey) {
  app.querySelector(`[data-profile-field-row="${fieldKey}"]`)?.classList.add("is-missing");
  const input = app.querySelector(`#profile_detail_${fieldKey}`);
  if (input) {
    input.classList.add("is-missing");
    input.setAttribute("aria-invalid", "true");
  }
}
function markStructuredSectionMissing(tableKey) {
  app.querySelector(`[data-structured-card="${tableKey}"]`)?.classList.add("is-missing");
  app.querySelectorAll(`[data-structured-table="${tableKey}"]`).forEach((input) => {
    if (!String(input.value || "").trim()) input.classList.add("is-missing");
  });
}
function markAttachmentMissing(key) {
  app.querySelector('[data-attachment-card="true"]')?.classList.add("is-missing");
  app.querySelector(`[data-attachment-row="${key}"]`)?.classList.add("is-missing");
}
function renderOnboardingFields(existingDetails = {}) { return state.onboardingTemplate.fields.map((field) => { const value = existingDetails[field.key] || ""; return field.type === "textarea" ? `<div class="field"><label for="onboarding_${field.key}">${escapeHtml(field.label)}${field.required ? " *" : ""}</label><textarea id="onboarding_${field.key}" ${field.required ? "required" : ""}>${escapeHtml(value)}</textarea></div>` : `<div class="field"><label for="onboarding_${field.key}">${escapeHtml(field.label)}${field.required ? " *" : ""}</label><input id="onboarding_${field.key}" value="${escapeHtml(value)}" ${field.required ? "required" : ""} /></div>`; }).join(""); }
function renderOnboardingSummary(employee) { if (!employee.hiring.onboardingSubmittedAt) return emptyState("Employee has not submitted onboarding details yet."); return getOnboardingFieldEntries(employee).map((field) => `<div class="list-item"><strong>${escapeHtml(field.label)}${field.required ? " *" : ""}</strong><span>${escapeHtml(employee.onboardingDetails[field.key] || "-")}</span></div>`).join(""); }
function renderAttendanceRow(record, employee) { return `<div class="table-row"><div><strong>${employee ? escapeHtml(getEmployeeDisplayName(employee)) : escapeHtml(record.type)}</strong><span class="muted">${escapeHtml(record.type)} | ${escapeHtml(record.date)} | ${escapeHtml(record.time)}</span></div><div class="stack" style="gap:6px;"><span class="pill">${escapeHtml(String(record.latitude || "-"))}, ${escapeHtml(String(record.longitude || "-"))}</span>${record.officeDistanceMeters != null ? `<span class="pill success">Office distance ${escapeHtml(String(record.officeDistanceMeters))} m</span>` : ""}</div></div>`; }
function renderEmailLogRow(entry) { return `<div class="table-row"><div><strong>${escapeHtml(entry.employeeName)}</strong><span class="muted">${escapeHtml(entry.employeeEmail)} | ${escapeHtml(entry.sentAt)}</span></div><div class="stack" style="gap:6px;"><span class="pill">${escapeHtml(entry.subject)}</span></div></div>`; }
function showModalMessage(title, message, tone = "danger", showSuccessTick = false, buttonLabel = "Close") {
  const existing = document.querySelector("[data-modal-overlay='true']");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.setAttribute("data-modal-overlay", "true");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(15, 23, 42, 0.38)";
  overlay.style.display = "grid";
  overlay.style.placeItems = "center";
  overlay.style.padding = "24px";
  overlay.style.zIndex = "9999";
  const box = document.createElement("div");
  box.style.width = "min(520px, 100%)";
  box.style.background = "#ffffff";
  box.style.borderRadius = "20px";
  box.style.border = tone === "danger" ? "2px solid rgba(207, 63, 95, 0.45)" : "2px solid rgba(21, 128, 61, 0.28)";
  box.style.boxShadow = "0 24px 60px rgba(15, 23, 42, 0.18)";
  box.style.padding = "24px";
  const successTick = tone === "success" && showSuccessTick ? `<div style="width:56px;height:56px;border-radius:999px;background:#dcfce7;color:#15803d;display:grid;place-items:center;font-size:30px;font-weight:700;">&#10003;</div>` : "";
  box.innerHTML = `<div style="display:grid;gap:12px;">${successTick}<p class="eyebrow" style="margin:0;">${escapeHtml(tone === "danger" ? "Attention required" : "Update")}</p><h3 style="margin:0;">${escapeHtml(title)}</h3><p style="margin:0;color:#51627f;line-height:1.65;white-space:pre-line;">${escapeHtml(message)}</p><div style="display:flex;justify-content:flex-end;"><button type="button" class="primary-btn" id="modalCloseBtn">${escapeHtml(buttonLabel)}</button></div></div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  box.querySelector("#modalCloseBtn")?.addEventListener("click", close);
}

function bindTicketEvents() {
  app.querySelectorAll("[data-ticket-login-type]").forEach((button) => {
    button.addEventListener("click", () => setState({ ticketLoginType: button.dataset.ticketLoginType || "employee" }));
  });
  app.querySelector("#ticketLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = app.querySelector("#ticketLoginEmail")?.value.trim().toLowerCase();
    const password = app.querySelector("#ticketLoginPassword")?.value;
    const role = state.ticketLoginType || "employee";
    const user = getTicketDirectory().find((item) => item.role === role && item.email.toLowerCase() === email && item.password === password);
    if (!user) {
      showModalMessage("Ticket login not completed", "The email or password does not match the current Raise Ticket credentials.");
      return;
    }
    setState({ ticketSession: { role: user.role, email: user.email, name: user.name, id: user.id }, ticketSection: getTicketActiveSection(), ticketProfileOpen: false });
  });
  app.querySelectorAll("[data-ticket-section]").forEach((button) => {
    button.addEventListener("click", () => setState({ ticketSection: button.dataset.ticketSection || "dashboard", ticketProfileOpen: false }));
  });
  app.querySelectorAll("[data-ticket-filter]").forEach((button) => {
    button.addEventListener("click", () => setState({ ticketFilter: button.dataset.ticketFilter || "assigned", ticketSection: "tickets", ticketProfileOpen: false }));
  });
  app.querySelector("#ticketGroup")?.addEventListener("change", (event) => setState({ ticketDraftGroupId: event.target.value, ticketSection: "raise", ticketProfileOpen: false }));
  app.querySelector("#ticketGroupSearch")?.addEventListener("input", (event) => {
    const term = event.target.value.trim().toLowerCase();
    app.querySelectorAll("#ticketGroup option").forEach((option) => {
      option.hidden = term && !String(option.dataset.search || option.textContent || "").toLowerCase().includes(term);
    });
  });
  app.querySelectorAll(".ticket-member-search").forEach((input) => {
    input.addEventListener("input", () => {
      const term = input.value.trim().toLowerCase();
      input.closest(".ticket-member-search-scope")?.querySelectorAll(".ticket-member-row").forEach((row) => {
        row.hidden = term && !String(row.dataset.search || row.textContent || "").toLowerCase().includes(term);
      });
    });
  });
  app.querySelector("#ticketGroupCreateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.ticketSession?.role !== "admin") return;
    const name = app.querySelector("#ticketGroupName")?.value.trim();
    const selectedMembers = Array.from(app.querySelectorAll(".ticketCreateMemberCheck:checked")).map((input) => input.value).filter(Boolean);
    if (!name || !selectedMembers.length) {
      showModalMessage("Ticket group is incomplete", "Please enter the group name and choose at least one member.");
      return;
    }
    if (getTicketGroupOptions().some((group) => group.name.toLowerCase() === name.toLowerCase())) {
      showModalMessage("Ticket group already exists", "Please use a different group name. Duplicate group names are not allowed.");
      return;
    }
    const group = { id: `TKG-${Date.now()}`, name, memberEmails: selectedMembers, createdAt: buildTimestamp() };
    const notifications = createTicketHrmsEmployeeNotifications(selectedMembers, "Added to Raise Ticket group", `You were added to ${name} in Raise Ticket.`);
    setState({ ticketGroups: [group, ...(state.ticketGroups || [])], notifications: [...notifications, ...(state.notifications || [])], ticketDraftGroupId: group.id, ticketSection: "raise", ticketProfileOpen: false });
    showModalMessage("Ticket group created", `${name} is now available in the Raise Ticket group dropdown.`, "success");
  });
  app.querySelectorAll("[data-ticket-remove-member]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedGroup = getSelectedTicketGroup();
      if (state.ticketSession?.role !== "admin" || selectedGroup?.source !== "ticket") return;
      const email = button.dataset.ticketRemoveMember;
      const updatedGroups = (state.ticketGroups || []).map((group) => group.id === selectedGroup.id ? { ...group, memberEmails: (group.memberEmails || []).filter((memberEmail) => memberEmail !== email) } : group);
      const notification = createTicketHrmsEmployeeNotification(email, "Removed from Raise Ticket group", `You were removed from ${selectedGroup.name} in Raise Ticket.`);
      setState({ ticketGroups: updatedGroups, notifications: notification ? [notification, ...(state.notifications || [])] : state.notifications, ticketSection: "raise", ticketProfileOpen: false });
    });
  });
  app.querySelector("#ticketAddMembersBtn")?.addEventListener("click", () => {
    const selectedGroup = getSelectedTicketGroup();
    if (state.ticketSession?.role !== "admin" || selectedGroup?.source !== "ticket") return;
    const selectedMembers = Array.from(app.querySelectorAll(".ticketAddMemberCheck:checked")).map((input) => input.value).filter(Boolean);
    if (!selectedMembers.length) {
      showModalMessage("No members selected", "Please choose one or more members to add to the group.");
      return;
    }
    const updatedGroups = (state.ticketGroups || []).map((group) => {
      if (group.id !== selectedGroup.id) return group;
      return { ...group, memberEmails: Array.from(new Set([...(group.memberEmails || []), ...selectedMembers])) };
    });
    const notifications = createTicketHrmsEmployeeNotifications(selectedMembers, "Added to Raise Ticket group", `You were added to ${selectedGroup.name} in Raise Ticket.`);
    setState({ ticketGroups: updatedGroups, notifications: [...notifications, ...(state.notifications || [])], ticketSection: "raise", ticketProfileOpen: false });
  });
  app.querySelector("#ticketDeleteGroupBtn")?.addEventListener("click", () => {
    const selectedGroup = getSelectedTicketGroup();
    if (state.ticketSession?.role !== "admin" || selectedGroup?.source !== "ticket") return;
    const updatedGroups = (state.ticketGroups || []).filter((group) => group.id !== selectedGroup.id);
    const nextGroup = getTicketGroupOptions().filter((group) => group.id !== selectedGroup.id)[0];
    setState({ ticketGroups: updatedGroups, ticketDraftGroupId: nextGroup?.id || "", ticketSection: "raise", ticketProfileOpen: false });
    showModalMessage("Ticket group deleted", `${selectedGroup.name} has been removed from Raise Ticket groups.`, "success");
  });
  app.querySelector("#ticketProfileBtn")?.addEventListener("click", () => setState({ ticketProfileOpen: !state.ticketProfileOpen, ticketSection: state.ticketSection || "dashboard" }));
  app.querySelector("#ticketLogoutBtn")?.addEventListener("click", () => setState({ ticketSession: null, ticketProfileOpen: false, ticketSection: getTicketActiveSection() }));
  app.querySelector("#ticketUserForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.ticketSession?.role !== "admin") return;
    const name = app.querySelector("#ticketUserName")?.value.trim();
    const email = app.querySelector("#ticketUserEmail")?.value.trim().toLowerCase();
    const clientName = app.querySelector("#ticketUserClientName")?.value.trim();
    const mobileNumber = app.querySelector("#ticketUserMobile")?.value.trim();
    const password = app.querySelector("#ticketUserPassword")?.value.trim() || TEMP_PASSWORD;
    const role = "employee";
    if (!name || !email || !clientName || !mobileNumber || !password) {
      showModalMessage("Ticket user is incomplete", "Please enter name, email, client name, mobile number, and password before adding the ticket user.");
      return;
    }
    if (getTicketDirectory().some((user) => user.email.toLowerCase() === email)) {
      showModalMessage("Ticket user already exists", "This email is already available in Raise Ticket through HRMS sync or ticket-only access.");
      return;
    }
    const ticketUser = { id: `TKT-${Date.now()}`, name, email, password, role, clientName, mobileNumber, department: clientName, createdAt: buildTimestamp() };
    setState({ ticketUsers: [ticketUser, ...(state.ticketUsers || [])], ticketSection: "users", ticketProfileOpen: false });
    showModalMessage("Ticket user added", `${name} can now log in to Raise Ticket.`, "success");
  });
  app.querySelector("#ticketRaiseForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const subject = app.querySelector("#ticketSubject")?.value.trim();
    if (!subject) {
      showModalMessage("Ticket is incomplete", "Please enter the ticket subject before creating the ticket.");
      return;
    }
    const currentUser = getCurrentTicketUser();
    const selectedGroup = getTicketGroupOptions().find((group) => group.id === (app.querySelector("#ticketGroup")?.value || ""));
    const selectedAgentEmail = app.querySelector("#ticketAgent")?.value || "";
    const selectedAgent = getTicketDirectory().find((user) => user.email === selectedAgentEmail);
    const selectedAgentName = selectedAgent?.name || "Unassigned";
    const nextNumber = Math.max(700, ...(state.ticketTickets || []).map((ticket) => Number(String(ticket.id || "").replace(/\D/g, "")) || 0)) + 1;
    const ticket = {
      id: `#${nextNumber}`,
      subject,
      category: app.querySelector("#ticketCategory")?.value || "Problem",
      priority: app.querySelector("#ticketPriority")?.value || "Medium",
      group: selectedGroup ? selectedGroup.name : "Unassigned group",
      agent: selectedAgentName,
      agentEmail: selectedAgent?.email || "",
      department: app.querySelector("#ticketDepartment")?.value || currentUser?.department || "Operations",
      requester: currentUser?.name || "Ticket requester",
      requesterEmail: currentUser?.email || "",
      status: "Open",
      sla: "Within SLA",
      due: "Resolve in 3 days",
      createdAt: "Just now"
    };
    const assignmentNotification = createTicketHrmsEmployeeNotification(selectedAgent?.email, "Ticket assigned", `${ticket.id} - ${subject} has been assigned to you in Raise Ticket.`);
    setState({ ticketTickets: [ticket, ...(state.ticketTickets || [])], notifications: assignmentNotification ? [assignmentNotification, ...(state.notifications || [])] : state.notifications, ticketSection: "tickets", ticketProfileOpen: false });
    showModalMessage("Ticket created", "The support ticket has been added to the unresolved tickets list.", "success");
  });
}
function bindLoginEvents() {
  bindTicketEvents();
  app.querySelectorAll("[data-login-type]").forEach((button) => {
    button.addEventListener("click", () => setState({ selectedLogin: button.dataset.loginType }));
  });

  app.querySelector("#adminLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = app.querySelector("#adminEmail")?.value.trim().toLowerCase();
    const password = app.querySelector("#adminPassword")?.value;
    const allowedEmails = (state.adminEmails || []).map(e => String(e).toLowerCase());
    if (!allowedEmails.includes(email) || password !== state.adminProfile.password) {
      showModalMessage("Login not completed", "The admin email or password does not match the current prototype credentials.");
      return;
    }
    setState({ session: { role: "admin", email }, activeSection: "overview" });
  });

  app.querySelector("#employeeLoginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = app.querySelector("#employeeEmail")?.value.trim().toLowerCase();
    const password = app.querySelector("#employeePassword")?.value;
    const employee = state.employees.find((item) => item.email.toLowerCase() === email);
    if (!employee || employee.credentials.password !== password) {
      showModalMessage("Login not completed", "The employee email or password is not valid for this prototype.");
      return;
    }
    setState({ session: { role: "employee", email: employee.email }, activeSection: employee.hiring.onboardingSubmittedAt ? "overview" : "profile" });
  });

  app.querySelector("#adminForgotPasswordBtn")?.addEventListener("click", () => setState({ activeAuthView: "forgotPassword" }));
  app.querySelector("#employeeForgotPasswordBtn")?.addEventListener("click", () => setState({ activeAuthView: "forgotPassword" }));
}

function bindForgotPasswordEvents() {
  app.querySelector("#fpBackBtn")?.addEventListener("click", () => setState({ activeAuthView: "login" }));
  app.querySelector("#forgotPasswordForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = app.querySelector("#fpEmail")?.value.trim().toLowerCase();
    const password = app.querySelector("#fpNewPassword")?.value.trim() || "";
    const confirmPassword = app.querySelector("#fpConfirmPassword")?.value.trim() || "";
    
    if (password !== confirmPassword) {
      showModalMessage("Password mismatch", "The new password and confirmation do not match.");
      return;
    }
    
    const employee = state.employees.find((item) => item.email.toLowerCase() === email);
    if (!employee) {
      showModalMessage("Account not found", "No employee is registered with this email address.");
      return;
    }
    
    const updatedEmployee = { ...employee, credentials: { ...(employee.credentials || {}), password } };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item), activeAuthView: "login" });
    showModalMessage("Password reset successful", "Your password has been successfully updated. You can now log in.", "success");
  });
}

function nextEmployeeId() {
  const max = state.employees.reduce((highest, employee) => {
    const match = String(employee.id || "").match(/(\d+)$/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 1000);
  return `EMP-${String(max + 1).padStart(4, "0")}`;
}

function createEmployeeFromForm(sendOffer) {
  const fullName = app.querySelector("#newEmployeeName")?.value.trim();
  const email = app.querySelector("#newEmployeeEmail")?.value.trim().toLowerCase();
  const department = app.querySelector("#newEmployeeDept")?.value.trim();
  const role = app.querySelector("#newEmployeeRole")?.value.trim();
  const empId = app.querySelector("#newEmployeeCode")?.value.trim();
  const password = app.querySelector("#newEmployeePassword")?.value.trim() || TEMP_PASSWORD;
  if (!fullName || !email || !department || !role || !empId) {
    showModalMessage("Employee details are incomplete", "Please complete all employee creation fields before continuing.");
    return;
  }
  if (state.employees.some((item) => item.email.toLowerCase() === email || item.id === empId)) {
    showModalMessage("Employee already exists", "An employee with this email address or Emp ID is already registered in the portal.");
    return;
  }
  const employee = {
    id: empId,
    fullName,
    directoryName: fullName,
    email,
    department,
    role,
    status: sendOffer ? "Pending" : "Active",
    signupCode: empId,
    signedUp: true,
    profile: { phone: "", designation: role, location: "", bio: "" },
    onboardingDetails: {},
    onboardingFieldLabels: {},
    attachments: {},
    attendance: [],
    activities: normalizeActivityRows([]),
    credentials: { password },
    hiring: {
      offerStatus: sendOffer ? "sent" : "accepted",
      offerSentAt: sendOffer ? todayDdMmYyyy() : "",
      offerAcceptedAt: sendOffer ? "" : todayDdMmYyyy(),
      onboardingSubmittedAt: "",
      profileEditAllowed: true,
      offerDraftSubject: "",
      offerDraftBody: ""
    }
  };
  const offerContent = buildOfferContent(employee);
  const emails = sendOffer ? pushEmailLog(employee, offerContent) : state.recentEmails;
  setState({
    employees: [...state.employees, employee],
    selectedEmployeeId: employee.id,
    adminEmployeeView: "details",
    activeSection: "employees",
    recentEmails: emails
  });
  showModalMessage(sendOffer ? "Offer prepared" : "Employee added", sendOffer ? `The employee was added and the offer entry was prepared for ${employee.fullName}.` : `${employee.fullName} was added to Registered employees without sending an offer email.`, "success");
}

function updateSelectedEmployee(updater) {
  const selected = getSelectedEmployee();
  if (!selected) return;
  const updated = updater(selected);
  setState({ employees: state.employees.map((employee) => employee.id === selected.id ? updated : employee) });
}

function bindAdminEvents() {
  app.querySelector("#addEmployeeForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    createEmployeeFromForm(true);
  });

  app.querySelector("#addEmployeeOnlyBtn")?.addEventListener("click", () => createEmployeeFromForm(false));
  app.querySelector("#groupClientOptionForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = app.querySelector("#groupClientOptionName")?.value.trim() || "";
    if (!name) {
      showModalMessage("Group/Client missing", "Please enter a Group/Client name before adding it.");
      return;
    }
    const options = getGroupClientOptions();
    if (options.some((option) => option.toLowerCase() === name.toLowerCase())) {
      showModalMessage("Group/Client already exists", `${name} is already available in the employee activity dropdown.`);
      return;
    }
    setState({ activityTemplate: { ...state.activityTemplate, groupClientOptions: normalizeGroupClientOptions([...options, name]) }, activeSection: "activity" });
    scheduleRemoteStateSave(getSharedStateSnapshot(state), true);
    showModalMessage("Group/Client added", `${name} is now available in the employee activity log dropdown.`, "success");
  });

  app.querySelectorAll("[data-remove-group-client]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.removeGroupClient || "";
      const options = getGroupClientOptions().filter((option) => option !== name);
      setState({ activityTemplate: { ...state.activityTemplate, groupClientOptions: options }, activeSection: "activity" });
      scheduleRemoteStateSave(getSharedStateSnapshot(state), true);
      showModalMessage("Group/Client removed", `${name} was removed from the employee activity log dropdown.`, "success");
    });
  });

  app.querySelectorAll("[data-employee-action]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ selectedEmployeeId: button.dataset.employeeId, adminEmployeeView: button.dataset.employeeAction, activeSection: button.dataset.employeeAction === "details" ? "admin_employee_details" : "employees" });
    });
  });

  app.querySelector("#employeeGroupCreateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = app.querySelector("#newGroupName")?.value.trim() || "";
    const parentId = app.querySelector("#newGroupParent")?.value || "";
    if (!name) {
      showModalMessage("Group name missing", "Please enter a group name before creating it.");
      return;
    }
    const group = { id: makeGroupId(), name, parentId, members: [], createdAt: `${todayDdMmYyyy()} ${formatTime()}`, isDefault: false };
    setState({ employeeGroups: [...(state.employeeGroups || []), group], activeSection: "employee_grouping" });
    showModalMessage("Group created", `${name} has been created.`, "success");
  });

  app.querySelectorAll("[data-group-create-subgroup]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const parentId = form.dataset.groupCreateSubgroup;
      const parent = getGroupById(parentId);
      const input = form.querySelector("input");
      const name = input?.value.trim() || "";
      if (!parent || !name) {
        showModalMessage("Sub group name missing", "Please enter a sub group name before creating it.");
        return;
      }
      const group = { id: makeGroupId(), name, parentId, members: [], createdAt: `${todayDdMmYyyy()} ${formatTime()}`, isDefault: false };
      setState({ employeeGroups: [...(state.employeeGroups || []), group], activeSection: "employee_grouping" });
      showModalMessage("Sub group created", `${name} has been created under ${parent.name}.`, "success");
    });
  });

  app.querySelectorAll("[data-group-employee-picker]").forEach((input) => {
    const form = input.closest("[data-group-add-member]");
    const optionsBox = form?.querySelector(".group-employee-options");
    const empty = form?.querySelector(".group-search-empty");
    const selectedInput = form?.querySelector("[data-group-employee-selected]");
    const filterOptions = () => {
      const query = input.value.trim().toLowerCase();
      let visibleCount = 0;
      optionsBox?.querySelectorAll("[data-group-employee-option]").forEach((option) => {
        const matches = !query || String(option.dataset.searchText || option.textContent || "").toLowerCase().includes(query);
        option.classList.toggle("hidden", !matches);
        if (matches) visibleCount += 1;
      });
      optionsBox?.classList.toggle("hidden", visibleCount === 0);
      empty?.classList.toggle("hidden", visibleCount > 0);
      if (selectedInput) selectedInput.value = "";
    };
    input.addEventListener("focus", filterOptions);
    input.addEventListener("input", filterOptions);
    optionsBox?.addEventListener("click", (event) => {
      const option = event.target.closest("[data-group-employee-option]");
      if (!option) return;
      const employeeId = option.dataset.groupEmployeeOption || "";
      const employee = state.employees.find((item) => item.id === employeeId);
      input.value = employee ? `${getEmployeeDisplayName(employee)} (${employee.id})` : option.textContent.trim();
      if (selectedInput) selectedInput.value = employeeId;
      optionsBox.classList.add("hidden");
      empty?.classList.add("hidden");
    });
  });

  if (!groupPickerOutsideClickBound) {
    document.addEventListener("click", (event) => {
      if (event.target.closest(".group-employee-picker")) return;
      app.querySelectorAll(".group-employee-options").forEach((box) => box.classList.add("hidden"));
    });
    groupPickerOutsideClickBound = true;
  }

  app.querySelectorAll("[data-group-add-member]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const groupId = form.dataset.groupAddMember;
      const pickerValue = form.querySelector("[data-group-employee-picker]")?.value.trim() || "";
      const selectedEmployeeId = form.querySelector("[data-group-employee-selected]")?.value || "";
      const employeeId = selectedEmployeeId || pickerValue.match(/\((EMP-[^)]+)\)$/)?.[1] || pickerValue;
      const group = getGroupById(groupId);
      const employee = state.employees.find((item) => item.id === employeeId || `${getEmployeeDisplayName(item)} (${item.id})` === pickerValue);
      if (!group || !employee) {
        showModalMessage("Employee not selected", "Please choose an employee from the dropdown suggestions before adding to the group.");
        return;
      }
      if ((group.members || []).includes(employeeId)) {
        showModalMessage("Employee already in group", `${getEmployeeDisplayName(employee)} is already added to ${group.name}.`);
        return;
      }
      const updatedGroups = state.employeeGroups.map((item) => item.id === groupId ? { ...item, members: [...(item.members || []), employeeId] } : item);
      const updatedGroup = { ...group, members: [...(group.members || []), employeeId] };
      const notification = createGroupMembershipNotification(employeeId, updatedGroup, "added");
      setState({ employeeGroups: updatedGroups, notifications: [notification, ...(state.notifications || [])], activeSection: "employee_grouping" });
      showModalMessage("Employee added", `${getEmployeeDisplayName(employee)} was added to ${getGroupPath(updatedGroup)}.`, "success");
    });
  });

  app.querySelectorAll("[data-group-remove-member]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupId = button.dataset.groupRemoveMember;
      const employeeId = button.dataset.groupEmployeeId;
      const group = getGroupById(groupId);
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!group || !employee) return;
      const updatedGroup = { ...group, members: (group.members || []).filter((id) => id !== employeeId) };
      const updatedGroups = state.employeeGroups.map((item) => item.id === groupId ? updatedGroup : item);
      const notification = createGroupMembershipNotification(employeeId, group, "removed");
      setState({ employeeGroups: updatedGroups, notifications: [notification, ...(state.notifications || [])], activeSection: "employee_grouping" });
      showModalMessage("Employee removed", `${getEmployeeDisplayName(employee)} was removed from ${getGroupPath(group)}.`, "success");
    });
  });

  app.querySelectorAll("[data-group-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupId = button.dataset.groupDelete;
      const group = getGroupById(groupId);
      if (!group || group.isDefault || group.id === DEFAULT_ADMIN_GROUP_ID) {
        showModalMessage("Group cannot be deleted", "The default Admin group cannot be deleted.");
        return;
      }
      const memberIds = Array.from(new Set(group.members || []));
      const updatedGroups = (state.employeeGroups || [])
        .filter((item) => item.id !== groupId)
        .map((item) => item.parentId === groupId ? { ...item, parentId: "" } : item);
      const groupHolidayCalendars = { ...(state.holidayGroupCalendars || {}) };
      delete groupHolidayCalendars[groupId];
      const notifications = memberIds.map((employeeId) => createNotification({ recipientRole: "employee", employeeId, title: "Employee group deleted", message: `${getGroupPath(group)} was deleted by admin.` }));
      setState({
        employeeGroups: updatedGroups,
        holidayGroupCalendars: groupHolidayCalendars,
        selectedHolidayGroupId: state.selectedHolidayGroupId === groupId ? "" : state.selectedHolidayGroupId,
        notifications: [...notifications, ...(state.notifications || [])],
        activeSection: "employee_grouping"
      });
      showModalMessage("Group deleted", `${getGroupPath(group)} was deleted. ${memberIds.length} member notification(s) were sent.`, "success");
    });
  });

  app.querySelector("#attendancePolicyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const locationRuleEnabled = app.querySelector("#policyLocationEnabled")?.checked ?? true;
    const latitude = app.querySelector("#officeLatitude")?.value.trim() || "";
    const longitude = app.querySelector("#officeLongitude")?.value.trim() || "";
    const radiusMeters = app.querySelector("#officeRadius")?.value.trim() || "15";
    const officeName = app.querySelector("#officeName")?.value.trim() || "Office";
    if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude)) || !Number.isFinite(Number(radiusMeters)) || Number(radiusMeters) <= 0) {
      showModalMessage("Office location is incomplete", "Please enter valid latitude, longitude, and radius before saving.");
      return;
    }
    const previousPolicy = { ...(state.attendancePolicy || {}) };
    const nextPolicy = {
      ...(state.attendancePolicy || {}),
      officeName,
      latitude,
      longitude,
      radiusMeters,
      locationRuleEnabled,
      locked: true
    };
    const historyEntry = {
      updatedAt: `${todayDdMmYyyy()} ${formatTime()}`,
      updatedBy: state.adminProfile.name,
      officeName,
      latitude,
      longitude,
      radiusMeters,
      checkInTime: previousPolicy.checkInTime || "",
      checkInGraceMinutes: previousPolicy.checkInGraceMinutes || "0",
      checkOutTime: previousPolicy.checkOutTime || "",
      checkOutGraceMinutes: previousPolicy.checkOutGraceMinutes || "0",
      previousOfficeName: previousPolicy.officeName || "",
      previousLatitude: previousPolicy.latitude || "",
      previousLongitude: previousPolicy.longitude || "",
      previousRadiusMeters: previousPolicy.radiusMeters || ""
    };
    setState({ attendancePolicy: nextPolicy, attendancePolicyHistory: [historyEntry, ...(state.attendancePolicyHistory || [])], activeSection: "attendance" });
    showModalMessage("Office location saved", `Attendance can now be marked within ${radiusMeters} meters of the configured office location.`, "success");
  });

  app.querySelector("#attendanceTimingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const timingRuleEnabled = Boolean(app.querySelector("#policyTimingEnabled")?.checked);
    const checkInTime = app.querySelector("#policyCheckInTime")?.value || "";
    const checkInGraceMinutes = app.querySelector("#policyCheckInGrace")?.value.trim() || "0";
    const checkOutTime = app.querySelector("#policyCheckOutTime")?.value || "";
    const checkOutGraceMinutes = app.querySelector("#policyCheckOutGrace")?.value.trim() || "0";
    if ((checkInGraceMinutes && (!Number.isFinite(Number(checkInGraceMinutes)) || Number(checkInGraceMinutes) < 0)) || (checkOutGraceMinutes && (!Number.isFinite(Number(checkOutGraceMinutes)) || Number(checkOutGraceMinutes) < 0))) {
      showModalMessage("Attendance timing is incomplete", "Please enter valid grace minutes before saving.");
      return;
    }
    const nextPolicy = {
      ...(state.attendancePolicy || {}),
      checkInTime,
      checkInGraceMinutes,
      checkOutTime,
      checkOutGraceMinutes,
      timingRuleEnabled,
      locked: true
    };
    setState({ attendancePolicy: nextPolicy, activeSection: "attendance" });
    showModalMessage("Attendance timing saved", "The employee check in and check out timing policy has been updated successfully.", "success");
  });

  app.querySelector("#editAttendancePolicyBtn")?.addEventListener("click", () => {
    setState({ attendancePolicy: { ...state.attendancePolicy, locked: !state.attendancePolicy.locked }, activeSection: "attendance" });
  });

  app.querySelector("#editAttendanceTimingBtn")?.addEventListener("click", () => {
    setState({ attendancePolicy: { ...state.attendancePolicy, locked: !state.attendancePolicy.locked }, activeSection: "attendance" });
  });

  app.querySelector("#attendanceFilterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      attendanceFilterDate: normalizeActivityDateValue(app.querySelector("#attendanceFilterDate")?.value.trim() || todayDdMmYyyy()),
      attendanceFilterMonth: app.querySelector("#attendanceFilterMonth")?.value.trim() || new Date().toISOString().slice(0, 7),
      attendanceReportMode: app.querySelector("#attendanceReportMode")?.value || "daily",
      attendanceSearchQuery: app.querySelector("#attendanceSearchQuery")?.value.trim() || "",
      attendanceFilterFrom: "",
      attendanceFilterTo: "",
      activeSection: "attendance"
    });
  });

  app.querySelectorAll("[data-attendance-employee-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const filters = getAttendanceSearchParams();
      const monthRange = getMonthDateRange(filters.month);
      setState({
        selectedEmployeeId: button.dataset.attendanceEmployeeId,
        attendanceFilterFrom: filters.mode === "monthly" ? monthRange.from : filters.date,
        attendanceFilterTo: filters.mode === "monthly" ? monthRange.to : filters.date,
        attendanceEmployeeStatusFilter: "all",
        activeSection: "admin_attendance_employee"
      });
    });
  });

  app.querySelector("#backToAttendanceBtn")?.addEventListener("click", () => {
    setState({ activeSection: "attendance" });
  });

  app.querySelectorAll("[data-attendance-status-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ attendanceEmployeeStatusFilter: button.dataset.attendanceStatusFilter || "all", activeSection: "admin_attendance_employee" });
    });
  });

  app.querySelector("#attendanceEmployeeFilterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      attendanceFilterFrom: normalizeActivityDateValue(app.querySelector("#attendanceFilterFrom")?.value.trim() || ""),
      attendanceFilterTo: normalizeActivityDateValue(app.querySelector("#attendanceFilterTo")?.value.trim() || ""),
      attendanceEmployeeStatusFilter: "all",
      activeSection: "admin_attendance_employee"
    });
  });

  app.querySelector("#employeeDetailForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSelectedEmployee((employee) => ({
      ...employee,
      fullName: app.querySelector("#detailFullName")?.value.trim() || employee.fullName,
      directoryName: app.querySelector("#detailFullName")?.value.trim() || employee.directoryName || employee.fullName,
      email: app.querySelector("#detailEmail")?.value.trim() || employee.email,
      department: app.querySelector("#detailDepartment")?.value.trim() || employee.department,
      role: app.querySelector("#detailRole")?.value.trim() || employee.role,
      status: app.querySelector("#detailStatus")?.value || employee.status,
      id: app.querySelector("#detailSignupCode")?.value.trim() || employee.id,
      signupCode: app.querySelector("#detailSignupCode")?.value.trim() || employee.signupCode,
      credentials: { password: app.querySelector("#detailPassword")?.value.trim() || employee.credentials.password },
      profile: {
        ...employee.profile,
        phone: app.querySelector("#detailPhone")?.value.trim() || "",
        designation: app.querySelector("#detailDesignation")?.value.trim() || "",
        location: app.querySelector("#detailLocation")?.value.trim() || "",
        bio: app.querySelector("#detailBio")?.value.trim() || ""
      }
    }));
    showModalMessage("Employee details saved", "The selected employee information has been updated.", "success");
  });

  app.querySelector("#adminEmployeePasswordResetForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newPassword = app.querySelector("#adminEmployeeConfirmPassword")?.value.trim() || "";
    if (newPassword.length < 6) {
      showModalMessage("Password too short", "Please enter a new password with at least 6 characters.");
      return;
    }
    updateSelectedEmployee((employee) => ({ ...employee, credentials: { ...(employee.credentials || {}), password: newPassword } }));
    showModalMessage("Employee password reset", "The employee's password has been updated successfully.", "success");
  });

  app.querySelector("#saveOfferDraftBtn")?.addEventListener("click", () => {
    updateSelectedEmployee((employee) => ({
      ...employee,
      hiring: {
        ...employee.hiring,
        offerDraftSubject: app.querySelector("#offerDraftSubject")?.value.trim() || employee.hiring.offerDraftSubject,
        offerDraftBody: app.querySelector("#offerDraftBody")?.value.trim() || employee.hiring.offerDraftBody
      }
    }));
    showModalMessage("Draft updated", "The offer email draft has been saved for this employee.", "success");
  });

  app.querySelector("#offerDraftForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = getSelectedEmployee();
    if (!selected) return;
    const subject = app.querySelector("#offerDraftSubject")?.value.trim();
    const body = app.querySelector("#offerDraftBody")?.value.trim();
    const draftEmployee = {
      ...selected,
      hiring: {
        ...selected.hiring,
        offerDraftSubject: subject,
        offerDraftBody: body,
        offerStatus: "sent",
        offerSentAt: todayDdMmYyyy()
      }
    };
    const offerContent = buildOfferContent(draftEmployee);
    setState({
      employees: state.employees.map((employee) => employee.id === selected.id ? draftEmployee : employee),
      recentEmails: pushEmailLog(draftEmployee, offerContent)
    });
    showModalMessage("Offer recorded", `The offer for ${selected.fullName} has been prepared in the portal.`, "success");
  });

  app.querySelector("#markAcceptedBtn")?.addEventListener("click", () => {
    updateSelectedEmployee((employee) => ({
      ...employee,
      status: "Accepted",
      hiring: { ...employee.hiring, offerStatus: "accepted", offerAcceptedAt: todayDdMmYyyy(), profileEditAllowed: true }
    }));
    setState({ adminEmployeeView: "onboarding", activeSection: "employees" });
  });

  app.querySelector("#allowProfileEditBtn")?.addEventListener("click", () => {
    updateSelectedEmployee((employee) => ({ ...employee, hiring: { ...employee.hiring, profileEditAllowed: true, profileReviewed: false } }));
    showModalMessage("Profile edits allowed", "The employee can now update profile details once more.", "success");
  });

  app.querySelector("#addAdminEmailForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = app.querySelector("#newAdminEmail")?.value.trim().toLowerCase();
    if (!email) return;
    const currentList = state.adminEmails || [state.adminProfile.email];
    if (currentList.map(e => String(e).toLowerCase()).includes(email)) {
      showModalMessage("Already exists", "This admin email is already in the list.", "warning");
      return;
    }
    setState({ adminEmails: [...currentList, email] });
    showModalMessage("Admin added", `Added ${email} to admin access list.`, "success");
  });

  app.querySelectorAll("[data-remove-admin-email]").forEach(btn => {
    btn.addEventListener("click", () => {
      const email = btn.dataset.removeAdminEmail;
      const currentList = state.adminEmails || [state.adminProfile.email];
      if (currentList.length <= 1) {
        showModalMessage("Action blocked", "You cannot remove the last admin email.", "error");
        return;
      }
      setState({ adminEmails: currentList.filter(e => String(e).toLowerCase() !== String(email).toLowerCase()) });
      showModalMessage("Admin removed", `Removed ${email} from admin access list.`, "success");
    });
  });

  app.querySelector("#emailConfigForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      emailConfig: {
        senderName: app.querySelector("#senderName")?.value.trim() || "",
        senderEmail: app.querySelector("#senderEmail")?.value.trim() || "",
        smtpHost: app.querySelector("#smtpHost")?.value.trim() || "",
        smtpPort: app.querySelector("#smtpPort")?.value.trim() || "",
        appPassword: app.querySelector("#appPassword")?.value.trim() || "",
        configured: true
      }
    });
    showModalMessage("Email configuration saved", "The sender email and app password settings were saved to the prototype.", "success");
  });

  app.querySelector("#adminPasswordChangeForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentPassword = app.querySelector("#adminCurrentPasswordChange")?.value || "";
    const password = app.querySelector("#adminNewPasswordChange")?.value.trim() || "";
    const confirmPassword = app.querySelector("#adminConfirmPasswordChange")?.value.trim() || "";
    if (currentPassword !== state.adminProfile.password) {
      showModalMessage("Current password mismatch", "The current admin password is not correct.");
      return;
    }
    if (password.length < 6) {
      showModalMessage("Password too short", "Please enter a new admin password with at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showModalMessage("Password mismatch", "The new admin password and confirmation do not match.");
      return;
    }
    setState({ adminProfile: { ...state.adminProfile, password } });
    showModalMessage("Admin password changed", "The admin password has been updated for future logins.", "success");
  });

  app.querySelector("#offerTemplateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      offerTemplate: {
        ...state.offerTemplate,
        subject: app.querySelector("#offerSubject")?.value.trim() || state.offerTemplate.subject,
        body: app.querySelector("#offerBody")?.value.trim() || state.offerTemplate.body
      }
    });
    showModalMessage("Offer template saved", "The default offer email content has been updated.", "success");
  });


  app.querySelectorAll("[data-admin-leave-wfh-month]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ adminLeaveWfhCalendarMonth: button.dataset.adminLeaveWfhMonth, activeSection: "leave_wfh" });
    });
  });

  app.querySelectorAll("[data-admin-leave-wfh-date]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ adminLeaveWfhCalendarDate: button.dataset.adminLeaveWfhDate, activeSection: "leave_wfh" });
    });
  });

  app.querySelector("#adminLeaveWfhReportDateMode")?.addEventListener("change", (event) => {
    setState({ adminLeaveWfhReportDateMode: event.target.value || "all", activeSection: "leave_wfh" });
  });

  app.querySelector("#adminLeaveWfhReportFilterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      adminLeaveWfhReportSearch: app.querySelector("#adminLeaveWfhReportSearch")?.value.trim() || "",
      adminLeaveWfhReportEmployeeId: app.querySelector("#adminLeaveWfhReportEmployee")?.value || "",
      adminLeaveWfhReportDateMode: app.querySelector("#adminLeaveWfhReportDateMode")?.value || "all",
      adminLeaveWfhReportMonth: app.querySelector("#adminLeaveWfhReportMonth")?.value || new Date().toISOString().slice(0, 7),
      adminLeaveWfhReportYear: app.querySelector("#adminLeaveWfhReportYear")?.value || String(new Date().getFullYear()),
      adminLeaveWfhReportFrom: fromDateInputValue(app.querySelector("#adminLeaveWfhReportFrom")?.value || ""),
      adminLeaveWfhReportTo: fromDateInputValue(app.querySelector("#adminLeaveWfhReportTo")?.value || ""),
      adminLeaveWfhReportType: app.querySelector("#adminLeaveWfhReportType")?.value || "",
      activeSection: "leave_wfh"
    });
  });
  app.querySelector("#resetAdminLeaveWfhReportFiltersBtn")?.addEventListener("click", () => {
    setState({
      adminLeaveWfhReportSearch: "",
      adminLeaveWfhReportEmployeeId: "",
      adminLeaveWfhReportDateMode: "all",
      adminLeaveWfhReportMonth: new Date().toISOString().slice(0, 7),
      adminLeaveWfhReportYear: String(new Date().getFullYear()),
      adminLeaveWfhReportFrom: "",
      adminLeaveWfhReportTo: "",
      adminLeaveWfhReportType: "",
      activeSection: "leave_wfh"
    });
  });
  app.querySelectorAll("[data-admin-leave-wfh-employee]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ adminLeaveWfhCalendarEmployeeId: button.dataset.adminLeaveWfhEmployee, selectedLeaveWfhEmployeeId: button.dataset.adminLeaveWfhEmployee, activeSection: "leave_wfh" });
    });
  });
  app.querySelector("#wfhAutoApprovalCheck")?.addEventListener("change", (event) => setLeaveWfhAutoApproval("wfh", event.target.checked));
  app.querySelector("#leaveAutoApprovalCheck")?.addEventListener("change", (event) => setLeaveWfhAutoApproval("leave", event.target.checked));
  app.querySelector("#wfhPolicyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const weeklyLimit = Number(app.querySelector("#wfhWeeklyLimit")?.value || 0);
    const monthlyLimit = Number(app.querySelector("#wfhMonthlyLimit")?.value || 0);
    const requestWindowMonths = Number(app.querySelector("#wfhRequestWindowMonths")?.value || 6);
    if (!Number.isFinite(weeklyLimit) || !Number.isFinite(monthlyLimit) || !Number.isFinite(requestWindowMonths) || weeklyLimit < 0 || monthlyLimit < 0 || requestWindowMonths < 1) {
      showModalMessage("WFH policy is incomplete", "Please enter valid weekly, monthly, and future month limits before saving.");
      return;
    }
    if (weeklyLimit > monthlyLimit && monthlyLimit > 0) {
      showModalMessage("WFH policy needs review", "The weekly WFH limit cannot be higher than the monthly WFH limit.");
      return;
    }
    const previousPolicy = { ...(state.wfhPolicy || {}) };
    const nextPolicy = { weeklyLimit, monthlyLimit, requestWindowMonths, locked: true };
    const historyEntry = {
      updatedAt: buildTimestamp(),
      updatedBy: state.adminProfile.name,
      weeklyLimit,
      monthlyLimit,
      requestWindowMonths,
      previousWeeklyLimit: previousPolicy.weeklyLimit ?? "",
      previousMonthlyLimit: previousPolicy.monthlyLimit ?? "",
      previousRequestWindowMonths: previousPolicy.requestWindowMonths ?? ""
    };
    setState({ wfhPolicy: nextPolicy, wfhPolicyHistory: [historyEntry, ...(state.wfhPolicyHistory || [])], activeSection: "leave_wfh" });
    showModalMessage("WFH policy saved", "The Work From Home policy has been saved and locked.", "success");
  });

  app.querySelector("#editWfhPolicyBtn")?.addEventListener("click", () => {
    setState({ wfhPolicy: { ...(state.wfhPolicy || {}), locked: !state.wfhPolicy?.locked }, activeSection: "leave_wfh" });
  });

  app.querySelector("#leavePolicyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const privilegeLeave = Number(app.querySelector("#privilegeLeaveLimit")?.value || 0);
    const sickLeave = Number(app.querySelector("#sickLeaveLimit")?.value || 0);
    const requestWindowMonths = Number(app.querySelector("#leaveRequestWindowMonths")?.value || 6);
    if (!Number.isFinite(privilegeLeave) || !Number.isFinite(sickLeave) || !Number.isFinite(requestWindowMonths) || privilegeLeave < 0 || sickLeave < 0 || requestWindowMonths < 1) {
      showModalMessage("Leave policy is incomplete", "Please enter valid Privilege Leave, Sick Leave, and future month limits before saving.");
      return;
    }
    const previousPolicy = { ...(state.leavePolicy || {}) };
    const nextPolicy = { privilegeLeave, sickLeave, requestWindowMonths, locked: true };
    const historyEntry = {
      updatedAt: buildTimestamp(),
      updatedBy: state.adminProfile.name,
      privilegeLeave,
      sickLeave,
      requestWindowMonths,
      previousPrivilegeLeave: previousPolicy.privilegeLeave ?? "",
      previousSickLeave: previousPolicy.sickLeave ?? "",
      previousRequestWindowMonths: previousPolicy.requestWindowMonths ?? ""
    };
    setState({ leavePolicy: nextPolicy, leavePolicyHistory: [historyEntry, ...(state.leavePolicyHistory || [])], activeSection: "leave_wfh" });
    showModalMessage("Leave policy saved", "The leave policy has been saved and locked.", "success");
  });

  app.querySelector("#editLeavePolicyBtn")?.addEventListener("click", () => {
    setState({ leavePolicy: { ...(state.leavePolicy || {}), locked: !state.leavePolicy?.locked }, activeSection: "leave_wfh" });
  });

  app.querySelector("#wfhHistoryFilterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      wfhHistoryFilterEmployee: app.querySelector("#wfhHistoryEmployeeFilter")?.value || "",
      wfhHistoryFilterMonth: app.querySelector("#wfhHistoryMonthFilter")?.value || new Date().toISOString().slice(0, 7),
      activeSection: "leave_wfh"
    });
  });


  app.querySelectorAll("[data-wfh-balance-employee]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ selectedLeaveWfhEmployeeId: button.dataset.wfhBalanceEmployee, adminLeaveWfhCalendarEmployeeId: button.dataset.wfhBalanceEmployee, activeSection: "leave_wfh" });
    });
  });

  app.querySelector("#holidayGroupSelectForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({ selectedHolidayGroupId: app.querySelector("#holidayGroupSelector")?.value || "", activeSection: "holiday" });
  });

  app.querySelector("#holidayGroupSelector")?.addEventListener("change", (event) => {
    setState({ selectedHolidayGroupId: event.target.value || "", activeSection: "holiday" });
  });

  app.querySelector("#holidayCalendarForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const groupId = app.querySelector("#holidayConfigGroupId")?.value || "";
    const sourceCalendar = getHolidayCalendarForGroup(groupId);
    const calendar = sourceCalendar.map((holiday, index) => {
      if (!isFutureDateOnly(holiday.date)) return holiday;
      return {
        id: app.querySelector(`[data-holiday-field="id"][data-holiday-index="${index}"]`)?.value || holiday.id,
        date: normalizeActivityDateValue(app.querySelector(`[data-holiday-field="date"][data-holiday-index="${index}"]`)?.value.trim() || ""),
        day: app.querySelector(`[data-holiday-field="day"][data-holiday-index="${index}"]`)?.value.trim() || "",
        name: app.querySelector(`[data-holiday-field="name"][data-holiday-index="${index}"]`)?.value.trim() || "",
        type: app.querySelector(`[data-holiday-field="type"][data-holiday-index="${index}"]`)?.value || "CH"
      };
    });
    const normalizedCalendar = normalizeHolidayCalendar(calendar);
    if (!normalizedCalendar.length) {
      showModalMessage("Holiday list is incomplete", "Please keep at least one valid holiday before saving.");
      return;
    }
    if (groupId) {
      setState({ holidayGroupCalendars: { ...(state.holidayGroupCalendars || {}), [groupId]: normalizedCalendar }, selectedHolidayGroupId: groupId, activeSection: "holiday" });
    } else {
      setState({ holidayCalendar: normalizedCalendar, holidays: getCompanyHolidayDatesFromCalendar(normalizedCalendar), selectedHolidayGroupId: "", activeSection: "holiday" });
    }
    showModalMessage("Holiday list saved", `${getHolidayConfigLabel(groupId)} holiday calendar has been updated.`, "success");
  });

  app.querySelector("#holidayAddForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const groupId = getSelectedHolidayGroupId();
    const holiday = {
      id: `HOL-${Date.now()}`,
      date: normalizeActivityDateValue(app.querySelector("#newHolidayDate")?.value.trim() || ""),
      day: app.querySelector("#newHolidayDay")?.value.trim() || "",
      name: app.querySelector("#newHolidayName")?.value.trim() || "",
      type: app.querySelector("#newHolidayType")?.value || "CH"
    };
    if (!holiday.date || !holiday.name) {
      showModalMessage("Holiday is incomplete", "Please enter the holiday date and name before adding.");
      return;
    }
    const normalizedCalendar = normalizeHolidayCalendar([...getHolidayCalendarForGroup(groupId), holiday]);
    if (groupId) {
      setState({ holidayGroupCalendars: { ...(state.holidayGroupCalendars || {}), [groupId]: normalizedCalendar }, selectedHolidayGroupId: groupId, activeSection: "holiday" });
    } else {
      setState({ holidayCalendar: normalizedCalendar, holidays: getCompanyHolidayDatesFromCalendar(normalizedCalendar), selectedHolidayGroupId: "", activeSection: "holiday" });
    }
    showModalMessage("Holiday added", `${holiday.name} has been added to ${getHolidayConfigLabel(groupId)}.`, "success");
  });

  app.querySelectorAll("[data-remove-holiday-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupId = getSelectedHolidayGroupId();
      const holidayId = button.dataset.removeHolidayId;
      const sourceCalendar = getHolidayCalendarForGroup(groupId);
      const holiday = sourceCalendar.find((item) => item.id === holidayId);
      if (!holiday) return;
      if (!isFutureDateOnly(holiday.date)) {
        showModalMessage("Holiday is locked", "Past holidays cannot be removed or updated.");
        return;
      }
      const normalizedCalendar = normalizeHolidayCalendar(sourceCalendar.filter((item) => item.id !== holidayId));
      if (groupId) {
        setState({ holidayGroupCalendars: { ...(state.holidayGroupCalendars || {}), [groupId]: normalizedCalendar }, selectedHolidayGroupId: groupId, activeSection: "holiday" });
      } else {
        setState({ holidayCalendar: normalizedCalendar, holidays: getCompanyHolidayDatesFromCalendar(normalizedCalendar), selectedHolidayGroupId: "", activeSection: "holiday" });
      }
      showModalMessage("Holiday removed", `${holiday.name} has been removed from ${getHolidayConfigLabel(groupId)}.`, "success");
    });
  });

  app.querySelectorAll("[data-rh-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const requestId = button.dataset.rhRequestId;
      const decision = button.dataset.rhDecision;
      const request = (state.holidayRequests || []).find((item) => item.id === requestId);
      if (!request) return;
      const employee = state.employees.find((item) => item.id === request.employeeId);
      const updatedRequests = (state.holidayRequests || []).map((item) => item.id === requestId ? { ...item, status: decision, reviewedAt: buildTimestamp(), reviewedBy: state.adminProfile.name } : item);
      const employeeNotification = createNotification({ recipientRole: "employee", employeeId: request.employeeId, title: `Restricted holiday ${decision}`, message: `Your restricted holiday request for ${request.date} was ${decision} by admin.` });
      setState({ holidayRequests: updatedRequests, notifications: [employeeNotification, ...(state.notifications || [])], activeSection: "holiday" });
      showModalMessage(`Restricted holiday ${decision}`, `The restricted holiday request for ${getEmployeeDisplayName(employee) || request.employeeId} was ${decision}.`, "success");
    });
  });

  app.querySelectorAll("[data-wfh-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const requestId = button.dataset.wfhRequestId;
      const decision = button.dataset.wfhDecision;
      const request = (state.wfhRequests || []).find((item) => item.id === requestId);
      if (!request) return;
      const employee = state.employees.find((item) => item.id === request.employeeId);
      const updatedRequests = (state.wfhRequests || []).map((item) => item.id === requestId ? { ...item, status: decision, reviewedAt: buildTimestamp(), reviewedBy: state.adminProfile.name } : item);
      const employeeNotification = createNotification({ recipientRole: "employee", employeeId: request.employeeId, title: `Work From Home request ${decision}`, message: `Your Work From Home request for ${request.date} was ${decision} by admin.` });
      setState({ wfhRequests: updatedRequests, notifications: [employeeNotification, ...(state.notifications || [])], activeSection: "leave_wfh" });
      showModalMessage(`WFH request ${decision}`, `The Work From Home request for ${getEmployeeDisplayName(employee) || request.employeeId} was ${decision}.`, "success");
    });
  });


  app.querySelectorAll("[data-leave-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const requestId = button.dataset.leaveRequestId;
      const decision = button.dataset.leaveDecision;
      const request = (state.leaveRequests || []).find((item) => item.id === requestId);
      if (!request) return;
      const employee = state.employees.find((item) => item.id === request.employeeId);
      const leaveType = getLeaveTypeConfig(request.type).label;
      const updatedRequests = (state.leaveRequests || []).map((item) => item.id === requestId ? { ...item, status: decision, reviewedAt: buildTimestamp(), reviewedBy: state.adminProfile.name } : item);
      const employeeNotification = createNotification({ recipientRole: "employee", employeeId: request.employeeId, title: `Leave request ${decision}`, message: `Your ${leaveType} request for ${request.date} was ${decision} by admin.` });
      setState({ leaveRequests: updatedRequests, notifications: [employeeNotification, ...(state.notifications || [])], activeSection: "leave_wfh" });
      showModalMessage(`Leave request ${decision}`, `The ${leaveType} request for ${getEmployeeDisplayName(employee) || request.employeeId} was ${decision}.`, "success");
    });
  });


  app.querySelector("#adminSpecialWfhForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const employeeId = app.querySelector("#specialWfhEmployee")?.value || "";
    const fromDate = normalizeActivityDateValue(app.querySelector("#specialWfhFromDate")?.value.trim() || "");
    const toDate = normalizeActivityDateValue(app.querySelector("#specialWfhToDate")?.value.trim() || "");
    const reason = app.querySelector("#specialWfhReason")?.value.trim() || "";
    const employee = state.employees.find((item) => item.id === employeeId);
    const dateRange = getDatesInRange(fromDate, toDate);
    if (!employee || !fromDate || !toDate || !reason || !dateRange.length) {
      showModalMessage("Special WFH is incomplete", "Please choose the employee, valid from and to dates, and reason before marking special WFH.");
      return;
    }
    const existingDates = dateRange.filter((date) => getActiveWfhRequestForDate(employeeId, date));
    if (existingDates.length) {
      showModalMessage("WFH already exists", `A pending or accepted Work From Home entry already exists for: ${existingDates.join(", ")}.`);
      return;
    }
    const timestamp = buildTimestamp();
    const requests = dateRange.map((date, index) => ({ id: `WFH-${Date.now()}-${index}`, employeeId, date, reason, status: "accepted", submittedAt: timestamp, reviewedAt: timestamp, reviewedBy: state.adminProfile.name, revokedAt: "", createdBy: "admin" }));
    const rangeLabel = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;
    const employeeNotification = createNotification({ recipientRole: "employee", employeeId, title: "Special Work From Home marked", message: `Admin marked Work From Home for ${rangeLabel}.` });
    setState({ wfhRequests: [...requests, ...(state.wfhRequests || [])], notifications: [employeeNotification, ...(state.notifications || [])], selectedLeaveWfhEmployeeId: employeeId, activeSection: "leave_wfh" });
    showModalMessage("Special WFH marked", `Work From Home was marked for ${getEmployeeDisplayName(employee)} from ${rangeLabel}.`, "success");
  });

  app.querySelector("#adminSpecialLeaveForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const employeeId = app.querySelector("#specialLeaveEmployee")?.value || "";
    const type = app.querySelector("#specialLeaveType")?.value || "privilege";
    const fromDate = normalizeActivityDateValue(app.querySelector("#specialLeaveFromDate")?.value.trim() || "");
    const toDate = normalizeActivityDateValue(app.querySelector("#specialLeaveToDate")?.value.trim() || "");
    const reason = app.querySelector("#specialLeaveReason")?.value.trim() || "";
    const employee = state.employees.find((item) => item.id === employeeId);
    const dateRange = getDatesInRange(fromDate, toDate);
    const leaveType = getLeaveTypeConfig(type);
    if (!employee || !fromDate || !toDate || !reason || !dateRange.length) {
      showModalMessage("Additional leave is incomplete", "Please choose the employee, leave type, valid from and to dates, and reason before marking additional leave.");
      return;
    }
    const existingDates = dateRange.filter((date) => getActiveLeaveRequestForDate(employeeId, date));
    if (existingDates.length) {
      showModalMessage("Leave already exists", `A pending or accepted leave entry already exists for: ${existingDates.join(", ")}.`);
      return;
    }
    const leaveBalance = getEmployeeLeaveBalance(employeeId, fromDate);
    const remaining = leaveType.key === "sick" ? leaveBalance.sickRemaining : leaveBalance.privilegeRemaining;
    if (dateRange.length > remaining) {
      showModalMessage("Leave balance is insufficient", `${getEmployeeDisplayName(employee)} has only ${remaining} ${leaveType.shortLabel} day(s) remaining for ${leaveBalance.year}.`);
      return;
    }
    const timestamp = buildTimestamp();
    const requests = dateRange.map((date, index) => ({ id: `LEV-${Date.now()}-${index}`, employeeId, date, type: leaveType.key, reason, status: "accepted", submittedAt: timestamp, reviewedAt: timestamp, reviewedBy: state.adminProfile.name, revokedAt: "", createdBy: "admin" }));
    const rangeLabel = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;
    const employeeNotification = createNotification({ recipientRole: "employee", employeeId, title: "Additional leave marked", message: `Admin marked ${leaveType.label} for ${rangeLabel}.` });
    setState({ leaveRequests: [...requests, ...(state.leaveRequests || [])], notifications: [employeeNotification, ...(state.notifications || [])], selectedLeaveWfhEmployeeId: employeeId, activeSection: "leave_wfh" });
    showModalMessage("Additional leave marked", `${leaveType.label} was marked for ${getEmployeeDisplayName(employee)} from ${rangeLabel}.`, "success");
  });

  app.querySelector("#employeeDocImportForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const selected = getSelectedEmployee();
    const file = app.querySelector("#employeeDocFile")?.files?.[0];
    if (!selected || !file) {
      showModalMessage("DOCX file missing", "Please choose the employee DOCX file before extracting details.");
      return;
    }
    try {
      const updatedEmployee = await importEmployeeDocxData(selected, file);
      setState({ employees: state.employees.map((employee) => employee.id === selected.id ? updatedEmployee : employee), adminEmployeeView: "onboarding" });
      showModalMessage("Employee form extracted", "The employee DOCX fields were extracted and mapped into the onboarding and profile sections.", "success");
    } catch (error) {
      showModalMessage("DOCX import failed", error.message || "The employee form could not be parsed.");
    }
  });

  app.querySelector("#attendanceAdjustmentHistoryForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    setState({
      adjustmentHistoryFilterEmployee: app.querySelector("#adjustmentHistoryEmployee")?.value || "",
      adjustmentHistoryFilterDate: normalizeActivityDateValue(app.querySelector("#adjustmentHistoryDate")?.value.trim() || ""),
      activeSection: "attendance_adjustment"
    });
  });

  app.querySelectorAll("[data-claim-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const claimId = button.dataset.claimId;
      const decision = button.dataset.claimDecision;
      const claim = (state.attendanceClaims || []).find((item) => item.id === claimId);
      if (!claim) return;
      const employee = state.employees.find((item) => item.id === claim.employeeId);
      const updatedClaims = state.attendanceClaims.map((item) => item.id === claimId ? { ...item, status: decision, reviewedAt: buildTimestamp(), reviewedBy: state.adminProfile.name } : item);
      const employeeNotification = createNotification({ recipientRole: "employee", employeeId: claim.employeeId, claimId, title: `Attendance claim ${decision === "accepted" ? "accepted" : "rejected"}`, message: `${claim.claimType} for ${claim.attendanceDate} was ${decision} by admin.` });
      setState({ attendanceClaims: updatedClaims, notifications: [employeeNotification, ...(state.notifications || [])], activeSection: "attendance_adjustment" });
      showModalMessage(`Claim ${decision}`, `The attendance claim for ${getEmployeeDisplayName(employee) || claim.employeeId} was ${decision}.`, "success");
    });
  });
}

function collectOnboardingValues(prefix) {
  const details = {};
  for (const field of state.onboardingTemplate.fields) {
    const element = app.querySelector(`#${prefix}${field.key}`);
    details[field.key] = element?.value.trim() || "";
  }
  return details;
}

function initializeActivityGroupClientPickers() {
  document.querySelectorAll(".activity-group-client-options").forEach((box) => {
    if (box.parentElement === document.body) box.remove();
  });
  app.querySelectorAll("[data-activity-group-client-search]").forEach((input) => {
    const hidden = app.querySelector(`#${input.dataset.activityGroupClientSearch}`);
    const picker = input.closest("[data-activity-group-client-picker]");
    const toggle = picker?.querySelector("[data-activity-group-client-toggle]");
    const optionsBox = picker?.querySelector(".activity-group-client-options");
    const empty = picker?.querySelector(".group-search-empty");
    const closeOptions = () => {
      optionsBox?.classList.add("hidden");
      empty?.classList.add("hidden");
      if (optionsBox) {
        optionsBox.style.top = "";
        optionsBox.style.left = "";
        optionsBox.style.width = "";
      }
    };
    const positionOptions = () => {
      if (!optionsBox || optionsBox.classList.contains("hidden")) return;
      const inputRect = input.getBoundingClientRect();
      optionsBox.style.top = (inputRect.bottom + 6) + "px";
      optionsBox.style.left = inputRect.left + "px";
      optionsBox.style.width = Math.max(inputRect.width, 220) + "px";
    };
    const filterOptions = (showAll = false) => {
      const query = showAll ? "" : input.value.trim().toLowerCase();
      let visibleCount = 0;
      let exactValue = "";
      optionsBox?.querySelectorAll("[data-activity-group-client-option]").forEach((option) => {
        const label = option.dataset.activityGroupClientOption || option.textContent.trim();
        const matches = !query || String(option.dataset.searchText || label).toLowerCase().includes(query);
        option.classList.toggle("hidden", !matches);
        if (matches) visibleCount += 1;
        if (label.toLowerCase() === input.value.trim().toLowerCase()) exactValue = label;
      });
      if (hidden) hidden.value = exactValue;
      optionsBox?.classList.toggle("hidden", visibleCount === 0);
      empty?.classList.toggle("hidden", visibleCount > 0);
      if (visibleCount > 0) positionOptions();
      else closeOptions();
    };
    toggle?.addEventListener("click", () => {
      if (!optionsBox || optionsBox.classList.contains("hidden")) {
        if (optionsBox && optionsBox.parentElement !== document.body) document.body.appendChild(optionsBox);
        input.focus();
        filterOptions(true);
        return;
      }
      closeOptions();
    });
    input.addEventListener("input", () => {
      if (input.value.trim() && optionsBox && optionsBox.parentElement !== document.body) document.body.appendChild(optionsBox);
      if (input.value.trim()) {
        filterOptions(false);
        return;
      }
      if (hidden) hidden.value = "";
      closeOptions();
    });
    window.addEventListener("resize", positionOptions);
    window.addEventListener("scroll", positionOptions, true);
    optionsBox?.addEventListener("click", (event) => {
      const option = event.target.closest("[data-activity-group-client-option]");
      if (!option) return;
      const value = option.dataset.activityGroupClientOption || option.textContent.trim();
      input.value = value;
      if (hidden) hidden.value = value;
      closeOptions();
    });
  });

  if (!activityGroupClientOutsideClickBound) {
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-activity-group-client-picker]") || event.target.closest(".activity-group-client-options")) return;
      document.querySelectorAll(".activity-group-client-options").forEach((box) => box.classList.add("hidden"));
      app.querySelectorAll(".activity-group-client-picker .group-search-empty").forEach((item) => item.classList.add("hidden"));
      document.querySelectorAll(".activity-group-client-options").forEach((box) => {
        box.style.top = "";
        box.style.left = "";
        box.style.width = "";
      });
    });
    activityGroupClientOutsideClickBound = true;
  }
}
function bindEmployeeEvents() {
  const employee = getCurrentEmployee();
  if (!employee) return;
  initializeActivityGroupClientPickers();

  app.querySelector("#acceptOfferBtn")?.addEventListener("click", () => {
    setState({
      employees: state.employees.map((item) => item.id === employee.id ? {
        ...item,
        status: "Accepted",
        hiring: { ...item.hiring, offerStatus: "accepted", offerAcceptedAt: todayDdMmYyyy(), profileEditAllowed: true }
      } : item),
      activeSection: "profile"
    });
  });

  app.querySelector("#employeeProfileForgotPasswordBtn")?.addEventListener("click", () => showModalMessage("Employee password reset", getPasswordRecoveryMessage("employee")));

  app.querySelector("#employeePasswordForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentPassword = app.querySelector("#employeeCurrentPassword")?.value || "";
    const password = app.querySelector("#employeeNewPassword")?.value.trim() || "";
    const confirmPassword = app.querySelector("#employeeConfirmPassword")?.value.trim() || "";
    if (currentPassword !== employee.credentials?.password) {
      showModalMessage("Current password mismatch", "The current password is not correct.");
      return;
    }
    if (password.length < 6) {
      showModalMessage("Password too short", "Please enter a new password with at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showModalMessage("Password mismatch", "The new password and confirmation do not match.");
      return;
    }
    const updatedEmployee = { ...employee, credentials: { ...(employee.credentials || {}), password } };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item), activeSection: "profile" });
    showModalMessage("Password changed", "Your password has been updated for future logins.", "success");
  });

  app.querySelector("#employeeOnboardingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const details = collectOnboardingValues("onboarding_");
    const missing = state.onboardingTemplate.fields.filter((field) => field.required && !String(details[field.key] || "").trim()).map((field) => field.label);
    if (missing.length) {
      showModalMessage("Onboarding form is incomplete", `Please complete all mandatory fields before submitting.\n\nMissing fields:\n${missing.join("\n")}`);
      return;
    }
    const updatedEmployee = {
      ...employee,
      fullName: details.legalName || employee.fullName,
      onboardingDetails: { ...employee.onboardingDetails, ...details },
      profile: mergeOnboardingIntoProfile(employee, details),
      hiring: { ...employee.hiring, onboardingSubmittedAt: todayDdMmYyyy(), profileEditAllowed: true, profileReviewed: false }
    };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item), activeSection: "overview" });
    showModalMessage("Onboarding submitted", "Your employee details have been submitted and your profile is now locked until admin approval.", "success");
  });

  
  app.querySelector("#saveProfileDraftBtn")?.addEventListener("click", async () => {
    clearProfileValidationState();
    const updatedOnboardingDetails = { ...employee.onboardingDetails };
    app.querySelectorAll("[data-profile-detail-key]").forEach((element) => {
      updatedOnboardingDetails[element.dataset.profileDetailKey] = element.value.trim();
    });
    const basicKeys = ["legalName", "phone", "dateOfBirth", "personalMailId", "motherName", "fatherName", "maritalStatus", "emergencyContact", "pan", "adharNo"];
    const missingKeys = basicKeys.filter(k => !String(updatedOnboardingDetails[k] || "").trim());
    if (missingKeys.length) {
      missingKeys.forEach((key) => markProfileFieldMissing(key));
      app.querySelector('.profile-row-input.is-missing, .sheet-input.is-missing')?.focus();
      showModalMessage("Basic fields missing", "Please fill all basic details up to Aadhar No. to save as draft.");
      return;
    }
    
    // Process attachments for draft save as well
    const nextAttachments = { ...employee.attachments };
    const fileInputs = Array.from(app.querySelectorAll("[data-attachment-key]"));
    for (const input of fileInputs) {
      const file = input.files?.[0];
      if (file) {
        try {
          const savedFileId = await uploadAttachment(file);
          nextAttachments[input.dataset.attachmentKey] = { 
            fileName: file.name, 
            savedFileId, 
            uploadedAt: `${todayDdMmYyyy()} ${formatTime()}` 
          };
        } catch (e) {
          showModalMessage("Upload failed", `Failed to upload ${file.name}: ${e.message}`);
          return;
        }
      }
    }

    const updatedEmployee = {
      ...employee,
      onboardingDetails: updatedOnboardingDetails,
      attachments: nextAttachments,
      profile: mergeOnboardingIntoProfile(employee, updatedOnboardingDetails),
      hiring: { ...employee.hiring, profileDraftSaved: true }
    };
    setState({
      employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item)
    });
    showModalMessage("Draft saved", "Your basic details and any selected attachments have been saved. You can now access other features, but please remember to fill the complete form.", "success");
  });
  app.querySelector("#profileForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!employee.hiring.profileEditAllowed) return;
    clearProfileValidationState();
    const updatedOnboardingDetails = { ...employee.onboardingDetails };
    app.querySelectorAll("[data-profile-detail-key]").forEach((element) => {
      updatedOnboardingDetails[element.dataset.profileDetailKey] = element.value.trim();
    });
    const educationRows = Array.from(app.querySelectorAll('[data-structured-table="educationalDetails"]')).reduce((rows, element) => { const index = Number(element.dataset.structuredRow); rows[index] = rows[index] || {}; rows[index][element.dataset.structuredHeader] = element.value.trim(); return rows; }, []);
    const previousCompanyRows = Array.from(app.querySelectorAll('[data-structured-table="previousCompanyDetails"]')).reduce((rows, element) => { const index = Number(element.dataset.structuredRow); rows[index] = rows[index] || {}; rows[index][element.dataset.structuredHeader] = element.value.trim(); return rows; }, []);
    const meta = getProfileFieldMeta({ ...employee, onboardingDetails: updatedOnboardingDetails });
    const sameAsPresent = app.querySelector("#sameAsPresentAddress")?.checked;
    if (sameAsPresent) {
      PRESENT_ADDRESS_KEYS.forEach((key, index) => {
        updatedOnboardingDetails[PERMANENT_ADDRESS_KEYS[index]] = updatedOnboardingDetails[key] || "";
      });
    }
    const experienceType = String(updatedOnboardingDetails.experienceType || "").trim();
    const requiredFields = Object.values(meta).filter((field) => field.required && !["bankDetailsAttachment", "address"].includes(field.key));
    const pfAvailable = String(updatedOnboardingDetails.pfAvailable || "").trim();
    const missingRequired = requiredFields.filter((field) => {
      if (field.key === "pfAvailable" && experienceType !== "Experienced") return false;
      if (["pfNo"].includes(field.key) && (experienceType !== "Experienced" || pfAvailable !== "Yes")) return false;
      return !String(updatedOnboardingDetails[field.key] || "").trim();
    });
    const educationMissing = !validateStructuredTableRows(educationRows, EDUCATION_HEADERS, true);
    const previousCompanyMissing = experienceType === "Experienced" && !validateStructuredTableRows(previousCompanyRows, PREVIOUS_COMPANY_HEADERS, true);
    updatedOnboardingDetails.educationalDetails = serializeStructuredEntries(educationRows, EDUCATION_HEADERS);
    updatedOnboardingDetails.previousCompanyDetails = experienceType === "Experienced" ? serializeStructuredEntries(previousCompanyRows, PREVIOUS_COMPANY_HEADERS) : "";
    const nextAttachments = { ...employee.attachments };
    const fileInputs = Array.from(app.querySelectorAll("[data-attachment-key]"));
    for (const input of fileInputs) {
      const file = input.files?.[0];
      if (file) {
        try {
          const savedFileId = await uploadAttachment(file);
          nextAttachments[input.dataset.attachmentKey] = { 
            fileName: file.name, 
            savedFileId, 
            uploadedAt: `${todayDdMmYyyy()} ${formatTime()}` 
          };
        } catch (e) {
          showModalMessage("Upload failed", `Failed to upload ${file.name}: ${e.message}`);
          return;
        }
      }
    }
    const missingAttachments = PROFILE_ATTACHMENT_REQUIREMENTS.filter((item) => item.required !== false && !nextAttachments[item.key]);
    missingRequired.forEach((field) => markProfileFieldMissing(field.key));
    if (educationMissing) markStructuredSectionMissing("educationalDetails");
    if (previousCompanyMissing) markStructuredSectionMissing("previousCompanyDetails");
    missingAttachments.forEach((item) => markAttachmentMissing(item.key));
    if (missingRequired.length || educationMissing || previousCompanyMissing || missingAttachments.length) {
      const missingLabels = [
        ...missingRequired.map((field) => field.label),
        ...(educationMissing ? ["Educational details"] : []),
        ...(previousCompanyMissing ? ["Previous company details"] : []),
        ...missingAttachments.map((item) => item.label)
      ];
      app.querySelector('.profile-row-input.is-missing, .sheet-input.is-missing, .profile-attachment-table tr.is-missing input')?.focus();
      showModalMessage("Mandatory fields are incomplete", `Please fill all mandatory fields before saving.\n\nMissing items:\n${missingLabels.join("\n")}`);
      return;
    }
    const updatedEmployee = {
      ...employee,
      onboardingDetails: updatedOnboardingDetails,
      attachments: nextAttachments,
      profile: mergeOnboardingIntoProfile(employee, updatedOnboardingDetails),
      hiring: { ...employee.hiring, onboardingSubmittedAt: employee.hiring.onboardingSubmittedAt || todayDdMmYyyy(), profileEditAllowed: false, profileReviewed: true }
    };
    setState({
      session: { ...state.session, email: updatedEmployee.email },
      employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item)
    });
    showModalMessage("All details saved", "All details were saved successfully. The profile is now visible in non-editable mode.", "success", true);
  });

  app.querySelector("#employeeDocImportForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = app.querySelector("#employeeDocFile")?.files?.[0];
    if (!file) {
      showModalMessage("DOCX file missing", "Please choose the employee form before extracting details.");
      return;
    }
    try {
      const updatedEmployee = await importEmployeeDocxData(employee, file);
      setState({ session: { ...state.session, email: updatedEmployee.email }, employees: state.employees.map((item) => item.id === employee.id ? updatedEmployee : item), activeSection: "profile" });
      showModalMessage("Employee form extracted", "The uploaded DOCX fields were extracted into your profile. Please review the details and save the profile to lock them.", "success");
    } catch (error) {
      showModalMessage("DOCX import failed", error.message || "The uploaded file could not be processed.");
    }
  });

  app.querySelector('[data-add-structured-row="educationalDetails"]')?.addEventListener("click", () => {
    const body = app.querySelector('[data-structured-body="educationalDetails"]');
    if (!body) return;
    body.insertAdjacentHTML("beforeend", createStructuredEntryRow("educationalDetails", EDUCATION_HEADERS, EDUCATION_HEADERS.map((header) => `${header} *`), {}, body.children.length, false));
  });

  app.querySelector('[data-add-structured-row="previousCompanyDetails"]')?.addEventListener("click", () => {
    const body = app.querySelector('[data-structured-body="previousCompanyDetails"]');
    if (!body) return;
    body.insertAdjacentHTML("beforeend", createStructuredEntryRow("previousCompanyDetails", PREVIOUS_COMPANY_HEADERS, PREVIOUS_COMPANY_HEADERS, {}, body.children.length, false));
  });
  app.querySelector('[data-structured-body="educationalDetails"]')?.addEventListener("click", (event) => {
    const button = event.target.closest('[data-delete-structured-row="educationalDetails"]');
    if (!button) return;
    button.closest("tr")?.remove();
    reindexStructuredTableRows("educationalDetails");
  });

  app.querySelector('[data-structured-body="previousCompanyDetails"]')?.addEventListener("click", (event) => {
    const button = event.target.closest('[data-delete-structured-row="previousCompanyDetails"]');
    if (!button) return;
    button.closest("tr")?.remove();
    reindexStructuredTableRows("previousCompanyDetails");
  });
  const syncSameAsPresentAddress = (clearOnUnlock = true) => {
    const checkbox = app.querySelector("#sameAsPresentAddress");
    const checked = Boolean(checkbox?.checked);
    PRESENT_ADDRESS_KEYS.forEach((key, index) => {
      const presentInput = app.querySelector(`#profile_detail_${key}`);
      const permanentKey = PERMANENT_ADDRESS_KEYS[index];
      const permanentInput = app.querySelector(`#profile_detail_${permanentKey}`);
      if (!permanentInput) return;
      if (checked && presentInput) {
        permanentInput.value = presentInput.value;
      } else if (clearOnUnlock && presentInput && permanentInput.value === presentInput.value) {
        permanentInput.value = "";
      }
      permanentInput.disabled = checked || !employee.hiring.profileEditAllowed;
    });
  };

  app.querySelector("#sameAsPresentAddress")?.addEventListener("change", () => syncSameAsPresentAddress(true));
  PRESENT_ADDRESS_KEYS.forEach((key) => {
    app.querySelector(`#profile_detail_${key}`)?.addEventListener("input", () => {
      if (app.querySelector("#sameAsPresentAddress")?.checked) syncSameAsPresentAddress(false);
    });
  });

  const syncExperienceConditionalFields = () => {
    const experienceInput = app.querySelector("#profile_detail_experienceType");
    const pfAvailableInput = app.querySelector("#profile_detail_pfAvailable");
    const experienced = experienceInput?.value === "Experienced";
    const pfAvailable = pfAvailableInput?.value === "Yes";
    const pfAvailableRow = app.querySelector(`[data-profile-field-row="pfAvailable"]`);
    const pfNoRow = app.querySelector(`[data-profile-field-row="pfNo"]`);
    
    if (pfAvailableRow) pfAvailableRow.style.display = experienced ? "" : "none";
    if (pfNoRow) pfNoRow.style.display = experienced && pfAvailable ? "" : "none";
    
    const previousCard = app.querySelector('[data-structured-card="previousCompanyDetails"]');
    if (previousCard) previousCard.style.display = experienced ? "" : "none";
  };

  app.querySelector("#profile_detail_experienceType")?.addEventListener("change", syncExperienceConditionalFields);
  app.querySelector("#profile_detail_pfAvailable")?.addEventListener("change", syncExperienceConditionalFields);

  syncSameAsPresentAddress(false);
  syncExperienceConditionalFields();


  const syncWfhRequestDraft = () => {
    setState({
      wfhRequestDraft: {
        date: normalizeActivityDateValue(app.querySelector("#wfhRequestDate")?.value.trim() || todayDdMmYyyy()),
        reason: app.querySelector("#wfhReason")?.value || ""
      },
      activeSection: "leave_wfh"
    });
  };
  app.querySelector("#wfhRequestDate")?.addEventListener("change", syncWfhRequestDraft);
  app.querySelector("#wfhRequestDate")?.addEventListener("blur", syncWfhRequestDraft);
  app.querySelector("#wfhReason")?.addEventListener("change", syncWfhRequestDraft);

  const syncLeaveRequestDraft = () => {
    const fromDate = normalizeActivityDateValue(app.querySelector("#leaveRequestFromDate")?.value.trim() || todayDdMmYyyy());
    const toDate = normalizeActivityDateValue(app.querySelector("#leaveRequestToDate")?.value.trim() || fromDate);
    setState({
      leaveRequestDraft: {
        date: fromDate,
        fromDate,
        toDate,
        type: app.querySelector("#leaveRequestType")?.value || "privilege",
        reason: app.querySelector("#leaveReason")?.value || ""
      },
      activeSection: "leave_wfh"
    });
  };
  app.querySelector("#leaveRequestFromDate")?.addEventListener("change", syncLeaveRequestDraft);
  app.querySelector("#leaveRequestFromDate")?.addEventListener("blur", syncLeaveRequestDraft);
  app.querySelector("#leaveRequestToDate")?.addEventListener("change", syncLeaveRequestDraft);
  app.querySelector("#leaveRequestToDate")?.addEventListener("blur", syncLeaveRequestDraft);
  app.querySelector("#leaveRequestType")?.addEventListener("change", syncLeaveRequestDraft);
  app.querySelector("#leaveReason")?.addEventListener("change", syncLeaveRequestDraft);

  const openLeaveWfhDatePicker = (target) => {
    const valueByTarget = {
      wfh: normalizeActivityDateValue(app.querySelector("#wfhRequestDate")?.value || todayDdMmYyyy()),
      leaveFrom: normalizeActivityDateValue(app.querySelector("#leaveRequestFromDate")?.value || todayDdMmYyyy()),
      leaveTo: normalizeActivityDateValue(app.querySelector("#leaveRequestToDate")?.value || todayDdMmYyyy())
    };
    const parsed = parseDdMmYyyy(valueByTarget[target]) || new Date();
    setState({ leaveWfhDatePicker: { target, mode: "months", year: parsed.getFullYear(), month: parsed.getMonth() + 1 }, activeSection: "leave_wfh" });
  };
  app.querySelectorAll("[data-leave-wfh-date-open]").forEach((input) => {
    input.addEventListener("click", () => openLeaveWfhDatePicker(input.dataset.leaveWfhDateOpen));
    input.addEventListener("focus", () => openLeaveWfhDatePicker(input.dataset.leaveWfhDateOpen));
  });
  app.querySelectorAll("[data-leave-wfh-picker-year]").forEach((button) => {
    button.addEventListener("click", () => setState({ leaveWfhDatePicker: { ...(state.leaveWfhDatePicker || {}), year: Number(button.dataset.leaveWfhPickerYear) }, activeSection: "leave_wfh" }));
  });
  app.querySelectorAll("[data-leave-wfh-picker-month]").forEach((button) => {
    button.addEventListener("click", () => setState({ leaveWfhDatePicker: { ...(state.leaveWfhDatePicker || {}), month: Number(button.dataset.leaveWfhPickerMonth), mode: "days" }, activeSection: "leave_wfh" }));
  });
  app.querySelectorAll("[data-leave-wfh-picker-month-shift]").forEach((button) => {
    button.addEventListener("click", () => setState({ leaveWfhDatePicker: { ...(state.leaveWfhDatePicker || {}), month: Number(button.dataset.leaveWfhPickerMonthShift), year: Number(button.dataset.leaveWfhPickerShiftYear), mode: "days" }, activeSection: "leave_wfh" }));
  });
  app.querySelectorAll("[data-leave-wfh-picker-mode]").forEach((button) => {
    button.addEventListener("click", () => setState({ leaveWfhDatePicker: { ...(state.leaveWfhDatePicker || {}), mode: button.dataset.leaveWfhPickerMode || "months" }, activeSection: "leave_wfh" }));
  });
  app.querySelector("[data-leave-wfh-picker-close]")?.addEventListener("click", () => setState({ leaveWfhDatePicker: null, activeSection: "leave_wfh" }));
  app.querySelectorAll("[data-leave-wfh-picker-select]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = state.leaveWfhDatePicker?.target || "";
      const selectedDate = normalizeActivityDateValue(button.dataset.leaveWfhPickerSelect || "");
      const currentLeaveType = app.querySelector("#leaveRequestType")?.value || "privilege";
      const currentLeaveReason = app.querySelector("#leaveReason")?.value || "";
      const currentWfhReason = app.querySelector("#wfhReason")?.value || "";
      const currentFrom = normalizeActivityDateValue(app.querySelector("#leaveRequestFromDate")?.value || todayDdMmYyyy());
      const currentTo = normalizeActivityDateValue(app.querySelector("#leaveRequestToDate")?.value || currentFrom);
      const nextState = { leaveWfhDatePicker: null, activeSection: "leave_wfh" };
      if (target === "wfh") nextState.wfhRequestDraft = { date: selectedDate, reason: currentWfhReason };
      if (target === "leaveFrom") nextState.leaveRequestDraft = { date: selectedDate, fromDate: selectedDate, toDate: currentTo, type: currentLeaveType, reason: currentLeaveReason };
      if (target === "leaveTo") nextState.leaveRequestDraft = { date: currentFrom, fromDate: currentFrom, toDate: selectedDate, type: currentLeaveType, reason: currentLeaveReason };
      setState(nextState);
    });
  });

  app.querySelectorAll("[data-leave-wfh-calendar-month]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      setState({ leaveWfhCalendarMonth: button.dataset.leaveWfhCalendarMonth, activeSection: "leave_wfh" });
    });
  });
  app.querySelectorAll("[data-leave-wfh-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const date = normalizeActivityDateValue(button.dataset.leaveWfhCalendarDate || "");
      if (!date || !isLeaveWfhDateSelectable(employee, date).selectable) return;
      const selected = new Set(state.leaveWfhSelectedDates || []);
      const wasSelected = selected.has(date);
      if (wasSelected) selected.delete(date); else selected.add(date);
      setState({ leaveWfhSelectedDates: Array.from(selected).sort((a, b) => parseDateSortValue(a) - parseDateSortValue(b)), activeSection: "leave_wfh" });
      if (!wasSelected) {
        const awarenessMessage = getGroupLeaveWfhAwarenessMessage(employee, date);
        if (awarenessMessage) showModalMessage("Team availability notice", awarenessMessage, "warning", false, "Close & proceed");
      }
    });
  });
  app.querySelectorAll("[data-leave-wfh-remove-date]").forEach((button) => {
    button.addEventListener("click", () => {
      const date = normalizeActivityDateValue(button.dataset.leaveWfhRemoveDate || "");
      setState({ leaveWfhSelectedDates: (state.leaveWfhSelectedDates || []).filter((item) => item !== date), activeSection: "leave_wfh" });
    });
  });
  app.querySelector("#downloadTeamLeaveWfhExcelBtn")?.addEventListener("click", () => downloadEmployeeGroupLeaveWfhExcel(employee));
  app.querySelector("#clearLeaveWfhSelectionBtn")?.addEventListener("click", () => setState({ leaveWfhSelectedDates: [], activeSection: "leave_wfh" }));
  app.querySelector("#leaveWfhCalendarRequestType")?.addEventListener("change", (event) => setState({ leaveWfhRequestType: event.target.value, activeSection: "leave_wfh" }));
  app.querySelector("#leaveWfhCalendarReason")?.addEventListener("change", (event) => setState({ leaveWfhRequestReason: event.target.value, activeSection: "leave_wfh" }));
  app.querySelector("#leaveWfhCalendarRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selectedDates = (state.leaveWfhSelectedDates || []).filter((date) => isLeaveWfhDateSelectable(employee, date).selectable).sort((a, b) => parseDateSortValue(a) - parseDateSortValue(b));
    const requestType = app.querySelector("#leaveWfhCalendarRequestType")?.value || state.leaveWfhRequestType || "wfh";
    const reason = app.querySelector("#leaveWfhCalendarReason")?.value.trim() || "";
    if (!selectedDates.length) {
      showModalMessage("No dates selected", "Please select one or more available dates from the calendar before sending the request.");
      return;
    }
    if (!reason) {
      showModalMessage("Reason is required", "Please enter the reason before sending the request.");
      return;
    }
    if (requestType === "wfh") {
      const policy = getWfhPolicy();
      const byMonth = new Map();
      const byWeek = new Map();
      selectedDates.forEach((date) => {
        const monthKey = getMonthKeyFromDateValue(date);
        const weekRange = getWeekRangeForDate(date);
        const weekKey = `${weekRange.from}-${weekRange.to}`;
        byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
        byWeek.set(weekKey, { date, count: (byWeek.get(weekKey)?.count || 0) + 1 });
      });
      for (const [monthKey, count] of byMonth.entries()) {
        const probeDate = `01-${monthKey.slice(5, 7)}-${monthKey.slice(0, 4)}`;
        if (getEmployeeWfhCountForMonth(employee.id, probeDate) + count > policy.monthlyLimit) {
          showModalMessage("Monthly WFH limit reached", `Only ${policy.monthlyLimit} Work From Home request(s) are allowed in a month. Weekly WFH requests will reopen next month.`);
          return;
        }
      }
      for (const item of byWeek.values()) {
        if (getEmployeeWfhCountForWeek(employee.id, item.date) + item.count > policy.weeklyLimit) {
          showModalMessage("Weekly WFH limit reached", `Only ${policy.weeklyLimit} Work From Home request(s) are allowed in a week.`);
          return;
        }
      }
      const submittedAt = buildTimestamp();
      const autoApproved = Boolean(state.wfhAutoApproval);
      const requests = selectedDates.map((date, index) => ({ id: `WFH-${Date.now()}-${index}`, employeeId: employee.id, date, reason, status: autoApproved ? "accepted" : "pending", submittedAt, reviewedAt: autoApproved ? submittedAt : "", reviewedBy: autoApproved ? `${state.adminProfile.name} (auto approval)` : "", revokedAt: "" }));
      const notifications = requests.flatMap((request) => createWfhRequestNotifications(employee, request));
      setState({ wfhRequests: [...requests, ...(state.wfhRequests || [])], notifications: [...notifications, ...(state.notifications || [])], leaveWfhSelectedDates: [], leaveWfhRequestReason: "", leaveWfhRequestType: requestType, activeSection: "leave_wfh" });
      showModalMessage("WFH request sent", state.wfhAutoApproval ? "Your Work From Home request has been auto-approved and shared with your group members." : "Your Work From Home request has been sent to admin and your group members.", "success");
      return;
    }
    const leaveType = getLeaveTypeConfig(requestType);
    const leaveDatesByYear = new Map();
    selectedDates.forEach((date) => {
      const year = getHolidayYear(date) || String(new Date().getFullYear());
      leaveDatesByYear.set(year, [...(leaveDatesByYear.get(year) || []), date]);
    });
    for (const dates of leaveDatesByYear.values()) {
      const balance = getEmployeeLeaveBalance(employee.id, dates[0]);
      const remaining = leaveType.key === "sick" ? balance.sickRemaining : balance.privilegeRemaining;
      if (dates.length > remaining) {
        showModalMessage("Leave balance exhausted", `Only ${remaining} ${leaveType.label} day(s) are available for ${balance.year}.`);
        return;
      }
    }
    const submittedAt = buildTimestamp();
    const autoApproved = Boolean(state.leaveAutoApproval);
    const requests = selectedDates.map((date, index) => ({ id: `LEV-${Date.now()}-${index}`, employeeId: employee.id, date, type: leaveType.key, reason, status: autoApproved ? "accepted" : "pending", submittedAt, reviewedAt: autoApproved ? submittedAt : "", reviewedBy: autoApproved ? `${state.adminProfile.name} (auto approval)` : "", revokedAt: "" }));
    const notifications = requests.flatMap((request) => createLeaveRequestNotifications(employee, request));
    setState({ leaveRequests: [...requests, ...(state.leaveRequests || [])], notifications: [...notifications, ...(state.notifications || [])], leaveWfhSelectedDates: [], leaveWfhRequestReason: "", leaveWfhRequestType: requestType, activeSection: "leave_wfh" });
    showModalMessage("Leave request sent", state.leaveAutoApproval ? "Your leave request has been auto-approved and shared with your group members." : "Your leave request has been sent to admin and your group members.", "success");
  });
  app.querySelector("#restrictedHolidayForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const holidayId = app.querySelector("#restrictedHolidaySelect")?.value || "";
    const reason = app.querySelector("#restrictedHolidayReason")?.value.trim() || "";
    const holiday = getRestrictedHolidayOptions(getEmployeeHolidayCalendar(employee).calendar).find((item) => item.id === holidayId);
    if (!holiday || !reason) {
      showModalMessage("Restricted holiday is incomplete", "Please select the restricted holiday and enter a reason before applying.");
      return;
    }
    if (!isFutureDateOnly(holiday.date)) {
      showModalMessage("Restricted holiday date passed", "Restricted holiday can only be applied before the holiday date.");
      return;
    }
    const year = getHolidayYear(holiday.date);
    if (hasActiveRestrictedHolidayForYear(employee.id, year)) {
      showModalMessage("Restricted holiday limit reached", `Only one restricted holiday can be applied in ${year}.`);
      return;
    }
    const request = { id: `RH-${Date.now()}`, employeeId: employee.id, holidayId: holiday.id, date: holiday.date, holidayName: holiday.name, reason, status: "pending", submittedAt: buildTimestamp(), reviewedAt: "", reviewedBy: "" };
    setState({ holidayRequests: [request, ...(state.holidayRequests || [])], notifications: [...createRestrictedHolidayNotifications(employee, request), ...(state.notifications || [])], activeSection: "holiday" });
    showModalMessage("Restricted holiday requested", "Your restricted holiday request has been sent to admin for approval.", "success");
  });

  app.querySelector("#wfhRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestDate = normalizeActivityDateValue(app.querySelector("#wfhRequestDate")?.value.trim() || "");
    const reason = app.querySelector("#wfhReason")?.value.trim() || "";
    if (!requestDate || !reason) {
      showModalMessage("WFH request is incomplete", "Please select the Work From Home date and enter the reason before sending the request.");
      return;
    }
    if (!isFutureDateOnly(requestDate)) {
      showModalMessage("WFH date not allowed", "Employees can apply Work From Home only for a future date. Same-day and past-date WFH can be marked only by admin as special WFH.");
      return;
    }
    const wfhPolicy = getWfhPolicy();
    if (!isWithinRequestWindow(requestDate, wfhPolicy.requestWindowMonths)) {
      showModalMessage("WFH date outside policy", "Employees can apply Work From Home only within the next " + wfhPolicy.requestWindowMonths + " month(s).");
      return;
    }
    if (isSundayDate(requestDate) || isHolidayDate(requestDate)) {
      showModalMessage("WFH request not required", "Work From Home cannot be requested for Sundays or configured holidays.");
      return;
    }
    if (getActiveWfhRequestForDate(employee.id, requestDate)) {
      showModalMessage("WFH request already exists", "A pending or accepted Work From Home request already exists for this date.");
      return;
    }
    if (getEmployeeWfhCountForMonth(employee.id, requestDate) >= wfhPolicy.monthlyLimit) {
      showModalMessage("Monthly WFH limit reached", `Only ${wfhPolicy.monthlyLimit} Work From Home request(s) are allowed in a month. Weekly WFH requests will reopen next month.`);
      return;
    }
    if (getEmployeeWfhCountForWeek(employee.id, requestDate) >= wfhPolicy.weeklyLimit) {
      showModalMessage("Weekly WFH limit reached", `Only ${wfhPolicy.weeklyLimit} Work From Home request(s) are allowed in a week.`);
      return;
    }
    const submittedAt = buildTimestamp();
    const autoApproved = Boolean(state.wfhAutoApproval);
    const request = { id: `WFH-${Date.now()}`, employeeId: employee.id, date: requestDate, reason, status: autoApproved ? "accepted" : "pending", submittedAt, reviewedAt: autoApproved ? submittedAt : "", reviewedBy: autoApproved ? `${state.adminProfile.name} (auto approval)` : "", revokedAt: "" };
    setState({
      wfhRequests: [request, ...(state.wfhRequests || [])],
      notifications: [...createWfhRequestNotifications(employee, request), ...(state.notifications || [])],
      wfhRequestDraft: { date: requestDate, reason: "" },
      activeSection: "leave_wfh"
    });
    showModalMessage("WFH request sent", state.wfhAutoApproval ? "Your Work From Home request has been auto-approved and shared with your group members." : "Your Work From Home request has been sent to admin and your group members.", "success");
  });

  app.querySelector("#wfhRevokeBtn")?.addEventListener("click", () => {
    const requestDate = normalizeActivityDateValue(app.querySelector("#wfhRequestDate")?.value.trim() || "");
    const request = getPendingWfhRequestForDate(employee.id, requestDate);
    if (!request || !canRevokeWfhRequest(request)) {
      showModalMessage("Revoke unavailable", "Only a pending future-dated Work From Home request can be revoked.");
      return;
    }
    const updatedRequests = (state.wfhRequests || []).map((item) => item.id === request.id ? { ...item, status: "revoked", revokedAt: buildTimestamp() } : item);
    const adminNotification = createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Work From Home request revoked", message: `${getEmployeeDisplayName(employee)} revoked the Work From Home request for ${request.date}.` });
    setState({ wfhRequests: updatedRequests, notifications: [adminNotification, ...(state.notifications || [])], wfhRequestDraft: { date: request.date, reason: "" }, activeSection: "leave_wfh" });
    showModalMessage("WFH request revoked", "The selected Work From Home request has been revoked.", "success");
  });

  app.querySelectorAll("[data-wfh-revoke-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = (state.wfhRequests || []).find((item) => item.id === button.dataset.wfhRevokeId);
      if (!request || !canRevokeWfhRequest(request)) return;
      const updatedRequests = (state.wfhRequests || []).map((item) => item.id === request.id ? { ...item, status: "revoked", revokedAt: buildTimestamp() } : item);
      const adminNotification = createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Work From Home request revoked", message: `${getEmployeeDisplayName(employee)} revoked the Work From Home request for ${request.date}.` });
      setState({ wfhRequests: updatedRequests, notifications: [adminNotification, ...(state.notifications || [])], wfhRequestDraft: { date: request.date, reason: "" }, activeSection: "leave_wfh" });
      showModalMessage("WFH request revoked", "The selected Work From Home request has been revoked.", "success");
    });
  });

  app.querySelector("#leaveRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fromDate = normalizeActivityDateValue(app.querySelector("#leaveRequestFromDate")?.value.trim() || "");
    const toDate = normalizeActivityDateValue(app.querySelector("#leaveRequestToDate")?.value.trim() || "");
    const type = app.querySelector("#leaveRequestType")?.value || "privilege";
    const reason = app.querySelector("#leaveReason")?.value.trim() || "";
    const leaveType = getLeaveTypeConfig(type);
    const dateRange = getDatesInRange(fromDate, toDate);
    if (!fromDate || !toDate || !reason || !dateRange.length) {
      showModalMessage("Leave request is incomplete", "Please select valid from and to dates, leave type, and enter the reason before sending the request.");
      return;
    }
    const nonFutureDates = dateRange.filter((date) => !isFutureDateOnly(date));
    if (nonFutureDates.length) {
      showModalMessage("Leave date not allowed", "Employees can apply leave only for future dates. Same-day and past-date leave can be handled by admin later.");
      return;
    }
    const leavePolicy = getLeavePolicy();
    const outOfWindowDates = dateRange.filter((date) => !isWithinRequestWindow(date, leavePolicy.requestWindowMonths));
    if (outOfWindowDates.length) {
      showModalMessage("Leave date outside policy", "Employees can apply leave only within the next " + leavePolicy.requestWindowMonths + " month(s). Dates outside policy: " + outOfWindowDates.join(", ") + ".");
      return;
    }
    const blockedDates = dateRange.filter((date) => isSundayDate(date) || isHolidayDate(date));
    if (blockedDates.length) {
      showModalMessage("Leave request not required", `Leave cannot be requested for Sundays or configured holidays: ${blockedDates.join(", ")}.`);
      return;
    }
    const existingLeaveDates = dateRange.filter((date) => getActiveLeaveRequestForDate(employee.id, date, type));
    if (existingLeaveDates.length) {
      showModalMessage("Leave request already exists", `A pending or accepted leave request already exists for: ${existingLeaveDates.join(", ")}.`);
      return;
    }
    const existingWfhDates = dateRange.filter((date) => getActiveWfhRequestForDate(employee.id, date));
    if (existingWfhDates.length) {
      showModalMessage("WFH already exists", `A pending or accepted Work From Home request already exists for: ${existingWfhDates.join(", ")}.`);
      return;
    }
    const leaveBalance = getEmployeeLeaveBalance(employee.id, fromDate);
    const remaining = type === "sick" ? leaveBalance.sickRemaining : leaveBalance.privilegeRemaining;
    if (dateRange.length > remaining) {
      showModalMessage("Leave balance exhausted", `Only ${remaining} ${leaveType.label} day(s) are available for the selected year.`);
      return;
    }
    const submittedAt = buildTimestamp();
    const autoApproved = Boolean(state.leaveAutoApproval);
    const requests = dateRange.map((date, index) => ({ id: `LEV-${Date.now()}-${index}`, employeeId: employee.id, date, type, reason, status: autoApproved ? "accepted" : "pending", submittedAt, reviewedAt: autoApproved ? submittedAt : "", reviewedBy: autoApproved ? `${state.adminProfile.name} (auto approval)` : "", revokedAt: "" }));
    const rangeLabel = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;
    const groupMemberNotifications = getWfhGroupRecipientIds(employee.id).map((employeeId) => createNotification({ recipientRole: "employee", employeeId, title: "Group member leave request", message: `${getEmployeeDisplayName(employee)} requested ${leaveType.label} for ${rangeLabel}.` }));
    const notifications = [createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Leave request raised", message: `${getEmployeeDisplayName(employee)} requested ${leaveType.label} for ${rangeLabel}.` }), ...groupMemberNotifications];
    setState({
      leaveRequests: [...requests, ...(state.leaveRequests || [])],
      notifications: [...notifications, ...(state.notifications || [])],
      leaveRequestDraft: { date: fromDate, fromDate, toDate, type, reason: "" },
      activeSection: "leave_wfh"
    });
    showModalMessage("Leave request sent", state.leaveAutoApproval ? "Your leave request has been auto-approved and shared with your group members." : "Your leave request has been sent to admin and your group members.", "success");
  });

  app.querySelector("#leaveRevokeBtn")?.addEventListener("click", () => {
    const fromDate = normalizeActivityDateValue(app.querySelector("#leaveRequestFromDate")?.value.trim() || "");
    const toDate = normalizeActivityDateValue(app.querySelector("#leaveRequestToDate")?.value.trim() || fromDate);
    const type = app.querySelector("#leaveRequestType")?.value || "privilege";
    const dateRange = getDatesInRange(fromDate, toDate);
    const requests = dateRange.map((date) => getPendingLeaveRequestForDate(employee.id, date, type)).filter(Boolean).filter((request) => canRevokeLeaveRequest(request));
    if (!requests.length || requests.length !== dateRange.length) {
      showModalMessage("Revoke unavailable", "Only pending future-dated leave requests in the selected range can be revoked.");
      return;
    }
    const requestIds = new Set(requests.map((request) => request.id));
    const updatedRequests = (state.leaveRequests || []).map((item) => requestIds.has(item.id) ? { ...item, status: "revoked", revokedAt: buildTimestamp() } : item);
    const leaveType = getLeaveTypeConfig(type).label;
    const rangeLabel = fromDate === toDate ? fromDate : `${fromDate} to ${toDate}`;
    const adminNotification = createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Leave request revoked", message: `${getEmployeeDisplayName(employee)} revoked the ${leaveType} request for ${rangeLabel}.` });
    setState({ leaveRequests: updatedRequests, notifications: [adminNotification, ...(state.notifications || [])], leaveRequestDraft: { date: fromDate, fromDate, toDate, type, reason: "" }, activeSection: "leave_wfh" });
    showModalMessage("Leave request revoked", "The selected leave request has been revoked.", "success");
  });

  app.querySelectorAll("[data-leave-revoke-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = (state.leaveRequests || []).find((item) => item.id === button.dataset.leaveRevokeId);
      if (!request || !canRevokeLeaveRequest(request)) return;
      const updatedRequests = (state.leaveRequests || []).map((item) => item.id === request.id ? { ...item, status: "revoked", revokedAt: buildTimestamp() } : item);
      const leaveType = getLeaveTypeConfig(request.type).label;
      const adminNotification = createNotification({ recipientRole: "admin", employeeId: employee.id, title: "Leave request revoked", message: `${getEmployeeDisplayName(employee)} revoked the ${leaveType} request for ${request.date}.` });
      setState({ leaveRequests: updatedRequests, notifications: [adminNotification, ...(state.notifications || [])], leaveRequestDraft: { date: request.date, fromDate: request.date, toDate: request.date, type: request.type, reason: "" }, activeSection: "leave_wfh" });
      showModalMessage("Leave request revoked", "The selected leave request has been revoked.", "success");
    });
  });

  const syncAttendanceClaimDraft = () => {
    setState({
      attendanceClaimDraft: {
        attendanceDate: normalizeActivityDateValue(app.querySelector("#claimAttendanceDate")?.value.trim() || todayDdMmYyyy()),
        claimType: app.querySelector("#claimType")?.value || "",
        proposedTime: app.querySelector("#claimProposedTime")?.value || "",
        proposedCheckInTime: app.querySelector("#claimCheckInTime")?.value || "",
        proposedCheckOutTime: app.querySelector("#claimCheckOutTime")?.value || "",
        reason: app.querySelector("#claimReason")?.value || ""
      },
      activeSection: "attendance"
    });
  };
  ["#claimAttendanceDate", "#claimType", "#claimProposedTime", "#claimCheckInTime", "#claimCheckOutTime"].forEach((selector) => {
    app.querySelector(selector)?.addEventListener("change", syncAttendanceClaimDraft);
  });
  app.querySelector("#claimReason")?.addEventListener("change", syncAttendanceClaimDraft);

  app.querySelector("#attendanceClaimForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const claimDraft = {
      attendanceDate: normalizeActivityDateValue(app.querySelector("#claimAttendanceDate")?.value.trim() || todayDdMmYyyy()),
      claimType: app.querySelector("#claimType")?.value || "",
      proposedTime: app.querySelector("#claimProposedTime")?.value || "",
      proposedCheckInTime: app.querySelector("#claimCheckInTime")?.value || "",
      proposedCheckOutTime: app.querySelector("#claimCheckOutTime")?.value || "",
      reason: app.querySelector("#claimReason")?.value.trim() || ""
    };
    const weeklyCount = getEmployeeWeeklyClaimCount(employee.id, todayDdMmYyyy());
    if (weeklyCount >= 2) {
      showModalMessage("Weekly limit reached", "Only two attendance adjustment requests can be raised in one week.");
      return;
    }
    if (!claimDraft.attendanceDate || !claimDraft.claimType || !claimDraft.reason) {
      showModalMessage("Claim is incomplete", "Please complete the attendance date, claim type, and reason before raising the claim.");
      return;
    }
    if (claimDraft.claimType === "Missed check in and check out") {
      if (!claimDraft.proposedCheckInTime || !claimDraft.proposedCheckOutTime) {
        showModalMessage("Claim is incomplete", "Please enter both actual check in and actual check out time for this claim type.");
        return;
      }
    } else if (!claimDraft.proposedTime) {
      showModalMessage("Claim is incomplete", "Please enter the actual check in or check out time before raising the claim.");
      return;
    }
    const claim = {
      id: `CLM-${Date.now()}`,
      employeeId: employee.id,
      attendanceDate: claimDraft.attendanceDate,
      claimType: claimDraft.claimType,
      proposedTime: claimDraft.proposedTime,
      proposedCheckInTime: claimDraft.proposedCheckInTime,
      proposedCheckOutTime: claimDraft.proposedCheckOutTime,
      reason: claimDraft.reason,
      status: "pending",
      submittedAt: buildTimestamp()
    };
    const notification = createNotification({ recipientRole: "admin", employeeId: employee.id, claimId: claim.id, title: "Attendance adjustment claim raised", message: `${getEmployeeDisplayName(employee)} raised ${claim.claimType} for ${claim.attendanceDate}.` });
    setState({
      attendanceClaims: [claim, ...(state.attendanceClaims || [])],
      notifications: [notification, ...(state.notifications || [])],
      attendanceClaimDraft: { attendanceDate: todayDdMmYyyy(), claimType: "", proposedTime: "", proposedCheckInTime: "", proposedCheckOutTime: "", reason: "" },
      activeSection: "attendance"
    });
    showModalMessage("Claim raised", "Your attendance adjustment request has been sent to admin for review.", "success");
  });

  app.querySelectorAll("[data-attendance-calendar-month]").forEach((button) => {
    button.addEventListener("click", () => setState({ employeeAttendanceCalendarMonth: button.dataset.attendanceCalendarMonth || new Date().toISOString().slice(0, 7), activeSection: "attendance" }));
  });

  app.querySelector("#checkInBtn")?.addEventListener("click", () => captureLocationForEmployee(employee, "Check in"));
  app.querySelector("#checkOutBtn")?.addEventListener("click", () => captureLocationForEmployee(employee, "Check out"));
  app.querySelector("#addActivityRowBtn")?.addEventListener("click", () => {
    const nextRow = {
      rowId: `ACT-${Date.now()}`,
      slNo: employee.activities.length + 1,
      workflowStatus: "draft",
      values: normalizeActivityValues({}),
      savedAt: "",
      submittedAt: ""
    };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? { ...item, activities: [...item.activities, nextRow] } : item), activeSection: "activity" });
  });
  app.querySelector("#saveActivityRowBtn")?.addEventListener("click", () => saveActivityRows("save"));
  app.querySelector("#submitActivityRowBtn")?.addEventListener("click", () => saveActivityRows("submit"));
  app.querySelector("#downloadEmployeeActivityExcelBtn")?.addEventListener("click", () => downloadEmployeeActivityExcel(employee));
  app.querySelectorAll("[data-delete-activity-row]").forEach((button) => button.addEventListener("click", () => deleteEmployeeActivityRow(employee, button.dataset.deleteActivityRow)));
}

async function captureLocationForEmployee(employee, type) {
  const statusNode = app.querySelector("#locationStatus");
  const policy = getAttendancePolicyStatus();
  const buttonState = getAttendanceButtonState(employee);
  if (buttonState.isSunday) {
    showModalMessage("Attendance not required", "Attendance is not marked on Sundays.");
    return;
  }
  if (buttonState.isHoliday) {
    showModalMessage("Attendance not required", "Attendance is not marked on configured holidays.");
    return;
  }
  if (!policy.locationRuleEnabled) {
    const record = { type, date: todayDdMmYyyy(), time: formatTime(), latitude: "", longitude: "", officeDistanceMeters: 0 };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? { ...item, attendance: [record, ...item.attendance] } : item), activeSection: "attendance" });
    showModalMessage("Attendance captured", `${type} was recorded successfully.`, "success");
    return;
  }
  if (!policy.configured) {
    showModalMessage("Office location missing", "Admin must configure the office latitude, longitude, and radius before attendance can be marked.");
    return;
  }
  const timingPolicy = getAttendancePolicyTimingStatus();
  const currentMinutes = getCurrentTimeInMinutes();
  if (timingPolicy.enabled && String(type) === "Check in" && timingPolicy.checkInTime != null) {
    const lastAllowedCheckIn = timingPolicy.checkInTime + timingPolicy.checkInGraceMinutes;
    if (currentMinutes > lastAllowedCheckIn) {
      showModalMessage("Check in time window closed", `Check in can only be marked until ${state.attendancePolicy.checkInTime} with ${timingPolicy.checkInGraceMinutes} minutes grace. Please raise an attendance claim instead.`);
      return;
    }
  }
  if (timingPolicy.enabled && String(type) === "Check out" && timingPolicy.checkOutTime != null) {
    const firstAllowedCheckOut = timingPolicy.checkOutTime - timingPolicy.checkOutGraceMinutes;
    if (currentMinutes < firstAllowedCheckOut) {
      const firstAllowedHours = String(Math.floor(firstAllowedCheckOut / 60)).padStart(2, "0");
      const firstAllowedMinutes = String(firstAllowedCheckOut % 60).padStart(2, "0");
      showModalMessage("Check out not open yet", `Check out can only be marked from ${firstAllowedHours}:${firstAllowedMinutes} for the configured ${state.attendancePolicy.checkOutTime} check out time with ${timingPolicy.checkOutGraceMinutes} minutes grace. Please raise an attendance claim instead if needed.`);
      return;
    }
  }
  if (String(type) === "Check in" && buttonState.checkInDone) {
    showModalMessage("Check in already captured", "Check in can only be marked once in a single day.");
    return;
  }
  if (String(type) === "Check out" && buttonState.checkOutDone) {
    showModalMessage("Check out already captured", "Check out can only be marked once in a single day.");
    return;
  }
  if (String(type) === "Check out" && !buttonState.checkInDone) {
    showModalMessage("Check in required", "Please complete check in before marking check out.");
    return;
  }
  if (!navigator.geolocation) {
    showModalMessage("Location unavailable", "This browser does not support location capture for attendance.");
    return;
  }
  if (statusNode) statusNode.textContent = "Capturing your live location...";
  navigator.geolocation.getCurrentPosition((position) => {
    const distance = getAttendanceDistanceMeters(position.coords.latitude, position.coords.longitude, policy.lat, policy.lon);
    if (distance > policy.radius) {
      if (statusNode) statusNode.textContent = `You are outside the allowed office radius. Current distance ${Math.round(distance)} m.`;
      showModalMessage("Outside office radius", `Attendance can only be marked within ${policy.radius} meters of the configured office location.`);
      return;
    }
    const record = {
      type,
      date: todayDdMmYyyy(),
      time: formatTime(),
      latitude: position.coords.latitude.toFixed(6),
      longitude: position.coords.longitude.toFixed(6),
      officeDistanceMeters: Math.round(distance)
    };
    setState({ employees: state.employees.map((item) => item.id === employee.id ? { ...item, attendance: [record, ...item.attendance] } : item), activeSection: "attendance" });
    showModalMessage("Attendance captured", `${type} was recorded successfully within the allowed office radius.`, "success");
  }, (error) => {
    if (statusNode) statusNode.textContent = "Location permission is required before attendance can be marked.";
    showModalMessage("Location access required", error.message || "Please allow location access to mark attendance.");
  }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
}

function collectActivityRowValues(rowId) {
  const values = {};
  const groupClientOptions = getGroupClientOptions();
  for (const field of state.activityTemplate.fields) {
    if (field.key === "sl_no") continue;
    const element = app.querySelector(`#activity_${rowId}_${field.key}`);
    if (field.type === "groupClient") {
      const selectedValue = element?.value.trim() || "";
      values[field.key] = groupClientOptions.includes(selectedValue) ? selectedValue : "";
      continue;
    }
    values[field.key] = field.type === "date" ? normalizeActivityDateValue(element?.value.trim() || "") : (element?.value.trim() || "");
  }
  return values;
}

function saveActivityRows(action) {
  const employee = getCurrentEmployee();
  if (!employee) return;
  const selectedRowIds = Array.from(app.querySelectorAll("input[name='activeActivityRow']:checked")).map((input) => input.value);
  if (!selectedRowIds.length) {
    showModalMessage("No rows selected", "Please select one or more draft rows before choosing Save or Submit.");
    return;
  }
  const missingByRow = [];
  const updatedActivities = employee.activities.map((row) => {
    if (!selectedRowIds.includes(row.rowId) || row.workflowStatus === "submitted") return row;
    const values = collectActivityRowValues(row.rowId);
    if (action === "submit") {
      const missingFields = state.activityTemplate.fields.filter((field) => field.required && field.key !== "sl_no" && !String(values[field.key] || "").trim()).map((field) => field.label);
      if (missingFields.length) {
        missingByRow.push(`SL No. ${row.slNo}: ${missingFields.join(", ")}`);
        return row;
      }
    }
    return {
      ...row,
      values,
      workflowStatus: action === "submit" ? "submitted" : "draft",
      savedAt: todayDdMmYyyy(),
      submittedAt: action === "submit" ? todayDdMmYyyy() : row.submittedAt
    };
  });
  if (missingByRow.length) {
    showModalMessage("Activity log submission is incomplete", `All columns are mandatory before submission. Please complete the following rows and fields:\n\n${missingByRow.join("\n")}`);
    return;
  }
  setState({ employees: state.employees.map((item) => item.id === employee.id ? { ...item, activities: updatedActivities } : item), activeSection: "activity" });
  showModalMessage(action === "submit" ? "Activity rows submitted" : "Activity rows saved", action === "submit" ? "The selected rows were submitted and are now locked for editing." : "The selected draft rows were saved and remain editable.", "success");
}

function getEmployeeActivityTableData(employee) {
  const headers = [...state.activityTemplate.fields.map((field) => field.label), "Row status", "Last update"];
  const rows = (employee.activities || []).map((row) => [
    ...state.activityTemplate.fields.map((field) => field.key === "sl_no" ? row.slNo : row.values?.[field.key] || "-"),
    row.workflowStatus === "submitted" ? "Submitted" : "Draft",
    formatDate(row.submittedAt || row.savedAt || todayDdMmYyyy())
  ]);
  return { headers, rows };
}

function downloadEmployeeActivityExcel(employee) {
  const { headers, rows } = getEmployeeActivityTableData(employee);
  const downloader = getEmployeeDisplayName(employee).replace(/\s+/g, "_");
  const stamp = `${todayDdMmYyyy()}_${formatTime().replace(/:/g, "-")}`;
  const title = `Activity log export - downloaded by ${getEmployeeDisplayName(employee)} on ${todayDdMmYyyy()} ${formatTime()}`;
  const tableRows = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8" /><style>body{font-family:Calibri,Arial,sans-serif;padding:20px;background:#fff;color:#0f172a;} h2,p{margin:0 0 10px;} table{border-collapse:collapse;margin-top:18px;background:#fff;} th,td{border:1px solid #cbd5e1;padding:8px 10px;vertical-align:top;} th{background:#eff6ff;font-weight:700;} .buffer{display:inline-block;padding-right:36px;}</style></head><body><div class="buffer"><h2>${escapeHtml(title)}</h2><p>Employee activity log</p><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table></div></body></html>`;
  triggerDownload(`activity_log_${downloader}_${stamp}.xls`, html, "application/vnd.ms-excel");
}

function deleteEmployeeActivityRow(employee, rowId) {
  const remainingActivities = employee.activities.filter((row) => row.rowId !== rowId).map((row, index) => ({ ...row, slNo: index + 1 }));
  setState({ employees: state.employees.map((item) => item.id === employee.id ? { ...item, activities: remainingActivities } : item), activeSection: "activity" });
  showModalMessage("Activity row deleted", "The selected activity row was removed from your activity log.", "success");
}
function getAdminActivityTableData(filteredOnly) {
  const table = app.querySelector("#adminActivityTable");
  if (!table) return { headers: [], rows: [] };
  const headers = Array.from(table.querySelectorAll("thead tr:first-child th")).map((th) => th.textContent.trim());
  const rows = Array.from(table.querySelectorAll("tbody tr[data-admin-activity-row='true']")).filter((row) => !filteredOnly || row.style.display !== "none").map((row) => Array.from(row.children).map((cell) => cell.textContent.trim()));
  return { headers, rows };
}

function getAdminLeaveWfhMonthlyReportRows(monthValue) {
  const range = getFullMonthDateRange(monthValue);
  const employeeById = new Map((state.employees || []).map((employee) => [employee.id, employee]));
  return getAdminLeaveWfhEvents()
    .filter((event) => isDateInRange(event.date, range.from, range.to))
    .map((event) => {
      const employee = employeeById.get(event.employeeId);
      return {
        sort: parseDateSortValue(event.date),
        date: normalizeActivityDateValue(event.date),
        employeeName: getEmployeeDisplayName(employee) || event.employeeId,
        type: event.calendarLabel || getLeaveWfhCalendarTypeLabel(event, event.kind),
        reason: event.reason || "-"
      };
    })
    .sort((a, b) => a.sort - b.sort || a.employeeName.localeCompare(b.employeeName) || a.type.localeCompare(b.type))
    .map(({ sort, ...row }) => row);
}

function buildLeaveWfhExcelHtml(title, subtitle, headers, rows, emptyMessage) {
  const tableRows = rows.map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(row[header.key] || "-")}</td>`).join("")}</tr>`).join("");
  const emptyRow = `<tr><td colspan="${headers.length}">${escapeHtml(emptyMessage)}</td></tr>`;
  return `<!doctype html><html><head><meta charset="utf-8" /><style>body{font-family:Calibri,Arial,sans-serif;padding:18px;background:#fff;color:#111827;} table{border-collapse:collapse;background:#fff;} th,td{border:1px solid #6b7280;padding:8px 10px;mso-number-format:"\@";vertical-align:top;white-space:normal;} th{background:#eff6ff;font-weight:700;text-align:left;} .title-row td{background:#dbeafe;font-size:18px;font-weight:700;text-align:left;} .subtitle-row td{background:#f8fafc;color:#475569;text-align:left;} .col-date{width:110px;} .col-name{width:190px;} .col-type{width:130px;} .col-reason{width:320px;}</style></head><body><table><tbody><tr class="title-row"><td colspan="${headers.length}">${escapeHtml(title)}</td></tr><tr class="subtitle-row"><td colspan="${headers.length}">${escapeHtml(subtitle)}</td></tr><tr>${headers.map((header) => `<th class="col-${escapeHtml(header.key === "employeeName" ? "name" : header.key)}">${escapeHtml(header.label)}</th>`).join("")}</tr>${tableRows || emptyRow}</tbody></table></body></html>`;
}

function downloadAdminLeaveWfhExcel() {
  const monthValue = getAdminLeaveWfhCalendarMonth();
  const rows = getAdminLeaveWfhMonthlyReportRows(monthValue);
  const headers = [{ key: "date", label: "Date" }, { key: "employeeName", label: "Emp name" }, { key: "type", label: "Type" }, { key: "reason", label: "Reason" }];
  const monthLabel = getMonthLabel(monthValue).replace(/\s+/g, "_");
  const downloader = (state.adminProfile.name || "admin").replace(/\s+/g, "_");
  const stamp = `${todayDdMmYyyy()}_${formatTime().replace(/:/g, "-")}`;
  const title = `Monthly Leave and WFH report - ${getMonthLabel(monthValue)}`;
  const subtitle = `All employees | Downloaded by ${state.adminProfile.name} on ${todayDdMmYyyy()} ${formatTime()}`;
  const html = buildLeaveWfhExcelHtml(title, subtitle, headers, rows, `No Leave or WFH bookings are available for ${getMonthLabel(monthValue)}.`);
  triggerDownload(`admin_leave_wfh_${monthLabel}_${downloader}_${stamp}.xls`, html, "application/vnd.ms-excel");
}
function downloadEmployeeGroupLeaveWfhExcel(employee) {
  const monthValue = getLeaveWfhCalendarMonth(employee);
  const range = getFullMonthDateRange(monthValue);
  const rows = getEmployeeGroupLeaveWfhReportRows(employee, range.from, range.to);
  const headers = [{ key: "date", label: "Date" }, { key: "employeeName", label: "Emp name" }, { key: "type", label: "Type" }, { key: "reason", label: "Reason" }];
  const downloader = (getEmployeeDisplayName(employee) || employee.id || "employee").replace(/\s+/g, "_");
  const monthLabel = getMonthLabel(monthValue).replace(/\s+/g, "_");
  const stamp = `${todayDdMmYyyy()}_${formatTime().replace(/:/g, "-")}`;
  const title = `Team Leave and WFH report - ${getMonthLabel(monthValue)}`;
  const subtitle = `Other group members | Downloaded by ${getEmployeeDisplayName(employee)} on ${todayDdMmYyyy()} ${formatTime()}`;
  const html = buildLeaveWfhExcelHtml(title, subtitle, headers, rows, `No group member Leave or WFH bookings are available for ${getMonthLabel(monthValue)}.`);
  triggerDownload(`team_leave_wfh_${monthLabel}_${downloader}_${stamp}.xls`, html, "application/vnd.ms-excel");
}
function triggerDownload(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadAdminActivityExcel(filteredOnly) {
  const { headers, rows } = getAdminActivityTableData(filteredOnly);
  const downloader = state.adminProfile.name.replace(/\s+/g, "_");
  const stamp = `${todayDdMmYyyy()}_${formatTime().replace(/:/g, "-")}`;
  const title = `Activity tracker export - downloaded by ${state.adminProfile.name} on ${todayDdMmYyyy()} ${formatTime()}`;
  const tableRows = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8" /><style>body{font-family:Calibri,Arial,sans-serif;padding:20px;background:#fff;color:#0f172a;} h2,p{margin:0 0 10px;} table{border-collapse:collapse;margin-top:18px;background:#fff;} th,td{border:1px solid #cbd5e1;padding:8px 10px;vertical-align:top;} th{background:#eff6ff;font-weight:700;} .buffer{display:inline-block;padding-right:36px;}</style></head><body><div class="buffer"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(filteredOnly ? "Filtered view" : "Complete employee activity log")}</p><table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table></div></body></html>`;
  triggerDownload(`activity_tracker_${filteredOnly ? "filtered" : "all"}_${downloader}_${stamp}.xls`, html, "application/vnd.ms-excel");
}

function applyAdminActivityFilters() {
  const filters = Object.fromEntries(Array.from(app.querySelectorAll("[data-admin-activity-filter]")).map((input) => [input.dataset.adminActivityFilter, input.value.trim().toLowerCase()]));
  app.querySelectorAll("tbody tr[data-admin-activity-row='true']").forEach((row) => {
    const matches = Array.from(row.querySelectorAll("td")).every((cell) => {
      const key = cell.dataset.adminColKey;
      const filter = filters[key] || "";
      if (!filter) return true;
      return (cell.dataset.filterValue || "").includes(filter);
    });
    row.style.display = matches ? "" : "none";
  });
}

function initializeColumnResizers(table) {
  if (!table || table.dataset.resizersBound === "true") return;
  table.dataset.resizersBound = "true";
  const headerRow = table.querySelector("thead tr:first-child");
  if (!headerRow) return;
  Array.from(headerRow.children).forEach((th, index) => {
    th.style.position = "relative";
    const label = document.createElement("div");
    label.className = "sheet-header-cell";
    while (th.firstChild) label.appendChild(th.firstChild);
    th.appendChild(label);
    const resizer = document.createElement("button");
    resizer.type = "button";
    resizer.className = "sheet-col-resizer";
    resizer.setAttribute("aria-label", `Resize ${label.textContent.trim()} column`);
    label.appendChild(resizer);
    let startX = 0;
    let startWidth = 0;
    const onMove = (event) => {
      const width = Math.max(90, startWidth + (event.clientX - startX));
      table.querySelectorAll(`tr > *:nth-child(${index + 1})`).forEach((cell) => {
        cell.style.width = `${width}px`;
        cell.style.minWidth = `${width}px`;
      });
    };
    const stop = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", stop);
    };
    resizer.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      startX = event.clientX;
      startWidth = th.getBoundingClientRect().width;
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", stop);
    });
  });
}

function initializeAdminActivityConsole() {
  app.querySelectorAll("[data-admin-activity-filter]").forEach((input) => input.addEventListener("input", applyAdminActivityFilters));
  app.querySelector("#downloadFilteredActivityExcelBtn")?.addEventListener("click", () => downloadAdminActivityExcel(true));
  app.querySelector("#downloadAllActivityExcelBtn")?.addEventListener("click", () => downloadAdminActivityExcel(false));
  initializeColumnResizers(app.querySelector("#adminActivityTable"));
  initializeColumnResizers(app.querySelector(".activity-sheet"));
}

function bindDashboardEvents() {
  app.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const activeSection = button.dataset.section;
      const patch = { activeSection };
      if (state.session?.role === "employee" && activeSection === "groups") {
        const employee = getCurrentSessionEmployee();
        patch.notifications = (state.notifications || []).map((item) => item.recipientRole === "employee" && item.employeeId === employee?.id && item.section === "groups" && !item.columnResolved ? { ...item, columnResolved: true } : item);
      }
      setState(patch);
    });
  });
  notificationBtn?.addEventListener("click", openNotificationDialog);
  if (state.session?.role === "admin") bindAdminEvents();
  if (state.session?.role === "employee") bindEmployeeEvents();
  initializeAdminActivityConsole();
}

logoutBtn.addEventListener("click", () => setState({ session: null, activeSection: "overview", selectedLogin: "employee" }));

render();
initializeSharedState();
