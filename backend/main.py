from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import database
import models
from knowledge_graph import KnowledgeGraphEngine
from predictor import PredictorEngine
from question_generator import QuestionGenerator
from analytics import AnalyticsEngine

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Adaptive Exam AI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class QuestionResponse(BaseModel):
    id: int
    topic: str
    difficulty: float
    content: str
    options: List[str]

class AnswerSubmission(BaseModel):
    question_id: int
    selected_answer: str
    time_taken: float

class ChatRequest(BaseModel):
    message: str

class SignupRequest(BaseModel):
    username: str
    password: str
    email: str

class VerifyRequest(BaseModel):
    email: str
    code: str

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Endpoints ---

# --- Authentication ---
import random
import string

@app.post("/api/auth/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(models.User).filter(models.User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username taken")
        
    code = ''.join(random.choices(string.digits, k=6))
    
    user = models.User(
        username=req.username,
        email=req.email,
        hashed_password=req.password, # In production hash this!
        verification_code=code,
        is_verified=False
    )
    db.add(user)
    db.commit()
    
    # Simulate Email Sending
    print(f"[{datetime.utcnow()}] VERIFICATION CODE for {req.email}: {code}")
    
    return {"message": "Signup successful. Check console for code."}

@app.post("/api/auth/verify")
def verify_email(req: VerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.verification_code != req.code:
        raise HTTPException(status_code=400, detail="Invalid code")
        
    user.is_verified = True
    user.verification_code = None
    db.commit()
    
    return {"message": "Verified successfully"}

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if user.hashed_password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")
        
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "token": "fake-jwt-token-for-demo"
    }

@app.on_event("startup")
def startup_event():
    # Seed data
    db = database.SessionLocal()
    try:
        gen = QuestionGenerator(db)
        gen.seed_questions()
        
        # Ensure a demo user exists
        if not db.query(models.User).filter(models.User.username == "student").first():
            db.add(models.User(
                username="student", 
                hashed_password="student", # Simple password for demo
                email="student@demo.com",
                is_verified=True
            ))
            db.commit()
    except Exception as e:
        print(f"Startup Error: {e}")
    finally:
        db.close()

# --- New Hierarchy Endpoints ---

@app.get("/streams")
def get_streams(db: Session = Depends(get_db)):
    return db.query(models.Stream).all()

@app.get("/exams")
def get_exams(stream_id: int, db: Session = Depends(get_db)):
    return db.query(models.Exam).filter(models.Exam.stream_id == stream_id).all()

@app.get("/subjects")
def get_subjects(exam_id: int, db: Session = Depends(get_db)):
    return db.query(models.Subject).filter(models.Subject.exam_id == exam_id).all()

@app.get("/quizzes")
def get_quizzes(subject_id: int, db: Session = Depends(get_db)):
    return db.query(models.Quiz).filter(models.Quiz.subject_id == subject_id).all()

# Modified Quiz Logic

# Valid Quiz Types
QUIZ_TYPES = {
    "basics": "Basics Quiz",
    "concept": "Concept Strength Test",
    "mixed": "Mixed Difficulty Quiz",
    "full": "Full-Length Subject Test"
}

@app.get("/quiz-types")
def get_quiz_types():
    return [{"id": k, "name": v} for k, v in QUIZ_TYPES.items()]

class StartQuizRequest(BaseModel):
    subject_id: int
    type: str

@app.post("/quiz/start")
def start_quiz_session(
    req: StartQuizRequest, 
    user_id: int = 1, 
    db: Session = Depends(get_db)
):
    """Starts a new quiz session for a subject and type."""
    if req.type not in QUIZ_TYPES:
        raise HTTPException(status_code=400, detail="Invalid quiz type")

    # Create a new attempt
    attempt = models.QuizAttempt(
        user_id=user_id,
        subject_id=req.subject_id,
        score=0.0,
        timestamp=datetime.utcnow(),
        total_time=0.0,
        accuracy=0.0,
        completed=False
    )
    db.add(attempt)
    db.commit() # Get ID
    db.refresh(attempt)
    
    return {"attempt_id": attempt.id, "message": "Quiz started", "total_questions": 50}

