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

# --- Endpoints ---

@app.on_event("startup")
def startup_event():
    # Seed data
    db = database.SessionLocal()
    gen = QuestionGenerator(db)
    gen.seed_questions()
    
    # Ensure a demo user exists
    if not db.query(models.User).filter(models.User.username == "student").first():
        db.add(models.User(username="student", hashed_password="hashed_secret")) # Simplified auth
        db.commit()
    db.close()

# Root endpoint removed to allow React Router to handle /

# 1. Start Quiz / Get Question
@app.get("/quiz/next", response_model=QuestionResponse)
def get_next_question(user_id: int = 1, db: Session = Depends(get_db)):
    """Get the next adaptive question for the user."""
    gen = QuestionGenerator(db)
    q = gen.get_next_question(user_id)
    if not q:
        raise HTTPException(status_code=404, detail="No questions available")
    return {
        "id": q.id,
        "topic": q.topic,
        "difficulty": q.difficulty,
        "content": q.content,
        "options": q.options
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
    new_strength = kg.update_topic_strength(user_id, q.topic, is_correct, q.difficulty)
    
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

# 4. AI Tutor Chat
@app.post("/chat/tutor")
def chat_tutor(req: ChatRequest):
    """
    Simulated AI Tutor.
    In production, this would call OpenAI/Gemini API.
    Here we use rule-based responses for strict control/demo speed.
    """
    msg = req.message.lower()
    response = "That's an interesting question! can you look at the study materials?"
    
    if "explain" in msg or "what is" in msg:
        response = "That sounds like a conceptual question. Let's break it down using the Feynman technique..."
    elif "hard" in msg or "stuck" in msg:
        response = "I noticed you're finding this topic challenging. Shall we try a simpler example first?"
    elif "next" in msg:
        response = "Ready for the next challenge? Let's go!"
        
    return {"reply": response}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Mount React Assets
frontend_dist = "../frontend/dist"
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
