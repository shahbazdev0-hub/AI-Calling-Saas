# backend/app/services/sms.py - COMPLETE FIXED VERSION

import os
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from bson import ObjectId
import logging

from app.database import get_database

logger = logging.getLogger(__name__)


class SMSService:
    """SMS Service using Twilio"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self.default_from: Optional[str] = None
        self.db = None
        self._is_configured = False
        
        # Try to initialize Twilio from environment variables
        self._init_twilio()
    
    def _init_twilio(self):
        """Initialize Twilio client from environment variables"""
        try:
            account_sid = os.getenv("TWILIO_ACCOUNT_SID")
            auth_token = os.getenv("TWILIO_AUTH_TOKEN")
            phone_number = os.getenv("TWILIO_PHONE_NUMBER")
            
            if account_sid and auth_token:
                # Strip spaces
                account_sid = account_sid.strip()
                auth_token = auth_token.strip()
                if phone_number:
                    phone_number = phone_number.strip()
                
                self.client = Client(account_sid, auth_token)
                self.default_from = phone_number
                self._is_configured = True
                logger.info("✅ SMS Service: Twilio configured")
                logger.info(f"📱 SMS From Number: {phone_number}")
            else:
                logger.warning("⚠️ SMS Service: Twilio not configured - SMS will be disabled")
                self._is_configured = False
        except Exception as e:
            logger.error(f"❌ SMS Service: Failed to initialize Twilio - {e}")
            self._is_configured = False
    
    def is_configured(self) -> bool:
        """Check if SMS service is configured"""
        return self._is_configured
    
    async def get_db(self):
        """Get database connection"""
        if self.db is None:
            self.db = await get_database()
        return self.db
    
    async def send_sms(
        self,
        to_number: str,
        message: str,
        from_number: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Send SMS message
        
        Args:
            to_number: Recipient phone number
            message: SMS message content
            from_number: Sender phone number (optional)
            user_id: User ID (optional)
            metadata: Additional metadata (optional)
            
        Returns:
            Dict with success status and details
        """
        
        # Check if configured
        if not self._is_configured:
            logger.warning("⚠️ SMS Service not configured - skipping SMS send")
            return {
                "success": False,
                "error": "SMS service not configured. Please set up Twilio credentials."
            }
        
        try:
            from_number = from_number or self.default_from
            
            logger.info(f"📱 Sending SMS to {to_number}")
            logger.info(f"   From: {from_number}")
            logger.info(f"   Message: {message[:50]}...")
            
            # Send via Twilio
            twilio_message = self.client.messages.create(
                body=message,
                from_=from_number,
                to=to_number
            )
            
            logger.info(f"✅ SMS sent successfully! SID: {twilio_message.sid}")
            
            # Save to database
            db = await self.get_db()
            sms_data = {
                "user_id": user_id,
                "to_number": to_number,
                "from_number": from_number,
                "message": message,
                "status": "sent",
                "direction": "outbound",
                "twilio_sid": twilio_message.sid,
                "twilio_status": twilio_message.status,
                "metadata": metadata or {},
                "created_at": datetime.utcnow(),
                "sent_at": datetime.utcnow()
            }
            
            result = await db.sms_messages.insert_one(sms_data)
            
            return {
                "success": True,
                "sms_id": str(result.inserted_id),
                "twilio_sid": twilio_message.sid,
                "status": twilio_message.status,
                "to_number": to_number,
                "message": "SMS sent successfully"
            }
            
        except TwilioRestException as e:
            logger.error(f"❌ Twilio SMS Error: {e.code} - {e.msg}")
            
            # Save failed attempt
            db = await self.get_db()
            await db.sms_messages.insert_one({
                "user_id": user_id,
                "to_number": to_number,
                "from_number": from_number or self.default_from,
                "message": message,
                "status": "failed",
                "direction": "outbound",
                "error_code": str(e.code),
                "error_message": str(e.msg),
                "metadata": metadata or {},
                "created_at": datetime.utcnow()
            })
            
            return {
                "success": False,
                "error": f"Twilio Error {e.code}: {e.msg}",
                "error_code": e.code
            }
            
        except Exception as e:
            logger.error(f"❌ Error sending SMS: {str(e)}")
            
            return {
                "success": False,
                "error": f"Failed to send SMS: {str(e)}"
            }
    
    async def send_bulk_sms(
        self,
        to_numbers: List[str],
        message: str,
        from_number: Optional[str] = None,
        user_id: Optional[str] = None,
        batch_size: int = 25
    ) -> Dict[str, Any]:
        """Send bulk SMS messages"""
        
        if not self._is_configured:
            return {
                "success": False,
                "error": "SMS service not configured"
            }
        
        results = {
            "total": len(to_numbers),
            "sent": 0,
            "failed": 0,
            "errors": []
        }
        
        for to_number in to_numbers:
            result = await self.send_sms(
                to_number=to_number,
                message=message,
                from_number=from_number,
                user_id=user_id
            )
            
            if result.get("success"):
                results["sent"] += 1
            else:
                results["failed"] += 1
                results["errors"].append({
                    "to_number": to_number,
                    "error": result.get("error")
                })
        
        return {
            "success": True,
            "results": results
        }
    
    async def get_sms_list(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        direction: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get list of SMS messages"""
        db = await self.get_db()
        
        query = {"user_id": user_id}
        
        if direction:
            query["direction"] = direction
        if status:
            query["status"] = status
        
        cursor = db.sms_messages.find(query).sort("created_at", -1).skip(skip).limit(limit)
        messages = await cursor.to_list(length=limit)
        
        # Format messages
        for msg in messages:
            msg["_id"] = str(msg["_id"])
        
        return messages
    
    async def get_sms_stats(self, user_id: str) -> Dict[str, int]:
        """Get SMS statistics"""
        db = await self.get_db()
        
        # Total counts
        total_sent = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "sent"
        })
        
        total_failed = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "failed"
        })
        
        total_pending = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "pending"
        })
        
        # Today's count
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        today_sent = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "sent",
            "created_at": {"$gte": today_start}
        })
        
        # This week's count
        week_start = today_start - timedelta(days=today_start.weekday())
        week_sent = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "sent",
            "created_at": {"$gte": week_start}
        })
        
        # This month's count
        month_start = today_start.replace(day=1)
        month_sent = await db.sms_messages.count_documents({
            "user_id": user_id,
            "status": "sent",
            "created_at": {"$gte": month_start}
        })
        
        return {
            "total_sent": total_sent,
            "total_failed": total_failed,
            "total_pending": total_pending,
            "today_sent": today_sent,
            "this_week_sent": week_sent,
            "this_month_sent": month_sent
        }
    
    async def handle_incoming_sms(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming SMS webhook from Twilio"""
        db = await self.get_db()
        
        sms_data = {
            "to_number": data.get("To"),
            "from_number": data.get("From"),
            "message": data.get("Body"),
            "status": "received",
            "direction": "inbound",
            "twilio_sid": data.get("MessageSid"),
            "twilio_status": data.get("SmsStatus"),
            "created_at": datetime.utcnow()
        }
        
        await db.sms_messages.insert_one(sms_data)
        
        return {
            "success": True,
            "message": "Incoming SMS processed"
        }
    
    async def delete_sms(self, sms_id: str, user_id: str) -> bool:
        """Delete SMS message"""
        db = await self.get_db()
        
        result = await db.sms_messages.delete_one({
            "_id": ObjectId(sms_id),
            "user_id": user_id
        })
        
        return result.deleted_count > 0


# Create singleton instance
sms_service = SMSService()