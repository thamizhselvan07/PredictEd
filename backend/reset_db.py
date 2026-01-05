import models
import database
from question_generator import QuestionGenerator

def reset_database():
    print("Resetting database...")
    db = database.SessionLocal()
    
    # Drops all tables
    models.Base.metadata.drop_all(bind=database.engine)
    print("Tables dropped.")
    
    # Recreates all tables
    models.Base.metadata.create_all(bind=database.engine)
    print("Tables created.")
    
    # Seed data
    print("Seeding new data...")
    gen = QuestionGenerator(db)
    gen.seed_questions()
    
    # Create demo user
    if not db.query(models.User).filter(models.User.username == "student").first():
        db.add(models.User(username="student", hashed_password="hashed_secret"))
        db.commit()
    
    db.close()
    print("Database reset and seeded successfully.")

if __name__ == "__main__":
    reset_database()
