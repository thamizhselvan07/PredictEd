# PredictEd - AI-Powered Personalized Learning Path Recommender

PredictEd doesn't just tell students what to study - it predicts what they need to learn next and continuously rebuilds their learning path based on how they perform.

## What is PredictEd?
PredictEd is an AI-powered adaptive learning platform designed for students preparing for competitive examinations and career-oriented skill development.

Traditional learning platforms provide students with:
- Static syllabi
- Generic recommendations
- Fixed learning paths
- Basic test scores
- Generic chatbots

PredictEd takes a different approach. It continuously analyzes a student's:
- Target exam or career
- Current skill level
- Quiz and mock-test performance
- Skill gaps
- Topic prerequisites
- Learning velocity
- Repeated mistakes
- Performance trends

And uses this information to determine:
**What should the student learn next, why they should learn it, and how their learning path should change.**

## Problem Statement
Students preparing for competitive exams often follow static syllabi and generic study plans that do not adapt to their individual strengths, weaknesses, learning pace, or performance.

Most existing platforms answer: *"What should I study?"*
But they often fail to answer:
- *"What should I study next?"*
- *"Why should I study it?"*
- *"What am I likely to struggle with?"*
- *"How should my learning path change after my latest test?"*

PredictEd addresses this gap through a closed-loop adaptive learning intelligence system.

## Our Solution
PredictEd creates a personalized roadmap for each learner and continuously updates it using performance feedback.

**Core Workflow**
Student Goal -> AI Learner Profile -> Skill Assessment -> Skill Gap Detection -> Prerequisite Analysis -> Personalized Learning Path -> Next Best Action -> Learn / Practice -> Quiz / Mock Test -> AI Performance Analysis -> Predictive Weak-Topic Engine -> Dynamic Replanning -> Updated Learning Path -> Next Best Action

The roadmap is therefore not fixed. Every assessment becomes feedback for the intelligence layer.

## Core Innovation
**Learn -> Measure -> Predict -> Explain -> Replan -> Learn Again**

Unlike traditional learning platforms, PredictEd creates a closed-loop adaptive learning system.

| Traditional Platform | PredictEd |
| :--- | :--- |
| Static syllabus | Dynamic learning path |
| Generic recommendations | Personalized recommendations |
| Shows test score | Analyzes why the score happened |
| Detects weak topics | Predicts future weak topics |
| Fixed roadmap | Self-replanning roadmap |
| Generic chatbot | Context-aware AI Tutor |
| "Study Chapter 5" | "Study this next, because..." |
| Completion percentage | Goal ETA + Learning Velocity |
| Tests measure progress | Tests actively change the learning path |

## Key Features

### 1. AI-Powered Learner Profiling
Students describe their goal and current knowledge in natural language. PredictEd structures this into a learner profile containing the target career, strengths, skill gaps, and learning pace.

### 2. Personalized Learning Path
PredictEd generates a roadmap based on the student's actual skill level instead of forcing every learner through the same syllabus, integrating prerequisite dependencies and locked/unlocked topic states.

### 3. Next Best Action Engine
PredictEd continuously determines the single most useful action for the student based on skill mastery, recent quiz performance, prerequisites, and learning velocity.

### 4. Adaptive Mock Tests
PredictEd goes beyond static question papers by generating AI-powered adaptive mocks that dynamically target areas where the student needs more practice.

### 5. AI Mock-Test Analysis
PredictEd doesn't stop at displaying a score. After a test, it analyzes performance at the skill and topic level and identifies learning trends.

### 6. Predictive Weak-Topic Engine
PredictEd attempts to go one step further by predicting future bottlenecks. For example: *"You have a high probability of struggling with PCA because your Linear Algebra and Eigenvalue mastery are currently low."*

### 7. Dynamic Learning Path Replanning
This is the heart of PredictEd. If a student performs poorly in an area, the AI automatically transforms the roadmap to add reinforcement modules and targeted practice before allowing them to advance.

