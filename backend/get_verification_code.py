from sqlalchemy.orm import Session
from database import SessionLocal
import models

def get_code(email):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"Verification Code for {email}: {user.verification_code}")
        else:
            print(f"User {email} not found.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_code("yuva@gmail.com")
