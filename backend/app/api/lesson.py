from fastapi import APIRouter, HTTPException
from ..models.lesson import LessonRequest, LessonResponse, RefineRequest
from ..services.ai_service import generate_lesson_content, refine_lesson_content

router = APIRouter(prefix="/generate-lesson", tags=["lesson"])

@router.post("", response_model=LessonResponse)
async def create_lesson(request: LessonRequest):
    try:
        content = await generate_lesson_content(
            request.grade, 
            request.topic,
            request.image_data
        )
        return {
            **content,
            "tier": "pro",
            "usage_remaining": 999
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")

@router.post("/refine", response_model=LessonResponse)
async def refine_lesson(request: RefineRequest):
    try:
        content = await refine_lesson_content(
            request.current_data,
            request.prompt,
            request.grade,
            request.topic
        )
        return {
            **content,
            "tier": "pro",
            "usage_remaining": 999
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {str(e)}")
