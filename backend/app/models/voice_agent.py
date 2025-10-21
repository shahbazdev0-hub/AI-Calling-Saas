# models/voice_agent.py
from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field, ConfigDict
from .base import PyObjectId
from bson import ObjectId


class VoiceAgent(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    voice_id: str
    voice_settings: Optional[Dict] = {
        "stability": 0.5,
        "similarity_boost": 0.75
    }
    system_prompt: str
    greeting_message: str
    personality_traits: Optional[List[str]] = []
    knowledge_base: Optional[Dict] = {}
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)