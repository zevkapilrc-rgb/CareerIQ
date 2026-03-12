from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr


# ── Auth & User ─────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str


class LoginRequest(BaseModel):
    # email OR phone
    identifier: str   # email address OR phone number
    password: str


class SendOtpRequest(BaseModel):
    contact: str      # email or phone number
    purpose: str = "login"  # "login" | "register"


class VerifyOtpRequest(BaseModel):
    contact: str
    code: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


# ── Progress ────────────────────────────────────────────────

class ProgressSave(BaseModel):
    last_page: Optional[str] = None
    resume_score: Optional[float] = None
    resume_uploaded: Optional[bool] = None
    interview_progress: Optional[Dict[str, Any]] = None
    learning_progress: Optional[Dict[str, Any]] = None
    badges_earned: Optional[List[str]] = None
    xp: Optional[int] = None
    level: Optional[str] = None


class ProgressLoad(BaseModel):
    user_id: int
    last_page: Optional[str] = None
    resume_score: Optional[float] = None
    resume_uploaded: bool = False
    interview_progress: Dict[str, Any] = {}
    learning_progress: Dict[str, Any] = {}
    badges_earned: List[str] = []
    xp: int = 0
    level: str = "Explorer"
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Resume ──────────────────────────────────────────────────

class ResumeScore(BaseModel):
    score: float
    strengths: List[str]
    improvements: List[str]


# ── Analytics ───────────────────────────────────────────────

class SkillGapPoint(BaseModel):
    skill: str
    current: float
    target: float


class SkillGapResponse(BaseModel):
    points: List[SkillGapPoint]


# ── Chatbot ─────────────────────────────────────────────────

class ChatbotQuery(BaseModel):
    message: str


class ChatbotResponse(BaseModel):
    reply: str


# ── Interview ───────────────────────────────────────────────

class InterviewQuestion(BaseModel):
    question: str
    category: str


class InterviewSimulationRequest(BaseModel):
    role: str
    seniority: str


class InterviewSimulationResponse(BaseModel):
    questions: List[InterviewQuestion]


# ── Learning Path ────────────────────────────────────────────

class LearningPathStep(BaseModel):
    title: str
    description: str
    eta_hours: int


class LearningPathResponse(BaseModel):
    steps: List[LearningPathStep]


# ── Gamification ─────────────────────────────────────────────

class GamificationPoints(BaseModel):
    points: int


class GamificationBadges(BaseModel):
    badges: List[str]


# ── Career Forecast ──────────────────────────────────────────

class CareerForecastResponse(BaseModel):
    next_roles: List[str]
    confidence: float


class ConfidenceScoreResponse(BaseModel):
    confidence: float
    notes: List[str]
