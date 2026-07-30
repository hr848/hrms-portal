from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analytics, upload

app = FastAPI(title="Attendance Analytics Portal", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(upload.router)
app.include_router(analytics.router)


@app.get("/health")
def health():
    return {"status": "ok"}


