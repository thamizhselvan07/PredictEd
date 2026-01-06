from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import models
from models import Question, KnowledgeNode, Exam
import random

class QuestionGenerator:
    def __init__(self, db: Session):
        self.db = db

    def get_next_question(self, user_id: int, subject_id: int = None, attempt_id: int = None):
        """
        Adapts to the user.
        - If attempt_id is provided, check the Quiz linked to it for specific Topic/Mode constraints.
        """
        # Get list of answered question IDs for this user
        answered_ids = [
            r[0] for r in self.db.query(models.QuestionLog.question_id)
            .join(models.QuizAttempt, models.QuestionLog.attempt_id == models.QuizAttempt.id)
            .filter(models.QuizAttempt.user_id == user_id)
            .all()
        ]
        
        topic = None
        target_difficulty = 0.5
        
        # --- NEW: Check Attempt Context for Topic Mock / Final Mock ---
        is_topic_mock = False
        is_final_mock = False
        forced_topic = None
        
        if attempt_id:
            attempt = self.db.query(models.QuizAttempt).filter(models.QuizAttempt.id == attempt_id).first()
            if attempt and attempt.quiz_id:
                quiz_obj = self.db.query(models.Quiz).filter(models.Quiz.id == attempt.quiz_id).first()
                if quiz_obj:
                    # Check for Topic in title
                    title = quiz_obj.title
                    if "Final Adaptive Mock" in title:
                        is_final_mock = True
                    elif "Mock" in title:
                        is_topic_mock = True
                        forced_topic = title.rpartition(" (")[0]
                    elif "practice" in title and "(" in title:
                        is_topic_mock = True # Reuse logic for strict filtering
                        forced_topic = title.rpartition(" (")[0]

        # --- LOGIC BRANCHING ---

        if is_topic_mock and forced_topic:
            # STRICT FILTER: Only from this topic
            topic = forced_topic
            # For mocks, we might want random difficulty or standard exam distribution.
            # Let's keep it adaptive but strictly bounded to topic.
            target_difficulty = 0.5 # Default start for mock
            
            # If user has history in this topic, adapt?
            # For 30 Q mock, maybe just random valid questions from this topic is better for "Exam Feel"
            # But adapting is fine too.
        
        elif is_final_mock:
            # STRICT FILTER: Weak Areas + High Weightage
            predictor = models.PredictorEngine(self.db)
            weak_areas = predictor.predict_weak_areas(user_id)
            
            if weak_areas:
                 # Pick a weak topic
                 topic = random.choice(weak_areas)['topic']
            else:
                 # Determine highly weighted topics for this subject/exam?
                 # Fallback to random
                 pass
        
        else:
            # STANDARD ADAPTIVE LOGIC (Existing)
            # Base query for KnowledgeNode
            kn_query = self.db.query(KnowledgeNode).filter(KnowledgeNode.user_id == user_id)
            if subject_id:
                kn_query = kn_query.filter(KnowledgeNode.subject_id == subject_id)

            # Get weak nodes
            weak_nodes = kn_query.filter(KnowledgeNode.strength_score < 0.4).all()

            if weak_nodes and random.random() < 0.3:
                # Re-test weak area
                node = random.choice(weak_nodes)
                topic = node.topic
                target_difficulty = max(0.1, node.strength_score)
            else:
                # Explore/Random
                # Find available topics that have unanswered questions
                available_topics_query = self.db.query(Question.topic)
                if subject_id:
                    available_topics_query = available_topics_query.filter(Question.subject_id == subject_id)
                    
                if answered_ids:
                    available_topics_query = available_topics_query.filter(~Question.id.in_(answered_ids))
                
                available_topics = available_topics_query.distinct().all()
                
                if available_topics:
                    topic = random.choice(available_topics)[0]
                    # Get current strength for this topic
                    node = kn_query.filter(KnowledgeNode.topic == topic).first()
                    target_difficulty = node.strength_score if node else 0.3 # Default to easy-medium if new
        
        
        # --- QUERY EXECUTION ---
        if not topic and is_topic_mock:
             # Should not happen if forced_topic is set, unless title parsing failed
             pass

        if not topic:
            # Fallback for general/final mock if no weak areas found
            if subject_id:
                fallback_q = self.db.query(Question).filter(Question.subject_id == subject_id)
                if answered_ids:
                    fallback_q = fallback_q.filter(~Question.id.in_(answered_ids))
                return fallback_q.order_by(func.random()).first()
            return None

        # Find question with difficulty close to that strength
        # Relax range for high-end questions
        query = self.db.query(Question).filter(
            Question.topic == topic,
            Question.difficulty.between(target_difficulty - 0.3, target_difficulty + 0.3)
        )
        if subject_id:
            query = query.filter(Question.subject_id == subject_id)
            
        if answered_ids:
            query = query.filter(~Question.id.in_(answered_ids))
            
        question = query.order_by(func.random()).first()

        # Fallback
        if not question:
            # Try any difficulty in that topic (Double check)
            fallback_query = self.db.query(Question).filter(Question.topic == topic)
            if subject_id:
                fallback_query = fallback_query.filter(Question.subject_id == subject_id)
            if answered_ids:
                fallback_query = fallback_query.filter(~Question.id.in_(answered_ids))
            question = fallback_query.order_by(func.random()).first()
            
        return question

    def seed_questions(self):
        """
        Populate the database with high-end, category-specific realistic exam questions.
        """
        from models import Subject, Question, Exam
        
        print("Seeding High-End Questions...")
        
        # --- HIGH END CONTENT REPOSITORY ---
        REAL_CONTENT = {
            "Physics": [
                {"c": "A block of mass m is kept on a wedge of mass M. The wedge moves with acceleration a. The block remains stationary wrt wedge. The value of a is:", "o": ["g tanθ", "g cotθ", "g sinθ", "g cosθ"], "a": "g tanθ", "t": "Laws of Motion", "d": 0.7},
                {"c": "An electron moving with velocity v = 2i + 3j enters a magnetic field B = 4k. The force on the electron is (e = charge):", "o": ["e(-12i + 8j)", "e(12i - 8j)", "e(8i + 12j)", "e(-8i - 12j)"], "a": "e(12i - 8j)", "t": "Magnetism", "d": 0.8},
                {"c": "In an adiabatic expansion of an ideal gas, the product of pressure and volume:", "o": ["Decreases", "Increases", "Remains constant", "First increases then decreases"], "a": "Decreases", "t": "Thermodynamics", "d": 0.6},
                {"c": "A ring of mass M and radius R rolls without slipping down an inclined plane of inclination θ. The acceleration of center of mass is:", "o": ["g sinθ / 2", "2g sinθ / 3", "g sinθ", "5g sinθ / 7"], "a": "g sinθ / 2", "t": "Rotational Motion", "d": 0.8},
                {"c": "The de Broglie wavelength of an electron accelerated through a potential difference V is proportional to:", "o": ["V", "V^0.5", "V^-0.5", "V^2"], "a": "V^-0.5", "t": "Modern Physics", "d": 0.5}
            ],
            "Chemistry": [
                {"c": "Which of the following complexes exhibits optical isomerism?", "o": ["[Co(en)3]3+", "trans-[Co(en)2Cl2]+", "[Co(NH3)4Cl2]+", "[Cr(H2O)6]3+"], "a": "[Co(en)3]3+", "t": "Coordination Compounds", "d": 0.8},
                {"c": "In the reaction of Phenol with CHCl3 and NaOH (Reimer-Tiemann reaction), the electrophile attacking the ring is:", "o": "CHCl2", "o": ["CCl2 (Dichlorocarbene)", "CHCl2+", "CHO+", "CO2"], "a": "CCl2 (Dichlorocarbene)", "t": "Organic Chemistry", "d": 0.7},
                {"c": "The standard electrode potential (E°) for OCl- / Cl- and Cl- / 1/2 Cl2 are given. Calculate E° for OCl- / 1/2 Cl2.", "o": ["Depends on pH", "Sum of potentials", "Difference of potentials", "Need Nernst Equation"], "a": "Need Nernst Equation", "t": "Electrochemistry", "d": 0.9},
                {"c": "Which crystal system has a ≠ b ≠ c and α ≠ β ≠ γ ≠ 90°?", "o": ["Triclinic", "Monoclinic", "Orthorhombic", "Rhombohedral"], "a": "Triclinic", "t": "Solid State", "d": 0.6},
                {"c": "Aldol condensation will NOT be observed in:", "o": ["Chloral", "Acetaldehyde", "Acetone", "Propanal"], "a": "Chloral", "t": "Aldehydes & Ketones", "d": 0.5}
            ],
            "Mathematics": [
                {"c": "The simple integral of dx / (x^2 + a^2) is:", "o": ["(1/a) tan^-1(x/a)", "tan^-1(x/a)", "loge(x + sqrt(x^2+a^2))", "sin^-1(x/a)"], "a": "(1/a) tan^-1(x/a)", "t": "Integral Calculus", "d": 0.4},
                {"c": "If z is a complex number such that |z| = 1 and z ≠ -1, then (z-1)/(z+1) is purely:", "o": ["Real", "Imaginary", "Zero", "Undefined"], "a": "Imaginary", "t": "Complex Numbers", "d": 0.8},
                {"c": "The number of real solutions of the equation |x|^2 - 3|x| + 2 = 0 is:", "o": ["4", "2", "3", "1"], "a": "4", "t": "Quadratic Equations", "d": 0.6},
                {"c": "Three numbers are chosen from {1, 2, ..., 30}. The probability that they are consecutive is:", "o": ["1/145", "2/145", "1/29", "28/4060"], "a": "28/4060", "t": "Probability", "d": 0.7},
                {"c": "The value of lim(x->0) (sin x / x) is:", "o": ["1", "0", "Infinity", "Undefined"], "a": "1", "t": "Calculus", "d": 0.3}
            ],
            "Biology": [
                {"c": "In C4 plants, the primary CO2 acceptor is:", "o": ["PEP", "RuBP", "OAA", "PGA"], "a": "PEP", "t": "Plant Physiology", "d": 0.7},
                {"c": "Which immunoglobulins can cross the placenta?", "o": ["IgA", "IgG", "IgM", "IgE"], "a": "IgG", "t": "Immunology", "d": 0.6},
                {"c": "Restriction Endonucleases cut DNA strands at:", "o": ["Palindromic sites", "GC rich regions", "AT rich regions", "Random sites"], "a": "Palindromic sites", "t": "Biotechnology", "d": 0.5},
                {"c": "During muscle contraction, observing the sarcomere, what shortens?", "o": ["I-Band and H-Zone", "A-Band", "Actin filaments only", "Myosin filaments only"], "a": "I-Band and H-Zone", "t": "Human Physiology", "d": 0.8},
                {"c": "Which vector is commonly used in Human Genome Project cloning?", "o": ["BAC and YAC", "Plasmid", "Cosmid", "Phagemid"], "a": "BAC and YAC", "t": "Genetics", "d": 0.7}
            ],
            # --- NEW CATEGORIES ---
            "Law": [
                {"c": "PRINCIPLE: A master is liable for acts of his servant done in the course of employment. FACTS: Driver takes a detour to visit his friend and hits a pedestrian.", "o": ["Master is liable", "Master is not liable (Frolic of his own)", "Both liable", "Depends on distance"], "a": "Master is not liable (Frolic of his own)", "t": "Law of Torts", "d": 0.8},
                {"c": "The 'Preamble' of the Indian Constitution was amended by which Amendment?", "o": ["42nd", "44th", "1st", "86th"], "a": "42nd", "t": "Constitutional Law", "d": 0.5},
                {"c": "Void ab initio means:", "o": ["Void from the beginning", "Voidable at option", "Valid until cancelled", "Illegal"], "a": "Void from the beginning", "t": "Legal Maxims", "d": 0.4},
                {"c": "PRINCIPLE: Contract with a minor is void. FACTS: A (17 years) buys a bike on credit.", "o": ["Contract is valid", "Contract is void", "Contract is voidable", "Seller can sue parents"], "a": "Contract is void", "t": "Contract Law", "d": 0.6},
                {"c": "Which writ is issued to quash the order of a lower court?", "o": ["Certiorari", "Mandamus", "Habeas Corpus", "Quo Warranto"], "a": "Certiorari", "t": "Constitutional Law", "d": 0.7}
            ],
            "Commerce": [
                {"c": "Which accounting standard deals with Cash Flow Statements?", "o": ["AS-3", "AS-10", "AS-2", "AS-1"], "a": "AS-3", "t": "Accounting", "d": 0.5},
                {"c": "In a perfectly competitive market, the demand curve for a firm is:", "o": ["Perfectly Elastic", "Perfectly Inelastic", "Downward sloping", "Upward sloping"], "a": "Perfectly Elastic", "t": "Economics", "d": 0.6},
                {"c": "Debit what comes in, Credit what goes out is the rule for:", "o": ["Real Accounts", "Personal Accounts", "Nominal Accounts", "Bank Accounts"], "a": "Real Accounts", "t": "Accountancy Basics", "d": 0.3},
                {"c": "The break-even point is where:", "o": ["Total Revenue = Total Cost", "Total Revenue > Total Cost", "Marginal Revenue = Marginal Cost", "Profit is maximum"], "a": "Total Revenue = Total Cost", "t": "Cost Accounting", "d": 0.5},
                {"c": "Which of the following is NOT a function of the Reserve Bank of India?", "o": ["Allocating funds directly to farmers", "Issuing Currency", "Banker's Bank", "Controller of Credit"], "a": "Allocating funds directly to farmers", "t": "Business Studies", "d": 0.4}
            ],
            "General": [
                {"c": "If A completes a work in 10 days and B in 15 days, together they complete it in:", "o": ["6 days", "5 days", "8 days", "7 days"], "a": "6 days", "t": "Quantitative Aptitude", "d": 0.5},
                {"c": "Find the next number: 2, 6, 12, 20, ...", "o": ["30", "32", "42", "28"], "a": "30", "t": "Logical Reasoning", "d": 0.4},
                {"c": "Synonym of 'Ephemeral' is:", "o": ["Short-lived", "Eternal", "Beautiful", "Dangerous"], "a": "Short-lived", "t": "Verbal Ability", "d": 0.7},
                {"c": "Who is the current Chief Justice of India (2024)?", "o": ["D.Y. Chandrachud", "U.U. Lalit", "N.V. Ramana", "Ranjan Gogoi"], "a": "D.Y. Chandrachud", "t": "General Knowledge", "d": 0.3},
                {"c": "A train 120m long crosses a pole in 6s. Speed of train is:", "o": ["72 km/hr", "60 km/hr", "20 km/hr", "50 km/hr"], "a": "72 km/hr", "t": "Quantitative Aptitude", "d": 0.6}
            ]
        }

        # Mapping Helpers
        def get_category(sub_name):
            n = sub_name.lower()
            if "phys" in n: return "Physics"
            if "chem" in n: return "Chemistry"
            if "math" in n or "quant" in n: return "Mathematics"
            if "bio" in n or "zoo" in n or "bot" in n: return "Biology"
            if "law" in n or "legal" in n: return "Law"
            if "account" in n or "business" in n or "econ" in n or "cost" in n: return "Commerce"
            if "logic" in n or "reason" in n or "aptitude" in n or "mental" in n or "general" in n or "english" in n or "verbal" in n: return "General"
            return "General"

        all_subjects = self.db.query(Subject).all()

        for sub in all_subjects:
            category = get_category(sub.name)
            
            # Special case: Mathematics in Commerce/Govt might be Quant (General)
            # Use Exam type to refine if needed, but 'Mathematics' usually implies Core Math.
            # 'Quantitative Techniques' -> General/Quant.
            
            content_list = REAL_CONTENT.get(category, REAL_CONTENT["General"])
            
            # If still default, try finding "Mathematics" for "Math" string match
            if category == "General" and "Math" in sub.name:
                content_list = REAL_CONTENT["Mathematics"]
            
            print(f"Seeding {sub.name} [{category}]...")
            
            exam_name = self.db.query(Exam.name).filter(Exam.id == sub.exam_id).scalar() or "Exam"
            
            # Generate questions
            count = 0
            while count < 55:
                for item in content_list:
                    if count >= 55: break
                    
                    year = random.randint(2018, 2024)
                    final_opts = list(item["o"]) # Copy
                    random.shuffle(final_opts)
                    
                    q_model = Question(
                        subject_id=sub.id,
                        topic=item["t"],
                        subtopic="Advanced",
                        difficulty=item["d"] + random.uniform(-0.02, 0.02),
                        content=f"[{exam_name} {year}] {item['c']}",
                        options=final_opts,
                        correct_answer=item["a"],
                        pyq_year=year,
                        exam_weightage=1.5
                    )
                    self.db.add(q_model)
                    count += 1
            
        self.db.commit()
        print("High-End Question Seeding Complete!")
