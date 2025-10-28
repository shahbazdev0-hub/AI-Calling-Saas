# backend/app/models/voice_agent.py

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId


class VoiceAgent(BaseModel):
    """Voice Agent Model"""
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    
    # Voice settings
    voice_id: str  # ElevenLabs voice ID
    voice_settings: Dict[str, Any] = {
        "stability": 0.5,
        "similarity_boost": 0.75
    }
    
    # Workflow integration
    workflow_id: Optional[str] = None  # AI Campaign workflow ID
    appointment_rules: Optional[Dict[str, Any]] = None  # 🆕 Workflow appointment rules
    
    # AI configuration
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    personality_traits: List[str]
    knowledge_base: Dict[str, Any] = {}
    
    # Status
    is_active: bool = True
    
    # Metadata
    metadata: Optional[Dict[str, Any]] = {}
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}