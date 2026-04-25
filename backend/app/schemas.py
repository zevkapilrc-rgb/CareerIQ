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

class ImprovedSummary(BaseModel):
    """ATS-optimized professional summary"""
    original: str
    improved: str
    key_keywords: List[str]
    ats_compliance: int  # 0-100


class EnhancedExperienceItem(BaseModel):
    """Single experience with improvements"""
    original: str
    improved: str
    action_verbs: List[str]
    metrics: List[str]
    impact_score: int  # 0-100


class EnhancedExperience(BaseModel):
    """All experience with enhancements"""
    items: List[EnhancedExperienceItem]
    overall_strength: int  # 0-100


class SkillOptimization(BaseModel):
    """Industry keyword optimization"""
    current_skills: List[str]
    optimized_skills: List[str]
    industry_keywords: List[str]
    missing_trending: List[str]
    coverage_percentage: int  # 0-100


class MultiDimensionalScores(BaseModel):
    """6 key dimension scores"""
    ats_score: int  # 0-100
    recruiter_score: int  # 0-100
    impact_score: int  # 0-100
    skill_depth_score: int  # 0-100
    career_consistency_score: int  # 0-100
    overall_score: int  # 0-100


class RecruiterSimulation(BaseModel):
    """6-second recruiter impression"""
    first_impression: str
    shortlist_probability: int  # 0-100
    key_concerns: List[str]
    strengths_spotted: List[str]


class BulletPointAnalysis(BaseModel):
    """Analysis of a single bullet point"""
    original: str
    issues: List[str]
    improved: str
    action_verb: str
    metric_added: str


class ResumeBreakdown(BaseModel):
    """Analysis of each bullet point"""
    bullet_analyses: List[BulletPointAnalysis]
    generic_content_percentage: int
    metrics_percentage: int
    improvement_potential: int  # 0-100


class SkillIntelligence(BaseModel):
    """Core, weak, missing, and future skills"""
    core_skills: List[str]
    weak_skills: List[str]
    missing_skills: List[str]
    future_skills: List[str]
    skill_gap: int  # 0-100


class CareerInsights(BaseModel):
    """Career path and growth recommendations"""
    role_alignment: int  # 0-100
    suggested_career_paths: List[str]
    growth_recommendations: List[str]
    timeline_to_next_level: str


class RiskDetection(BaseModel):
    """Potential red flags"""
    generic_content: bool
    skill_mismatch: bool
    timeline_issues: bool
    employment_gaps: bool
    risks: List[str]
    severity: str  # "low" | "medium" | "high"


class InterviewQuestionItem(BaseModel):
    category: str
    question: str


class InterviewQuestions(BaseModel):
    """Predicted interview questions"""
    technical: List[InterviewQuestionItem]
    hr: List[InterviewQuestionItem]
    situational: List[InterviewQuestionItem]


class PersonalBranding(BaseModel):
    """LinkedIn and personal branding content"""
    linkedin_headline: str
    short_bio: str
    tagline: str
    elevator_pitch: str


class PortfolioContent(BaseModel):
    """Portfolio website content"""
    hero: str
    about: str
    skills_section: str
    projects: List[str]
    contact_cta: str


class OptimizedResume(BaseModel):
    """Fully rewritten resume (ATS-friendly, tailored)"""
    content: str
    is_tailored: bool
    job_matched_percentage: int


class ResumeAnalysisResponse(BaseModel):
    """Complete unified resume analysis response"""
    # 1. Improved Summary
    improved_summary: ImprovedSummary
    
    # 2. Enhanced Experience
    enhanced_experience: EnhancedExperience
    
    # 3. Skills Optimization
    skill_optimization: SkillOptimization
    
    # 4. Multi-Dimensional Scores
    scores: MultiDimensionalScores
    
    # 5. Recruiter Simulation
    recruiter_simulation: RecruiterSimulation
    
    # 6. Resume Breakdown
    resume_breakdown: ResumeBreakdown
    
    # 7. Skill Intelligence
    skill_intelligence: SkillIntelligence
    
    # 8. Career Insights
    career_insights: CareerInsights
    
    # 9. Risk Detection
    risk_detection: RiskDetection
    
    # 10. Interview Questions
    interview_questions: InterviewQuestions
    
    # 11. Personal Branding
    personal_branding: PersonalBranding
    
    # 12. Portfolio Content
    portfolio_content: PortfolioContent
    
    # 13. Optimized Resume
    optimized_resume: OptimizedResume


# Legacy compatibility
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
