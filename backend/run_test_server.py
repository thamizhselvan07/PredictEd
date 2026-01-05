import uvicorn
import os
import sys

# Ensure we can import main
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting Test Server on 8001...")
    uvicorn.run("main:app", host="127.0.0.1", port=8001, log_level="info")
