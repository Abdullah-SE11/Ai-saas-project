import os
import json
from openai import AsyncOpenAI
from ..core.logging import logger
from ..models.lesson import LessonResponse

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_lesson_content(grade: str, topic: str) -> dict:
    # (Prompt remains the same, omitted for brevity in chunk but included in implementation)
    prompt = f"""
    You are an expert curriculum designer and pedagogic specialist. Your task is to generate a high-quality, classroom-ready lesson plan and an accompanying student worksheet based on the following parameters:

    Grade Level: {grade}
    Topic: {topic}

    Act strictly as a structured data generator. Your output must be a single, valid JSON object that adapts its vocabulary, pedagogical depth, and task complexity specifically for the {grade} level.

    Educational Requirements:
    1. Lesson Objectives: Clear, measurable goals using Bloom's Taxonomy verbs appropriate for the grade.
    2. Materials: A comprehensive list of physical and digital resources needed.
    3. Activities: A step-by-step instructional sequence (Introduction, Guided Practice, Independent Practice, Closing) with time estimates.
    4. Assessment: A strategy to evaluate if objectives were met.
    5. Worksheet: A student-ready set of at least 5 questions (e.g., matching, multiple choice, or short answer) tailored to the comprehension level of {grade} students.
    6. Answer Key: Precise answers for every worksheet question.

    JSON Schema Constraint:
    {{
      "lesson_plan": {{
        "objectives": ["string"],
        "materials": ["string"],
        "activities": ["string"],
        "assessment": "string"
      }},
      "worksheet": {{
        "instructions": "string",
        "questions": ["string"],
        "answer_key": ["string"]
      }}
    }}

    Strict Constraints:
    - Output ONLY valid JSON.
    - Deliver ONLY the JSON object. No preamble or conversational text.
    - Ensure all content is factually accurate and safe for a classroom environment.
    """

    try:
        logger.info(f"Generating AI content for Topic: {topic}, Grade: {grade}")
        response = await client.chat.completions.create(
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
        logger.error(f"AI Generation failed: {str(e)}")
        raise e
