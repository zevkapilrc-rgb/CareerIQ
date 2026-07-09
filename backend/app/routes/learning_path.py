import os
from fastapi import APIRouter, Depends
import httpx
from typing import Optional

from ..authentication import get_current_user_id
from ..schemas import LearningPathResponse, LearningPathStep, LearningModule

router = APIRouter()

# In-memory cache for search results to avoid hitting API limits
YOUTUBE_CACHE = {}

async def get_youtube_video_for_query(query: str) -> Optional[dict]:
    # Check cache first
    if query in YOUTUBE_CACHE:
        return YOUTUBE_CACHE[query]

    # Check env keys for RapidAPI
    rapidapi_key = os.getenv("RAPIDAPI_KEY") or os.getenv("YOUTUBE_API_KEY") or os.getenv("JSEARCH_ID") or os.getenv("JSEARCH_KEY")
    if not rapidapi_key:
        return None

    # Host 1: youtube-v31.p.rapidapi.com
    try:
        url = "https://youtube-v31.p.rapidapi.com/search"
        headers = {
            "x-rapidapi-key": rapidapi_key,
            "x-rapidapi-host": "youtube-v31.p.rapidapi.com"
        }
        params = {
            "q": query,
            "part": "snippet",
            "maxResults": "1",
            "type": "video"
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params, timeout=5.0)
            if response.status_code == 200:
                res_data = response.json()
                items = res_data.get("items", [])
                if items:
                    video_id = items[0].get("id", {}).get("videoId")
                    snippet = items[0].get("snippet", {})
                    if video_id:
                        result = {
                            "video_url": f"https://www.youtube.com/watch?v={video_id}",
                            "title": snippet.get("title", query),
                            "description": snippet.get("description", "")
                        }
                        YOUTUBE_CACHE[query] = result
                        return result
    except Exception as e:
        print(f"[YouTube API] Error calling youtube-v31: {e}")

    # Host 2: youtube-search-and-download.p.rapidapi.com (fallback)
    try:
        url_alt = "https://youtube-search-and-download.p.rapidapi.com/search"
        headers_alt = {
            "x-rapidapi-key": rapidapi_key,
            "x-rapidapi-host": "youtube-search-and-download.p.rapidapi.com"
        }
        params_alt = {
            "query": query
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url_alt, headers=headers_alt, params=params_alt, timeout=5.0)
            if response.status_code == 200:
                res_data = response.json()
                contents = res_data.get("contents", [])
                for item in contents:
                    video = item.get("video")
                    if video and video.get("videoId"):
                        video_id = video["videoId"]
                        desc_text = ""
                        if video.get("descriptionSnippet"):
                            desc_text = video["descriptionSnippet"][0].get("text", "")
                        result = {
                            "video_url": f"https://www.youtube.com/watch?v={video_id}",
                            "title": video.get("title", query),
                            "description": desc_text
                        }
                        YOUTUBE_CACHE[query] = result
                        return result
    except Exception as e:
        print(f"[YouTube API] Error calling youtube-search-and-download: {e}")

    return None


@router.get("/personalized", response_model=LearningPathResponse)
async def get_personalized_learning_path(user_id: str = Depends(get_current_user_id)):
    _ = user_id
    
    # We will build the base learning path steps
    steps_data = [
        {
            "title": "Deepen React & Modern Web Ecosystem",
            "description": "Master React fundamentals, advanced patterns, and modern tooling.",
            "eta_hours": 20,
            "modules": [
                {"title": "React JS Full Course for Beginners", "description": "Learn the absolute fundamentals of React, components, state, and props.", "default_url": "https://www.youtube.com/watch?v=bMknfKXIFA8"},
                {"title": "React Advanced Patterns & Hooks", "description": "Master custom hooks, Context API, and compound components.", "default_url": "https://www.youtube.com/watch?v=LlvBzyy-558"},
                {"title": "Redux Toolkit & State Management", "description": "Manage complex global state efficiently in large applications.", "default_url": "https://www.youtube.com/watch?v=bbkBuqC1rU4"}
            ]
        },
        {
            "title": "TypeScript Mastery",
            "description": "Move from basic types to advanced generic programming.",
            "eta_hours": 15,
            "modules": [
                {"title": "TypeScript Full Course", "description": "Learn TS from scratch: Types, Interfaces, Unions, and more.", "default_url": "https://www.youtube.com/watch?v=30LWjhZzg50"},
                {"title": "Advanced TypeScript Concepts", "description": "Generics, utility types, mapped types, and conditional types.", "default_url": "https://www.youtube.com/watch?v=d56mG7DezGs"}
            ]
        },
        {
            "title": "System Design & Architecture",
            "description": "Learn to design scalable, production-ready distributed systems.",
            "eta_hours": 25,
            "modules": [
                {"title": "System Design Basics", "description": "Load balancing, caching, databases, and microservices.", "default_url": "https://www.youtube.com/watch?v=bUHFg8CZFws"},
                {"title": "Designing Scalable Applications", "description": "Real-world system design case studies and architectural patterns.", "default_url": "https://www.youtube.com/watch?v=m8Icp_Cid5o"}
            ]
        },
        {
            "title": "Interview Preparation & Data Structures",
            "description": "Crack coding interviews with algorithm mastery.",
            "eta_hours": 30,
            "modules": [
                {"title": "Data Structures & Algorithms Course", "description": "Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming.", "default_url": "https://www.youtube.com/watch?v=RBSGKlAvoiM"},
                {"title": "Mock Coding Interviews", "description": "Watch real engineers solve complex algorithmic problems.", "default_url": "https://www.youtube.com/watch?v=GjY-D05L8Zc"}
            ]
        }
    ]

    steps = []
    for step_data in steps_data:
        modules = []
        for mod_data in step_data["modules"]:
            # Query YouTube for live video!
            video_info = await get_youtube_video_for_query(mod_data["title"])
            if video_info:
                modules.append(LearningModule(
                    title=video_info["title"],
                    description=video_info["description"] or mod_data["description"],
                    video_url=video_info["video_url"]
                ))
            else:
                modules.append(LearningModule(
                    title=mod_data["title"],
                    description=mod_data["description"],
                    video_url=mod_data["default_url"]
                ))
        steps.append(LearningPathStep(
            title=step_data["title"],
            description=step_data["description"],
            eta_hours=step_data["eta_hours"],
            modules=modules
        ))

    return LearningPathResponse(steps=steps)


@router.get("/test")
def learning_path_test():
    return {"message": "Learning Path router is working!"}