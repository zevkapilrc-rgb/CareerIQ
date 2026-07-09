from typing import Any, Dict

from openai import OpenAI, AsyncOpenAI

from ..config import get_settings


_async_client = None


def get_client() -> OpenAI | None:
    settings = get_settings()
    if not settings.openai_api_key:
        return None
    return OpenAI(api_key=settings.openai_api_key)


def get_async_client() -> AsyncOpenAI | None:
    global _async_client
    if _async_client is not None:
        return _async_client
    settings = get_settings()
    if not settings.openai_api_key:
        return None
    _async_client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _async_client


async def simple_chat_completion(prompt: str) -> str:
    """
    Placeholder OpenAI chat call. Returns a static string when no API key is set.
    """
    client = get_async_client()
    if client is None:
        return "AI response placeholder. Configure OPENAI_API_KEY to enable live responses."

    # NOTE: Adjust model name when wiring to a real deployment.
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=256,
    )
    return response.choices[0].message.content or ""


