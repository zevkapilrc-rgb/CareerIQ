from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id
from ..schemas import (
    InterviewQuestion,
    InterviewSimulationRequest,
    InterviewSimulationResponse,
)

router = APIRouter()


@router.post("/simulate", response_model=InterviewSimulationResponse)
async def simulate_interview(
    payload: InterviewSimulationRequest,
    user_id: str = Depends(get_current_user_id),
):
    _ = user_id
    questions = [
        InterviewQuestion(
            question=f"Describe a challenging {payload.role} project you led.",
            category="behavioral",
        ),
        InterviewQuestion(
            question="How would you design a scalable job recommendation system?",
            category="system design",
        ),
    ]
    return InterviewSimulationResponse(questions=questions)
@router.get("/test")
def interview_test():
    return {"message": "Interview router is working!"}

