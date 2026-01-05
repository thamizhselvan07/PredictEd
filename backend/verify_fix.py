import requests

BASE_URL = "http://127.0.0.1:8000"

def verify_quiz_start():
    print("--- Verifying Quiz Fixes & PYQ ---")
    
    # 1. Start a regular quiz
    # Need a valid subject ID. Let's assume Subject 1 exists.
    try:
        print("Starting Quiz for Subject 1...")
        resp = requests.post(f"{BASE_URL}/quiz/start?user_id=1", json={"subject_id": 1, "type": "mixed"})
        if resp.status_code == 200:
            data = resp.json()
            attempt_id = data['attempt_id']
            print(f"[PASS] Quiz Started. ID: {attempt_id}")
            
            # 2. Get Question
            print("Fetching Question...")
            q_resp = requests.get(f"{BASE_URL}/quiz/{attempt_id}/next?user_id=1")
            if q_resp.status_code == 200:
                q_data = q_resp.json()
                content = q_data['content']
                print(f"[PASS] Question Fetched: {content}")
                
                # 3. Check PYQ Tag
                if "[" in content and "]" in content:
                     print("[PASS] PYQ Tag verified in content.")
                else:
                     print("[FAIL] PYQ Tag missing.")
            else:
                print(f"[FAIL] Fetch Question Error: {q_resp.text}")

        else:
             print(f"[FAIL] Start Quiz Error: {resp.text}")

    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")

if __name__ == "__main__":
    verify_quiz_start()
