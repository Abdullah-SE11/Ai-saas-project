from fastapi import APIRouter, Depends
from ..models.lesson import LessonRequest, LessonResponse
from ..core.security import get_api_key
from ..services.stripe_service import check_subscription
from ..services.ai_service import generate_lesson_content

router = APIRouter()

@router.post("/generate-lesson", response_model=LessonResponse)
async def generate_lesson(
    request: LessonRequest, 
    user_key: str = Depends(get_api_key),
    sub_info: dict = Depends(check_subscription)
):
    print(f"Generating lesson for {request.grade}: {request.topic} (Tier: {sub_info['tier']})")
    
    # Generate content
    data = generate_lesson_content(request.grade, request.topic)
    
    return data
