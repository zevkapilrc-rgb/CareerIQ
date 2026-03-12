from typing import Any, Dict

from openai import OpenAI

from ..config import get_settings


def get_client() -> OpenAI | None:
    settings = get_settings()
    if not settings.openai_api_key:
        return None
    return OpenAI(api_key=settings.openai_api_key)


async def simple_chat_completion(prompt: str) -> str:
    """
    Placeholder OpenAI chat call. Returns a static string when no API key is set.
    """
    client = get_client()
    if client is None:
        return "AI response placeholder. Configure OPENAI_API_KEY to enable live responses."

    # NOTE: Adjust model name when wiring to a real deployment.
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=256,
    )
    return response.choices[0].message.content or ""

