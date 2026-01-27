import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI Client safely
client = None
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    print("Warning: OPENAI_API_KEY not found. AI features will run in demo mode.")

def generate_lesson_content(grade: str, topic: str) -> dict:
    prompt = f"""
    You are an expert teacher. Create a structured lesson plan and a student worksheet for:
    Grade: {grade}
    Topic: {topic}

    Output valid JSON strictly matching this schema:
    {{
      "lesson_plan": {{
        "objectives": ["obj1", "obj2"],
        "materials": ["item1", "item2"],
        "activities": ["activity1", "activity2"],
        "assessment": "string description"
      }},
      "worksheet": {{
        "instructions": "string",
        "questions": ["q1", "q2"],
        "answer_key": ["a1", "a2"]
      }}
    }}
    """
    
    try:
        if not client:
            raise Exception("OpenAI Client not initialized (Missing Key)")

        response = client.chat.completions.create(
            model="gpt-4o", # Or gpt-3.5-turbo
            messages=[
                {"role": "system", "content": "You are a helpful education assistant that outputs strict JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"AI Generation Error: {e}")
        # Fallback/Mock for demo if API fails (or key is invalid/missing in dev)
        return {
            "lesson_plan": {
                "objectives": [f"Understand {topic}", "Apply concepts to real world"],
                "materials": ["Textbook", "Pencil", "Whiteboard"],
                "activities": ["Introduction lecture", "Group work", "Independent practice"],
                "assessment": "Exit ticket quiz"
            },
            "worksheet": {
                "instructions": f"Complete the following questions about {topic}.",
                "questions": ["What is the main concept?", "Solve for X."],
                "answer_key": ["The main concept is...", "X = 5"]
            }
        }
