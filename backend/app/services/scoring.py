"""Scoring utilities for interview and resume analysis."""
from typing import List


def score_answers(answers: List[dict]) -> float:
    """Calculate an aggregate score from a list of interview answers.

    Each answer should have optional 'score' (0‑100). Returns average.
    """
    scores = [a.get("score", 0) for a in answers if isinstance(a.get("score"), (int, float))]
    if not scores:
        return 0.0
    return round(sum(scores) / len(scores), 2)


def ats_score(resume_text: str, job_keywords: List[str]) -> float:
    """Simple keyword-match ATS score (0‑100)."""
    if not job_keywords:
        return 50.0
    text_lower = resume_text.lower()
    hits = sum(1 for kw in job_keywords if kw.lower() in text_lower)
    return round((hits / len(job_keywords)) * 100, 2)
