import json
import sqlite3
con = sqlite3.connect('outputs/database/hrms_demo.sqlite')
cur = con.cursor()
tables = [row[0] for row in cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")]
print(json.dumps({name: cur.execute(f'SELECT COUNT(*) FROM {name}').fetchone()[0] for name in tables}, indent=2))
con.close()
