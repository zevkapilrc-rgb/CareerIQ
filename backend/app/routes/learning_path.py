from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id
from ..schemas import LearningPathResponse, LearningPathStep

router = APIRouter()


@router.get("/personalized", response_model=LearningPathResponse)
async def get_personalized_learning_path(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return LearningPathResponse(
        steps=[
            LearningPathStep(
                title="Deepen React & TypeScript",
                description="Advanced patterns, performance, and testing.",
                eta_hours=12,
            ),
            LearningPathStep(
                title="System Design Foundations",
                description="Work through core distributed systems concepts.",
                eta_hours=15,
            ),
        ]
    )

@router.get("/test")
def learning_path_test():
    return {"message": "Learning Path router is working!"}