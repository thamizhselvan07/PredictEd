import requests

BASE_URL = "http://127.0.0.1:8000"

def verify_mock_flow():
    try:
        print("--- Verifying Mock Exam Flow ---")
        
        # 1. Start Mock Exam (Exam ID 1 = JEE Main usually)
        print("Starting Mock Exam for Exam ID 1...")
        resp = requests.post(f"{BASE_URL}/exam/1/start_mock?user_id=1")
        if resp.status_code == 200:
            data = resp.json()
            attempt_id = data['attempt_id']
            print(f"[PASS] Started Mock Exam. Attempt ID: {attempt_id}")
        else:
            print(f"[FAIL] Start Mock Failed: {resp.text}")
            return

        # 2. Fetch Next Question (Should return subject name)
        print(f"Fetching Question for Attempt {attempt_id}...")
        resp = requests.get(f"{BASE_URL}/quiz/{attempt_id}/next?user_id=1")
        if resp.status_code == 200:
            q_data = resp.json()
            print(f"[PASS] Question Fetched.")
            print(f"       Topic: {q_data.get('topic')}")
            print(f"       Subject: {q_data.get('subject_name')}")
            
            if q_data.get('subject_name'):
                print("[PASS] Subject Name Present")
            else:
                print("[FAIL] Subject Name Missing")
        else:
             print(f"[FAIL] Fetch Question Failed: {resp.text}")

    except Exception as e:
        print(f"[ERROR] Verification Failed: {e}")
        print("Ensure Backend is running!")

if __name__ == "__main__":
    verify_mock_flow()
