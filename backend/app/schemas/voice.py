# voice.py
from typing import Optional, Dict, List
from pydantic import BaseModel, Field


class VoiceAgentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    voice_id: str = Field(..., description="ElevenLabs voice ID")
    system_prompt: str = Field(..., min_length=10)
    greeting_message: str = Field(..., min_length=1)


class VoiceAgentCreate(VoiceAgentBase):
    voice_settings: Optional[Dict] = {
        "stability": 0.5,
        "similarity_boost": 0.75
    }
    personality_traits: Optional[List[str]] = []
    knowledge_base: Optional[Dict] = {}


class VoiceAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    voice_id: Optional[str] = None
    voice_settings: Optional[Dict] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    personality_traits: Optional[List[str]] = None
    knowledge_base: Optional[Dict] = None
    is_active: Optional[bool] = None


class VoiceAgentResponse(VoiceAgentBase):
    id: str = Field(..., alias="_id")
    user_id: str
    voice_settings: Dict
    personality_traits: List[str]
    knowledge_base: Dict
    is_active: bool
    created_at: str
    updated_at: str

    class Config:
        populate_by_name = True


class VoiceTestRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    voice_id: str


class VoiceTestResponse(BaseModel):
    audio_url: str
    duration: float