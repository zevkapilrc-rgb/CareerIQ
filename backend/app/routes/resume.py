from fastapi import APIRouter, UploadFile, File, Depends, Query
from typing import Optional

from ..authentication import get_current_user_id
from ..schemas import ResumeAnalysisResponse, ResumeScore
from ..services.ai_resume import score_resume_stub
from ..services.resume_analyzer import analyze_resume_comprehensive


router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id)
):
    """
    Unified resume analysis endpoint.
    Performs comprehensive intelligence analysis in a single pipeline.
    
    Returns all 13 analysis modules:
    1. Improved Summary
    2. Enhanced Experience
    3. Skills Optimization
    4. Multi-Dimensional Scores
    5. Recruiter Simulation
    6. Resume Breakdown
    7. Skill Intelligence
    8. Career Insights
    9. Risk Detection
    10. Interview Questions
    11. Personal Branding
    12. Portfolio Content
    13. Optimized Resume
    """
    contents = await file.read()
    resume_text = contents.decode(errors="ignore")
    
    # Perform comprehensive analysis
    result = await analyze_resume_comprehensive(
        resume_text=resume_text,
        job_description=job_description,
        name="User"
    )
    
    return ResumeAnalysisResponse(**result)


@router.post("/upload", response_model=ResumeScore)
async def upload_resume(
    file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)
):
    """Legacy endpoint - use /analyze instead"""
    contents = await file.read()
    _ = user_id  # placeholder until we persist analyses
    result = await score_resume_stub(contents.decode(errors="ignore"))
    return ResumeScore(**result)


@router.get("/test")
def resume_test():
    return {"message": "Resume router is working!"}

