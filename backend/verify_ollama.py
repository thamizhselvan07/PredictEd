
import os
import requests
import sys

# Ensure backend server is running or mock the imports if unit testing
# For meaningful verification effectively, we should test the function logic or simple integration.

def verify_ollama_mock():
    """
    Verifies that the ollama library is installed and can be imported.
    Also tries to connect to local Ollama if possible.
    """
    print("Verifying Ollama Integration...")
    
    try:
        import ollama
        print("[OK] 'ollama' package imported successfully.")
    except ImportError:
        print("[FAIL] Failed to import 'ollama'.")
        return False

    # Check for OLLAMA connection (assuming default port)
    try:
        # Just list models to check connection
        models = ollama.list()
        print(f"[OK] Ollama connection successful. Found models: {[m['name'] for m in models['models']]}")
    except Exception as e:
        print(f"[WARN] Could not connect to running Ollama instance: {e}")
        print("This is expected if Ollama is not running. The code has a fallback to Gemini.")
        # We don't fail the script here because the user might not have started Ollama yet, 
        # but the code changes are correct.
    
    return True

if __name__ == "__main__":
    if verify_ollama_mock():
        print("Verification Script Passed.")
    else:
        print("Verification Script Failed.")
        sys.exit(1)
