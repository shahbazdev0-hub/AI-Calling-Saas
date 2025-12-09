# backend/app/services/call_handler.py - ✅ COMPLETE WITH SINGLETON INSTANCE

import os
from datetime import datetime
from typing import Dict, Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import logging

from app.database import get_database
from app.config import settings

logger = logging.getLogger(__name__)


class CallHandlerService:
    """
    Call Handler Service
    Manages call lifecycle and integration with Twilio
    """
    
    def __init__(self):
        """Initialize without database - will be set later"""
        self.db = None
        self._twilio_service = None
        self._initialized = False
        logger.info("📞 CallHandlerService initialized")
    
    async def initialize(self):
        """Initialize with database connection"""
        if not self._initialized:
            self.db = await get_database()
            
            # Import here to avoid circular imports
            from app.services.twilio import twilio_service
            self._twilio_service = twilio_service
            
            self._initialized = True
            logger.info("✅ CallHandlerService ready")
    
    async def ensure_initialized(self):
        """Ensure service is initialized before use"""
        if not self._initialized:
            await self.initialize()

    async def initiate_call(
        self,
        to_number: str,
        agent_id: Optional[str] = None,
        call_id: Optional[str] = None,
        from_number: Optional[str] = None
    ) -> Dict:
        """
        Initiate a new outbound call with Twilio
        
        Args:
            to_number: Phone number to call
            agent_id: Voice agent ID (optional)
            call_id: Existing call ID from database (optional)
            from_number: Override Twilio number (optional)
            
        Returns:
            Dict with call information
        """
        try:
            await self.ensure_initialized()
            
            logger.info(f"📞 Initiating call to {to_number}")
            logger.info(f"   Agent ID: {agent_id}")
            logger.info(f"   Call ID: {call_id}")
            
            # Use configured Twilio number if not provided
            if not from_number:
                from_number = settings.TWILIO_PHONE_NUMBER
            
            # Make the call via Twilio
            call_result = self._twilio_service.make_call(
                to_number=to_number,
                from_number=from_number
            )
            
            logger.info(f"📱 Twilio response: {call_result}")
            
            if not call_result.get("success"):
                logger.error(f"❌ Twilio call failed: {call_result.get('error')}")
                return call_result
            
            # Get Twilio call SID
            twilio_call_sid = call_result.get("call_sid")
            
            # Update call record if call_id provided
            if call_id and ObjectId.is_valid(call_id):
                await self.db.calls.update_one(
                    {"_id": ObjectId(call_id)},
                    {
                        "$set": {
                            "twilio_call_sid": twilio_call_sid,
                            "call_sid": twilio_call_sid,
                            "status": "ringing",
                            "from_number": from_number,
                            "to_number": to_number,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                logger.info(f"✅ Updated call {call_id} with Twilio SID")
            
            return call_result
            
        except Exception as e:
            logger.error(f"❌ Error initiating call: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e)
            }

    async def update_call_status(
        self,
        call_sid: str,
        status: str,
        duration: Optional[int] = None
    ):
        """
        Update call status in database
        
        Args:
            call_sid: Twilio call SID
            status: New status (initiated, ringing, in-progress, completed, failed)
            duration: Call duration in seconds (optional)
        """
        try:
            await self.ensure_initialized()
            
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if duration is not None:
                update_data["duration"] = duration
            
            if status == "completed":
                update_data["ended_at"] = datetime.utcnow()
            
            result = await self.db.calls.update_one(
                {"twilio_call_sid": call_sid},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                logger.info(f"✅ Updated call status: {call_sid} -> {status}")
            else:
                logger.warning(f"⚠️ Call not found: {call_sid}")
            
        except Exception as e:
            logger.error(f"❌ Error updating call status: {e}")

    async def save_recording(
        self,
        call_sid: str,
        recording_url: str,
        recording_sid: str,
        recording_duration: int = 0
    ):
        """
        Save recording information to database
        
        Args:
            call_sid: Twilio call SID
            recording_url: URL to access recording
            recording_sid: Twilio recording SID
            recording_duration: Duration in seconds
        """
        try:
            await self.ensure_initialized()
            
            result = await self.db.calls.update_one(
                {"twilio_call_sid": call_sid},
                {
                    "$set": {
                        "recording_url": recording_url,
                        "recording_sid": recording_sid,
                        "recording_duration": recording_duration,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                logger.info(f"✅ Recording saved for call {call_sid}")
            else:
                logger.warning(f"⚠️ Call not found for recording: {call_sid}")
            
        except Exception as e:
            logger.error(f"❌ Error saving recording: {e}")

    async def get_call_by_sid(self, call_sid: str) -> Optional[Dict]:
        """
        Get call record by Twilio call SID
        
        Args:
            call_sid: Twilio call SID
            
        Returns:
            Call record or None
        """
        try:
            await self.ensure_initialized()
            
            call = await self.db.calls.find_one({
                "twilio_call_sid": call_sid
            })
            
            return call
            
        except Exception as e:
            logger.error(f"❌ Error fetching call: {e}")
            return None

    async def end_call(self, call_sid: str):
        """
        End an active call via Twilio
        
        Args:
            call_sid: Twilio call SID
        """
        try:
            await self.ensure_initialized()
            
            # End call via Twilio
            result = self._twilio_service.end_call(call_sid)
            
            if result.get("success"):
                # Update database
                await self.update_call_status(call_sid, "completed")
                logger.info(f"✅ Call ended: {call_sid}")
            else:
                logger.error(f"❌ Failed to end call: {result.get('error')}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Error ending call: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# ============================================
# SINGLETON INSTANCE - THIS WAS MISSING!
# ============================================

call_handler_service = CallHandlerService()


# ============================================
# DEPENDENCY FUNCTION
# ============================================

def get_call_handler(db: AsyncIOMotorDatabase = None) -> CallHandlerService:
    """
    Get CallHandlerService instance
    
    Args:
        db: Database connection (optional, will use global if not provided)
        
    Returns:
        CallHandlerService instance
    """
    if db and call_handler_service.db is None:
        call_handler_service.db = db
    
    return call_handler_service