"""Notifications service – placeholder for push/email notifications."""
import logging

logger = logging.getLogger(__name__)


async def send_notification(user_id: int, message: str, channel: str = "in_app") -> bool:
    """Send a notification to a user. Logs to console in development."""
    logger.info(f"[NOTIFICATION] user_id={user_id} channel={channel}: {message}")
    print(f"\n[NOTIFICATION] → User {user_id} | {channel}: {message}\n")
    return True
