import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_test():
    print("=== Verifying Quiz Flow (PYQ Integration) ===")
    
    # 1. Signup/Login
    print("\n[1] Authenticating...")
    email = "tester@example.com"
    # Note: In real flow we need OTP. For this test optimization, if we reset DB, we need to replicate OTP flow or just inject user.
    # But wait, main.py has `student` demo user created on startup!
    # Let's use the demo user "student" / "student"
    
    login_payload = {"username": "student", "password": "student"}
    try:
        res = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        if res.status_code != 200:
            print(f"Login failed: {res.text}")
            # If failed, maybe DB reset and user gone? auto-seed on startup creates it.
            return
        
        data = res.json()
        user_id = data.get("user_id")
        print(f"Logged in as User ID: {user_id}")
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    # 2. Get Streams/Exams (Hierarchy Check)
    print("\n[2] Checking Hierarchy...")
    streams = requests.get(f"{BASE_URL}/streams").json()
    if not streams:
        # Hierarchy might be empty if seed_full_content not run. 
        # But seed_questions relies on existing subjects.
        # Ensure we have subjects.
        print("Warning: No streams found. Seeding might be partial.")
    else:
        print(f"Found {len(streams)} streams.")
        
    # 3. Start Quiz
    print("\n[3] Starting Quiz Configuration...")
    # Get subjects first
    # Just Assume Subject ID 1 exists (from seeding) or fetch
    # We'll try to find a valid subject
    # If hierarchy endpoints work:
    # streams -> exams -> subjects
    subject_id = 1
    if streams:
        s_id = streams[0]['id']
        exams = requests.get(f"{BASE_URL}/exams?stream_id={s_id}").json()
        if exams:
            e_id = exams[0]['id']
            subjects = requests.get(f"{BASE_URL}/subjects?exam_id={e_id}").json()
            if subjects:
                subject_id = subjects[0]['id']
                print(f"Selected Subject: {subjects[0]['name']} (ID: {subject_id})")

    quiz_payload = {"subject_id": subject_id, "type": "basics"}
    res = requests.post(f"{BASE_URL}/quiz/start?user_id={user_id}", json=quiz_payload)
    if res.status_code != 200:
        print(f"Start Quiz Failed: {res.text}")
        return
    
    attempt_data = res.json()
    attempt_id = attempt_data['attempt_id']
    print(f"Quiz Started! Attempt ID: {attempt_id}")

    # 4. Fetch Question
    print("\n[4] Fetching Question...")
    res = requests.get(f"{BASE_URL}/quiz/{attempt_id}/next?user_id={user_id}")
    if res.status_code != 200:
        print(f"Fetch Question Failed: {res.text}")
        return
    
    q_data = res.json()
    q_id = q_data['id']
    print(f"Question Received: [ID {q_id}] {q_data['content']}")
    print(f"PYQ Year: {q_data.get('pyq_year', 'N/A')}")
    print(f"Options: {q_data['options']}")

    # 5. Submit Answer
    print("\n[5] Submitting Answer...")
    # Just pick first option
    selected = q_data['options'][0]
    submit_payload = {
        "question_id": q_id,
        "selected_answer": selected,
        "time_taken": 5.5
    }
    res = requests.post(f"{BASE_URL}/quiz/submit?user_id={user_id}", json=submit_payload)
    if res.status_code != 200:
        print(f"Submit Failed: {res.text}")
        return
    
    result = res.json()
    print(f"Submission Result: Correct? {result['correct']}")
    print(f"Feedback: {result['feedback']}")
    print(f"New Topic Strength: {result['new_topic_strength']}")

    print("\n=== Verified Successfully ===")

if __name__ == "__main__":
    run_test()
