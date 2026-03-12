from fastapi import APIRouter, Depends

from ..authentication import get_current_user_id
from ..schemas import ChatbotQuery, ChatbotResponse
from ..services.ai_client import simple_chat_completion

router = APIRouter()


@router.post("/query", response_model=ChatbotResponse)
async def chatbot_query(
    payload: ChatbotQuery,
    user_id: str = Depends(get_current_user_id),
):
    _ = user_id
    reply = await simple_chat_completion(payload.message)
    return ChatbotResponse(reply=reply)

@router.get("/test")
def chatbot_test():
    return {"message": "Chatbot router is working!"}