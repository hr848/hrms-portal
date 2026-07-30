from fastapi import APIRouter, File, HTTPException, UploadFile
from app.services.analytics_service import store

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_files(proposed_file: UploadFile = File(...), attendance_file: UploadFile = File(...)):
    try:
        return await store.process_uploads(proposed_file, attendance_file)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
