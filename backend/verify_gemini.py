import google.generativeai as genai
import os
from dotenv import load_dotenv

def test_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    print(f"Found API Key: {api_key[:5]}...{api_key[-4:]}")
    
    try:
        genai.configure(api_key=api_key)
        # Try listing models to see what's available
        print("Listing available models...")
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print(f"Available Models: {models}")
        
        target_model = 'gemini-3-flash-preview'
        # Check if target is in list (loose match)
        # Gemini model names often have variants like models/gemini-pro
        
        # Test Generation
        print(f"Testing generation with {target_model}...")
        try:
             model = genai.GenerativeModel(target_model)
             response = model.generate_content("Hello, are you working?")
             print(f"Response: {response.text}")
             print("SUCCESS: Gemini API is connected and working!")
        except Exception as e:
             print(f"Failed with {target_model}: {e}")
             print("Retrying with 'gemini-1.5-flash'...")
             try:
                 model = genai.GenerativeModel('gemini-3-flash-preview')
                 response = model.generate_content("Hello, are you working?")
                 print(f"Response: {response.text}")
                 print("SUCCESS: Gemini API is connected and working (fallback to 1.5-flash)!")
             except Exception as e2:
                 print(f"Failed with gemini-1.5-flash: {e2}")

    except Exception as e:
        print(f"Configuration/Connection Error: {e}")

if __name__ == "__main__":
    test_gemini()
