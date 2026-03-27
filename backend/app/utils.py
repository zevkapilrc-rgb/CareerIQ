"""General utility helpers for the CareerIQ backend."""
import re


def slugify(text: str) -> str:
    """Convert a string to a URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


def truncate(text: str, max_len: int = 200) -> str:
    """Truncate a string to max_len characters, appending an ellipsis if needed."""
    if len(text) <= max_len:
        return text
    return text[:max_len].rstrip() + "…"


def is_valid_phone(phone: str) -> bool:
    """Basic phone number validation (digits, optional leading +)."""
    return bool(re.fullmatch(r"\+?\d{6,15}", phone.strip()))
