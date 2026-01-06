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
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

# Init DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PredictEd")

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
    stream: Optional[str] = "General"
    exam: Optional[str] = "General"
    subject: Optional[str] = "General"
    topic: Optional[str] = None
    recent_performance: Optional[str] = None

class SignupRequest(BaseModel):
    username: str
    password: Optional[str] = None
    email: EmailStr
    # No signup_token needed as verification is handled by Firebase on frontend

class LoginRequest(BaseModel):
    username: str
    password: str

# --- Endpoints ---

# --- Authentication ---

@app.post("/api/auth/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    """
    Creates a user profile. 
    Assumes the user is already verified via Firebase on the frontend.
    """
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(models.User).filter(models.User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username taken")
        
    user = models.User(
        username=req.username,
        email=req.email,
        hashed_password=req.password, # In production, verify Firebase Token and don't store password if using pure Firebase Auth
        is_verified=True # Trusted from Frontend Gate
    )
    db.add(user)
    db.commit()
    
    return {"message": "Signup successful. You can now login."}

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if user.hashed_password != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not user.is_verified:
        # Should not happen if signup enforces it, but safe check
        raise HTTPException(status_code=403, detail="Email not verified")
        
    return {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "token": "fake-jwt-token-for-demo"
    }

class GoogleLoginRequest(BaseModel):
    email: EmailStr

@app.post("/api/auth/google-login")
def google_login(req: GoogleLoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Account not found. Please Sign Up.")
        
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

    # Enforce 50 Questions Limit
    questions_answered = db.query(models.QuestionLog).filter(models.QuestionLog.attempt_id == attempt_id).count()
    if questions_answered >= 50:
         # Mark attempt as completed if not already
         if not attempt.completed:
             attempt.completed = True
             db.commit()
         raise HTTPException(status_code=404, detail="Quiz Completed")

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
        "subject_name": sub_name,
        "question_number": questions_answered + 1,
        "total_questions": 50
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

    # --- End: Log Attempt ---

    # Update Attempt Stats
    attempt = db.query(models.QuizAttempt).filter(models.QuizAttempt.id == attempt.id).first()
    attempt.total_time += submission.time_taken
    
    # Recalculate Score/Accuracy
    logs = db.query(models.QuestionLog).filter(models.QuestionLog.attempt_id == attempt.id).all()
    total_q = len(logs)
    correct_q = sum(1 for l in logs if l.is_correct)
    
    attempt.score = correct_q # Raw score
    attempt.accuracy = (correct_q / total_q) if total_q > 0 else 0.0
    db.commit()

    # Update Knowledge Graph
    kg = KnowledgeGraphEngine(db)
    new_strength = kg.update_topic_strength(
        user_id, 
        q.topic, 
        is_correct, 
        q.difficulty,
        subject_id=q.subject_id
    )
    
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
    AI Tutor powered by Ollama (local) or Google Gemini (cloud).
    """
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    # 1. Try Ollama First (if configured or default)
    # We prefer Ollama for local privacy/cost if available
    try:
        import ollama
        ollama_model = os.getenv("OLLAMA_MODEL", "llama3") # Default to llama3
        
        # Check if we can connect to Ollama (simple list check or just try generate)
        # We will try to generate directly.
        
        system_prompt = f"""
        You are an ADVANCED AI TUTOR for the 'PredictEd' platform.
        
        CONTEXT:
        - Stream: {req.stream}
        - Exam: {req.exam}
        - Subject: {req.subject}
        {f"- Topic: {req.topic}" if req.topic else ""}
        {f"- Recent Performance: {req.recent_performance}" if req.recent_performance else ""}
        
        INSTRUCTIONS:
        - You are explaining concepts to a student preparing for competitive exams.
        - Be accurate, exam-oriented, and easy to understand.
        - Use step-by-step explanations, formulas, and examples where applicable.
        - If the user asks a question, answer it directly.
        - If the user asks for clarity, simplify your language.
        - Stay strictly within the syllabus of the selected EXAM.
        """
        
        # Combine system prompt + user message for Ollama
        # Ollama python client supports 'messages' list
        # Try specific model, if not found, try to list and use FIRST available
        
        try:
             response = ollama.chat(model=ollama_model, messages=[
                {
                    'role': 'system',
                    'content': system_prompt,
                },
                {
                    'role': 'user',
                    'content': req.message,
                },
            ])
        except ollama.ResponseError as e:
            if e.status_code == 404:
                # Model not found, try to find ANY locally available model
                models_info = ollama.list()
                if models_info.get('models'):
                    fallback_model = models_info['models'][0]['name']
                    print(f"Model {ollama_model} not found. Falling back to {fallback_model}...")
                    response = ollama.chat(model=fallback_model, messages=[
                        {
                            'role': 'system',
                            'content': system_prompt,
                        },
                        {
                            'role': 'user',
                            'content': req.message,
                        },
                    ])
                else:
                    raise Exception("No models found in Ollama. Please run 'ollama pull llama3'")
            else:
                raise e
        
        return {"reply": response['message']['content']}
        
    except Exception as e_ollama:
        print(f"Ollama Error (falling back to Gemini): {e_ollama}")
        # If Ollama fails (e.g. not running, model not found), fall back to Gemini
        pass

    # 2. Fallback to Gemini
    import google.generativeai as genai
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        return {"reply": "Configuration Error: AI API Key is missing and Ollama is unavailable."}

    try:
        genai.configure(api_key=api_key)
        # Use a stable model
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Context Construction (Same as above, reused)
        context_str = f"""
        You are an ADVANCED AI TUTOR for the 'PredictEd' platform.
        
        CONTEXT:
        - Stream: {req.stream}
        - Exam: {req.exam}
        - Subject: {req.subject}
        {f"- Topic: {req.topic}" if req.topic else ""}
        {f"- Recent Performance: {req.recent_performance}" if req.recent_performance else ""}
        
        INSTRUCTIONS:
        - You are explaining concepts to a student preparing for competitive exams.
        - Be accurate, exam-oriented, and easy to understand.
        - Use step-by-step explanations, formulas, and examples where applicable.
        - If the user asks a question, answer it directly.
        - Stay strictly within the syllabus of the selected EXAM.
        
        User Question: {req.message}
        """
        
        chat = model.start_chat(history=[])
        response_obj = chat.send_message(context_str)
        response = response_obj.text
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        if "429" in str(e):
             response = "I'm receiving too many requests on the cloud API. Please ensure **Ollama** is running locally for unlimited chat."
        else:
             response = f"I'm having trouble connecting to the AI brain. (Ollama: {str(e_ollama) if 'e_ollama' in locals() else 'Not attempted'}, Gemini: {str(e)})"

    return {"reply": response}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# --- Static File Serving (SPA) ---

current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dist = os.path.join(current_dir, "../frontend/dist")
assets_path = os.path.join(frontend_dist, "assets")

# Ensure dist exists before mounting
if os.path.exists(frontend_dist):
    # Mount assets folder explicitly if it exists
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    # Catch-all for SPA
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # 1. API Guard: Don't serve HTML for missing API endpoints
        if full_path.startswith(("api", "chat", "quiz", "streams", "exams", "subjects", "dashboard", "auth")):
            raise HTTPException(status_code=404, detail="API Endpoint not found")
        
        # 2. Serve static files if they exist (e.g., favicon.ico, manifest.json)
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # 3. Fallback to index.html for React Router
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
            
        return {"error": "Frontend build index.html not found"}
else:
    print("Warning: Frontend build not found. Run 'npm run build' in frontend directory.")
    @app.get("/")
    def read_root():
        return {"message": "Backend is running. Frontend build not found. Please run 'npm run build' in frontend directory."}
