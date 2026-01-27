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
        # Generate content
        content = await generate_lesson_content(request.grade, request.topic)
        
        # Increment usage
        UsageTracker.increment_usage(user_data["user_id"])
        
        # Build response with metadata
        return {
            **content,
            "tier": user_data["tier"],
            "usage_remaining": UsageTracker.get_remaining_uses(user_data["user_id"], user_data["tier"])
        }
    except Exception:
        raise HTTPException(
            status_code=500, 
            detail="AI Generation failed. Please try again later or check your API key."
        )
