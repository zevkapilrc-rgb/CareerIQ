"""Interview question generator – stub implementation."""
from typing import List, Dict


def generate_questions(role: str, seniority: str = "mid") -> List[Dict]:
    """Generate a mix of behavioural, technical, and aptitude questions."""
    questions = [
        {"question": f"Describe a challenging {role} project you led.", "category": "behavioral"},
        {"question": "How would you design a scalable job recommendation system?", "category": "system design"},
        {"question": f"What are the core principles you follow as a {role}?", "category": "technical"},
        {"question": "A train travels 60 km in 45 minutes. What is its speed in km/h?", "category": "aptitude"},
        {"question": "How do you handle disagreements with your team lead?", "category": "behavioral"},
    ]
    return questions