@app.post("/exam/{exam_id}/start_mock")
def start_mock_exam(
    exam_id: int,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Starts a full mock exam session."""
    attempt = models.QuizAttempt(
        user_id=user_id,
        exam_id=exam_id, # Track Exam
        score=0.0,
        timestamp=datetime.utcnow(),
        total_time=0.0,
        accuracy=0.0,
        completed=False
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {"attempt_id": attempt.id, "message": "Mock Exam Started", "total_questions": 90}


@app.get("/quiz/{attempt_id}/next")
def get_next_question_for_attempt(
    attempt_id: int,
    current_question_index: int = 0, # Frontend tracks this
    user_id: int = 1, # Should be gathered from token in real app but passed for now
    db: Session = Depends(get_db)
):
    """Get next question for the attempt."""
    attempt = db.query(models.QuizAttempt).filter(models.QuizAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    subject_id = attempt.subject_id
    
    # Mock Exam Logic
    if attempt.exam_id:
        # Find subjects for this exam
        subjects = db.query(models.Subject).filter(models.Subject.exam_id == attempt.exam_id).all()
        if not subjects:
             raise HTTPException(status_code=404, detail="No subjects found for exam")
        
        # Simple Logic: Rotate subjects based on question index
        # e.g. 0-29 Subj 1, 30-59 Subj 2, etc. (assuming 30 q per sub)
        # OR just Randomly pick one
        # Let's do: Random Subject for now to simulate "Mixed"
        # Ideally we map index 0->Physics, 1->Physics... 
        # But frontend doesn't strictly enforce index.
        # Let's pick a random subject from the list
        import random
        selected_sub = random.choice(subjects)
        subject_id = selected_sub.id
    
    if not subject_id and attempt.quiz_id:
        # Fallback if quiz_id is used
        quiz = db.query(models.Quiz).filter(models.Quiz.id == attempt.quiz_id).first()
        if quiz:
             subject_id = quiz.subject_id
             
    if not subject_id:
         raise HTTPException(status_code=400, detail="Corrupt attempt data (no subject)")

    gen = QuestionGenerator(db)
    q = gen.get_next_question(user_id, subject_id=subject_id)
    
    if not q:
         raise HTTPException(status_code=404, detail="No questions available")
    
    # Get subject name for UI
    sub_name = db.query(models.Subject).filter(models.Subject.id == subject_id).first().name
         
    return {
        "id": q.id,
        "topic": q.topic,
        "difficulty": q.difficulty,
        "content": q.content,
        "options": q.options,
        "pyq_year": q.pyq_year,
        "attempt_id": attempt_id,
        "subject_name": sub_name 
    }


@app.get("/quiz/question/next")
def get_adaptive_question(
    subject_id: int,
    attempt_id: int,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Get the next adaptive question."""
    gen = QuestionGenerator(db)
    q = gen.get_next_question(user_id, subject_id=subject_id)
    
    if not q:
         raise HTTPException(status_code=404, detail="No questions available")
         
    return {
        "id": q.id,
        "topic": q.topic,
        "difficulty": q.difficulty,
        "content": q.content,
        "options": q.options,
        "pyq_year": q.pyq_year,
        "attempt_id": attempt_id
    }


# 2. Submit Answer & Update Knowledge Graph
@app.post("/quiz/submit")
def submit_answer(submission: AnswerSubmission, user_id: int = 1, db: Session = Depends(get_db)):
    """
    Process answer:
    1. Check correctness.
    2. Update Knowledge Graph (strength score).
    3. Log attempt.
    """
    q = db.query(models.Question).filter(models.Question.id == submission.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = (submission.selected_answer == q.correct_answer)
    
    # --- Start: Log Attempt for "No Repeat" Logic ---
    # Create a quiz attempt record
    attempt = models.QuizAttempt(
        user_id=user_id,
        score=1.0 if is_correct else 0.0,
        timestamp=datetime.utcnow()
    )
    db.add(attempt)
    db.flush() # Get ID
    
    # Log the specific question details
    log = models.QuestionLog(
        attempt_id=attempt.id,
        question_id=q.id,
        selected_answer=submission.selected_answer,
        is_correct=is_correct,
        time_taken=submission.time_taken,
        difficulty_at_time=q.difficulty
    )
    db.add(log)
    db.commit()
    # --- End: Log Attempt ---

    # Update Knowledge Graph
    kg = KnowledgeGraphEngine(db)
    new_strength = kg.update_topic_strength(
        user_id, 
        q.topic, 
        is_correct, 
        q.difficulty,
        subject_id=q.subject_id
    )
    
    # Log (Simplify: create a transient attempt or just log directly? logging directly for demo speed)
    # Ideally we group under a QuizAttempt, but for "endless mode" we just log.
    # We will just return the result for now.
    
    feedback = "Correct! Well done." if is_correct else f"Incorrect. The right answer was {q.correct_answer}."
    
    return {
        "correct": is_correct,
        "correct_answer": q.correct_answer,
        "new_topic_strength": round(new_strength, 2),
        "feedback": feedback
    }

# 3. Dashboard Analytics
@app.get("/dashboard/stats")
def get_dashboard_stats(user_id: int = 1, db: Session = Depends(get_db)):
    analytics = AnalyticsEngine(db)
    predictor = PredictorEngine(db)
    kg = KnowledgeGraphEngine(db)

    return {
        "stats": analytics.get_student_stats(user_id),
        "weak_areas": predictor.predict_weak_areas(user_id),
        "knowledge_graph": kg.get_user_knowledge_graph(user_id)
    }

# 3.5 Reset Quiz Progress
@app.post("/quiz/reset")
def reset_progress(user_id: int = 1, db: Session = Depends(get_db)):
    """Resets all progress for the user."""
    # Delete logs first (foreign key dependency)
    # Ideally use cascade, but manual deletes are safer for logic understanding here
    
    # Get user attempts
    attempts = db.query(models.QuizAttempt).filter(models.QuizAttempt.user_id == user_id).all()
    for att in attempts:
        db.query(models.QuestionLog).filter(models.QuestionLog.attempt_id == att.id).delete()
    
    db.query(models.QuizAttempt).filter(models.QuizAttempt.user_id == user_id).delete()
    
    # Reset Knowledge Graph (Delete or Reset Score)
    db.query(models.KnowledgeNode).filter(models.KnowledgeNode.user_id == user_id).delete()
    
    db.commit()
    return {"message": "Progress reset successfully"}

# 4. AI Tutor Chat
@app.post("/chat/tutor")
def chat_tutor(req: ChatRequest):
    """
    AI Tutor powered by Google Gemini.
    Falls back to simulated response if no API key is set.
    """
    import os
    import google.generativeai as genai
    from dotenv import load_dotenv

    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    msg = req.message
    
    if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
        # Enhanced Simulation Mode (Demo)
        keyword_responses = {
            "react": "React is a JavaScript library for building user interfaces. It uses components and a virtual DOM for efficient updates.",
            "python": "Python is a high-level, interpreted programming language known for its readability and vast ecosystem of libraries.",
            "ai": "Artificial Intelligence involves creating systems that can perform tasks requiring human intelligence, such as learning and problem-solving.",
            "sql": "SQL (Structured Query Language) is the standard language for managing and manipulating relational databases.",
            "hook": "In React, Hooks allow you to use state and other React features without writing a class component (e.g., useState, useEffect).",
            "list": "In Python, a list is a mutable, ordered sequence of elements. You can add items using `.append()`.",
        }
        
        msg_lower = msg.lower()
        response = "I'm currently running in Demo Mode (No API Key). "
        
        found = False
        for key, val in keyword_responses.items():
            if key in msg_lower:
               response += val
               found = True
               break
        
        if not found:
            response += "That's a great question! Try asking about React, Python, AI, or SQL to see my knowledge base in action."
            
    else:
        try:
            genai.configure(api_key=api_key)
            # Using specific available model from list_models()
            model = genai.GenerativeModel('gemini-2.0-flash')
            
            # Context for the AI
            context = """You are an expert AI Tutor for a competitive exam platform. 
            Your goal is to help students understand concepts in React, Python, AI, SQL, and Data Structures.
            Be encouraging, concise, and use the Socratic method when appropriate.
            If the user is stuck, give a hint, not just the answer.
            """
            
            chat = model.start_chat(history=[])
            response_obj = chat.send_message(f"{context}\n\nUser Question: {msg}")
            response = response_obj.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            response = "I'm having trouble connecting to my brain right now. Please try again later."

    return {"reply": response}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Mount React Assets
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dist = os.path.join(current_dir, "../frontend/dist")
assets_path = os.path.join(frontend_dist, "assets")

if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

# Catch-all for SPA (must be last)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Pass through API calls (though they should be caught above if defined)
    if full_path.startswith("api") or full_path.startswith("quiz") or full_path.startswith("dashboard") or full_path.startswith("chat"):
        # If it matched here, it means it didn't match a specific API route
         raise HTTPException(status_code=404, detail="Not Found")
    
    # Serve index.html for everything else
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend build not found. Please run 'npm run build' in frontend directory."}
