from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime, time
from typing import Optional


def normalize_name(value: object) -> str:
    return " ".join(str(value or "").strip().lower().split())


def parse_time_value(value: object) -> Optional[time]:
    if value is None or value == "":
        return None
    if isinstance(value, time):
        return value.replace(second=0, microsecond=0)
    if isinstance(value, datetime):
        return value.time().replace(second=0, microsecond=0)
    text = str(value).strip()
    match = re.search(r"(?:[01]?\d|2[0-3])\s*[:.]\s*[0-5]\d", text)
    if not match:
        return None
    hour_text, minute_text = re.split(r"[:.]", match.group(0).replace(" ", ""))
    return time(int(hour_text), int(minute_text))


def format_time(value: Optional[time]) -> Optional[str]:
    return value.strftime("%H:%M") if value else None


def minutes_since_midnight(value: time) -> int:
    return value.hour * 60 + value.minute


def minutes_between(start: time, end: time) -> int:
    return minutes_since_midnight(end) - minutes_since_midnight(start)


@dataclass(frozen=True)
class ParsedPunches:
    entry: Optional[time]
    exit: Optional[time]
    raw_punches: list[str]
    invalid: bool = False


class AttendanceRuleEngine:
    def __init__(self, entry_cutoff: time = time(15, 0), overtime_threshold_minutes: int = 0):
        self.entry_cutoff = entry_cutoff
        self.overtime_threshold_minutes = overtime_threshold_minutes

    def parse_cell(self, cell_value: object) -> ParsedPunches:
        if cell_value is None or str(cell_value).strip() == "" or str(cell_value).strip().lower() == "nan":
            return ParsedPunches(entry=None, exit=None, raw_punches=[])
        punches: list[time] = []
        raw: list[str] = []
        for match in re.finditer(r"(?:[01]?\d|2[0-3])\s*[:.]\s*[0-5]\d", str(cell_value)):
            parsed = parse_time_value(match.group(0))
            if parsed:
                punches.append(parsed)
                raw.append(format_time(parsed) or "")
        if not punches:
            return ParsedPunches(entry=None, exit=None, raw_punches=[str(cell_value)], invalid=True)
        cutoff = minutes_since_midnight(self.entry_cutoff)
        entries = [item for item in punches if minutes_since_midnight(item) < cutoff]
        exits = [item for item in punches if minutes_since_midnight(item) >= cutoff]
        return ParsedPunches(entry=entries[0] if entries else None, exit=exits[-1] if exits else None, raw_punches=raw)

    def determine_status(self, proposed_entry: time, proposed_exit: time, entry: Optional[time], exit: Optional[time], invalid: bool = False) -> str:
        if invalid:
            return "invalid attendance data"
        if not entry and not exit:
            return "no attendance"
        
        if not entry:
            entry_status = "entry missing"
        elif entry <= proposed_entry:
            entry_status = "ontime entry"
        else:
            entry_status = "late entry"
            
        if not exit:
            exit_status = "exit missing"
        elif exit >= proposed_exit:
            exit_status = "ontime exit"
        else:
            exit_status = "early exit"
            
        if entry_status == "ontime entry" and exit_status == "ontime exit":
            return "ontime entry & exit"
            
        return f"{entry_status}-{exit_status}"
