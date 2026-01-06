
import sys
import os
from pdf_quiz import generate_quiz_from_text

# Sample text about Photosynthesis
sample_text = """
Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.
The process generally takes place in chloroplasts, which contain the green pigment chlorophyll.
Photosynthesis can be summarized by the chemical equation: 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2.
This means carbon dioxide and water are consumed to produce glucose and oxygen.
"""

print("Testing Llama Quiz Generation...")
try:
    questions = generate_quiz_from_text(sample_text, num_questions=2)
    
    if not questions:
        print("FAILED: No questions generated.")
        sys.exit(1)
        
    print(f"SUCCESS: Generated {len(questions)} questions.")
    for i, q in enumerate(questions):
        print(f"\nQ{i+1}: {q.get('question')}")
        print(f"   Options: {q.get('options')}")
        print(f"   Answer: {q.get('correct_answer')}")
        print(f"   Topic: {q.get('topic')}")
        
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
