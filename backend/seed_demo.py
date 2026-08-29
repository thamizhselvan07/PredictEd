import models
import database
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = database.SessionLocal()

user = db.query(models.User).filter(models.User.email == "demo@predicted.com").first()
if not user:
    user = models.User(
        username="demo",
        email="demo@predicted.com",
        hashed_password=pwd_context.hash("demo123"),
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"Created demo user {user.id}")

profile = db.query(models.LearnerProfile).filter(models.LearnerProfile.user_id == user.id).first()
if not profile:
    profile = models.LearnerProfile(
        user_id=user.id,
        goal="I want to become a Machine Learning Engineer in 8 months.",
        target_career="Machine Learning Engineer",
        available_time="2 hrs/day",
        learning_pace="Fast",
        strengths=["Python", "Statistics", "Basic SQL"],
        skill_gaps=["Linear Algebra", "Machine Learning", "Deep Learning", "MLOps"],
        learning_preferences="Project-based, visual"
    )
    db.add(profile)

path = db.query(models.LearningPath).filter(models.LearningPath.user_id == user.id).first()
if not path:
    path = models.LearningPath(
        user_id=user.id,
        goal_name="AI Engineer",
        overall_progress=18.5,
        estimated_completion="14 weeks",
        learning_velocity=18.0
    )
    db.add(path)
    db.commit()
    db.refresh(path)

    steps = [
        models.PathStep(
            path_id=path.id, phase_order=1, title="Python Foundations", step_type="course", 
            description="Advanced Python for data science.", status="completed", estimated_time="1 week",
            prerequisites=[], reasoning="Python is the core language for AI."
        ),
        models.PathStep(
            path_id=path.id, phase_order=2, title="Linear Algebra", step_type="course", 
            description="Matrix operations, vectors, eigenvectors.", status="current", estimated_time="2 weeks",
            prerequisites=["Python Foundations"], reasoning="Linear Algebra is a prerequisite for several ML concepts. Your current mastery is low."
        ),
        models.PathStep(
            path_id=path.id, phase_order=3, title="Machine Learning", step_type="project", 
            description="Build a Student Performance Predictor.", status="locked", estimated_time="3 weeks",
            prerequisites=["Linear Algebra", "Probability"], reasoning="Your goal requires Machine Learning."
        ),
        models.PathStep(
            path_id=path.id, phase_order=4, title="Deep Learning", step_type="course", 
            description="Neural Networks, CNNs, RNNs.", status="locked", estimated_time="4 weeks",
            prerequisites=["Machine Learning", "Calculus"], reasoning="Deep learning is essential for modern AI engineers."
        ),
        models.PathStep(
            path_id=path.id, phase_order=5, title="MLOps & Deployment", step_type="course", 
            description="Docker, Kubernetes, CI/CD for ML.", status="locked", estimated_time="2 weeks",
            prerequisites=["Deep Learning"], reasoning="Needed to deploy models in production."
        )
    ]
    db.add_all(steps)

db.commit()
print("Demo student seeded successfully.")
