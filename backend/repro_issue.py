import requests

BASE_URL = "http://127.0.0.1:8000"

def test_start_quiz_mismatch():
    print("--- Testing /quiz/start API Mismatch ---")
    
    # Frontend sends JSON body
    payload = {"subject_id": 1, "type": "basics"}
    
    # URL only has user_id
    url = f"{BASE_URL}/quiz/start?user_id=1"
    
    resp = requests.post(url, json=payload)
    
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {resp.text}")
    
    if resp.status_code == 200:
        print("[PASS] Quiz Session Started Successfully!")
        print(f"Computed Attempt ID: {resp.json().get('attempt_id')}")
    else:
        print(f"[FAIL] Expected 200, got {resp.status_code}")

if __name__ == "__main__":
    test_start_quiz_mismatch()
