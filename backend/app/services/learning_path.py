"""Learning path service – generates personalised step suggestions."""
from typing import List, Dict


def get_steps_for_domain(domain: str) -> List[Dict]:
    """Return learning steps appropriate for a given domain."""
    base_steps = [
        {"title": "Core Foundations", "description": "Strengthen fundamentals for your field.", "eta_hours": 10},
        {"title": "Advanced Patterns", "description": "Move from basics to professional-grade patterns.", "eta_hours": 15},
        {"title": "System Design", "description": "Learn to design scalable, production-ready systems.", "eta_hours": 12},
        {"title": "Interview Preparation", "description": "Problem-solving, behavioural questions, and mock interviews.", "eta_hours": 8},
    ]
    return base_steps
