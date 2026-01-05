import uvicorn
import os
import sys

# Ensure we can import main
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting Adaptive Exam AI Server on http://127.0.0.1:8000 ...")
    # Using existing main:app
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
