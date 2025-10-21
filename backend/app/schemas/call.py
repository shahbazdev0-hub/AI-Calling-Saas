# schemas/call.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CallBase(BaseModel):
    direction: str = Field(..., description="Call direction: inbound or outbound")
    from_number: str = Field(..., description="Caller phone number")
    to_number: str = Field(..., description="Recipient phone number")


class CallCreate(CallBase):
    agent_id: Optional[str] = None


class CallUpdate(BaseModel):
    status: Optional[str] = None
    duration: Optional[int] = None
    ended_at: Optional[datetime] = None
    recording_url: Optional[str] = None


class CallResponse(CallBase):
    id: str = Field(..., alias="_id")
    user_id: str
    status: str
    duration: Optional[int] = 0
    call_sid: Optional[str] = None
    recording_url: Optional[str] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "direction": "outbound",
                "from_number": "+1234567890",
                "to_number": "+0987654321",
                "status": "completed",
                "duration": 120,
                "created_at": "2024-01-01T12:00:00"
            }
        }


class CallStatsResponse(BaseModel):
    total_calls: int
    completed_calls: int
    failed_calls: int
    average_duration: float
    total_duration: int