from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/notifications")
async def notifications_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        await websocket.send_json(
            {
                "type": "welcome",
                "message": "Real-time notifications will stream from the backend here.",
            }
        )
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        return
@router.get("/test")
def notifications_test():
    return {"message": "Notifications router is working!"}
