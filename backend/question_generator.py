from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import models
from models import Question, KnowledgeNode
import random

class QuestionGenerator:
    def __init__(self, db: Session):
        self.db = db

    def get_next_question(self, user_id: int, subject_id: int = None):
        """
        Adapts to the user.
        1. Pick a topic (randomly or based on weak areas).
        2. Check user's strength in that topic.
        3. Fetch a question with difficulty close to that strength (Zone of Proximal Development).
        """
        # Get list of answered question IDs for this user
        answered_ids = [
            r[0] for r in self.db.query(models.QuestionLog.question_id)
            .join(models.QuizAttempt, models.QuestionLog.attempt_id == models.QuizAttempt.id)
            .filter(models.QuizAttempt.user_id == user_id)
            .all()
        ]
        
        # Simple strategy: 70% chance to pick a random topic to explore/reinforce, 
        # 30% chance to target a weak area.
        
        topic = None
        target_difficulty = 0.5
        
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
        
        if not topic:
            # If strictly filtered by subject and no topic found, maybe all answered or no topics?
            if subject_id:
                # Fallback: Just get any question from this subject
                fallback_q = self.db.query(Question).filter(Question.subject_id == subject_id)
                if answered_ids:
                    fallback_q = fallback_q.filter(~Question.id.in_(answered_ids))
                return fallback_q.order_by(func.random()).first()
            return None

        # Find question with difficulty close to that strength
        query = self.db.query(Question).filter(
            Question.topic == topic,
            Question.difficulty.between(target_difficulty - 0.2, target_difficulty + 0.2)
        )
        if subject_id:
            query = query.filter(Question.subject_id == subject_id)
            
        if answered_ids:
            query = query.filter(~Question.id.in_(answered_ids))
            
        question = query.order_by(func.random()).first()

        # Fallback: if no question in range, just get any question for that topic
        if not question:
            fallback_query = self.db.query(Question).filter(Question.topic == topic)
            if subject_id:
                fallback_query = fallback_query.filter(Question.subject_id == subject_id)
            if answered_ids:
                fallback_query = fallback_query.filter(~Question.id.in_(answered_ids))
            question = fallback_query.order_by(func.random()).first()
            
        return question

    def seed_questions(self):
        """
        Populate the database with dummy questions for the existing hierarchy.
        Adds PYQ metadata (Year 2014-2024).
        """
        from models import Subject, Question, Exam
        
        print("Seeding Questions for existing subjects...")
        
        # Get all subjects with their exam names
        # Assuming we can join or lazy load
        all_subjects = self.db.query(Subject).all()
        
        for sub in all_subjects:
            # check if questions exist
            if self.db.query(Question).filter(Question.subject_id == sub.id).count() < 50:
                # Fetch Exam Name
                exam_name = self.db.query(Exam.name).filter(Exam.id == sub.exam_id).scalar() or "Exam"
                
                # Add generic placeholder questions
                for i in range(1, 51):
                    topic = f"Topic {i%10 + 1}" 
                    diff = round(0.1 + (random.random() * 0.9), 1) # 0.1 to 1.0
                    
                    year = random.randint(2014, 2024)
                    
                    # Enhanced Question Text
                    q_content = f"[{exam_name} {year}] Question {i}: What is a key concept in {topic} regarding {sub.name}?"
                    opts = [f"Option A ({i})", f"Option B ({i})", "Correct Option", "None of the above"]
                    random.shuffle(opts)
                    
                    self.db.add(Question(
                        subject_id=sub.id,
                        topic=topic,
                        subtopic="General",
                        difficulty=diff,
                        content=q_content,
                        options=opts,
                        correct_answer="Correct Option",
                        pyq_year=year,
                        exam_weightage=1.0 + (random.random() * 0.5)
                    ))
        
        self.db.commit()
        print("Question Seeding Complete!")

