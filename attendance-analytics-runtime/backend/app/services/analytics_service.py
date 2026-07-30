from __future__ import annotations

from collections import Counter, defaultdict
from pathlib import Path
from statistics import mean
from tempfile import NamedTemporaryFile
from fastapi import UploadFile
from app.models.schemas import AnalyticsPayload, AttendanceRecord, EmployeeSummary, UploadResponse
from app.parsers.excel_parser import AttendanceExcelParser


class AnalyticsStore:
    def __init__(self) -> None:
        self.records: list[AttendanceRecord] = []
        self.warnings: list[str] = []

    async def process_uploads(self, proposed_file: UploadFile, attendance_file: UploadFile) -> UploadResponse:
        self.records = []
        self.warnings = []
        proposed_path = await self._save_temp(proposed_file)
        attendance_path = await self._save_temp(attendance_file)
        try:
            parser = AttendanceExcelParser()
            proposed, proposed_warnings = parser.parse_proposed_sheet(proposed_path)
            records, attendance_warnings = parser.parse_attendance(proposed, attendance_path)
            self.records = records
            self.warnings = proposed_warnings + attendance_warnings
            return UploadResponse(message="Files processed successfully", employees_processed=len(proposed), total_records=len(records), warnings=self.warnings)
        finally:
            proposed_path.unlink(missing_ok=True)
            attendance_path.unlink(missing_ok=True)

    async def _save_temp(self, upload: UploadFile) -> Path:
        if not upload.filename:
            raise ValueError("Please upload Excel files in .xlsx or .xls format")
        suffix = Path(upload.filename).suffix.lower()
        if suffix not in {".xlsx", ".xls"}:
            raise ValueError("Only .xlsx and .xls files are supported")
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(await upload.read())
            temp_path = Path(temp_file.name)
        if suffix == ".xls":
            return self._convert_legacy_excel(temp_path)
        return temp_path

    def _convert_legacy_excel(self, source: Path) -> Path:
        target = source.with_suffix(".xlsx")
        excel = None
        workbook = None
        try:
            import win32com.client
            excel = win32com.client.DispatchEx("Excel.Application")
            excel.Visible = False
            excel.DisplayAlerts = False
            workbook = excel.Workbooks.Open(str(source.resolve()))
            workbook.SaveAs(str(target.resolve()), FileFormat=51)
            return target
        except Exception as exc:
            target.unlink(missing_ok=True)
            raise ValueError("Unable to read the .xls file. Please confirm it is a valid Excel workbook.") from exc
        finally:
            if workbook is not None:
                workbook.Close(False)
            if excel is not None:
                excel.Quit()
            source.unlink(missing_ok=True)

    def payload(self) -> AnalyticsPayload:
        records = self.records
        employees = self.employee_summaries()
        status_counts = Counter(record.status for record in records)
        late_by_employee = self._employee_metric(lambda record: "Late Entry" in record.status)
        early_by_employee = self._employee_metric(lambda record: "Early Exit" in record.status)
        missing_by_employee = self._employee_metric(lambda record: "Missing" in record.status)
        overtime_by_employee = self._employee_metric(lambda record: (record.overtime_minutes or 0) > 0)
        present_records = [record for record in records if record.status not in {"No Attendance", "Attendance Not Found", "Invalid Attendance Data"}]
        return AnalyticsPayload(
            kpis={
                "employeesProcessed": len({record.employee for record in records}),
                "totalWorkingDays": len({record.date.isoformat() for record in records}),
                "lateArrivals": sum(1 for record in records if "Late Entry" in record.status),
                "earlyExits": sum(1 for record in records if "Early Exit" in record.status),
                "missingEntries": sum(1 for record in records if record.status == "Entry Missing"),
                "missingExits": sum(1 for record in records if record.status == "Exit Missing"),
                "noAttendance": sum(1 for record in records if record.status == "No Attendance"),
                "averageAttendancePercent": round(len(present_records) / len(records) * 100, 2) if records else 0,
                "averageArrivalDelay": round(mean([record.arrival_delay_minutes or 0 for record in records]), 2) if records else 0,
                "averageWorkingHours": round(mean([record.working_hours for record in records if record.working_hours is not None]), 2) if any(record.working_hours is not None for record in records) else 0,
            },
            status_distribution=[{"status": status, "count": count} for status, count in status_counts.items()],
            late_by_employee=late_by_employee,
            early_by_employee=early_by_employee,
            daily_trend=self._daily_trend(),
            top_late_employees=late_by_employee[:10],
            top_missing_punches=missing_by_employee[:10],
            top_overtime_employees=overtime_by_employee[:10],
            employees=employees,
            records=records,
        )

    def employee_summaries(self) -> list[EmployeeSummary]:
        grouped: dict[str, list[AttendanceRecord]] = defaultdict(list)
        for record in self.records:
            grouped[record.employee].append(record)
        summaries: list[EmployeeSummary] = []
        for employee, records in grouped.items():
            present = [record for record in records if record.status not in {"No Attendance", "Attendance Not Found", "Invalid Attendance Data"}]
            summaries.append(EmployeeSummary(
                employee=employee, department=records[0].department, proposed_entry=records[0].proposed_entry, proposed_exit=records[0].proposed_exit,
                attendance_percent=round(len(present) / len(records) * 100, 2) if records else 0,
                late_entries=sum(1 for record in records if "Late Entry" in record.status), early_exits=sum(1 for record in records if "Early Exit" in record.status),
                missing_entry=sum(1 for record in records if record.status == "Entry Missing"), missing_exit=sum(1 for record in records if record.status == "Exit Missing"), no_attendance=sum(1 for record in records if record.status == "No Attendance"),
                average_working_hours=round(mean([record.working_hours for record in records if record.working_hours is not None]), 2) if any(record.working_hours is not None for record in records) else 0,
                average_arrival_time=self._average_time([record.actual_entry for record in records if record.actual_entry]), average_exit_time=self._average_time([record.actual_exit for record in records if record.actual_exit]), records=records))
        return sorted(summaries, key=lambda item: item.employee)

    def _employee_metric(self, predicate) -> list[dict[str, int | str]]:
        counts = Counter(record.employee for record in self.records if predicate(record))
        return [{"employee": employee, "count": count} for employee, count in counts.most_common()]

    def _daily_trend(self) -> list[dict[str, int | str]]:
        grouped: dict[str, Counter] = defaultdict(Counter)
        for record in self.records:
            grouped[record.date.isoformat()][record.status] += 1
        return [{"date": day, **counts} for day, counts in sorted(grouped.items())]

    def _average_time(self, values: list[str]) -> str | None:
        if not values:
            return None
        minutes = [int(value.split(":")[0]) * 60 + int(value.split(":")[1]) for value in values]
        average_minutes = round(mean(minutes))
        return f"{average_minutes // 60:02d}:{average_minutes % 60:02d}"


store = AnalyticsStore()


