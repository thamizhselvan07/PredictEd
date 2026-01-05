from database import SessionLocal
from models import User, Stream, Exam, Subject, Question

def verify_system():
    db = SessionLocal()
    try:
        print("--- System Verification ---")
        
        # 1. Verify User
        user = db.query(User).first()
        if user:
            print(f"[PASS] Demo User Exists: {user.username}")
        else:
            print("[FAIL] No User Found - Startup event might need to run.")
            
        # 2. Verify Hierachy
        streams = db.query(Stream).count()
        exams = db.query(Exam).count()
        subjects = db.query(Subject).count()
        print(f"Streams: {streams}, Exams: {exams}, Subjects: {subjects}")
        
        if streams > 0 and exams > 0 and subjects > 0:
            print("[PASS] Hierarchy Seeded")
        else:
            print("[FAIL] Hierarchy Incomplete")

        # 3. Verify Questions & PYQ
        questions = db.query(Question).count()
        pyq_q = db.query(Question).filter(Question.pyq_year.isnot(None)).count()
        print(f"Total Questions: {questions}")
        print(f"PYQ Questions: {pyq_q}")
        
        if pyq_q > 0:
            print("[PASS] PYQ Metadata Present")
        else:
            print("[WARNING] No PYQ Metadata found on questions")

    except Exception as e:
        print(f"[ERROR] Verification Failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_system()
