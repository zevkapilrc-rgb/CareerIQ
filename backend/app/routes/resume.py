from fastapi import APIRouter, UploadFile, File, Depends

from ..authentication import get_current_user_id
from ..schemas import ResumeScore
from ..services.ai_resume import score_resume_stub


router = APIRouter()


@router.post("/upload", response_model=ResumeScore)
async def upload_resume(
    file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)
):
    contents = await file.read()
    _ = user_id  # placeholder until we persist analyses
    result = await score_resume_stub(contents.decode(errors="ignore"))
    return ResumeScore(**result)
@router.get("/test")
def resume_test():
    return {"message": "Resume router is working!"}

