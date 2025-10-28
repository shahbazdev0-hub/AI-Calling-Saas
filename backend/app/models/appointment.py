# backend/app/models/appointment.py - appointment integration 
"""
Appointment Model - Stores appointment bookings
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from bson import ObjectId


class Appointment(BaseModel):
    """Appointment database model"""
    
    id: Optional[str] = Field(default_factory=str, alias="_id")
    
    # Customer information
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    
    # Appointment details
    appointment_date: datetime
    appointment_time: str  # "14:00", "09:30", etc.
    service_type: Optional[str] = None
    notes: Optional[str] = None
    
    # Booking metadata
    call_id: Optional[str] = None  # Link to call that created it
    user_id: Optional[str] = None  # Business owner
    agent_id: Optional[str] = None  # Voice agent that booked it
    workflow_id: Optional[str] = None  # Workflow used
    
    # Google Calendar integration
    google_calendar_event_id: Optional[str] = None
    
    # Status
    status: str = "scheduled"  # scheduled, confirmed, cancelled, completed, no_show
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    confirmed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}