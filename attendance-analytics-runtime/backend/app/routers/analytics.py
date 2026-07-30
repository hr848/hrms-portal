from fastapi import APIRouter, HTTPException, Response
from app.services.analytics_service import store
from app.utils.exporter import export_csv, export_excel, export_pdf

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("")
def get_analytics():
    return store.payload()


@router.get("/export/{file_type}")
def export_records(file_type: str):
    if file_type == "csv":
        return Response(export_csv(store.records), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=attendance-records.csv"})
    if file_type == "xlsx":
        return Response(export_excel(store.records), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=attendance-records.xlsx"})
    if file_type == "pdf":
        return Response(export_pdf(store.records), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=attendance-records.pdf"})
    raise HTTPException(status_code=400, detail="Unsupported export type")


@router.get("/export-employee")
def export_employee(employee: str):
    from app.utils.exporter import export_employee_excel
    return Response(
        export_employee_excel(employee, store.records),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=Download_Analytics_{employee.replace(' ', '_')}.xlsx"}
    )


@router.post("/update-status")
def update_status(payload: dict):
    employee = payload.get("employee")
    date_str = payload.get("date")
    status = payload.get("status")
    if not employee or not date_str or not status:
        raise HTTPException(status_code=400, detail="Missing required parameters")
    
    from datetime import datetime
    try:
        target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format, expect YYYY-MM-DD")
    
    from app.rule_engine.attendance_rules import normalize_name
    normalized_target = normalize_name(employee)
    
    updated = False
    for r in store.records:
        if normalize_name(r.employee) == normalized_target and r.date == target_date:
            r.status = status
            updated = True
            break
            
    if not updated:
        raise HTTPException(status_code=404, detail="Attendance record not found")
        
    return {"message": "Status updated successfully"}
