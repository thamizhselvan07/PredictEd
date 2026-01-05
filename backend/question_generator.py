from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
import models
from models import Question, KnowledgeNode
import random

class QuestionGenerator:
    def __init__(self, db: Session):
        self.db = db

    def get_next_question(self, user_id: int):
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
        print(f"DEBUG: User {user_id} Answered IDs: {answered_ids}")
        
        # Simple strategy: 70% chance to pick a random topic to explore/reinforce, 
        # 30% chance to target a weak area.
        
        topic = None
        target_difficulty = 0.5
        
        # Get weak nodes
        weak_nodes = self.db.query(KnowledgeNode).filter(
            KnowledgeNode.user_id == user_id,
            KnowledgeNode.strength_score < 0.4
        ).all()

        if weak_nodes and random.random() < 0.3:
            # Re-test weak area
            # Ensure we pick a weak node that actually has unanswered questions
            # This is complex, so for now we just pick one and fallback if empty
            node = random.choice(weak_nodes)
            topic = node.topic
            target_difficulty = max(0.1, node.strength_score)
        else:
            # Explore/Random
            # Pick from available question topics that have at least one unanswered question
            
            # Find available topics that have unanswered questions
            available_topics_query = self.db.query(Question.topic)
            if answered_ids:
                available_topics_query = available_topics_query.filter(~Question.id.in_(answered_ids))
            
            available_topics = available_topics_query.distinct().all()
            
            if available_topics:
                topic = random.choice(available_topics)[0]
                # Get current strength for this topic to adapt
                node = self.db.query(KnowledgeNode).filter(
                    KnowledgeNode.user_id == user_id, 
                    KnowledgeNode.topic == topic
                ).first()
                target_difficulty = node.strength_score if node else 0.3 # Default to easy-medium if new
        
        if not topic:
            print("DEBUG: No topic found (all answered?)")
            return None

        # Find question with difficulty close to that strength
        query = self.db.query(Question).filter(
            Question.topic == topic,
            Question.difficulty.between(target_difficulty - 0.2, target_difficulty + 0.2)
        )
        if answered_ids:
            query = query.filter(~Question.id.in_(answered_ids))
            
        question = query.order_by(func.random()).first()

        # Fallback: if no question in range, just get any question for that topic that isn't answered
        if not question:
            fallback_query = self.db.query(Question).filter(Question.topic == topic)
            if answered_ids:
                fallback_query = fallback_query.filter(~Question.id.in_(answered_ids))
            question = fallback_query.order_by(func.random()).first()
            
        return question

    def seed_questions(self):
        """Helper to seed DB if empty."""
        # Check individually to allow adding new questions to existing DB
        
        # Sample data
        data = [
            ("React", "Basics", 0.2, "What is a Component?", ["A function/class", "A variable", "A database"], "A function/class"),
            ("React", "Hooks", 0.6, "What does useEffect do?", ["Side effects", "Routing", "Styling"], "Side effects"),
            ("React", "State", 0.8, "Difference between State and Props?", ["State is mutable", "Props are mutable", "Both same"], "State is mutable"),
            ("Python", "Basics", 0.1, "Output of print(2+2)?", ["4", "22", "Error"], "4"),
            ("Python", "Lists", 0.4, "How to append to list?", [".push()", ".append()", ".add()"], ".append()"),
            ("Python", "Advanced", 0.9, "What is a decorator?", ["A function modifying another", "A comment", "A class"], "A function modifying another"),
            ("AI", "Concepts", 0.5, "What is Supervised Learning?", ["Labeled data", "No labels", "Reinforcement"], "Labeled data"),
            ("AI", "Neural Nets", 0.8, "What is Backpropagation?", ["Updating weights", "Forward pass", "Data cleaning"], "Updating weights"),
            # JavaScript
            ("JavaScript", "Basics", 0.3, "What is the result of '2' + 2 in JS?", ["'22'", "4", "Error"], "'22'"),
            ("JavaScript", "Advanced", 0.7, "What is a Closure?", ["Function inside function", "Loop termination", "Object property"], "Function inside function"),
            ("JavaScript", "Async", 0.8, "What does 'await' do?", ["Pauses execution until promise resolves", "Stops the server", "Creates a new thread"], "Pauses execution until promise resolves"),
            # SQL
            ("SQL", "Basics", 0.2, "Command to retrieve data?", ["SELECT", "GET", "FETCH"], "SELECT"),
            ("SQL", "Joins", 0.6, "Which JOIN returns matching rows only?", ["INNER JOIN", "LEFT JOIN", "OUTER JOIN"], "INNER JOIN"),
            ("SQL", "Constraints", 0.5, "What is a Primary Key?", ["Unique identifier", "Any column", "Foreign key"], "Unique identifier"),
            # Data Structures
            ("Data Structures", "Basics", 0.3, "Access time for Array by index?", ["O(1)", "O(n)", "O(log n)"], "O(1)"),
            ("Data Structures", "Stack", 0.4, "LIFO stands for?", ["Last In First Out", "List In First Out", "Long Integer Floating Output"], "Last In First Out"),
            ("Data Structures", "Queue", 0.4, "FIFO stands for?", ["First In First Out", "Fast In Fast Out", "First Integer First Output"], "First In First Out"),
        ]

        for t, sub, diff, q, opts, ans in data:
            exists = self.db.query(Question).filter(Question.content == q).first()
            if not exists:
                self.db.add(Question(
                    topic=t, subtopic=sub, difficulty=diff, 
                    content=q, options=opts, correct_answer=ans
                ))
        self.db.commit()
