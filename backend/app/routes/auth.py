from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..authentication import (
    create_access_token,
    get_password_hash,
    verify_password,
    get_current_user_id,
)
from ..config import get_settings
from ..database import get_db
from ..services.otp_service import generate_otp, send_email_otp, send_sms_otp

router = APIRouter()


def _is_email(value: str) -> bool:
    return "@" in value


# ── Register ────────────────────────────────────────────────────────
@router.post("/register", response_model=schemas.UserRead, status_code=201)
async def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    """Create a new user account."""
    existing = db.query(models.User).filter_by(email=payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.phone:
        phone_exists = db.query(models.User).filter_by(phone=payload.phone).first()
        if phone_exists:
            raise HTTPException(status_code=400, detail="Phone number already registered")

    user = models.User(
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ── Login (email or phone + password) ───────────────────────────────
@router.post("/login", response_model=schemas.Token)
async def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login with email or phone + password. Returns JWT access token."""
    identifier = payload.identifier.strip()

    if _is_email(identifier):
        user = db.query(models.User).filter_by(email=identifier.lower()).first()
    else:
        user = db.query(models.User).filter_by(phone=identifier).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
        )

    token = create_access_token(subject=str(user.id))
    return schemas.Token(access_token=token)


# ── Send OTP ────────────────────────────────────────────────────────
@router.post("/send-otp")
async def send_otp(payload: schemas.SendOtpRequest, db: Session = Depends(get_db)):
    """Generate and send a 6-digit OTP to email or phone. Expires in 5 minutes."""
    settings = get_settings()
    contact = payload.contact.strip()
    purpose = payload.purpose

    # Expire any previous unused OTPs for this contact
    db.query(models.OtpCode).filter_by(contact=contact, used=False).update({"used": True})
    db.commit()

    code = generate_otp(6)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes)

    # Try to find the user (optional for pre-registration)
    if _is_email(contact):
        user = db.query(models.User).filter_by(email=contact.lower()).first()
    else:
        user = db.query(models.User).filter_by(phone=contact).first()

    otp_record = models.OtpCode(
        user_id=user.id if user else None,
        contact=contact,
        code=code,
        purpose=purpose,
        expires_at=expires_at,
        used=False,
    )
    db.add(otp_record)
    db.commit()

    # Send via email or SMS
    if _is_email(contact):
        await send_email_otp(contact, code, purpose)
    else:
        await send_sms_otp(contact, code, purpose)

    return {"message": f"OTP sent to {contact}", "expires_in_minutes": settings.otp_expire_minutes}


# ── Verify OTP ──────────────────────────────────────────────────────
@router.post("/verify-otp", response_model=schemas.Token)
async def verify_otp(payload: schemas.VerifyOtpRequest, db: Session = Depends(get_db)):
    """Verify a 6-digit OTP. Returns JWT access token on success."""
    contact = payload.contact.strip()
    now = datetime.now(timezone.utc)

    otp_record = (
        db.query(models.OtpCode)
        .filter_by(contact=contact, code=payload.code, used=False)
        .order_by(models.OtpCode.created_at.desc())
        .first()
    )

    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

    # Compare timezone-naive expires_at safely
    expires_at = otp_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if now > expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    # Mark as used
    otp_record.used = True
    db.commit()

    # Find or create user
    if _is_email(contact):
        user = db.query(models.User).filter_by(email=contact.lower()).first()
    else:
        user = db.query(models.User).filter_by(phone=contact).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please register first.")

    # Mark user as verified
    user.is_verified = True
    db.commit()

    token = create_access_token(subject=str(user.id))
    return schemas.Token(access_token=token)


# ── Get current user ────────────────────────────────────────────────
@router.get("/me", response_model=schemas.UserRead)
async def get_me(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter_by(id=int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ── Legacy endpoints (kept for backward compatibility) ───────────────
@router.post("/token", response_model=schemas.Token)
def login_for_access_token(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    """Legacy login endpoint (email + password only). Use /auth/login for new code."""
    user = db.query(models.User).filter_by(email=payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return schemas.Token(access_token=create_access_token(subject=str(user.id)))


@router.get("/test")
def auth_test():
    return {"message": "Auth router is working!"}