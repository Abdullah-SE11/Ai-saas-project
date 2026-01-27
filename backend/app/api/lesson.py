from fastapi import APIRouter, Depends, HTTPException
from ..models.lesson import LessonRequest, LessonResponse
from ..core.security import get_api_key
from ..services.ai_service import generate_lesson_content

router = APIRouter(prefix="/generate-lesson", tags=["lesson"])

@router.post("/", response_model=LessonResponse)
async def create_lesson(
    request: LessonRequest,
    api_key: str = Depends(get_api_key)
):
    try:
        # Business logic: Generate content via AI service
        content = generate_lesson_content(request.grade, request.topic)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI Generation failed. Please check your API key.")
