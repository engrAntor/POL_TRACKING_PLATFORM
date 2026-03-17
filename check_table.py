import sqlite3
conn = sqlite3.connect('backend/db.sqlite3')
cur = conn.cursor()
cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='pol_ai_supportticket'")
r = cur.fetchone()
print('Table exists:', r is not None)
conn.close()
