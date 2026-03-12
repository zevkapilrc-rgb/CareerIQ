from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id
from ..schemas import (
    CareerForecastResponse,
    ConfidenceScoreResponse,
    SkillGapResponse,
    SkillGapPoint,
)

router = APIRouter()


@router.get("/skill-gap", response_model=SkillGapResponse)
async def skill_gap(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return SkillGapResponse(
        points=[
            SkillGapPoint(skill="React", current=0.7, target=0.9),
            SkillGapPoint(skill="System Design", current=0.4, target=0.8),
        ]
    )


@router.get("/career-forecast", response_model=CareerForecastResponse)
async def career_forecast(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return CareerForecastResponse(
        next_roles=["Senior Frontend Engineer", "Staff Engineer"],
        confidence=0.82,
    )


@router.get("/confidence-score", response_model=ConfidenceScoreResponse)
async def confidence_score(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return ConfidenceScoreResponse(
        confidence=0.68,
        notes=["Voice was steady", "Answers could be more concise"],
    )

@router.get("/test")
def analytics_test():
    return {"message": "Analytics router is working!"}