# models/call.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from .base import PyObjectId
from bson import ObjectId


class Call(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "user_id": "507f1f77bcf86cd799439011",
                "direction": "outbound",
                "from_number": "+1234567890",
                "to_number": "+0987654321",
                "status": "completed",
                "duration": 120,
                "call_sid": "CAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            }
        }
    )

    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    direction: str  # inbound or outbound
    from_number: str
    to_number: str
    status: str  # initiated, ringing, in-progress, completed, failed, busy, no-answer
    duration: Optional[int] = 0  # in seconds
    call_sid: Optional[str] = None  # Twilio call SID
    recording_url: Optional[str] = None
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)