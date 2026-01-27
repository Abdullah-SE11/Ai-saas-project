from typing import List
from pydantic import BaseModel, Field

class LessonRequest(BaseModel):
    grade: str = Field(..., example="7th Grade")
    topic: str = Field(..., example="Photosynthesis")

class LessonPlan(BaseModel):
    objectives: List[str]
    materials: List[str]
    activities: List[str]
    assessment: str

class Worksheet(BaseModel):
    instructions: str
    questions: List[str]
    answer_key: List[str]

class LessonResponse(BaseModel):
    lesson_plan: LessonPlan
    worksheet: Worksheet
    tier: str
    usage_remaining: int
