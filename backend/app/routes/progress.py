from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..authentication import get_current_user_id
from ..database import get_db

router = APIRouter()


def _get_or_create_progress(user_id: int, db: Session) -> models.UserProgress:
    """Get user's progress record or create an empty one."""
    progress = db.query(models.UserProgress).filter_by(user_id=user_id).first()
    if not progress:
        progress = models.UserProgress(user_id=user_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress


# ── Save Progress ───────────────────────────────────────────────────
@router.post("/save", status_code=200)
async def save_progress(
    payload: schemas.ProgressSave,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Save authenticated user's progress. Only fields provided are updated."""
    uid = int(user_id)
    progress = _get_or_create_progress(uid, db)

    if payload.last_page is not None:
        progress.last_page = payload.last_page
    if payload.resume_score is not None:
        progress.resume_score = payload.resume_score
    if payload.resume_uploaded is not None:
        progress.resume_uploaded = payload.resume_uploaded
    if payload.interview_progress is not None:
        progress.interview_progress = payload.interview_progress
    if payload.learning_progress is not None:
        progress.learning_progress = payload.learning_progress
    if payload.badges_earned is not None:
        progress.badges_earned = payload.badges_earned
    if payload.xp is not None:
        progress.xp = payload.xp
    if payload.level is not None:
        progress.level = payload.level

    progress.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(progress)

    return {"message": "Progress saved", "last_page": progress.last_page}


# ── Load Progress ───────────────────────────────────────────────────
@router.get("/load", response_model=schemas.ProgressLoad)
async def load_progress(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Load authenticated user's saved progress."""
    uid = int(user_id)
    progress = _get_or_create_progress(uid, db)
    return progress
