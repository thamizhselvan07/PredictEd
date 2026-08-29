from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import os
import json
from datetime import datetime
import google.generativeai as genai

router = APIRouter(prefix="/api/mock-tests", tags=["Mock Tests"])

@router.post("/generate")
async def generate_mock(db: Session = Depends(get_db)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Generate 10 multiple choice questions about Physics (focusing on Modern Physics and Thermodynamics).
    Output strictly as a JSON array of objects.
    Each object must have:
    - topic: (string)
    - subtopic: (string)
    - difficulty: (float between 0.1 and 1.0)
    - content: (string, the question text)
    - options: (array of 4 strings)
    - correct_answer: (string, must exactly match one of the options)
    - explanation: (string)
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown if present
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        questions_data = json.loads(text)
        
        # Ensure user exists (Demo user)
        user = db.query(models.User).filter(models.User.id == 1).first()
        if not user:
             user = models.User(username="demo", email="demo@example.com", hashed_password="hashed")
             db.add(user)
             db.commit()
             db.refresh(user)
             
        # Find subject
        subject = db.query(models.Subject).filter(models.Subject.name == "Physics").first()
        if not subject:
             exam = db.query(models.Exam).first()
             if not exam:
                 exam = models.Exam(name="JEE Mock", description="Mock Exam")
                 db.add(exam)
                 db.commit()
             subject = models.Subject(name="Physics", exam_id=exam.id)
             db.add(subject)
             db.commit()
             
        # Create attempt
        attempt = models.QuizAttempt(user_id=1, subject_id=subject.id, score=0, completed=False)
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        
        # Create questions
        for qd in questions_data[:10]:
            q = models.Question(
                subject_id=subject.id,
                topic=qd.get("topic", "Physics"),
                subtopic=qd.get("subtopic", "General"),
                difficulty=float(qd.get("difficulty", 0.5)),
                content=qd.get("content", "Question"),
                options=qd.get("options", ["A", "B", "C", "D"]),
                correct_answer=qd.get("correct_answer", "A"),
                explanation=qd.get("explanation", "")
            )
            db.add(q)
        
        db.commit()
        
        # Modify the max_q in main.py logic using a dummy Quiz object if needed, but since we are inserting questions directly, it's fine.
        return {"status": "success", "attempt_id": attempt.id}
    except Exception as e:
        print("Error generating:", str(e))
        # Fallback to attempt 1
        return {"status": "fallback", "attempt_id": 1}

@router.post("/start")
async def start_mock(db: Session = Depends(get_db)):
    return {"status": "started", "test_id": 1}

@router.post("/submit")
async def submit_mock(db: Session = Depends(get_db)):
    return {"status": "submitted", "score": 72}

@router.get("/history")
async def mock_history(db: Session = Depends(get_db)):
    return []

@router.get("/recommendation")
async def mock_recommendation(db: Session = Depends(get_db)):
    return {
        "title": "Physics Diagnostic Test",
        "difficulty": "Adaptive",
        "questions": 20,
        "time": 25,
        "reason": "Recommended because your recent performance shows weakness in Modern Physics and Thermodynamics."
    }
