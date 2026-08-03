import sqlite3

conn = sqlite3.connect("memoryverse.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    document_type TEXT,
    summary TEXT,
    skills TEXT,
    projects TEXT,
    certifications TEXT,
    internships TEXT,
    achievements TEXT
)
""")

conn.commit()