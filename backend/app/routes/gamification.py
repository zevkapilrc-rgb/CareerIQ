from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id
from ..schemas import GamificationBadges, GamificationPoints

router = APIRouter()


@router.get("/points", response_model=GamificationPoints)
async def get_points(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return GamificationPoints(points=1200)


@router.get("/badges", response_model=GamificationBadges)
async def get_badges(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    return GamificationBadges(badges=["Rookie", "Consistent", "Rising Star"])

@router.get("/test")
def gamification_test():
    return {"message": "Gamification router is working!"}