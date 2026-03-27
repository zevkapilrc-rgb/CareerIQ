"""Leaderboard service – placeholder implementation."""
from typing import List, Dict


def get_top_users(limit: int = 10) -> List[Dict]:
    """Return a stub leaderboard."""
    return [
        {"rank": i + 1, "name": f"User {i + 1}", "xp": max(0, 5000 - i * 400), "level": "Specialist"}
        for i in range(limit)
    ]
