import ollama
import sys

print("Attempting to pull llama3 model via Python API...")
try:
    # pull method might stream progress
    progress = ollama.pull('llama3', stream=True)
    for p in progress:
        print(p)
    print("Successfully pulled llama3!")
except Exception as e:
    print(f"Failed to pull llama3: {e}")
    sys.exit(1)
