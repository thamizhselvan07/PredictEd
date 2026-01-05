from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

def seed_exams():
    db = SessionLocal()
    try:
        # Clear existing data provided we are re-seeding
        # Note: In production you'd be more careful.
        print("Clearing existing hierarchy...")
        db.query(models.Exam).delete()
        db.query(models.Stream).delete()
        db.query(models.Subject).delete()
        db.commit()

        # Define Hierarchy
        hierarchy = {
            "Engineering & Technology": {
                "icon": "engineering",
                "exams": {
                    "JEE Main": ["Physics", "Chemistry", "Mathematics"],
                    "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
                    "BITSAT": ["Physics", "Chemistry", "Mathematics", "English Proficiency", "Logical Reasoning"],
                    "VITEEE": ["Physics", "Chemistry", "Mathematics/Biology", "Aptitude", "English"],
                    "SRMJEEE": ["Physics", "Chemistry", "Mathematics/Biology", "English", "Aptitude"],
                    "AEEE": ["Physics", "Chemistry", "Mathematics", "English"],
                    "MET": ["Physics", "Chemistry", "Mathematics", "English", "General Aptitude"],
                    "COMEDK UGET": ["Physics", "Chemistry", "Mathematics"],
                    "WBJEE": ["Physics", "Chemistry", "Mathematics"],
                    "MHTCET": ["Physics", "Chemistry", "Mathematics/Biology"],
                    "KCET": ["Physics", "Chemistry", "Mathematics/Biology"],
                    "AP EAMCET": ["Physics", "Chemistry", "Mathematics"],
                    "TS EAMCET": ["Physics", "Chemistry", "Mathematics"]
                }
            },
            "Medical & Health Sciences": {
                "icon": "medical",
                "exams": {
                    "NEET UG": ["Physics", "Chemistry", "Biology (Botany)", "Biology (Zoology)"],
                    "Allied Health Sciences": ["Physics", "Chemistry", "Biology"]
                }
            },
            "Law": {
                "icon": "law",
                "exams": {
                    "CLAT UG": ["English Language", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
                    "AILET": ["English Language", "General Knowledge", "Logical Reasoning"],
                    "SLAT": ["Logical Reasoning", "Legal Reasoning", "Analytical Reasoning", "Reading Comprehension", "General Knowledge"],
                    "LSAT India": ["Analytical Reasoning", "Logical Reasoning", "Reading Comprehension"]
                }
            },
            "Management, Commerce & Arts": {
                "icon": "management",
                "exams": {
                    "CUET UG": ["Accountancy", "Economics", "Business Studies", "General Test", "English"],
                    "IPMAT": ["Quantitative Ability (SA)", "Quantitative Ability (MCQ)", "Verbal Ability"],
                    "UGAT": ["English", "Numerical Analysis", "Data Analysis", "General Knowledge"],
                    "NPAT": ["Quantitative & Numerical Ability", "Reasoning & General Intelligence", "Proficiency in English"],
                    "SET": ["General English", "Quantitative", "General Awareness", "Analytical & Logical Reasoning"]
                }
            },
            "Professional Courses (Commerce)": {
                "icon": "commerce",
                "exams": {
                    "CA Foundation": ["Principles of Accounting", "Business Laws", "Quantitative Aptitude", "Business Economics"],
                    "CS Executive Entrance": ["Business Communication", "Legal Aptitude", "Economic & Business Environment", "Current Affairs"],
                    "CMA Foundation": ["Fundamentals of Economics", "Accounting", "Laws and Ethics", "Mathematics"]
                }
            },
            "Architecture & Design": {
                "icon": "architecture",
                "exams": {
                    "NATA": ["Diagrammatic Reasoning", "Numerical Reasoning", "Verbal Reasoning", "Inductive Reasoning", "Abstract Reasoning"],
                    "UCEED": ["Visualization", "Spatial Ability", "Design Sensitivity", "Problem Solving"]
                }
            },
            "Government & Defence (Age Restricted)": {
                "icon": "defence",
                "exams": {
                    "NDA": ["Mathematics", "General Ability Test"],
                    "SSC CHSL": ["English", "General Intelligence", "Quantitative Aptitude", "General Awareness"]
                }
            }
        }

        print("Seeding new hierarchy...")
        for stream_name, stream_data in hierarchy.items():
            stream = models.Stream(name=stream_name, icon=stream_data["icon"])
            db.add(stream)
            db.flush() # Get ID

            for exam_name, subjects in stream_data["exams"].items():
                exam = models.Exam(name=exam_name, stream_id=stream.id)
                db.add(exam)
                db.flush()

                for sub_name in subjects:
                    subject = models.Subject(name=sub_name, exam_id=exam.id)
                    db.add(subject)
            
        db.commit()
        print("Seeding Complete!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_exams()
