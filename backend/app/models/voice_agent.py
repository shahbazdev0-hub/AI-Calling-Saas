# backend/app/models/voice_agent.py - COMPLETE WITH ALL NEW FIELDS

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from bson import ObjectId


class VoiceAgent(BaseModel):
    """
    Voice Agent Model - COMPLETE VERSION
    Supports: Single/Bulk calling, RAG training, Multi-channel communication
    """
    
    # ============================================
    # BASIC IDENTIFICATION
    # ============================================
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    name: str
    description: Optional[str] = None
    
    # ============================================
    # VOICE SETTINGS (ElevenLabs)
    # ============================================
    voice_id: str  # ElevenLabs voice ID - MUST be dynamic per agent
    voice_settings: Dict[str, Any] = Field(
        default_factory=lambda: {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    )
    
    # ============================================
    # CALLING CONFIGURATION (NEW)
    # ============================================
    calling_mode: str = Field(
        default="single",
        description="Calling mode: 'single' or 'bulk'"
    )
    
    contacts: List[Dict[str, str]] = Field(
        default_factory=list,
        description="List of contacts for calling. Format: [{'name': '', 'phone': '', 'email': ''}]"
    )
    
    # ============================================
    # AI CONFIGURATION (NEW - Custom Script)
    # ============================================
    ai_script: Optional[str] = Field(
        None,
        description="Custom AI agent script - used when no training docs available"
    )
    
    system_prompt: Optional[str] = Field(
        None,
        description="Legacy system prompt - deprecated in favor of ai_script"
    )
    
    greeting_message: Optional[str] = Field(
        None,
        description="Initial greeting message"
    )
    
    personality_traits: List[str] = Field(
        default_factory=list,
        description="Personality traits for the agent"
    )
    
    knowledge_base: Dict[str, Any] = Field(
        default_factory=dict,
        description="Legacy knowledge base"
    )
    
    # ============================================
    # AGENT INTELLIGENCE SETTINGS (NEW)
    # ============================================
    logic_level: str = Field(
        default="medium",
        description="Agent intelligence level: 'low', 'medium', 'high'"
    )
    
    contact_frequency: int = Field(
        default=3,
        ge=1,
        le=30,
        description="Days between contacts (1-30)"
    )
    
    # ============================================
    # COMMUNICATION CHANNELS (NEW)
    # ============================================
    enable_calls: bool = Field(
        default=True,
        description="Enable voice calling"
    )
    
    enable_emails: bool = Field(
        default=False,
        description="Enable email communications"
    )
    
    enable_sms: bool = Field(
        default=False,
        description="Enable SMS communications"
    )
    
    # ============================================
    # RAG TRAINING DOCUMENTS (NEW)
    # ============================================
    has_training_docs: bool = Field(
        default=False,
        description="Whether agent has uploaded training documents"
    )
    
    training_doc_ids: List[str] = Field(
        default_factory=list,
        description="IDs of uploaded training documents"
    )
    
    # ============================================
    # WORKFLOW INTEGRATION (Existing - Keep)
    # ============================================
    workflow_id: Optional[str] = Field(
        None,
        description="AI Campaign workflow ID"
    )
    
    appointment_rules: Optional[Dict[str, Any]] = Field(
        None,
        description="Workflow appointment rules"
    )
    
    # ============================================
    # STATUS & METRICS
    # ============================================
    is_active: bool = Field(
        default=True,
        description="Whether agent is active"
    )
    
    in_call: bool = Field(
        default=False,
        description="Whether agent is currently in a call"
    )
    
    total_calls: int = Field(
        default=0,
        description="Total number of calls made by this agent"
    )
    
    successful_calls: int = Field(
        default=0,
        description="Number of successful calls"
    )
    
    # ============================================
    # BULK CAMPAIGN TRACKING (NEW)
    # ============================================
    last_campaign_run: Optional[datetime] = Field(
        None,
        description="Last time bulk campaign was executed"
    )
    
    campaign_status: Optional[str] = Field(
        None,
        description="Current campaign status: 'idle', 'running', 'paused', 'completed'"
    )
    
    # ============================================
    # METADATA
    # ============================================
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata"
    )
    
    # ============================================
    # TIMESTAMPS
    # ============================================
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # ============================================
    # VALIDATORS
    # ============================================
    @validator('calling_mode')
    def validate_calling_mode(cls, v):
        if v not in ['single', 'bulk']:
            raise ValueError("calling_mode must be 'single' or 'bulk'")
        return v
    
    @validator('logic_level')
    def validate_logic_level(cls, v):
        if v not in ['low', 'medium', 'high']:
            raise ValueError("logic_level must be 'low', 'medium', or 'high'")
        return v
    
    @validator('contacts')
    def validate_contacts(cls, v, values):
        """Validate contacts based on calling mode"""
        calling_mode = values.get('calling_mode', 'single')
        
        if calling_mode == 'bulk' and len(v) == 0:
            raise ValueError("Bulk calling mode requires at least one contact")
        
        # Validate each contact has required fields
        for contact in v:
            if 'name' not in contact or not contact['name']:
                raise ValueError("Each contact must have a 'name'")
            if 'phone' not in contact or not contact['phone']:
                raise ValueError("Each contact must have a 'phone'")
        
        return v
    
    @validator('contact_frequency')
    def validate_contact_frequency(cls, v):
        if not 1 <= v <= 30:
            raise ValueError("contact_frequency must be between 1 and 30 days")
        return v
    
    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "name": "Customer Support Agent",
                "description": "Handles customer inquiries and support",
                "voice_id": "21m00Tcm4TlvDq8ikWAM",
                "calling_mode": "bulk",
                "contacts": [
                    {"name": "John Doe", "phone": "+1234567890", "email": "john@example.com"},
                    {"name": "Jane Smith", "phone": "+0987654321", "email": "jane@example.com"}
                ],
                "ai_script": "You are a helpful customer support agent...",
                "logic_level": "high",
                "contact_frequency": 7,
                "enable_calls": True,
                "enable_emails": True,
                "enable_sms": False,
                "has_training_docs": True,
                "training_doc_ids": ["doc123", "doc456"]
            }
        }