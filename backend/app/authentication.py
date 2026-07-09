from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import get_settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    settings = get_settings()
    to_encode = {"sub": subject}
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        if settings.environment == "development":
            return "1"
        raise credentials_exception
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        subject: str | None = payload.get("sub") or payload.get("id")
        if subject is None:
            if settings.environment == "development":
                return "1"
            raise credentials_exception
        return str(subject)
    except JWTError:
        if settings.environment == "development":
            return "1"
        raise credentials_exception


async def get_optional_user_id(token: str = Depends(oauth2_scheme)) -> Optional[str]:
    """Like get_current_user_id but returns None instead of raising when no token."""
    settings = get_settings()
    if not token:
        if settings.environment == "development":
            return "1"
        return None
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
        subject = payload.get("sub") or payload.get("id")
        if subject is None:
            if settings.environment == "development":
                return "1"
            return None
        return str(subject)
    except JWTError:
        if settings.environment == "development":
            return "1"
        return None
