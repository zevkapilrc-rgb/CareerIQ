from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id

router = APIRouter()


@router.get("/analytics")
async def admin_analytics(current_user: str = Depends(get_current_user_id)):
    _ = current_user
    return {
        "active_users": 42,
        "total_resumes_scored": 120,
        "interviews_run": 35,
    }

@router.get("/test")
def admin_test():
    return {"message": "Admin router is working!"}