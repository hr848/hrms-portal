import base64
import inspect
import json
import os
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parent.parent
ANALYTICS_BACKEND = ROOT / "attendance-analytics-runtime" / "backend"
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(ANALYTICS_BACKEND) not in sys.path:
    sys.path.insert(0, str(ANALYTICS_BACKEND))

from app.models.schemas import AttendanceRecord  # noqa: E402
from app.routers import analytics, upload  # noqa: E402
from app.services.analytics_service import store  # noqa: E402
from server import parse_employee_docx  # noqa: E402

ANALYTICS_STATE_BLOB = "hrms/attendance-analytics-state.json"
APP_STATE_KEY = "default"


def _database_url() -> str:
    return os.environ.get("DATABASE_URL") or os.environ.get("POSTGRES_URL") or ""


def _open_db():
    database_url = _database_url()
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured. Connect a Postgres database in Vercel first.")
    import psycopg

    return psycopg.connect(database_url)


def _ensure_state_table(connection) -> None:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            create table if not exists hrms_portal_state (
                app_key text primary key,
                payload jsonb not null,
                updated_at timestamptz not null default now()
            )
            """
        )
    connection.commit()


def _read_shared_state():
    with _open_db() as connection:
        _ensure_state_table(connection)
        with connection.cursor() as cursor:
            cursor.execute("select payload from hrms_portal_state where app_key = %s", (APP_STATE_KEY,))
            row = cursor.fetchone()
            return row[0] if row else None


def _write_shared_state(payload: dict) -> None:
    with _open_db() as connection:
        _ensure_state_table(connection)
        with connection.cursor() as cursor:
            cursor.execute(
                """
                insert into hrms_portal_state (app_key, payload, updated_at)
                values (%s, %s::jsonb, now())
                on conflict (app_key)
                do update set payload = excluded.payload, updated_at = now()
                """,
                (APP_STATE_KEY, json.dumps(payload)),
            )
        connection.commit()

app = FastAPI(title="HRMS Portal API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _blob_state_payload() -> bytes:
    return json.dumps({
        "records": [record.model_dump(mode="json") for record in store.records],
        "warnings": store.warnings,
    }).encode("utf-8")


async def _maybe_await(value):
    return await value if inspect.isawaitable(value) else value


async def _read_blob_bytes(result) -> bytes:
    if result is None:
        return b""
    for attr in ("body", "content", "data"):
        value = getattr(result, attr, None)
        if value:
            value = await _maybe_await(value)
            return value.encode("utf-8") if isinstance(value, str) else bytes(value)
    stream = getattr(result, "stream", None)
    if stream is None:
        return b""
    if hasattr(stream, "read"):
        value = await _maybe_await(stream.read())
        return value.encode("utf-8") if isinstance(value, str) else bytes(value)
    chunks = []
    async for chunk in stream:
        chunks.append(chunk.encode("utf-8") if isinstance(chunk, str) else chunk)
    return b"".join(chunks)


async def _persist_analytics_state() -> None:
    if not store.records:
        return
    try:
        from vercel.blob import AsyncBlobClient

        client = AsyncBlobClient()
        await client.put(
            ANALYTICS_STATE_BLOB,
            _blob_state_payload(),
            access="private",
            content_type="application/json",
            add_random_suffix=False,
            overwrite=True,
        )
    except Exception as exc:
        print(f"Analytics Blob persistence skipped: {exc}")


async def _load_analytics_state() -> None:
    if store.records:
        return
    try:
        from vercel.blob import AsyncBlobClient

        client = AsyncBlobClient()
        result = await client.get(ANALYTICS_STATE_BLOB, access="private")
        raw = await _read_blob_bytes(result)
        if not raw:
            return
        payload = json.loads(raw.decode("utf-8"))
        store.records = [AttendanceRecord(**record) for record in payload.get("records", [])]
        store.warnings = payload.get("warnings", [])
    except Exception as exc:
        print(f"Analytics Blob restore skipped: {exc}")


@app.middleware("http")
async def analytics_state_middleware(request: Request, call_next):
    if request.url.path.startswith("/api/analytics"):
        await _load_analytics_state()
    response = await call_next(request)
    if request.method == "POST" and request.url.path == "/api/upload" and response.status_code < 400:
        await _persist_analytics_state()
    return response


app.include_router(upload.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/parse-employee-docx")
async def parse_employee_docx_endpoint(request: Request):
    try:
        payload = await request.json()
        encoded = payload.get("contentBase64", "")
        if not encoded:
            raise ValueError("Missing DOCX content.")
        return parse_employee_docx(base64.b64decode(encoded))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@app.get("/api/state")
def get_shared_state():
    try:
        payload = _read_shared_state()
        return {"configured": True, "state": payload}
    except RuntimeError as exc:
        return {"configured": False, "state": None, "message": str(exc)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.put("/api/state")
async def put_shared_state(request: Request):
    try:
        payload = await request.json()
        state_payload = payload.get("state") if isinstance(payload, dict) else None
        if not isinstance(state_payload, dict):
            raise ValueError("Missing shared state payload.")
        _write_shared_state(state_payload)
        return {"ok": True}
    except RuntimeError as exc:
        return {"ok": False, "configured": False, "message": str(exc)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

