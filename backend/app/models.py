from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, JSON
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    progress = relationship("UserProgress", back_populates="user", uselist=False)
    otp_codes = relationship("OtpCode", back_populates="user")
    badges = relationship("Badge", back_populates="user")
    interviews = relationship("Interview", back_populates="user")


class OtpCode(Base):
    __tablename__ = "otp_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # contact can be email or phone (for pre-registration OTP)
    contact = Column(String, nullable=False, index=True)
    code = Column(String, nullable=False)
    purpose = Column(String, default="login")  # "register" | "login"
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="otp_codes")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    last_page = Column(String, default="/dashboard")
    resume_score = Column(Float, nullable=True)
    resume_uploaded = Column(Boolean, default=False)
    interview_progress = Column(JSON, default={})   # {round, score, completed}
    learning_progress = Column(JSON, default={})    # {streamId: bool}
    badges_earned = Column(JSON, default=[])        # list of badge names
    xp = Column(Integer, default=0)
    level = Column(String, default="Explorer")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    raw_text = Column(Text)
    score = Column(Float)
    suggestions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    round = Column(String, nullable=False)           # hr | tech | code
    score = Column(Float, nullable=True)
    answers = Column(JSON, default=[])               # [{question, answer, score, feedback}]
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interviews")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_name = Column(String, nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")
