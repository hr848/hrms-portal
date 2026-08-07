"""Load the current HRMS JSON export into the MySQL shared-state table.

Usage:
  python migrate-json-to-mysql.py "mysql://user:password@host:3306/hrms0"

The script is repeatable: it replaces only the portal's default shared-state
record and does not delete any other MySQL tables or rows.
"""

import json
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

import pymysql


ROOT = Path(__file__).resolve().parents[2]
STATE_PATH = ROOT / "database" / "production" / "current-hrms-browser-data.json"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python migrate-json-to-mysql.py mysql://user:password@host:3306/database")
        return 2

    database_url = urlparse(sys.argv[1])
    if database_url.scheme not in {"mysql", "mysql+pymysql"}:
        raise SystemExit("The connection must use a mysql:// URL.")

    with STATE_PATH.open("r", encoding="utf-8") as seed_file:
        payload = json.load(seed_file)
    if not isinstance(payload, dict):
        raise SystemExit("The current JSON export must contain an object at its root.")

    connection = pymysql.connect(
        host=database_url.hostname or "127.0.0.1",
        port=database_url.port or 3306,
        user=unquote(database_url.username or ""),
        password=unquote(database_url.password or ""),
        database=(database_url.path or "").lstrip("/"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                create table if not exists hrms_portal_state (
                    app_key varchar(255) primary key,
                    payload json not null,
                    updated_at datetime(6) not null default current_timestamp(6)
                )
                """
            )
            cursor.execute(
                """
                insert into hrms_portal_state (app_key, payload, updated_at)
                values (%s, %s, current_timestamp(6))
                on duplicate key update
                    payload = values(payload),
                    updated_at = current_timestamp(6)
                """,
                ("default", json.dumps(payload, ensure_ascii=False, separators=(",", ":"))),
            )
        connection.commit()
    finally:
        connection.close()

    print(f"Loaded {len(payload)} state sections into hrms_portal_state.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
