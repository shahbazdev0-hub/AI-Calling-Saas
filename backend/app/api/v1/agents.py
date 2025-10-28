# backend/app/api/v1/agents.py without campaign builder 
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from ...api.deps import get_current_user, get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/agents/{agent_id}/test")
async def test_agent(
    agent_id: str,
    test_message: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Test an AI agent with a message"""
    try:
        if not ObjectId.is_valid(agent_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid agent ID"
            )
        
        return {
            "success": True,
            "response": f"Hello! This is a test response from agent {agent_id}",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test agent: {str(e)}"
        )

