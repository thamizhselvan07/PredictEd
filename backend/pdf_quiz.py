
import os
import io
import json
import random
from typing import List, Dict, Any
from pypdf import PdfReader
import ollama
from models import Question
from dotenv import load_dotenv

load_dotenv()

# We don't need to configure Ollama like Gemini, it assumes local unless host is set.

def extract_text_from_pdf(file_stream: bytes) -> str:
    """Extracts text from a PDF file stream."""
    try:
        reader = PdfReader(io.BytesIO(file_stream))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""

def generate_quiz_from_text(text: str, num_questions: int = 5) -> List[Dict[str, Any]]:
    """
    Generates a quiz from the provided text using Ollama (Llama 3 or configured model).
    Returns a list of dicts: {question, options, answer, topic, difficulty}
    """
    if not text:
        return []

    # Get model from env or default to llama3
    model_name = os.getenv("OLLAMA_MODEL", "llama3")

    prompt = f"""
    CONTENT:
    {text[:10000]}
    
    TASK:
    Create {num_questions} hard multiple-choice questions from the content.
    
    FORMAT (JSON List):
    [
      {{
        "q": "Question text?",
        "o": ["Option A", "Option B", "Option C", "Option D"],
        "a": "Option A"
      }}
    ]
    
    OUTPUT JSON:
    """ 
    # Limited to ~20k chars for local model performance context limits

    try:
        response = ollama.chat(model=model_name, messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        
        content_text = response['message']['content']
        
        # Clean markdown code blocks if present
        if "```json" in content_text:
            content_text = content_text.split("```json")[1].split("```")[0]
        elif "```" in content_text:
             content_text = content_text.split("```")[1].split("```")[0]
             
        raw_data = json.loads(content_text.strip())
        
        # Map back to full keys
        final_data = []
        for item in raw_data:
            final_data.append({
                "question": item.get("q"),
                "options": item.get("o", []),
                "correct_answer": item.get("a"),
                "topic": "Derived",
                "difficulty": 0.8 # Default to hard
            })
            
        return final_data[:num_questions]
        
    except Exception as e:
        print(f"Error generating quiz with Ollama ({model_name}): {e}")
        print(f"RAW RESPONSE: {content_text if 'content_text' in locals() else 'None'}")
        return []

def save_generated_questions(db_session, user_id, questions_data, source_name="PDF Upload"):
    """
    Saves the generated questions to the database but does NOT seed them as global questions yet.
    Ideally we return them for the immediate session or temporary storage.
    For this integration, we might just return them to the frontend to display.
    """
    # For now, we will just return them to the frontend to render directly.
    pass
