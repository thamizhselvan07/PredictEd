from sqlalchemy import text
from database import engine

def migrate():
    with engine.connect() as conn:
        try:
            print("Adding subject_id to quiz_attempts...")
            conn.execute(text("ALTER TABLE quiz_attempts ADD COLUMN subject_id INTEGER REFERENCES subjects(id)"))
            print("Migration successful.")
        except Exception as e:
            print(f"Migration failed (Column might exist): {e}")

if __name__ == "__main__":
    migrate()
