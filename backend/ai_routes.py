from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import google.generativeai as genai
import os
import json
from database import get_db
import models

router = APIRouter(prefix="/api/ai", tags=["AI Features"])

class OnboardingRequest(BaseModel):
    user_id: int
    goal: str
    education_level: Optional[str] = "Unknown"
    available_time: Optional[str] = "1 hr/day"
    learning_pace: Optional[str] = "Normal"

@router.post("/onboarding")
async def ai_onboarding(req: OnboardingRequest, db: Session = Depends(get_db)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    Analyze this user's learning goal: '{req.goal}'
    Education Level: {req.education_level}
    
    Extract the following into a valid JSON object strictly matching this schema:
    {{
        "target_career": "str",
        "strengths": ["skill1", "skill2"],
        "skill_gaps": ["skill3", "skill4"]
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # very basic json extraction
        text = response.text.strip()
        if text.startswith('`json'):
            text = text[7:-3]
        
        parsed = json.loads(text)
        
        profile = db.query(models.LearnerProfile).filter(models.LearnerProfile.user_id == req.user_id).first()
        if not profile:
            profile = models.LearnerProfile(user_id=req.user_id)
            db.add(profile)
            
        profile.goal = req.goal
        profile.target_career = parsed.get("target_career", "Unknown")
        profile.available_time = req.available_time
        profile.learning_pace = req.learning_pace
        profile.strengths = parsed.get("strengths", [])
        profile.skill_gaps = parsed.get("skill_gaps", [])
        
        db.commit()
        db.refresh(profile)
        
        return {"status": "success", "profile": profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GeneratePathRequest(BaseModel):
    user_id: int

@router.post("/generate-path")
async def ai_generate_path(req: GeneratePathRequest, db: Session = Depends(get_db)):
    # This reads the profile and generates a roadmap.
    # We will use the demo data for the hackathon to guarantee consistent output if requested for demo,
    # or generate a generic one.
    
    profile = db.query(models.LearnerProfile).filter(models.LearnerProfile.user_id == req.user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    path = db.query(models.LearningPath).filter(models.LearningPath.user_id == req.user_id).first()
    if not path:
        path = models.LearningPath(
            user_id=req.user_id,
            goal_name=profile.target_career or "General Learning",
            overall_progress=0,
            estimated_completion="12 weeks",
            learning_velocity=0
        )
        db.add(path)
        db.commit()
        db.refresh(path)
    
    # Check if steps exist
    steps = db.query(models.PathStep).filter(models.PathStep.path_id == path.id).all()
    if not steps:
        # Generate steps based on gaps (Simplistic logic for demo)
        new_steps = []
        for i, gap in enumerate(profile.skill_gaps or []):
            new_steps.append(models.PathStep(
                path_id=path.id,
                phase_order=i+1,
                title=gap,
                step_type="course",
                description=f"Master the fundamentals of {gap}",
                status="current" if i == 0 else "locked",
                prerequisites=[profile.skill_gaps[i-1]] if i > 0 else [],
                reasoning=f"{gap} is essential for {profile.target_career}."
            ))
        db.add_all(new_steps)
        db.commit()
        
    db.refresh(path)
    steps = db.query(models.PathStep).filter(models.PathStep.path_id == path.id).order_by(models.PathStep.phase_order).all()
    
    return {
        "path": path,
        "steps": steps
    }

class ExplainRequest(BaseModel):
    step_id: int

@router.post("/explain-recommendation")
async def ai_explain_recommendation(req: ExplainRequest, db: Session = Depends(get_db)):
    step = db.query(models.PathStep).filter(models.PathStep.id == req.step_id).first()
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
        
    return {
        "title": step.title,
        "explanation": step.reasoning or "This topic was recommended based on your skill profile and goal requirements."
    }

class ReplanRequest(BaseModel):
    user_id: int
    subject_id: Optional[int] = None
    score: float

@router.post("/replan")
async def ai_replan(req: ReplanRequest, db: Session = Depends(get_db)):
    path = db.query(models.LearningPath).filter(models.LearningPath.user_id == req.user_id).first()
    if not path:
        return {"status": "ignored", "message": "No path exists"}
        
    if req.score < 50:
        # User failed. Adjust the roadmap by adding reinforcement.
        # Find the current step
        current_step = db.query(models.PathStep).filter(
            models.PathStep.path_id == path.id, 
            models.PathStep.status == "current"
        ).first()
        
        if current_step:
            # Shift phase order for subsequent steps
            subsequent = db.query(models.PathStep).filter(
                models.PathStep.path_id == path.id,
                models.PathStep.phase_order > current_step.phase_order
            ).all()
            for s in subsequent:
                s.phase_order += 1
                
            reinforcement = models.PathStep(
                path_id=path.id,
                phase_order=current_step.phase_order + 1,
                title=f"Reinforcement: {current_step.title}",
                step_type="assessment",
                description="Practice fundamental concepts again.",
                status="locked",
                estimated_time="2 days",
                prerequisites=[current_step.title],
                reasoning=f"PredictEd detected a learning gap during your last assessment on {current_step.title}. Adding reinforcement modules."
            )
            db.add(reinforcement)
            db.commit()
            return {"status": "replanned", "message": "Learning path adjusted based on performance."}
            
    return {"status": "no_change", "message": "Performance is good. Path remains optimal."}

@router.get("/profile/{user_id}")
async def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(models.LearnerProfile).filter(models.LearnerProfile.user_id == user_id).first()
    return profile

