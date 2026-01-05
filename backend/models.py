from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("QuizAttempt", back_populates="user")
    knowledge_nodes = relationship("KnowledgeNode", back_populates="user")

class Stream(Base):
    __tablename__ = "streams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g., Engineering, Medical
    icon = Column(String) # Frontend icon name or URL
    
    exams = relationship("Exam", back_populates="stream", cascade="all, delete-orphan")

class Exam(Base):
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., JEE Main
    stream_id = Column(Integer, ForeignKey("streams.id"))
    description = Column(String)
    
    stream = relationship("Stream", back_populates="exams")
    subjects = relationship("Subject", back_populates="exam", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., Physics
    exam_id = Column(Integer, ForeignKey("exams.id"))
    icon = Column(String)
    
    exam = relationship("Exam", back_populates="subjects")
    questions = relationship("Question", back_populates="subject")
    quizzes = relationship("Quiz", back_populates="subject")

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String) # e.g., "Mechanics Basics"
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    description = Column(String)
    questions_count = Column(Integer, default=50)
    
    subject = relationship("Subject", back_populates="quizzes")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    # Link to Hierarchy
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True) # Nullable for migration safety
    
    topic = Column(String, index=True)
    subtopic = Column(String, index=True)
    difficulty = Column(Float)  # 0.0 to 1.0
    content = Column(String)
    options = Column(JSON)  # List of strings
    correct_answer = Column(String)
    explanation = Column(String, nullable=True)
    
    # Exam Meta
    pyq_year = Column(Integer, nullable=True) # e.g. 2023
    exam_weightage = Column(Float, default=1.0) # Relative importance
    
    subject = relationship("Subject", back_populates="questions")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=True) # Link to specific quiz if applicable
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True) # Direct link to subject (New Mode)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=True) # Link for Full Mock Exams
    score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Enhanced Tracking
    total_time = Column(Float, default=0.0) # Total seconds
    accuracy = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="attempts")
    logs = relationship("QuestionLog", back_populates="attempt")

class QuestionLog(Base):
    __tablename__ = "question_logs"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_answer = Column(String)
    is_correct = Column(Boolean)
    time_taken = Column(Float)  # in seconds
    difficulty_at_time = Column(Float)
    
    attempt = relationship("QuizAttempt", back_populates="logs")
    question = relationship("Question")

class KnowledgeNode(Base):
    __tablename__ = "knowledge_nodes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True) # Add hierarchy link
    strength_score = Column(Float, default=0.0)  # 0.0 to 1.0 (Mastery)
    volatility = Column(Float, default=0.5) # How fast it changes
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="knowledge_nodes")