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
