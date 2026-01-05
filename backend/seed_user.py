from database import SessionLocal
from models import User

def seed_user():
    db = SessionLocal()
    try:
        # check if exists
        if not db.query(User).filter(User.username == "student").first():
            print("Creating demo user 'student'...")
            user = User(
                username="student",
                email="student@demo.com",
                hashed_password="student", # In prod, hash this
                is_verified=True
            )
            db.add(user)
            db.commit()
            print("User created successfully.")
        else:
            print("User 'student' already exists.")
            
    except Exception as e:
        print(f"Error seeding user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_user()
