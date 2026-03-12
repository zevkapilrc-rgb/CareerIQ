from .ai_client import simple_chat_completion


async def score_resume_stub(text: str) -> dict:
    prompt = (
        "You are an AI resume coach. Provide a JSON with fields "
        "'score' (0-100), 'strengths' (list), 'improvements' (list) "
        f"for this resume:\n{text[:4000]}"
    )
    _ = await simple_chat_completion(prompt)
    # For now, return a static structure so the UI can be built.
    return {
        "score": 78.5,
        "strengths": ["Clear summary", "Relevant technical skills"],
        "improvements": ["Quantify achievements", "Highlight impact metrics"],
    }

