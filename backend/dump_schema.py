import sqlite3

conn = sqlite3.connect('geb.db')
cursor = conn.cursor()
cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='users';")
for row in cursor.fetchall():
    print(row)
conn.close()
