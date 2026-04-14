from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth.dependencies import get_current_user
from database.database import get_db
from sqlalchemy.orm import Session
from database.models import User
from agents.chat_agent import process_chat

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatPayload(BaseModel):
    messages: list[ChatMessage]

@router.post("/chat")
def chat_endpoint(
    payload: ChatPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Convert pydantic models to list of dicts
    message_history = [{"role": msg.role, "content": msg.content} for msg in payload.messages]
    
    response_text = process_chat(message_history, db)
    
    return {"reply": response_text}
