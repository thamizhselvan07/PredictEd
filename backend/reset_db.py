import models
import database
from question_generator import QuestionGenerator
from sqlalchemy.orm import Session

def seed_hierarchy(db: Session):
    print("Seeding Hierarchy (Streams -> Exams -> Subjects)...")
    
    # --- 1. ENGINEERING & TECHNOLOGY ---
    eng = models.Stream(name="Engineering & Technology", icon="Cpu")
    db.add(eng)
    
    # --- 2. MEDICAL & HEALTH SCIENCES ---
    med = models.Stream(name="Medical & Health Sciences", icon="Stethoscope")
    db.add(med)

    # --- 3. LAW ---
    law = models.Stream(name="Law", icon="Scale")
    db.add(law)

    # --- 4. MANAGEMENT, COMMERCE & ARTS ---
    mgmt = models.Stream(name="Management, Commerce & Arts", icon="Briefcase")
    db.add(mgmt)

    # --- 5. PROFESSIONAL COURSES (COMMERCE) ---
    prof = models.Stream(name="Professional Courses (Commerce)", icon="BadgeDollarSign")
    db.add(prof)

    # --- 6. ARCHITECTURE & DESIGN ---
    arch = models.Stream(name="Architecture & Design", icon="PenTool")
    db.add(arch)

    # --- 7. GOVT JOBS (Read Only/Age Restricted) ---
    govt = models.Stream(name="Govt Jobs (Not Eligible Before 18)", icon="Shield")
    db.add(govt)

    # Flush to get IDs if needed, but we use object refs
    db.flush()
    
    # --- Exams ---
    
    # Engineering
    jee_m = models.Exam(name="JEE Main", stream=eng, description="Joint Entrance Examination Main")
    jee_a = models.Exam(name="JEE Advanced", stream=eng, description="Joint Entrance Examination Advanced")
    tnea = models.Exam(name="TNEA", stream=eng, description="Tamil Nadu Engineering Admissions")
    bitsat = models.Exam(name="BITSAT", stream=eng, description="Birla Institute of Technology Science Admission Test")
    viteee = models.Exam(name="VITEEE", stream=eng, description="VIT Engineering Entrance Exam")
    srmjeee = models.Exam(name="SRMJEEE", stream=eng, description="SRM Joint Engineering Entrance Exam")
    eng_exams = [jee_m, jee_a, tnea, bitsat, viteee, srmjeee]
    db.add_all(eng_exams)
    
    # Medical
    neet = models.Exam(name="NEET UG", stream=med, description="National Eligibility cum Entrance Test")
    paramed = models.Exam(name="Allied Health / Paramedical (TN)", stream=med, description="Paramedical Admissions")
    med_exams = [neet, paramed]
    db.add_all(med_exams)
    
    # Law
    clat = models.Exam(name="CLAT UG", stream=law, description="Common Law Admission Test")
    ailet = models.Exam(name="AILET", stream=law, description="All India Law Entrance Test")
    lsat = models.Exam(name="LSAT India", stream=law, description="Law School Admission Test")
    law_exams = [clat, ailet, lsat]
    db.add_all(law_exams)
    
    # Management
    cuet = models.Exam(name="CUET UG", stream=mgmt, description="Common University Entrance Test")
    ipmat = models.Exam(name="IPMAT", stream=mgmt, description="Integrated Program in Management Aptitude Test")
    ugat = models.Exam(name="UGAT", stream=mgmt, description="Under Graduate Aptitude Test")
    mgmt_exams = [cuet, ipmat, ugat]
    db.add_all(mgmt_exams)
    
    # Professional
    ca = models.Exam(name="CA Foundation", stream=prof, description="Chartered Accountancy")
    cs = models.Exam(name="CS Foundation", stream=prof, description="Company Secretary")
    cma = models.Exam(name="CMA Foundation", stream=prof, description="Cost Management Accounting")
    prof_exams = [ca, cs, cma]
    db.add_all(prof_exams)
    
    # Architecture
    nata = models.Exam(name="NATA", stream=arch, description="National Aptitude Test in Architecture")
    uceed = models.Exam(name="UCEED", stream=arch, description="Undergraduate Common Entrance Exam for Design")
    arch_exams = [nata, uceed]
    db.add_all(arch_exams)
    
    # Govt
    nda = models.Exam(name="NDA", stream=govt, description="National Defence Academy")
    ssc = models.Exam(name="SSC / TNPSC", stream=govt, description="Staff Selection Commission")
    def_job = models.Exam(name="Police / Defence", stream=govt, description="Defence Services")
    rail = models.Exam(name="Railway Jobs", stream=govt, description="Railways")
    govt_exams = [nda, ssc, def_job, rail]
    db.add_all(govt_exams)
    
    db.flush()
    
    # --- Subjects ---
    
    # Engineering Subjects
    for ex in eng_exams:
        db.add(models.Subject(name="Physics", exam=ex, icon="Atom"))
        db.add(models.Subject(name="Chemistry", exam=ex, icon="Flask"))
        db.add(models.Subject(name="Mathematics", exam=ex, icon="Calculator"))
        db.add(models.Subject(name="Botany", exam=ex, icon="Leaf"))
        db.add(models.Subject(name="Zoology", exam=ex, icon="Dna"))

    # Medical Subjects
    for ex in med_exams:
        db.add(models.Subject(name="Physics", exam=ex, icon="Atom"))
        db.add(models.Subject(name="Chemistry", exam=ex, icon="Flask"))
        db.add(models.Subject(name="Botany", exam=ex, icon="Leaf"))
        db.add(models.Subject(name="Zoology", exam=ex, icon="Dna"))

    # Law Subjects
    for ex in law_exams:
        db.add(models.Subject(name="Legal Reasoning", exam=ex, icon="Scale"))
        db.add(models.Subject(name="Logical Reasoning", exam=ex, icon="Brain"))
        db.add(models.Subject(name="English", exam=ex, icon="Book"))
        db.add(models.Subject(name="Quantitative Techniques", exam=ex, icon="Calculator"))
        db.add(models.Subject(name="General Knowledge", exam=ex, icon="Globe"))

    # Management Subjects
    for ex in mgmt_exams:
        db.add(models.Subject(name="Quantitative Aptitude", exam=ex, icon="Graph"))
        db.add(models.Subject(name="Verbal Ability", exam=ex, icon="Book"))
        db.add(models.Subject(name="Logical Reasoning", exam=ex, icon="Brain"))
        db.add(models.Subject(name="General Awareness", exam=ex, icon="Globe"))

    # Professional Subjects
    for ex in prof_exams:
         db.add(models.Subject(name="Accounting", exam=ex, icon="Calculator"))
         db.add(models.Subject(name="Business Law", exam=ex, icon="Scale"))
         db.add(models.Subject(name="Economics", exam=ex, icon="Graph"))

    # Architecture Subjects
    for ex in arch_exams:
         db.add(models.Subject(name="Drawing", exam=ex, icon="PenTool"))
         db.add(models.Subject(name="Aptitude", exam=ex, icon="Brain"))
         db.add(models.Subject(name="Mathematics", exam=ex, icon="Calculator"))

    # Govt Subjects
    for ex in govt_exams:
        db.add(models.Subject(name="General Studies", exam=ex, icon="Globe"))
        db.add(models.Subject(name="Aptitude", exam=ex, icon="Brain"))


    db.commit()
    print("Hierarchy Seeded.")

def reset_database():
    print("Resetting database...")
    db = database.SessionLocal()
    
    # Drops all tables
    models.Base.metadata.drop_all(bind=database.engine)
    print("Tables dropped.")
    
    # Recreates all tables
    models.Base.metadata.create_all(bind=database.engine)
    print("Tables created.")
    
    # Seed Hierarchy
    seed_hierarchy(db)
    
    # Seed data (Questions)
    print("Seeding questions...")
    gen = QuestionGenerator(db)
    gen.seed_questions()
    
    # Create demo user
    if not db.query(models.User).filter(models.User.username == "student").first():
        hashed_pwd = "student" # In real app, hash this!
        db.add(models.User(
            username="student", 
            hashed_password=hashed_pwd, 
            email="student@demo.com",
            is_verified=True
        ))
        db.commit()
    
    db.close()
    print("Database reset and seeded successfully.")

if __name__ == "__main__":
    reset_database()