### 8. "Why This?" Explainable AI
Every important recommendation should be understandable. The AI explains *why* a topic is in your path based on your current mastery and prerequisite requirements.

### 9. AI Knowledge Graph
PredictEd represents relationships visually between: `Goal -> Skill -> Subskill -> Prerequisite`. The graph highlights Mastered, In Progress, Needs Attention, and AI Recommended bottlenecks.

### 10. Context-Aware AI Tutor
PredictEd's AI Tutor is designed to understand the learner's journey. It uses context such as target goals, learning roadmaps, and recent test performance to provide highly contextualized answers.

### 11. Roadmap Intelligence
The dashboard tracks Learning Velocity, Goal ETA, Path Health, Predicted Failure Risk, and Skill Mastery.

### 12. Intelligent Home Dashboard
The dashboard acts as an AI command center, highlighting the **NEXT BEST ACTION** and **AI PREDICTION** instead of a simple "Resume Course" button.

### 13. Gamification
PredictEd connects learning improvement with gamification through XP, Levels, Daily streaks, and achievement badges that reward actual improvement.

### 14. Learning Path Adjustment Notifications
When the AI changes a student's roadmap, PredictEd makes the change transparently visible through alert modules.

## System Architecture
```
+---------------------------------------+
|                STUDENT                |
|        Goal - Activity - Tests        |
+-------------------+-------------------+
                    |
+-------------------v-------------------+
|             REACT FRONTEND            |
|  Dashboard - Roadmap - Quiz - Tutor   |
+-------------------+-------------------+
                    |
+-------------------v-------------------+
|               FASTAPI                 |
|          Application Layer            |
+-------------------+-------------------+
                    |
       +------------+------------+
       |            |            |
+------v-----+ +----v-----+ +----v---------+
| Knowledge  | |Predictive| |  Adaptive    |
|   Graph    | | Weakness | |  Difficulty  |
|   Engine   | |  Engine  | |    Engine    |
+------+-----+ +----+-----+ +------+-------+
       |            |              |
       +------------+--------------+
                    |
           +--------v-----------+
           |   Learning Path    |
           | Replanning Engine  |
           +--------+-----------+
                    |
           +--------v-----------+
           |  Next Best Action  |
           +--------+-----------+
                    |
                 STUDENT (Loop)
```

## Tech Stack
**Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, Axios, React Router  
**Backend**: FastAPI, Python, SQLAlchemy, SQLite, Pydantic, Uvicorn, Google Gemini (AI Layer)

## Installation

**Prerequisites:** Node.js 18+, Python 3.10+, Git

**1. Clone the Repository**
```bash
git clone https://github.com/thamizhselvan07/PredictEd.git
cd PredictEd
```

**2. Setup Backend**
```bash
cd backend
pip install -r requirements.txt

# Seed the database and start the server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
*Note: Make sure to set up your .env file with GEMINI_API_KEY for the AI features to work.*

**3. Setup Frontend (Development)**
```bash
cd frontend
npm install
npm run dev
```

**Production Build**
To serve everything together seamlessly through FastAPI:
```bash
cd frontend
npm run build
cd ../backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
Access the application through: http://localhost:8000

## UI / UX
PredictEd uses a modern futuristic learning interface designed around clarity, engagement, and adaptive intelligence. (Dark-first interface, Glassmorphism, Smooth animations).

## Hackathon Value Proposition
PredictEd addresses a major limitation in digital education: Learning platforms are good at delivering content, but they are not always good at deciding what an individual learner needs next.

It answers five critical questions:
1. Where am I? 
2. What am I weak at?
3. What am I likely to struggle with?
4. What should I do next?
5. Why should I do it?

## Team
Built with love by a team passionate about Artificial Intelligence, Education Technology, Personalized Learning, and Adaptive Systems.

**Don't just study harder. Know what to learn next.**  
*Learn -> Measure -> Predict -> Explain -> Replan -> Learn Again*
