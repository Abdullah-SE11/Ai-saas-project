from fastapi import APIRouter, Depends, HTTPException
from ..models.lesson import LessonRequest, LessonResponse
from ..core.security import check_usage_limits
from ..services.stripe_service import UsageTracker
from ..services.ai_service import generate_lesson_content

router = APIRouter(prefix="/generate-lesson", tags=["lesson"])

@router.post("/", response_model=LessonResponse)
async def create_lesson(
    request: LessonRequest,
    user_data: dict = Depends(check_usage_limits)
):
    try:
        # Business logic: Generate content via AI service
        content = generate_lesson_content(request.grade, request.topic)
        
        # Increment usage count
        UsageTracker.increment_usage(user_data["user_id"])
        
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail="AI Generation failed. Please check your API key.")
