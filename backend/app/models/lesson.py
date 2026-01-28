from typing import List
from pydantic import BaseModel, Field

class LessonRequest(BaseModel):
    grade: str = Field(..., example="7th Grade")
    topic: str = Field(..., example="Photosynthesis")
    image_data: str = None # Base64 encoded image

class LessonPlan(BaseModel):
    objectives: List[str]
    materials: List[str]
    activities: List[str]
    assessment: str

class Worksheet(BaseModel):
    instructions: str
    mcqs: List[dict] = [] # [{"q": "...", "o": ["a","b","c","d"], "a": "..."}]
    fill_blanks: List[dict] = [] # [{"q": "The ___ is blue.", "a": "sky"}]
    short_questions: List[dict] = [] # [{"q": "...", "a": "..."}]

class LessonResponse(BaseModel):
    lesson_plan: LessonPlan
    worksheet: Worksheet
    tier: str
    usage_remaining: int
