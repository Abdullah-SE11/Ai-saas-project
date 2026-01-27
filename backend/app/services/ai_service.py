import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from ..models.lesson import LessonResponse

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_lesson_content(grade: str, topic: str) -> dict:
    prompt = f"""
    You are an expert curriculum designer. Generate a comprehensive lesson plan and student worksheet.
    
    Target Audience: {grade} students.
    Topic: {topic}.

    The output must strictly follow this JSON structure:
    {{
      "lesson_plan": {{
        "objectives": ["Learner will be able to..."],
        "materials": ["Item 1", "Item 2"],
        "activities": ["Intro (5 min): ...", "Activity (20 min): ...", "Wrap-up (5 min): ..."],
        "assessment": "Method to check understanding"
      }},
      "worksheet": {{
        "instructions": "Simple instructions for the student",
        "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
        "answer_key": ["Answer 1", "Answer 2", "Answer 3", "Answer 4", "Answer 5"]
      }}
    }}

    Constraint: The worksheet questions must be grade-appropriate for {grade}. 
    Deliver ONLY the JSON object. No preamble or conversational text.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a professional teacher's assistant that outputs only valid, structured JSON."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_content = response.choices[0].message.content
        return json.loads(raw_content)
    except Exception as e:
        print(f"AI Service Error: {str(e)}")
        raise e
