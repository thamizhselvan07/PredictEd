import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def debug_quiz_flow():
    print("--- Debugging Quiz Flow ---")
    
    # 1. Start Mock Exam
    try:
        resp = requests.post(f"{BASE_URL}/exam/1/start_mock?user_id=1")
        if resp.status_code != 200:
            print(f"[FAIL] Start Mock Failed: {resp.text}")
            return
        
        attempt_id = resp.json()['attempt_id']
        print(f"[PASS] Started Mock Attempt: {attempt_id}")
        
        # 2. Fetch Questions Repeatedly
        for i in range(5):
            print(f"Fetch {i+1}...")
            resp = requests.get(f"{BASE_URL}/quiz/{attempt_id}/next?user_id=1")
            
            if resp.status_code == 200:
                data = resp.json()
                print(f"   [OK] Got QID: {data['id']} | Sub: {data.get('subject_name')}")
            else:
                print(f"   [FAIL] Code: {resp.status_code}")
                print(f"   Response: {resp.text}")
                
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    debug_quiz_flow()
