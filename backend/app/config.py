from functools import lru_cache
import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "CareerIQ API"
    environment: str = os.getenv("ENVIRONMENT", "development")

    # Database – defaults to SQLite for dev; set to postgres:// in production
    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./career_iq.db",
    )

    # JWT
    jwt_secret: str = os.getenv("JWT_SECRET", "changeme-in-production-use-long-random-string")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hrs

    # OTP
    otp_expire_minutes: int = 5

    # Cache / Queue (optional)
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    rabbitmq_url: str = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost//")

    # OpenAI (optional)
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")

    # Email OTP (optional – prints to console if not set)
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from: str = os.getenv("SMTP_FROM", "noreply@careeriq.ai")

    # Twilio SMS OTP (optional – prints to console if not set)
    twilio_sid: str = os.getenv("TWILIO_SID", "")
    twilio_token: str = os.getenv("TWILIO_TOKEN", "")
    twilio_from: str = os.getenv("TWILIO_FROM", "")

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
