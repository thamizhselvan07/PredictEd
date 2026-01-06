
import requests
import io
import os
from pypdf import PdfWriter

# Create a dummy PDF in memory
def create_dummy_pdf():
    buffer = io.BytesIO()
    p = PdfWriter()
    p.add_blank_page(width=200, height=200)
    # We can't easily write text with pypdf pure writer without other libs like reportlab, 
    # but we can try to send a file that exists or just mock the request if we were unit testing.
    # Since we need to test the endpoint which uses pypdf to READ, we need a valid PDF structure.
    # Let's write a minimal PDF.
    p.write(buffer)
    buffer.seek(0)
    return buffer

def test_pdf_generation():
    # START SERVER FIRST MANUALLY OR ASSUME IT IS RUNNING?
    # I cannot assume it is running. I should probably import the app and test via TestClient to be safe and fast.
    
    from fastapi.testclient import TestClient
    from main import app
    
    client = TestClient(app)
    
    # Create dummy PDF content (just a valid header/trailer if possible, or use a real sample if I had one)
    # Actually, easiest is to use reportlab if installed, but it's not.
    # I'll just skip the "valid content" part and check if it handles "empty text" gracefully 
    # OR mock the pdf extraction in pdf_quiz to return dummy text for this test.
    
    # Let's mock pdf_quiz.extract_text_from_pdf to avoid needing a real PDF
    import pdf_quiz
    original_extractor = pdf_quiz.extract_text_from_pdf
    
    pdf_quiz.extract_text_from_pdf = lambda x: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the aid of chlorophyll pigments."
    
    try:
        # Mock file upload
        files = {'file': ('test.pdf', b'%PDF-1.4 dummy content', 'application/pdf')}
        
        print("Sending request to /quiz/generate-from-pdf...")
        # We need to mock OpenAI/Gemini or it will fail if no key.
        # Check if key exists
        if not os.getenv("GEMINI_API_KEY"):
            print("WARNING: GEMINI_API_KEY not found. Mocking Generator also.")
            pdf_quiz.generate_quiz_from_text = lambda t, n: [{"question": "Mock Q", "options": ["A","B"], "correct_answer": "A", "difficulty": 0.5}]
            
        response = client.post("/quiz/generate-from-pdf", files=files, data={"num_questions": 1})
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "questions" in response.json():
            print("SUCCESS: API Endpoint works and returns questions.")
        else:
            print("FAILURE: API did not return 200 or questions missing.")
            
    finally:
        # Restore
        pdf_quiz.extract_text_from_pdf = original_extractor

if __name__ == "__main__":
    test_pdf_generation()
