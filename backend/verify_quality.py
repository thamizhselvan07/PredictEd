from sqlalchemy.orm import Session
from database import SessionLocal
import models
import random

def verify_questions():
    db = SessionLocal()
    try:
        print("--- Verifying Question Quality ---")
        
        # Select random 5 questions
        total = db.query(models.Question).count()
        print(f"Total Questions in DB: {total}")
        
        questions = db.query(models.Question).all()
        if questions:
            samples = random.sample(questions, 5)
            for q in samples:
                print(f"\n[ID: {q.id}] Subject: {q.subject_id} | Topic: {q.topic}")
                print(f"Q: {q.content}")
                print(f"Options: {q.options}")
                print(f"Correct: {q.correct_answer}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_questions()
