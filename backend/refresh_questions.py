from database import SessionLocal
from question_generator import QuestionGenerator
from models import Question
from sqlalchemy import text

def refresh_questions():
    db = SessionLocal()
    try:
        print("Refreshing Question Bank with Exam PYQ Tags...")
        
        # 1. Clear existing questions (Drastic, but ensures consistency for demo)
        # Note: In prod, we would update or append. Use SQL for speed.
        print("Deleting existing questions...")
        db.query(Question).delete()
        db.commit()
        
        # 2. Reseed
        gen = QuestionGenerator(db)
        gen.seed_questions()
        
        print("Question Refresh Complete!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    refresh_questions()
