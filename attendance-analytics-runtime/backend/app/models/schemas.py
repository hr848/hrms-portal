from __future__ import annotations

from datetime import date
from typing import Any, Optional
from pydantic import BaseModel, Field


class ProposedShift(BaseModel):
    employee_name: str
    department: str = ""
    proposed_entry: str
    proposed_exit: str


class AttendanceRecord(BaseModel):
    employee: str
    department: str = ""
    date: date
    proposed_entry: str
    proposed_exit: str
    actual_entry: Optional[str] = None
    actual_exit: Optional[str] = None
    status: str
    working_hours: Optional[float] = None
    arrival_delay_minutes: Optional[int] = None
    early_exit_minutes: Optional[int] = None
    overtime_minutes: Optional[int] = None
    raw_punches: list[str] = Field(default_factory=list)
    notes: str = ""


class EmployeeSummary(BaseModel):
    employee: str
    department: str
    proposed_entry: str
    proposed_exit: str
    attendance_percent: float
    late_entries: int
    early_exits: int
    missing_entry: int
    missing_exit: int
    no_attendance: int
    average_working_hours: float
    average_arrival_time: Optional[str] = None
    average_exit_time: Optional[str] = None
    records: list[AttendanceRecord]


class UploadResponse(BaseModel):
    message: str
    employees_processed: int
    total_records: int
    warnings: list[str] = Field(default_factory=list)


class AnalyticsPayload(BaseModel):
    kpis: dict[str, Any]
    status_distribution: list[dict[str, Any]]
    late_by_employee: list[dict[str, Any]]
    early_by_employee: list[dict[str, Any]]
    daily_trend: list[dict[str, Any]]
    top_late_employees: list[dict[str, Any]]
    top_missing_punches: list[dict[str, Any]]
    top_overtime_employees: list[dict[str, Any]]
    employees: list[EmployeeSummary]
    records: list[AttendanceRecord]
