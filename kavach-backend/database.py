import sqlite3
from datetime import datetime

conn = sqlite3.connect("kavach.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS scam_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    classification TEXT,
    confidence REAL,
    timestamp TEXT
)
""")
conn.commit()

def log_detection(message, classification, confidence):
    cursor.execute(
        "INSERT INTO scam_logs (message, classification, confidence, timestamp) VALUES (?, ?, ?, ?)",
        (message, classification, confidence, datetime.now().isoformat())
    )
    conn.commit()

def get_history():
    cursor.execute("SELECT * FROM scam_logs ORDER BY id DESC LIMIT 20")
    return cursor.fetchall()