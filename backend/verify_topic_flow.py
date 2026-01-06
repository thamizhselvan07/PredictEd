from fastapi.testclient import TestClient
from main import app
import models
from database import get_db, Base, engine

# Init DB
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_topic_flow():
    print("--- 1. Testing Practice Mode for 'Laws of Motion' ---")
    # Start Quiz
    res = client.post("/quiz/start", json={
        "subject_id": 1, # Assuming Physics exists, or will use dynamic
        "type": "mixed",
        "topic": "Laws of Motion",
        "mode": "practice"
    })
    
    if res.status_code != 200:
        print(f"Failed to start practice: {res.text}")
        return

    data = res.json()
    attempt_id = data["attempt_id"]
    print(f"Started Practice Attempt: {attempt_id}")
    
    # Get Question
    q_res = client.get(f"/quiz/{attempt_id}/next?user_id=1")
    if q_res.status_code == 200:
        q_data = q_res.json()
        print(f"Got Question: {q_data['content']} [Topic: {q_data['topic']}]")
        assert q_data['topic'] == "Laws of Motion"
    else:
        print(f"Failed to get question: {q_res.text}")

    print("\n--- 2. Testing Topic Mock (30 Qs) for 'Laws of Motion' ---")
    res = client.post("/quiz/start", json={
        "subject_id": 1,
        "type": "mixed",
        "topic": "Laws of Motion",
        "mode": "topic_mock"
    })
    
    data = res.json()
    attempt_id = data["attempt_id"]
    total_q = data["total_questions"]
    print(f"Started Topic Mock Attempt: {attempt_id}, Total Q: {total_q}")
    assert total_q == 30

    print("\n--- 3. Testing Final Mock (50 Qs) ---")
    res = client.post("/quiz/start", json={
        "subject_id": 1,
        "type": "full",
        "mode": "final_mock"
    })
    
    data = res.json()
    attempt_id = data["attempt_id"]
    total_q = data["total_questions"]
    print(f"Started Final Mock Attempt: {attempt_id}, Total Q: {total_q}")
    assert total_q == 50

    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    test_topic_flow()
