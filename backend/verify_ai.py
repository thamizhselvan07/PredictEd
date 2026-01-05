import requests
import json

url = "http://localhost:8000/chat/tutor"
payload = {
    "message": "Explain the concept of specific heat capacity in 2 sentences.",
    "stream": "Engineering",
    "exam": "JEE Main",
    "subject": "Physics"
}

try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("SUCCESS! API Response:")
        print(response.json()['reply'])
    else:
        print(f"FAILED with status {response.status_code}: {response.text}")
except Exception as e:
    print(f"Connection Error: {e}")
