"""
OTP generation and delivery service.
In development (no SMTP/Twilio configured), OTP codes are printed to the console.
"""
import random
import string
import logging

from ..config import get_settings

logger = logging.getLogger(__name__)


def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP of the given length."""
    return "".join(random.choices(string.digits, k=length))


async def send_email_otp(email: str, code: str, purpose: str = "login") -> bool:
    """
    Send OTP via email.
    Falls back to console-print in development.
    """
    settings = get_settings()
    subject = "CareerIQ – Your OTP Code"
    body = (
        f"Your CareerIQ OTP for {purpose} is:\n\n"
        f"  {code}\n\n"
        f"This code expires in {settings.otp_expire_minutes} minutes.\n"
        f"Do not share this code with anyone."
    )

    if not settings.smtp_host or not settings.smtp_user:
        # Development mode – print to console
        logger.info(f"[DEV] Email OTP for {email}: {code}  (purpose={purpose})")
        print(f"\n{'='*50}")
        print(f"  📧  OTP for {email}: {code}  (purpose={purpose})")
        print(f"{'='*50}\n")
        return True

    try:
        import aiosmtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        msg = MIMEMultipart()
        msg["From"] = settings.smtp_from
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        await aiosmtplib.send(
            msg,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
        logger.info(f"Email OTP sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email OTP to {email}: {e}")
        # Fallback – print to console so dev can still test
        print(f"\n[FALLBACK] OTP for {email}: {code}\n")
        return False


async def send_sms_otp(phone: str, code: str, purpose: str = "login") -> bool:
    """
    Send OTP via SMS (Twilio).
    Falls back to console-print in development.
    """
    settings = get_settings()
    message_body = f"Your CareerIQ OTP is: {code}. Valid for {settings.otp_expire_minutes} minutes. Do not share."

    if not settings.twilio_sid or not settings.twilio_token:
        # Development mode – print to console
        logger.info(f"[DEV] SMS OTP for {phone}: {code}  (purpose={purpose})")
        print(f"\n{'='*50}")
        print(f"  📱  OTP for {phone}: {code}  (purpose={purpose})")
        print(f"{'='*50}\n")
        return True

    try:
        from twilio.rest import Client
        client = Client(settings.twilio_sid, settings.twilio_token)
        client.messages.create(
            body=message_body,
            from_=settings.twilio_from,
            to=phone if phone.startswith("+") else f"+91{phone}",
        )
        logger.info(f"SMS OTP sent to {phone}")
        return True
    except Exception as e:
        logger.error(f"Failed to send SMS OTP to {phone}: {e}")
        print(f"\n[FALLBACK] OTP for {phone}: {code}\n")
        return False
