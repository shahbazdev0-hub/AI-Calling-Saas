# # backend/app/api/v1/sms.py - MILESTONE 3 COMPLETE

# from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
# from typing import Optional

# from app.schemas.sms import (
#     SMSSendRequest,
#     SMSBulkRequest,
#     SMSResponse,
#     SMSStatsResponse
# )
# from app.api.deps import get_current_user
# from app.services.sms import sms_service
# from app.tasks.sms_tasks import send_sms_task, send_bulk_sms_task
# import logging

# logger = logging.getLogger(__name__)
# router = APIRouter()


# @router.get("/", response_model=dict)
# async def get_sms_messages(
#     skip: int = Query(0, ge=0),
#     limit: int = Query(50, ge=1, le=100),
#     status: Optional[str] = None,
#     direction: Optional[str] = None,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS messages for the current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         logger.info(f"Fetching SMS messages for user: {user_id}")
        
#         result = await sms_service.get_sms_messages(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             status=status,
#             direction=direction
#         )
        
#         logger.info(f"Found {result.get('total', 0)} SMS messages for user {user_id}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error fetching SMS messages: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats", response_model=dict)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics for the current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         logger.info(f"Fetching SMS stats for user: {user_id}")
        
#         stats = await sms_service.get_sms_stats(user_id)
        
#         logger.info(f"SMS stats for user {user_id}: {stats}")
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error fetching SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/{sms_id}", response_model=dict)
# async def get_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get a specific SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         sms = await sms_service.get_sms_by_id(sms_id, user_id)
        
#         if not sms:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         return sms
        
#     except Exception as e:
#         logger.error(f"Error fetching SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_request: SMSSendRequest,
#     background_tasks: BackgroundTasks,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send a single SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         logger.info(f"Sending SMS to {sms_request.to_number} for user {user_id}")
        
#         # Queue SMS for sending
#         send_sms_task.delay(
#             to_number=sms_request.to_number,
#             message=sms_request.message,
#             user_id=user_id,
#             from_number=sms_request.from_number
#         )
        
#         return {
#             "success": True,
#             "message": "SMS queued for sending",
#             "to_number": sms_request.to_number
#         }
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk", response_model=dict)
# async def send_bulk_sms(
#     bulk_request: SMSBulkRequest,
#     background_tasks: BackgroundTasks,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         logger.info(f"Sending bulk SMS to {len(bulk_request.to_numbers)} recipients for user {user_id}")
        
#         # Queue bulk SMS for sending
#         send_bulk_sms_task.delay(
#             to_numbers=bulk_request.to_numbers,
#             message=bulk_request.message,
#             user_id=user_id,
#             from_number=bulk_request.from_number,
#             batch_size=bulk_request.batch_size
#         )
        
#         return {
#             "success": True,
#             "message": "Bulk SMS queued for sending",
#             "recipient_count": len(bulk_request.to_numbers)
#         }
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/webhook", response_model=dict)
# async def sms_webhook(webhook_data: dict):
#     """Handle incoming SMS webhook from Twilio"""
#     try:
#         logger.info(f"Received SMS webhook: {webhook_data}")
        
#         result = await sms_service.handle_incoming_sms(webhook_data)
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error processing SMS webhook: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # backend/app/api/v1/sms.py - COMPLETE FIXED VERSION

# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List
# from datetime import datetime
# from bson import ObjectId
# import logging

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse  # ✅ FIXED IMPORTS
# from app.services.sms import sms_service

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,  # ✅ FIXED: Use correct schema name
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,  # ✅ FIXED: Use correct schema name
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # ✅ SMS WEBHOOK - Handle incoming SMS from Twilio
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming SMS webhook from Twilio
    
#     Twilio sends form data, not JSON!
#     """
#     try:
#         # ✅ Extract form data from Twilio
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"   SID: {message_sid}")
#         logger.info(f"   Status: {sms_status}")
#         logger.info(f"{'='*80}\n")
        
#         # ✅ Find which user owns this Twilio number
#         # Get the first active user (you can improve this later)
#         user = await db.users.find_one({"is_active": True})
        
#         if not user:
#             logger.warning("⚠️ No active user found for incoming SMS")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         user_id = str(user["_id"])
        
#         # ✅ Store incoming SMS in database
#         sms_data = {
#             "user_id": user_id,  # ✅ CRITICAL: Add user_id
#             "to_number": to_number,
#             "from_number": from_number,
#             "message": body,
#             "status": "received",
#             "direction": "inbound",
#             "twilio_sid": message_sid,
#             "twilio_status": sms_status,
#             "created_at": datetime.utcnow()
#         }
        
#         # Store in sms_messages collection
#         await db.sms_messages.insert_one(sms_data.copy())
        
#         # ✅ Store in sms_logs collection (for frontend display)
#         sms_log_data = sms_data.copy()
#         sms_log_data["is_reply"] = False
#         sms_log_data["has_replies"] = False
#         sms_log_data["reply_count"] = 0
        
#         await db.sms_logs.insert_one(sms_log_data)
        
#         logger.info(f"✅ Incoming SMS stored successfully!")
#         logger.info(f"   Stored in sms_messages and sms_logs")
#         logger.info(f"   User ID: {user_id}")
        
#         # ✅ Return empty TwiML response (Twilio expects XML)
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Error processing SMS webhook: {e}")
#         import traceback
#         traceback.print_exc()
        
#         # Return XML response even on error
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml",
#             status_code=500
#         )

# # backend/app/api/v1/sms.py - COMPLETE WITH FIXED WEBHOOK FOR ALL USERS

# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List
# from datetime import datetime
# from bson import ObjectId
# import logging

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
# from app.services.sms import sms_service

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # ✅ FIXED: SMS WEBHOOK - Store for ALL active users
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ FIXED: Handle incoming SMS webhook from Twilio
    
#     Stores incoming SMS for ALL active users so everyone can see them
#     """
#     try:
#         # ✅ Extract form data from Twilio
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"   SID: {message_sid}")
#         logger.info(f"   Status: {sms_status}")
#         logger.info(f"{'='*80}\n")
        
#         # ✅ FIX: Get ALL active users and store SMS for each
#         users_cursor = db.users.find({"is_active": True})
#         users = await users_cursor.to_list(length=None)
        
#         if not users:
#             logger.warning("⚠️ No active users found for incoming SMS")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         logger.info(f"👥 Found {len(users)} active user(s), storing SMS for all")
        
#         # ✅ Store SMS for EACH active user
#         stored_count = 0
#         for user in users:
#             user_id = str(user["_id"])
            
#             # Base SMS data
#             sms_data = {
#                 "user_id": user_id,
#                 "to_number": to_number,
#                 "from_number": from_number,
#                 "message": body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "twilio_sid": message_sid,
#                 "twilio_status": sms_status,
#                 "created_at": datetime.utcnow()
#             }
            
#             # Store in sms_messages collection
#             await db.sms_messages.insert_one(sms_data.copy())
            
#             # ✅ Store in sms_logs collection (for frontend display)
#             sms_log_data = sms_data.copy()
#             sms_log_data["is_reply"] = False
#             sms_log_data["has_replies"] = False
#             sms_log_data["reply_count"] = 0
            
#             await db.sms_logs.insert_one(sms_log_data)
            
#             stored_count += 1
#             logger.info(f"✅ SMS stored for user: {user.get('email', user_id)}")
        
#         logger.info(f"✅ Incoming SMS stored successfully for {stored_count} user(s)!")
        
#         # ✅ Return empty TwiML response (Twilio expects XML)
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Error processing SMS webhook: {e}")
#         import traceback
#         traceback.print_exc()
        
#         # Return XML response even on error
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml",
#             status_code=500
#         )


# # backend/app/api/v1/sms.py - FIXED WITH CORRECT CAMPAIGN MATCHING

# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List, Dict, Any
# from datetime import datetime
# from bson import ObjectId
# import logging
# import os

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
# from app.services.sms import sms_service
# from app.services.openai import openai_service

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # HELPER: Campaign Matching (from sms_chat.py)
# # ============================================

# async def _match_campaign_workflow(
#     user_input: str,
#     user_id: str,
#     db
# ) -> Optional[Dict]:
#     """Match user input against Campaign Builder workflows"""
#     try:
#         workflows_cursor = db.flows.find({
#             "user_id": user_id,
#             "active": True
#         })
#         workflows = await workflows_cursor.to_list(length=None)
        
#         if not workflows:
#             return None
        
#         user_input_lower = user_input.lower().strip()
        
#         logger.info(f"🔍 Campaign matching for: '{user_input}'")
        
#         for workflow in workflows:
#             workflow_name = workflow.get("name", "Unnamed")
#             nodes = workflow.get("nodes", [])
            
#             for node in nodes:
#                 node_data = node.get("data", {})
#                 node_message = node_data.get("message", "")
#                 node_transitions = node_data.get("transitions", [])
                
#                 if not node_transitions or not node_message:
#                     continue
                
#                 for keyword in node_transitions:
#                     if not keyword:
#                         continue
                    
#                     keyword_clean = str(keyword).strip().lower()
                    
#                     if keyword_clean and keyword_clean in user_input_lower:
#                         logger.info(f"✅ Campaign match found: '{keyword_clean}'")
                        
#                         return {
#                             "found": True,
#                             "response": node_message,
#                             "workflow_id": str(workflow["_id"]),
#                             "workflow_name": workflow_name,
#                             "node_id": node.get("id"),
#                             "matched_keyword": keyword_clean
#                         }
        
#         logger.info(f"❌ No campaign match found")
#         return None
        
#     except Exception as e:
#         logger.error(f"Campaign matching error: {e}")
#         return None


# # ============================================
# # ✅ SMS WEBHOOK WITH AUTOMATIC AI RESPONSES
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming SMS webhook from Twilio with AUTOMATIC AI RESPONSES
    
#     This webhook:
#     1. Receives incoming SMS
#     2. Stores it in database for ALL active users
#     3. Generates AI response using same logic as sms_chat.py
#     4. Sends AI response back to customer
#     5. Stores AI response in database
#     """
#     try:
#         # Extract form data from Twilio
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"   SID: {message_sid}")
#         logger.info(f"   Status: {sms_status}")
#         logger.info(f"{'='*80}\n")
        
#         # Get ALL active users
#         users_cursor = db.users.find({"is_active": True})
#         users = await users_cursor.to_list(length=None)
        
#         if not users:
#             logger.warning("⚠️ No active users found")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         # Use the first active user for AI response generation
#         primary_user = users[0]
#         user_id = str(primary_user["_id"])
        
#         logger.info(f"👤 Processing AI response for user: {primary_user.get('email', user_id)}")
        
#         # ============================================
#         # STEP 1: Store incoming message for ALL users
#         # ============================================
#         for user in users:
#             uid = str(user["_id"])
            
#             sms_data = {
#                 "user_id": uid,
#                 "to_number": to_number,
#                 "from_number": from_number,
#                 "message": body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "twilio_sid": message_sid,
#                 "twilio_status": sms_status,
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(sms_data.copy())
            
#             sms_log_data = sms_data.copy()
#             sms_log_data["is_reply"] = False
#             sms_log_data["has_replies"] = False
#             sms_log_data["reply_count"] = 0
            
#             await db.sms_logs.insert_one(sms_log_data)
        
#         logger.info(f"✅ Incoming message stored for {len(users)} user(s)")
        
#         # ============================================
#         # STEP 2: Generate AI Response (Same logic as sms_chat.py)
#         # ============================================
        
#         ai_message = None
#         source = "none"
        
#         # Priority 1: Check Campaign Builder workflows
#         try:
#             campaign_match = await _match_campaign_workflow(
#                 user_input=body,
#                 user_id=user_id,
#                 db=db
#             )
            
#             if campaign_match and campaign_match.get("found"):
#                 ai_message = campaign_match["response"]
#                 source = "campaign"
#                 logger.info(f"✅ Using Campaign Builder response")
                
#         except Exception as e:
#             logger.error(f"Campaign matching error: {e}")
        
#         # Priority 2: Use OpenAI if no campaign match
#         if not ai_message:
#             try:
#                 logger.info(f"🤖 Generating OpenAI response...")
                
#                 # Get conversation history
#                 history_cursor = db.sms_logs.find({
#                     "user_id": user_id,
#                     "$or": [
#                         {"to_number": from_number},
#                         {"from_number": from_number}
#                     ]
#                 }).sort("created_at", -1).limit(10)
                
#                 history = await history_cursor.to_list(length=10)
#                 history.reverse()
                
#                 # Build conversation context
#                 conversation_context = []
#                 for msg in history:
#                     role = "user" if msg["direction"] == "inbound" else "assistant"
#                     conversation_context.append({
#                         "role": role,
#                         "content": msg["message"]
#                     })
                
#                 # Add current message
#                 conversation_context.append({
#                     "role": "user",
#                     "content": body
#                 })
                
#                 # Generate AI response
#                 ai_response = await openai_service.generate_chat_response(
#                     messages=conversation_context,
#                     system_prompt="""You are a helpful AI assistant for a call center business. 
#                     You help answer customer questions about services, pricing, appointments, and general inquiries.
#                     Be professional, friendly, and helpful. Keep responses under 150 words."""
#                 )
                
#                 if ai_response.get("success"):
#                     ai_message = ai_response.get("response", "I'm here to help! How can I assist you?")
#                     source = "openai"
#                     logger.info(f"✅ OpenAI response generated")
#                 else:
#                     logger.error(f"OpenAI error: {ai_response.get('error')}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
                
#             except Exception as e:
#                 logger.error(f"OpenAI error: {e}")
#                 import traceback
#                 traceback.print_exc()
#                 ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                 source = "fallback"
        
#         logger.info(f"📤 AI Response ({source}): {ai_message[:100]}...")
        
#         # ============================================
#         # STEP 3: Send AI response back to customer via Twilio
#         # ============================================
        
#         twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
#         try:
#             send_result = await sms_service.send_sms(
#                 to_number=from_number,
#                 message=ai_message,
#                 from_number=twilio_phone,
#                 user_id=user_id
#             )
            
#             if send_result.get("success"):
#                 logger.info(f"✅ AI response sent to customer via Twilio")
#                 logger.info(f"   Twilio SID: {send_result.get('twilio_sid')}")
#             else:
#                 logger.error(f"❌ Failed to send AI response: {send_result.get('error')}")
                
#         except Exception as e:
#             logger.error(f"❌ Error sending AI response: {e}")
#             import traceback
#             traceback.print_exc()
        
#         # ============================================
#         # STEP 4: Store AI response for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             ai_sms_data = {
#                 "user_id": uid,
#                 "to_number": from_number,
#                 "from_number": twilio_phone,
#                 "message": ai_message,
#                 "status": "sent",
#                 "direction": "outbound",
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(ai_sms_data.copy())
            
#             ai_sms_log = ai_sms_data.copy()
#             ai_sms_log["is_reply"] = True
#             ai_sms_log["has_replies"] = False
#             ai_sms_log["reply_count"] = 0
            
#             await db.sms_logs.insert_one(ai_sms_log)
        
#         logger.info(f"✅ AI response stored for {len(users)} user(s)")
#         logger.info(f"{'='*80}\n")
        
#         # Return empty TwiML (Twilio requires XML response)
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Error in SMS webhook: {e}")
#         import traceback
#         traceback.print_exc()
        
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml",
#             status_code=500
#         )


# # backend/app/api/v1/sms.py - FIXED IMPORTS important file with sms inbound and outbound but without bulk sms 

# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List, Dict, Any
# from datetime import datetime, timedelta
# from bson import ObjectId
# import logging
# import os
# import re

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
# from app.services.sms import sms_service
# from app.services.openai import openai_service
# from app.services.email_automation import email_automation_service
# from app.services.google_calendar import google_calendar_service  # ✅ FIXED: Correct import

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # HELPER FUNCTIONS (FROM sms_chat.py)
# # ============================================

# async def _get_conversation_state(phone_number: str, user_id: str, db) -> Dict:
#     """Get conversation state for appointment booking"""
#     try:
#         state = await db.sms_conversation_states.find_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
        
#         if not state:
#             return {
#                 "phone_number": phone_number,
#                 "user_id": user_id,
#                 "booking_in_progress": False,
#                 "current_step": None,
#                 "collected_data": {}
#             }
        
#         return state
#     except Exception as e:
#         logger.error(f"Error getting conversation state: {e}")
#         return {
#             "phone_number": phone_number,
#             "user_id": user_id,
#             "booking_in_progress": False,
#             "current_step": None,
#             "collected_data": {}
#         }


# async def _update_conversation_state(phone_number: str, user_id: str, updates: Dict, db):
#     """Update conversation state"""
#     try:
#         await db.sms_conversation_states.update_one(
#             {"phone_number": phone_number, "user_id": user_id},
#             {"$set": {**updates, "updated_at": datetime.utcnow()}},
#             upsert=True
#         )
#     except Exception as e:
#         logger.error(f"Error updating conversation state: {e}")


# async def _clear_conversation_state(phone_number: str, user_id: str, db):
#     """Clear conversation state"""
#     try:
#         await db.sms_conversation_states.delete_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
#     except Exception as e:
#         logger.error(f"Error clearing conversation state: {e}")


# def _extract_name(text: str) -> Optional[str]:
#     """Extract name from text"""
#     text = text.strip()
    
#     # Skip if too short or too long
#     if len(text) < 2 or len(text) > 50:
#         return None
    
#     # Simple extraction - take first 2-3 words as name
#     words = text.split()[:3]
#     name = " ".join(words)
    
#     # Capitalize properly
#     name = " ".join([word.capitalize() for word in name.split()])
    
#     return name if len(name) >= 2 else None


# def _extract_email(text: str) -> Optional[str]:
#     """Extract email from text"""
#     email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#     match = re.search(email_pattern, text)
#     return match.group(0).lower() if match else None


# def _extract_phone(text: str) -> Optional[str]:
#     """Extract phone number from text"""
#     phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
#     match = re.search(phone_pattern, text)
    
#     if match:
#         groups = match.groups()
#         phone = f"+1{groups[1]}{groups[2]}{groups[3]}"
#         return phone
    
#     return None


# def _extract_service(text: str) -> Optional[str]:
#     """Extract service type from text"""
#     services = [
#         "power washing",
#         "christmas lights installation",
#         "house painting",
#         "general maintenance",
#         "window cleaning",
#         "gutter cleaning",
#         "landscaping",
#         "pressure washing"
#     ]
    
#     text_lower = text.lower()
    
#     for service in services:
#         if service in text_lower:
#             return service.title()
    
#     return None


# def _extract_date_time(text: str) -> Optional[datetime]:
#     """Extract date and time from text (SIMPLIFIED VERSION FROM sms_chat.py)"""
#     try:
#         now = datetime.utcnow()
#         text_lower = text.lower()
        
#         # Day name mapping
#         days_map = {
#             "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
#             "friday": 4, "saturday": 5, "sunday": 6
#         }
        
#         # Extract time
#         time_pattern = r'(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?'
#         time_match = re.search(time_pattern, text_lower)
        
#         hour = 10
#         minute = 0
        
#         if time_match:
#             hour = int(time_match.group(1))
#             minute = int(time_match.group(2) or 0)
#             meridiem = time_match.group(3)
            
#             if meridiem and ('pm' in meridiem or 'p.m' in meridiem):
#                 if hour != 12:
#                     hour += 12
#             elif meridiem and ('am' in meridiem or 'a.m' in meridiem) and hour == 12:
#                 hour = 0
        
#         # Determine base date
#         base_date = None
        
#         if "tomorrow" in text_lower:
#             base_date = now + timedelta(days=1)
#         elif "today" in text_lower:
#             base_date = now
#         elif "next week" in text_lower:
#             base_date = now + timedelta(days=7)
#         else:
#             for day_name, target_weekday in days_map.items():
#                 if day_name in text_lower:
#                     current_weekday = now.weekday()
#                     days_ahead = (target_weekday - current_weekday) % 7
                    
#                     if "next" in text_lower and days_ahead == 0:
#                         days_ahead = 7
#                     elif days_ahead == 0:
#                         days_ahead = 7
                    
#                     base_date = now + timedelta(days=days_ahead)
#                     break
        
#         if not base_date:
#             base_date = now + timedelta(days=1)
        
#         appointment_datetime = base_date.replace(
#             hour=hour,
#             minute=minute,
#             second=0,
#             microsecond=0
#         )
        
#         logger.info(f"✅ Parsed datetime: {appointment_datetime.strftime('%A, %B %d, %Y at %I:%M %p UTC')}")
        
#         return appointment_datetime
        
#     except Exception as e:
#         logger.error(f"Error extracting date/time: {e}")
#         return None


# async def _process_appointment_booking(
#     user_message: str,
#     conversation_state: Dict,
#     user_id: str,
#     phone_number: str,
#     db
# ) -> Dict:
#     """Process appointment booking conversation (FROM sms_chat.py)"""
#     try:
#         collected_data = conversation_state.get("collected_data", {})
        
#         logger.info(f"\n📅 Appointment Booking")
#         logger.info(f"   Collected: {list(collected_data.keys())}")
        
#         # Step 1: Collect name
#         if not collected_data.get("name"):
#             name = _extract_name(user_message)
#             if name:
#                 collected_data["name"] = name
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "name"},
#                     db
#                 )
#                 return {
#                     "response": f"Thank you, {name}! What's your email address so I can send you a confirmation?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't catch your name. Could you please tell me your name?",
#                     "booking_complete": False
#                 }
        
#         # Step 2: Collect email
#         elif not collected_data.get("email"):
#             email = _extract_email(user_message)
#             if email:
#                 collected_data["email"] = email
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "email"},
#                     db
#                 )
#                 return {
#                     "response": "Great! We offer the following services:\n- Power Washing\n- Christmas Lights Installation\n- House Painting\n- General Maintenance\n\nWhich service would you like?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't find a valid email address. Could you please provide your email?",
#                     "booking_complete": False
#                 }
        
#         # Step 3: Collect service
#         elif not collected_data.get("service"):
#             service = _extract_service(user_message)
#             if service:
#                 collected_data["service"] = service
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "service"},
#                     db
#                 )
#                 return {
#                     "response": f"Perfect! When would you like to schedule {service}? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "Which service would you like? (Power Washing, Christmas Lights, House Painting, or General Maintenance)",
#                     "booking_complete": False
#                 }
        
#         # Step 4: Collect date/time and complete booking
#         elif not collected_data.get("date"):
#             appointment_date = _extract_date_time(user_message)
#             if appointment_date:
#                 collected_data["date"] = appointment_date.isoformat()
                
#                 # Create appointment
#                 customer_name = collected_data["name"]
#                 customer_email = collected_data["email"]
#                 service_type = collected_data["service"]
                
#                 # ✅ FIXED: Create Google Calendar event with correct method
#                 try:
#                     appointment_time = appointment_date.strftime("%H:%M")
                    
#                     event = await google_calendar_service.create_event(
#                         customer_name=customer_name,
#                         customer_email=customer_email,
#                         customer_phone=phone_number,
#                         appointment_date=appointment_date,
#                         appointment_time=appointment_time,
#                         duration_minutes=60,
#                         service_type=service_type,
#                         notes=None
#                     )
#                     event_id = event.get("event_id") if event.get("success") else None
#                     logger.info(f"✅ Calendar event created: {event_id}")
#                 except Exception as e:
#                     logger.error(f"Calendar error: {e}")
#                     event_id = None
                
#                 # Store in database
#                 appointment_data = {
#                     "user_id": user_id,
#                     "customer_name": customer_name,
#                     "customer_email": customer_email,
#                     "customer_phone": phone_number,
#                     "service_type": service_type,
#                     "appointment_date": appointment_date,
#                     "google_calendar_event_id": event_id,
#                     "status": "confirmed",
#                     "created_at": datetime.utcnow()
#                 }
                
#                 appointment_result = await db.appointments.insert_one(appointment_data)
#                 appointment_id = str(appointment_result.inserted_id)
                
#                 # Send confirmation email
#                 try:
#                     formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                    
#                     await email_automation_service.send_appointment_confirmation(
#                         to_email=customer_email,
#                         customer_name=customer_name,
#                         customer_phone=phone_number,
#                         service_type=service_type,
#                         appointment_date=formatted_date,
#                         user_id=user_id,
#                         appointment_id=appointment_id,
#                         call_id=None
#                     )
                    
#                     logger.info(f"✅ Confirmation email sent")
#                 except Exception as e:
#                     logger.error(f"Email error: {e}")
                
#                 # Clear conversation state
#                 await _clear_conversation_state(phone_number, user_id, db)
                
#                 date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
#                 response = f"Perfect! Your appointment is confirmed for {date_str}. I've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
                
#                 return {
#                     "response": response,
#                     "booking_complete": True
#                 }
#             else:
#                 return {
#                     "response": "I didn't understand the date/time. Could you try again? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
        
#         # Fallback
#         return {
#             "response": "Let me help you complete your booking. What information do you still need to provide?",
#             "booking_complete": False
#         }
        
#     except Exception as e:
#         logger.error(f"Error in appointment booking: {e}", exc_info=True)
#         await _clear_conversation_state(phone_number, user_id, db)
#         return {
#             "response": "I apologize, but there was an error. Please try booking again.",
#             "booking_complete": False
#         }


# async def _match_campaign_workflow(user_input: str, user_id: str, db) -> Optional[Dict]:
#     """Match user input against Campaign Builder workflows (FROM sms_chat.py)"""
#     try:
#         workflows_cursor = db.flows.find({
#             "user_id": user_id,
#             "active": True
#         })
#         workflows = await workflows_cursor.to_list(length=None)
        
#         if not workflows:
#             return None
        
#         user_input_lower = user_input.lower().strip()
        
#         logger.info(f"🔍 Checking {len(workflows)} campaigns for match")
        
#         for workflow in workflows:
#             workflow_name = workflow.get("name", "Unnamed")
#             nodes = workflow.get("nodes", [])
            
#             for node in nodes:
#                 node_data = node.get("data", {})
#                 node_message = node_data.get("message", "")
#                 node_transitions = node_data.get("transitions", [])
                
#                 if not node_transitions or not node_message:
#                     continue
                
#                 for keyword in node_transitions:
#                     if not keyword:
#                         continue
                    
#                     keyword_clean = str(keyword).strip().lower()
                    
#                     if keyword_clean and keyword_clean in user_input_lower:
#                         logger.info(f"✅ Campaign match: '{keyword_clean}' in workflow '{workflow_name}'")
                        
#                         return {
#                             "found": True,
#                             "response": node_message,
#                             "workflow_id": str(workflow["_id"]),
#                             "workflow_name": workflow_name,
#                             "node_id": node.get("id"),
#                             "matched_keyword": keyword_clean
#                         }
        
#         logger.info(f"❌ No campaign match")
#         return None
        
#     except Exception as e:
#         logger.error(f"Campaign matching error: {e}")
#         return None


# # ============================================
# # ✅ SMS WEBHOOK WITH FULL SMS_CHAT.PY LOGIC
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming SMS webhook with COMPLETE sms_chat.py logic:
#     - Priority 1: Appointment booking flow
#     - Priority 2: Campaign Builder responses
#     - Priority 3: OpenAI fallback
#     """
#     try:
#         # Extract Twilio form data
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"{'='*80}\n")
        
#         # Get ALL active users
#         users_cursor = db.users.find({"is_active": True})
#         users = await users_cursor.to_list(length=None)
        
#         if not users:
#             logger.warning("⚠️ No active users found")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         primary_user = users[0]
#         user_id = str(primary_user["_id"])
        
#         # ============================================
#         # STEP 1: Store incoming message for ALL users
#         # ============================================
#         for user in users:
#             uid = str(user["_id"])
            
#             sms_data = {
#                 "user_id": uid,
#                 "to_number": to_number,
#                 "from_number": from_number,
#                 "message": body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "twilio_sid": message_sid,
#                 "twilio_status": sms_status,
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(sms_data.copy())
            
#             sms_log_data = sms_data.copy()
#             sms_log_data["is_reply"] = False
#             sms_log_data["has_replies"] = False
#             sms_log_data["reply_count"] = 0
            
#             await db.sms_logs.insert_one(sms_log_data)
        
#         logger.info(f"✅ Incoming message stored")
        
#         # ============================================
#         # STEP 2: Generate AI Response (SAME AS sms_chat.py)
#         # ============================================
        
#         ai_message = None
#         source = "none"
        
#         # Get conversation state
#         conversation_state = await _get_conversation_state(from_number, user_id, db)
        
#         # PRIORITY 1: Handle Active Appointment Booking
#         if conversation_state.get("booking_in_progress"):
#             logger.info("📅 Continuing appointment booking...")
            
#             booking_result = await _process_appointment_booking(
#                 body, conversation_state, user_id, from_number, db
#             )
            
#             ai_message = booking_result["response"]
#             source = "appointment_booking"
        
#         # PRIORITY 2: Check if User Wants to Book
#         elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
#             logger.info("📅 Starting new appointment booking...")
            
#             await _update_conversation_state(
#                 from_number, user_id,
#                 {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
#                 db
#             )
            
#             ai_message = "Great! I can help you book an appointment. First, may I have your name?"
#             source = "appointment_booking"
        
#         # PRIORITY 3: Check Campaign Builder
#         else:
#             campaign_match = await _match_campaign_workflow(
#                 user_input=body,
#                 user_id=user_id,
#                 db=db
#             )
            
#             if campaign_match and campaign_match.get("found"):
#                 ai_message = campaign_match["response"]
#                 source = "campaign"
#                 logger.info(f"✅ Using Campaign: {campaign_match['workflow_name']}")
            
#             # PRIORITY 4: Use OpenAI
#             else:
#                 logger.info(f"🤖 Using OpenAI")
                
#                 try:
#                     history_cursor = db.sms_logs.find({
#                         "user_id": user_id,
#                         "$or": [
#                             {"to_number": from_number},
#                             {"from_number": from_number}
#                         ]
#                     }).sort("created_at", -1).limit(10)
                    
#                     history = await history_cursor.to_list(length=10)
#                     history.reverse()
                    
#                     conversation_context = []
#                     for msg in history:
#                         role = "user" if msg["direction"] == "inbound" else "assistant"
#                         conversation_context.append({
#                             "role": role,
#                             "content": msg["message"]
#                         })
                    
#                     conversation_context.append({
#                         "role": "user",
#                         "content": body
#                     })
                    
#                     ai_response = await openai_service.generate_chat_response(
#                         messages=conversation_context,
#                         system_prompt="""You are a helpful AI assistant for a call center business. 
#                         You help answer customer questions about services, pricing, appointments, and general inquiries.
#                         Be professional, friendly, and helpful. Keep responses under 150 words."""
#                     )
                    
#                     if ai_response.get("success"):
#                         ai_message = ai_response.get("response", "I'm here to help! How can I assist you?")
#                         source = "openai"
#                     else:
#                         ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                         source = "fallback"
#                 except Exception as e:
#                     logger.error(f"OpenAI error: {e}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
        
#         logger.info(f"📤 AI Response ({source}): {ai_message[:100]}...")
        
#         # ============================================
#         # STEP 3: Send AI response via Twilio
#         # ============================================
        
#         twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
#         try:
#             send_result = await sms_service.send_sms(
#                 to_number=from_number,
#                 message=ai_message,
#                 from_number=twilio_phone,
#                 user_id=user_id
#             )
            
#             if send_result.get("success"):
#                 logger.info(f"✅ AI response sent to customer")
#             else:
#                 logger.error(f"❌ Failed to send: {send_result.get('error')}")
#         except Exception as e:
#             logger.error(f"❌ Error sending SMS: {e}")
        
#         # ============================================
#         # STEP 4: Store AI response for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             ai_sms_data = {
#                 "user_id": uid,
#                 "to_number": from_number,
#                 "from_number": twilio_phone,
#                 "message": ai_message,
#                 "status": "sent",
#                 "direction": "outbound",
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(ai_sms_data.copy())
            
#             ai_sms_log = ai_sms_data.copy()
#             ai_sms_log["is_reply"] = True
#             ai_sms_log["has_replies"] = False
#             ai_sms_log["reply_count"] = 0
            
#             await db.sms_logs.insert_one(ai_sms_log)
        
#         logger.info(f"✅ Complete! ({source})")
        
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Webhook error: {e}")
#         import traceback
#         traceback.print_exc()
        
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml",
#             status_code=500
#         )


# # new file with bulk of sms 
# # backend/app/api/v1/sms.py - WITH CAMPAIGN TRACKING 

# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List, Dict, Any
# from datetime import datetime, timedelta
# from bson import ObjectId
# import logging
# import os
# import re

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
# from app.services.sms import sms_service
# from app.services.openai import openai_service
# from app.services.email_automation import email_automation_service
# from app.services.google_calendar import google_calendar_service

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # HELPER FUNCTIONS (FROM sms_chat.py)
# # ============================================

# async def _get_conversation_state(phone_number: str, user_id: str, db) -> Dict:
#     """Get conversation state for appointment booking"""
#     try:
#         state = await db.sms_conversation_states.find_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
        
#         if not state:
#             return {
#                 "phone_number": phone_number,
#                 "user_id": user_id,
#                 "booking_in_progress": False,
#                 "current_step": None,
#                 "collected_data": {}
#             }
        
#         return state
#     except Exception as e:
#         logger.error(f"Error getting conversation state: {e}")
#         return {
#             "phone_number": phone_number,
#             "user_id": user_id,
#             "booking_in_progress": False,
#             "current_step": None,
#             "collected_data": {}
#         }


# async def _update_conversation_state(phone_number: str, user_id: str, updates: Dict, db):
#     """Update conversation state"""
#     try:
#         await db.sms_conversation_states.update_one(
#             {"phone_number": phone_number, "user_id": user_id},
#             {"$set": {**updates, "updated_at": datetime.utcnow()}},
#             upsert=True
#         )
#     except Exception as e:
#         logger.error(f"Error updating conversation state: {e}")


# async def _clear_conversation_state(phone_number: str, user_id: str, db):
#     """Clear conversation state"""
#     try:
#         await db.sms_conversation_states.delete_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
#     except Exception as e:
#         logger.error(f"Error clearing conversation state: {e}")


# def _extract_name(text: str) -> Optional[str]:
#     """Extract name from text"""
#     text = text.strip()
    
#     # Skip if too short or too long
#     if len(text) < 2 or len(text) > 50:
#         return None
    
#     # Simple extraction - take first 2-3 words as name
#     words = text.split()[:3]
#     name = " ".join(words)
    
#     # Capitalize properly
#     name = " ".join([word.capitalize() for word in name.split()])
    
#     return name if len(name) >= 2 else None


# def _extract_email(text: str) -> Optional[str]:
#     """Extract email from text"""
#     email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#     match = re.search(email_pattern, text)
#     return match.group(0).lower() if match else None


# def _extract_phone(text: str) -> Optional[str]:
#     """Extract phone number from text"""
#     phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
#     match = re.search(phone_pattern, text)
    
#     if match:
#         groups = match.groups()
#         phone = f"+1{groups[1]}{groups[2]}{groups[3]}"
#         return phone
    
#     return None


# def _extract_service(text: str) -> Optional[str]:
#     """Extract service type from text"""
#     services = [
#         "power washing",
#         "christmas lights installation",
#         "house painting",
#         "general maintenance",
#         "window cleaning",
#         "gutter cleaning",
#         "landscaping",
#         "pressure washing"
#     ]
    
#     text_lower = text.lower()
    
#     for service in services:
#         if service in text_lower:
#             return service.title()
    
#     return None


# def _extract_date_time(text: str) -> Optional[datetime]:
#     """Extract date and time from text (SIMPLIFIED VERSION FROM sms_chat.py)"""
#     try:
#         now = datetime.utcnow()
#         text_lower = text.lower()
        
#         # Day name mapping
#         days_map = {
#             "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
#             "friday": 4, "saturday": 5, "sunday": 6
#         }
        
#         # Extract time
#         time_pattern = r'(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?'
#         time_match = re.search(time_pattern, text_lower)
        
#         hour = 10
#         minute = 0
        
#         if time_match:
#             hour = int(time_match.group(1))
#             minute = int(time_match.group(2) or 0)
#             meridiem = time_match.group(3)
            
#             if meridiem and ('pm' in meridiem or 'p.m' in meridiem):
#                 if hour != 12:
#                     hour += 12
#             elif meridiem and ('am' in meridiem or 'a.m' in meridiem) and hour == 12:
#                 hour = 0
        
#         # Determine base date
#         base_date = None
        
#         if "tomorrow" in text_lower:
#             base_date = now + timedelta(days=1)
#         elif "today" in text_lower:
#             base_date = now
#         elif "next week" in text_lower:
#             base_date = now + timedelta(days=7)
#         else:
#             for day_name, target_weekday in days_map.items():
#                 if day_name in text_lower:
#                     current_weekday = now.weekday()
#                     days_ahead = (target_weekday - current_weekday) % 7
                    
#                     if "next" in text_lower and days_ahead == 0:
#                         days_ahead = 7
#                     elif days_ahead == 0:
#                         days_ahead = 7
                    
#                     base_date = now + timedelta(days=days_ahead)
#                     break
        
#         if not base_date:
#             base_date = now + timedelta(days=1)
        
#         appointment_datetime = base_date.replace(
#             hour=hour,
#             minute=minute,
#             second=0,
#             microsecond=0
#         )
        
#         logger.info(f"✅ Parsed datetime: {appointment_datetime.strftime('%A, %B %d, %Y at %I:%M %p UTC')}")
        
#         return appointment_datetime
        
#     except Exception as e:
#         logger.error(f"Error extracting date/time: {e}")
#         return None


# async def _process_appointment_booking(
#     user_message: str,
#     conversation_state: Dict,
#     user_id: str,
#     phone_number: str,
#     db
# ) -> Dict:
#     """Process appointment booking conversation (FROM sms_chat.py)"""
#     try:
#         collected_data = conversation_state.get("collected_data", {})
        
#         logger.info(f"\n📅 Appointment Booking")
#         logger.info(f"   Collected: {list(collected_data.keys())}")
        
#         # Step 1: Collect name
#         if not collected_data.get("name"):
#             name = _extract_name(user_message)
#             if name:
#                 collected_data["name"] = name
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "name"},
#                     db
#                 )
#                 return {
#                     "response": f"Thank you, {name}! What's your email address so I can send you a confirmation?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't catch your name. Could you please tell me your name?",
#                     "booking_complete": False
#                 }
        
#         # Step 2: Collect email
#         elif not collected_data.get("email"):
#             email = _extract_email(user_message)
#             if email:
#                 collected_data["email"] = email
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "email"},
#                     db
#                 )
#                 return {
#                     "response": "Great! We offer the following services:\n- Power Washing\n- Christmas Lights Installation\n- House Painting\n- General Maintenance\n\nWhich service would you like?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't find a valid email address. Could you please provide your email?",
#                     "booking_complete": False
#                 }
        
#         # Step 3: Collect service
#         elif not collected_data.get("service"):
#             service = _extract_service(user_message)
#             if service:
#                 collected_data["service"] = service
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "service"},
#                     db
#                 )
#                 return {
#                     "response": f"Perfect! When would you like to schedule {service}? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "Which service would you like? (Power Washing, Christmas Lights, House Painting, or General Maintenance)",
#                     "booking_complete": False
#                 }
        
#         # Step 4: Collect date/time and complete booking
#         elif not collected_data.get("date"):
#             appointment_date = _extract_date_time(user_message)
#             if appointment_date:
#                 collected_data["date"] = appointment_date.isoformat()
                
#                 # Create appointment
#                 customer_name = collected_data["name"]
#                 customer_email = collected_data["email"]
#                 service_type = collected_data["service"]
                
#                 # Create Google Calendar event
#                 try:
#                     appointment_time = appointment_date.strftime("%H:%M")
                    
#                     event = await google_calendar_service.create_event(
#                         customer_name=customer_name,
#                         customer_email=customer_email,
#                         customer_phone=phone_number,
#                         appointment_date=appointment_date,
#                         appointment_time=appointment_time,
#                         duration_minutes=60,
#                         service_type=service_type,
#                         notes=None
#                     )
#                     event_id = event.get("event_id") if event.get("success") else None
#                     logger.info(f"✅ Calendar event created: {event_id}")
#                 except Exception as e:
#                     logger.error(f"Calendar error: {e}")
#                     event_id = None
                
#                 # Store in database
#                 appointment_data = {
#                     "user_id": user_id,
#                     "customer_name": customer_name,
#                     "customer_email": customer_email,
#                     "customer_phone": phone_number,
#                     "service_type": service_type,
#                     "appointment_date": appointment_date,
#                     "google_calendar_event_id": event_id,
#                     "status": "confirmed",
#                     "created_at": datetime.utcnow()
#                 }
                
#                 appointment_result = await db.appointments.insert_one(appointment_data)
#                 appointment_id = str(appointment_result.inserted_id)
                
#                 # Send confirmation email
#                 try:
#                     formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                    
#                     await email_automation_service.send_appointment_confirmation(
#                         to_email=customer_email,
#                         customer_name=customer_name,
#                         customer_phone=phone_number,
#                         service_type=service_type,
#                         appointment_date=formatted_date,
#                         user_id=user_id,
#                         appointment_id=appointment_id,
#                         call_id=None
#                     )
                    
#                     logger.info(f"✅ Confirmation email sent")
#                 except Exception as e:
#                     logger.error(f"Email error: {e}")
                
#                 # Clear conversation state
#                 await _clear_conversation_state(phone_number, user_id, db)
                
#                 date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
#                 response = f"Perfect! Your appointment is confirmed for {date_str}. I've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
                
#                 return {
#                     "response": response,
#                     "booking_complete": True
#                 }
#             else:
#                 return {
#                     "response": "I didn't understand the date/time. Could you try again? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
        
#         # Fallback
#         return {
#             "response": "Let me help you complete your booking. What information do you still need to provide?",
#             "booking_complete": False
#         }
        
#     except Exception as e:
#         logger.error(f"Error in appointment booking: {e}", exc_info=True)
#         await _clear_conversation_state(phone_number, user_id, db)
#         return {
#             "response": "I apologize, but there was an error. Please try booking again.",
#             "booking_complete": False
#         }


# async def _match_campaign_workflow(user_input: str, user_id: str, db) -> Optional[Dict]:
#     """Match user input against Campaign Builder workflows (FROM sms_chat.py)"""
#     try:
#         workflows_cursor = db.flows.find({
#             "user_id": user_id,
#             "active": True
#         })
#         workflows = await workflows_cursor.to_list(length=None)
        
#         if not workflows:
#             return None
        
#         user_input_lower = user_input.lower().strip()
        
#         logger.info(f"🔍 Checking {len(workflows)} campaigns for match")
        
#         for workflow in workflows:
#             workflow_name = workflow.get("name", "Unnamed")
#             nodes = workflow.get("nodes", [])
            
#             for node in nodes:
#                 node_data = node.get("data", {})
#                 node_message = node_data.get("message", "")
#                 node_transitions = node_data.get("transitions", [])
                
#                 if not node_transitions or not node_message:
#                     continue
                
#                 for keyword in node_transitions:
#                     if not keyword:
#                         continue
                    
#                     keyword_clean = str(keyword).strip().lower()
                    
#                     if keyword_clean and keyword_clean in user_input_lower:
#                         logger.info(f"✅ Campaign match: '{keyword_clean}' in workflow '{workflow_name}'")
                        
#                         return {
#                             "found": True,
#                             "response": node_message,
#                             "workflow_id": str(workflow["_id"]),
#                             "workflow_name": workflow_name,
#                             "node_id": node.get("id"),
#                             "matched_keyword": keyword_clean
#                         }
        
#         logger.info(f"❌ No campaign match")
#         return None
        
#     except Exception as e:
#         logger.error(f"Campaign matching error: {e}")
#         return None


# # ============================================
# # ✅ SMS WEBHOOK WITH CAMPAIGN TRACKING
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming SMS webhook with:
#     - 🆕 Campaign reply tracking
#     - Priority 1: Appointment booking flow
#     - Priority 2: Campaign Builder responses
#     - Priority 3: OpenAI fallback
#     """
#     try:
#         # Extract Twilio form data
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"{'='*80}\n")
        
#         # ============================================
#         # 🆕 STEP 0: Check if reply is from bulk campaign
#         # ============================================
        
#         campaign_id = None
#         original_campaign = None
        
#         try:
#             # Find if this customer received a message from a campaign
#             original_sms = await db.sms_messages.find_one({
#                 "to_number": from_number,
#                 "direction": "outbound",
#                 "campaign_id": {"$exists": True, "$ne": None}
#             }, sort=[("created_at", -1)])  # Get most recent
            
#             if original_sms:
#                 campaign_id = original_sms.get("campaign_id")
                
#                 # Get campaign details
#                 original_campaign = await db.sms_campaigns.find_one({
#                     "campaign_id": campaign_id
#                 })
                
#                 if original_campaign:
#                     logger.info(f"🎯 Reply is from bulk campaign: {campaign_id}")
                    
#                     # Update campaign recipient status
#                     await db.sms_campaigns.update_one(
#                         {
#                             "_id": original_campaign["_id"],
#                             "recipients.phone_number": from_number
#                         },
#                         {
#                             "$set": {
#                                 "recipients.$.status": "replied"
#                             }
#                         }
#                     )
#                     logger.info(f"✅ Updated campaign recipient status to 'replied'")
#         except Exception as e:
#             logger.warning(f"⚠️ Error checking campaign: {e}")
        
#         # ============================================
#         # STEP 1: Get ALL active users
#         # ============================================
        
#         users_cursor = db.users.find({"is_active": True})
#         users = await users_cursor.to_list(length=None)
        
#         if not users:
#             logger.warning("⚠️ No active users found")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         primary_user = users[0]
#         user_id = str(primary_user["_id"])
        
#         # ============================================
#         # STEP 2: Store incoming message for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             sms_data = {
#                 "user_id": uid,
#                 "to_number": to_number,
#                 "from_number": from_number,
#                 "message": body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "twilio_sid": message_sid,
#                 "twilio_status": sms_status,
#                 "campaign_id": campaign_id,  # 🆕 Track campaign
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(sms_data.copy())
            
#             sms_log_data = sms_data.copy()
#             sms_log_data["is_reply"] = True if campaign_id else False  # 🆕 Mark as reply if from campaign
#             sms_log_data["has_replies"] = False
#             sms_log_data["reply_count"] = 0
            
#             await db.sms_logs.insert_one(sms_log_data)
        
#         logger.info(f"✅ Incoming message stored for {len(users)} users")
        
#         # ============================================
#         # STEP 3: Generate AI Response
#         # ============================================
        
#         ai_message = None
#         source = "none"
        
#         # Get conversation state
#         conversation_state = await _get_conversation_state(from_number, user_id, db)
        
#         # PRIORITY 1: Handle Active Appointment Booking
#         if conversation_state.get("booking_in_progress"):
#             logger.info("📅 Continuing appointment booking...")
            
#             booking_result = await _process_appointment_booking(
#                 body, conversation_state, user_id, from_number, db
#             )
            
#             ai_message = booking_result["response"]
#             source = "appointment_booking"
        
#         # PRIORITY 2: Check if User Wants to Book
#         elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
#             logger.info("📅 Starting new appointment booking...")
            
#             await _update_conversation_state(
#                 from_number, user_id,
#                 {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
#                 db
#             )
            
#             ai_message = "Great! I can help you book an appointment. First, may I have your name?"
#             source = "appointment_booking"
        
#         # PRIORITY 3: Check Campaign Builder
#         else:
#             campaign_match = await _match_campaign_workflow(
#                 user_input=body,
#                 user_id=user_id,
#                 db=db
#             )
            
#             if campaign_match and campaign_match.get("found"):
#                 ai_message = campaign_match["response"]
#                 source = "campaign"
#                 logger.info(f"✅ Using Campaign: {campaign_match['workflow_name']}")
            
#             # PRIORITY 4: Use OpenAI
#             else:
#                 logger.info(f"🤖 Using OpenAI")
                
#                 try:
#                     history_cursor = db.sms_logs.find({
#                         "user_id": user_id,
#                         "$or": [
#                             {"to_number": from_number},
#                             {"from_number": from_number}
#                         ]
#                     }).sort("created_at", -1).limit(10)
                    
#                     history = await history_cursor.to_list(length=10)
#                     history.reverse()
                    
#                     conversation_context = []
#                     for msg in history:
#                         role = "user" if msg["direction"] == "inbound" else "assistant"
#                         conversation_context.append({
#                             "role": role,
#                             "content": msg["message"]
#                         })
                    
#                     conversation_context.append({
#                         "role": "user",
#                         "content": body
#                     })
                    
#                     ai_response = await openai_service.generate_chat_response(
#                         messages=conversation_context,
#                         system_prompt="""You are a helpful AI assistant for a call center business. 
#                         You help answer customer questions about services, pricing, appointments, and general inquiries.
#                         Be professional, friendly, and helpful. Keep responses under 150 words."""
#                     )
                    
#                     if ai_response.get("success"):
#                         ai_message = ai_response.get("response", "I'm here to help! How can I assist you?")
#                         source = "openai"
#                     else:
#                         ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                         source = "fallback"
#                 except Exception as e:
#                     logger.error(f"OpenAI error: {e}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
        
#         logger.info(f"📤 AI Response ({source}): {ai_message[:100]}...")
        
#         # ============================================
#         # STEP 4: Send AI response via Twilio
#         # ============================================
        
#         twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
#         try:
#             send_result = await sms_service.send_sms(
#                 to_number=from_number,
#                 message=ai_message,
#                 from_number=twilio_phone,
#                 user_id=user_id,
#                 campaign_id=campaign_id  # 🆕 Include campaign tracking in response
#             )
            
#             if send_result.get("success"):
#                 logger.info(f"✅ AI response sent to customer")
#             else:
#                 logger.error(f"❌ Failed to send: {send_result.get('error')}")
#         except Exception as e:
#             logger.error(f"❌ Error sending SMS: {e}")
        
#         # ============================================
#         # STEP 5: Store AI response for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             ai_sms_data = {
#                 "user_id": uid,
#                 "to_number": from_number,
#                 "from_number": twilio_phone,
#                 "message": ai_message,
#                 "status": "sent",
#                 "direction": "outbound",
#                 "campaign_id": campaign_id,  # 🆕 Track campaign in response
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(ai_sms_data.copy())
            
#             ai_sms_log = ai_sms_data.copy()
#             ai_sms_log["is_reply"] = True
#             ai_sms_log["has_replies"] = False
#             ai_sms_log["reply_count"] = 0
            
#             await db.sms_logs.insert_one(ai_sms_log)
        
#         logger.info(f"✅ Complete! ({source})")
        
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Webhook error: {e}")
#         import traceback
#         traceback.print_exc()
#         return Response(
#         content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#         media_type="application/xml",
#         status_code=500
#     )

# # backend/app/api/v1/sms.py with custom ai prompt 
# from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
# from fastapi.responses import Response
# from typing import Optional, List, Dict, Any
# from datetime import datetime, timedelta
# from bson import ObjectId
# import logging
# import os
# import re

# from app.api.deps import get_current_user, get_database
# from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
# from app.services.sms import sms_service
# from app.services.openai import openai_service
# from app.services.email_automation import email_automation_service
# from app.services.google_calendar import google_calendar_service

# router = APIRouter()
# logger = logging.getLogger(__name__)


# @router.post("/send", response_model=dict)
# async def send_sms(
#     sms_data: SMSSendRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_sms(
#             to_number=sms_data.to_number,
#             message=sms_data.message,
#             from_number=sms_data.from_number,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to send SMS")
#             )
        
#         logger.info(f"SMS sent to {sms_data.to_number}")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/bulk-send", response_model=dict)
# async def send_bulk_sms(
#     bulk_sms_data: SMSBulkRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Send bulk SMS messages"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await sms_service.send_bulk_sms(
#             to_numbers=bulk_sms_data.to_numbers,
#             message=bulk_sms_data.message,
#             from_number=bulk_sms_data.from_number,
#             user_id=user_id,
#             batch_size=bulk_sms_data.batch_size
#         )
        
#         logger.info(f"Bulk SMS sent: {result['results']['sent']} successful, {result['results']['failed']} failed")
        
#         return result
        
#     except Exception as e:
#         logger.error(f"Error sending bulk SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/", response_model=List[SMSResponse])
# async def list_sms(
#     current_user: dict = Depends(get_current_user),
#     skip: int = 0,
#     limit: int = 50,
#     direction: Optional[str] = None,
#     status_filter: Optional[str] = Query(None, alias="status")
# ):
#     """Get SMS message list"""
#     try:
#         user_id = str(current_user["_id"])
        
#         messages = await sms_service.get_sms_list(
#             user_id=user_id,
#             skip=skip,
#             limit=limit,
#             direction=direction,
#             status=status_filter
#         )
        
#         return messages
        
#     except Exception as e:
#         logger.error(f"Error getting SMS list: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats/summary", response_model=SMSStatsResponse)
# async def get_sms_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get SMS statistics"""
#     try:
#         user_id = str(current_user["_id"])
        
#         stats = await sms_service.get_sms_stats(user_id=user_id)
        
#         return stats
        
#     except Exception as e:
#         logger.error(f"Error getting SMS stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{sms_id}", response_model=dict)
# async def delete_sms(
#     sms_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete an SMS message"""
#     try:
#         user_id = str(current_user["_id"])
        
#         success = await sms_service.delete_sms(sms_id, user_id)
        
#         if not success:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="SMS message not found"
#             )
        
#         logger.info(f"Deleted SMS {sms_id}")
        
#         return {"message": "SMS deleted successfully"}
        
#     except Exception as e:
#         logger.error(f"Error deleting SMS: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ============================================
# # HELPER FUNCTIONS (FROM sms_chat.py)
# # ============================================

# async def _get_conversation_state(phone_number: str, user_id: str, db) -> Dict:
#     """Get conversation state for appointment booking"""
#     try:
#         state = await db.sms_conversation_states.find_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
        
#         if not state:
#             return {
#                 "phone_number": phone_number,
#                 "user_id": user_id,
#                 "booking_in_progress": False,
#                 "current_step": None,
#                 "collected_data": {}
#             }
        
#         return state
#     except Exception as e:
#         logger.error(f"Error getting conversation state: {e}")
#         return {
#             "phone_number": phone_number,
#             "user_id": user_id,
#             "booking_in_progress": False,
#             "current_step": None,
#             "collected_data": {}
#         }


# async def _update_conversation_state(phone_number: str, user_id: str, updates: Dict, db):
#     """Update conversation state"""
#     try:
#         await db.sms_conversation_states.update_one(
#             {"phone_number": phone_number, "user_id": user_id},
#             {"$set": {**updates, "updated_at": datetime.utcnow()}},
#             upsert=True
#         )
#     except Exception as e:
#         logger.error(f"Error updating conversation state: {e}")


# async def _clear_conversation_state(phone_number: str, user_id: str, db):
#     """Clear conversation state"""
#     try:
#         await db.sms_conversation_states.delete_one({
#             "phone_number": phone_number,
#             "user_id": user_id
#         })
#     except Exception as e:
#         logger.error(f"Error clearing conversation state: {e}")


# def _extract_name(text: str) -> Optional[str]:
#     """Extract name from text"""
#     text = text.strip()
    
#     # Skip if too short or too long
#     if len(text) < 2 or len(text) > 50:
#         return None
    
#     # Simple extraction - take first 2-3 words as name
#     words = text.split()[:3]
#     name = " ".join(words)
    
#     # Capitalize properly
#     name = " ".join([word.capitalize() for word in name.split()])
    
#     return name if len(name) >= 2 else None


# def _extract_email(text: str) -> Optional[str]:
#     """Extract email from text"""
#     email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#     match = re.search(email_pattern, text)
#     return match.group(0).lower() if match else None


# def _extract_phone(text: str) -> Optional[str]:
#     """Extract phone number from text"""
#     phone_pattern = r'(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
#     match = re.search(phone_pattern, text)
    
#     if match:
#         groups = match.groups()
#         phone = f"+1{groups[1]}{groups[2]}{groups[3]}"
#         return phone
    
#     return None


# def _extract_service(text: str) -> Optional[str]:
#     """Extract service type from text"""
#     services = [
#         "power washing",
#         "christmas lights installation",
#         "house painting",
#         "general maintenance",
#         "window cleaning",
#         "gutter cleaning",
#         "landscaping",
#         "pressure washing"
#     ]
    
#     text_lower = text.lower()
    
#     for service in services:
#         if service in text_lower:
#             return service.title()
    
#     return None


# def _extract_date_time(text: str) -> Optional[datetime]:
#     """Extract date and time from text (SIMPLIFIED VERSION FROM sms_chat.py)"""
#     try:
#         now = datetime.utcnow()
#         text_lower = text.lower()
        
#         # Day name mapping
#         days_map = {
#             "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
#             "friday": 4, "saturday": 5, "sunday": 6
#         }
        
#         # Extract time
#         time_pattern = r'(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?'
#         time_match = re.search(time_pattern, text_lower)
        
#         hour = 10
#         minute = 0
        
#         if time_match:
#             hour = int(time_match.group(1))
#             minute = int(time_match.group(2) or 0)
#             meridiem = time_match.group(3)
            
#             if meridiem and ('pm' in meridiem or 'p.m' in meridiem):
#                 if hour != 12:
#                     hour += 12
#             elif meridiem and ('am' in meridiem or 'a.m' in meridiem) and hour == 12:
#                 hour = 0
        
#         # Determine base date
#         base_date = None
        
#         if "tomorrow" in text_lower:
#             base_date = now + timedelta(days=1)
#         elif "today" in text_lower:
#             base_date = now
#         elif "next week" in text_lower:
#             base_date = now + timedelta(days=7)
#         else:
#             for day_name, target_weekday in days_map.items():
#                 if day_name in text_lower:
#                     current_weekday = now.weekday()
#                     days_ahead = (target_weekday - current_weekday) % 7
                    
#                     if "next" in text_lower and days_ahead == 0:
#                         days_ahead = 7
#                     elif days_ahead == 0:
#                         days_ahead = 7
                    
#                     base_date = now + timedelta(days=days_ahead)
#                     break
        
#         if not base_date:
#             base_date = now + timedelta(days=1)
        
#         appointment_datetime = base_date.replace(
#             hour=hour,
#             minute=minute,
#             second=0,
#             microsecond=0
#         )
        
#         logger.info(f"✅ Parsed datetime: {appointment_datetime.strftime('%A, %B %d, %Y at %I:%M %p UTC')}")
        
#         return appointment_datetime
        
#     except Exception as e:
#         logger.error(f"Error extracting date/time: {e}")
#         return None


# async def _process_appointment_booking(
#     user_message: str,
#     conversation_state: Dict,
#     user_id: str,
#     phone_number: str,
#     db
# ) -> Dict:
#     """Process appointment booking conversation (FROM sms_chat.py)"""
#     try:
#         collected_data = conversation_state.get("collected_data", {})
        
#         logger.info(f"\n📅 Appointment Booking")
#         logger.info(f"   Collected: {list(collected_data.keys())}")
        
#         # Step 1: Collect name
#         if not collected_data.get("name"):
#             name = _extract_name(user_message)
#             if name:
#                 collected_data["name"] = name
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "name"},
#                     db
#                 )
#                 return {
#                     "response": f"Thank you, {name}! What's your email address so I can send you a confirmation?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't catch your name. Could you please tell me your name?",
#                     "booking_complete": False
#                 }
        
#         # Step 2: Collect email
#         elif not collected_data.get("email"):
#             email = _extract_email(user_message)
#             if email:
#                 collected_data["email"] = email
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "email"},
#                     db
#                 )
#                 return {
#                     "response": "Great! We offer the following services:\n- Power Washing\n- Christmas Lights Installation\n- House Painting\n- General Maintenance\n\nWhich service would you like?",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "I didn't find a valid email address. Could you please provide your email?",
#                     "booking_complete": False
#                 }
        
#         # Step 3: Collect service
#         elif not collected_data.get("service"):
#             service = _extract_service(user_message)
#             if service:
#                 collected_data["service"] = service
#                 await _update_conversation_state(
#                     phone_number, user_id,
#                     {"collected_data": collected_data, "current_step": "service"},
#                     db
#                 )
#                 return {
#                     "response": f"Perfect! When would you like to schedule {service}? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
#             else:
#                 return {
#                     "response": "Which service would you like? (Power Washing, Christmas Lights, House Painting, or General Maintenance)",
#                     "booking_complete": False
#                 }
        
#         # Step 4: Collect date/time and complete booking
#         elif not collected_data.get("date"):
#             appointment_date = _extract_date_time(user_message)
#             if appointment_date:
#                 collected_data["date"] = appointment_date.isoformat()
                
#                 # Create appointment
#                 customer_name = collected_data["name"]
#                 customer_email = collected_data["email"]
#                 service_type = collected_data["service"]
                
#                 # Create Google Calendar event
#                 try:
#                     appointment_time = appointment_date.strftime("%H:%M")
                    
#                     event = await google_calendar_service.create_event(
#                         customer_name=customer_name,
#                         customer_email=customer_email,
#                         customer_phone=phone_number,
#                         appointment_date=appointment_date,
#                         appointment_time=appointment_time,
#                         duration_minutes=60,
#                         service_type=service_type,
#                         notes=None
#                     )
#                     event_id = event.get("event_id") if event.get("success") else None
#                     logger.info(f"✅ Calendar event created: {event_id}")
#                 except Exception as e:
#                     logger.error(f"Calendar error: {e}")
#                     event_id = None
                
#                 # Store in database
#                 appointment_data = {
#                     "user_id": user_id,
#                     "customer_name": customer_name,
#                     "customer_email": customer_email,
#                     "customer_phone": phone_number,
#                     "service_type": service_type,
#                     "appointment_date": appointment_date,
#                     "google_calendar_event_id": event_id,
#                     "status": "confirmed",
#                     "created_at": datetime.utcnow()
#                 }
                
#                 appointment_result = await db.appointments.insert_one(appointment_data)
#                 appointment_id = str(appointment_result.inserted_id)
                
#                 # Send confirmation email
#                 try:
#                     formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                    
#                     await email_automation_service.send_appointment_confirmation(
#                         to_email=customer_email,
#                         customer_name=customer_name,
#                         customer_phone=phone_number,
#                         service_type=service_type,
#                         appointment_date=formatted_date,
#                         user_id=user_id,
#                         appointment_id=appointment_id,
#                         call_id=None
#                     )
                    
#                     logger.info(f"✅ Confirmation email sent")
#                 except Exception as e:
#                     logger.error(f"Email error: {e}")
                
#                 # Clear conversation state
#                 await _clear_conversation_state(phone_number, user_id, db)
                
#                 date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
#                 response = f"Perfect! Your appointment is confirmed for {date_str}. I've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
                
#                 return {
#                     "response": response,
#                     "booking_complete": True
#                 }
#             else:
#                 return {
#                     "response": "I didn't understand the date/time. Could you try again? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
        
#         # Fallback
#         return {
#             "response": "Let me help you complete your booking. What information do you still need to provide?",
#             "booking_complete": False
#         }
        
#     except Exception as e:
#         logger.error(f"Error in appointment booking: {e}", exc_info=True)
#         await _clear_conversation_state(phone_number, user_id, db)
#         return {
#             "response": "I apologize, but there was an error. Please try booking again.",
#             "booking_complete": False
#         }


# async def _match_campaign_workflow(user_input: str, user_id: str, db) -> Optional[Dict]:
#     """Match user input against Campaign Builder workflows (FROM sms_chat.py)"""
#     try:
#         workflows_cursor = db.flows.find({
#             "user_id": user_id,
#             "active": True
#         })
#         workflows = await workflows_cursor.to_list(length=None)
        
#         if not workflows:
#             return None
        
#         user_input_lower = user_input.lower().strip()
        
#         logger.info(f"🔍 Checking {len(workflows)} campaigns for match")
        
#         for workflow in workflows:
#             workflow_name = workflow.get("name", "Unnamed")
#             nodes = workflow.get("nodes", [])
            
#             for node in nodes:
#                 node_data = node.get("data", {})
#                 node_message = node_data.get("message", "")
#                 node_transitions = node_data.get("transitions", [])
                
#                 if not node_transitions or not node_message:
#                     continue
                
#                 for keyword in node_transitions:
#                     if not keyword:
#                         continue
                    
#                     keyword_clean = str(keyword).strip().lower()
                    
#                     if keyword_clean and keyword_clean in user_input_lower:
#                         logger.info(f"✅ Campaign match: '{keyword_clean}' in workflow '{workflow_name}'")
                        
#                         return {
#                             "found": True,
#                             "response": node_message,
#                             "workflow_id": str(workflow["_id"]),
#                             "workflow_name": workflow_name,
#                             "node_id": node.get("id"),
#                             "matched_keyword": keyword_clean
#                         }
        
#         logger.info(f"❌ No campaign match")
#         return None
        
#     except Exception as e:
#         logger.error(f"Campaign matching error: {e}")
#         return None


# # ============================================
# # ✅ SMS WEBHOOK WITH CUSTOM AI SCRIPT SUPPORT
# # ============================================

# @router.post("/webhook")
# async def sms_webhook(
#     request: Request,
#     db = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming SMS webhook with:
#     - 🆕 Custom AI script from campaign (Priority 0)
#     - Priority 1: Appointment booking flow
#     - Priority 2: Campaign Builder responses
#     - Priority 3: OpenAI fallback
#     """
#     try:
#         # Extract Twilio form data
#         form_data = await request.form()
        
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         body = form_data.get("Body")
#         message_sid = form_data.get("MessageSid")
#         sms_status = form_data.get("SmsStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📨 INCOMING SMS WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Message: {body}")
#         logger.info(f"{'='*80}\n")
        
#         # ============================================
#         # 🆕 STEP 0: Check if reply is from bulk campaign
#         # ============================================
        
#         campaign_id = None
#         original_campaign = None
#         custom_ai_script = None  # 🆕 STORE CUSTOM SCRIPT
        
#         try:
#             # Find if this customer received a message from a campaign
#             original_sms = await db.sms_messages.find_one({
#                 "to_number": from_number,
#                 "direction": "outbound",
#                 "campaign_id": {"$exists": True, "$ne": None}
#             }, sort=[("created_at", -1)])  # Get most recent
            
#             if original_sms:
#                 campaign_id = original_sms.get("campaign_id")
                
#                 # Get campaign details
#                 original_campaign = await db.sms_campaigns.find_one({
#                     "campaign_id": campaign_id
#                 })
                
#                 if original_campaign:
#                     logger.info(f"🎯 Reply is from bulk campaign: {campaign_id}")
                    
#                     # 🆕 GET CUSTOM AI SCRIPT FROM CAMPAIGN
#                     custom_ai_script = original_campaign.get("custom_ai_script")
                    
#                     if custom_ai_script:
#                         logger.info(f"📝 Custom AI script found for campaign: {len(custom_ai_script)} chars")
                    
#                     # Update campaign recipient status
#                     await db.sms_campaigns.update_one(
#                         {
#                             "_id": original_campaign["_id"],
#                             "recipients.phone_number": from_number
#                         },
#                         {
#                             "$set": {
#                                 "recipients.$.status": "replied"
#                             }
#                         }
#                     )
#                     logger.info(f"✅ Updated campaign recipient status to 'replied'")
#         except Exception as e:
#             logger.warning(f"⚠️ Error checking campaign: {e}")
        
#         # ============================================
#         # STEP 1: Get ALL active users
#         # ============================================
        
#         users_cursor = db.users.find({"is_active": True})
#         users = await users_cursor.to_list(length=None)
        
#         if not users:
#             logger.warning("⚠️ No active users found")
#             return Response(
#                 content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#                 media_type="application/xml"
#             )
        
#         primary_user = users[0]
#         user_id = str(primary_user["_id"])
        
#         # ============================================
#         # STEP 2: Store incoming message for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             sms_data = {
#                 "user_id": uid,
#                 "to_number": to_number,
#                 "from_number": from_number,
#                 "message": body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "twilio_sid": message_sid,
#                 "twilio_status": sms_status,
#                 "campaign_id": campaign_id,  # 🆕 Track campaign
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(sms_data.copy())
            
#             sms_log_data = sms_data.copy()
#             sms_log_data["is_reply"] = True if campaign_id else False  # 🆕 Mark as reply if from campaign
#             sms_log_data["has_replies"] = False
#             sms_log_data["reply_count"] = 0
            
#             await db.sms_logs.insert_one(sms_log_data)
        
#         logger.info(f"✅ Incoming message stored for {len(users)} users")
        
#         # ============================================
#         # STEP 3: Generate AI Response
#         # ============================================
        
#         ai_message = None
#         source = "none"
        
#         # Get conversation state
#         conversation_state = await _get_conversation_state(from_number, user_id, db)
        
#         # ============================================
#         # 🆕 PRIORITY 0: Use Custom AI Script (if from campaign)
#         # ============================================
#         if custom_ai_script and not conversation_state.get("booking_in_progress"):
#             logger.info("🎯 PRIORITY 0: Using custom campaign AI script")
            
#             # Check if appointment booking keywords
#             if any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
#                 logger.info("📅 Switching to appointment booking...")
                
#                 await _update_conversation_state(
#                     from_number, user_id,
#                     {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
#                     db
#                 )
                
#                 ai_message = "Great! I can help you book an appointment. First, may I have your name?"
#                 source = "appointment_booking"
            
#             else:
#                 # Use custom script with OpenAI
#                 try:
#                     history_cursor = db.sms_logs.find({
#                         "user_id": user_id,
#                         "$or": [
#                             {"to_number": from_number},
#                             {"from_number": from_number}
#                         ]
#                     }).sort("created_at", -1).limit(10)
                    
#                     history = await history_cursor.to_list(length=10)
#                     history.reverse()
                    
#                     conversation_context = []
#                     for msg in history:
#                         role = "user" if msg["direction"] == "inbound" else "assistant"
#                         conversation_context.append({
#                             "role": role,
#                             "content": msg["message"]
#                         })
                    
#                     conversation_context.append({
#                         "role": "user",
#                         "content": body
#                     })
                    
#                     # 🆕 USE CUSTOM AI SCRIPT AS SYSTEM PROMPT
#                     ai_response = await openai_service.generate_chat_response(
#                         messages=conversation_context,
#                         system_prompt=custom_ai_script  # 🆕 CUSTOM SCRIPT HERE
#                     )
                    
#                     if ai_response.get("success"):
#                         ai_message = ai_response.get("response", "Thank you for your message!")
#                         source = "custom_ai_script"
#                         logger.info(f"✅ Custom AI script response generated")
#                     else:
#                         ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                         source = "fallback"
#                 except Exception as e:
#                     logger.error(f"Custom AI script error: {e}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
        
#         # ============================================
#         # PRIORITY 1: Handle Active Appointment Booking
#         # ============================================
#         elif conversation_state.get("booking_in_progress"):
#             logger.info("📅 Continuing appointment booking...")
            
#             booking_result = await _process_appointment_booking(
#                 body, conversation_state, user_id, from_number, db
#             )
            
#             ai_message = booking_result["response"]
#             source = "appointment_booking"
        
#         # ============================================
#         # PRIORITY 2: Check if User Wants to Book
#         # ============================================
#         elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
#             logger.info("📅 Starting new appointment booking...")
            
#             await _update_conversation_state(
#                 from_number, user_id,
#                 {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
#                 db
#             )
            
#             ai_message = "Great! I can help you book an appointment. First, may I have your name?"
#             source = "appointment_booking"
        
#         # ============================================
#         # PRIORITY 3: Check Campaign Builder
#         # ============================================
#         elif not ai_message:  # Only if not already handled by custom script
#             campaign_match = await _match_campaign_workflow(
#                 user_input=body,
#                 user_id=user_id,
#                 db=db
#             )
            
#             if campaign_match and campaign_match.get("found"):
#                 ai_message = campaign_match["response"]
#                 source = "campaign"
#                 logger.info(f"✅ Using Campaign: {campaign_match['workflow_name']}")
            
#             # ============================================
#             # PRIORITY 4: Use OpenAI (default)
#             # ============================================
#             else:
#                 logger.info(f"🤖 Using default OpenAI")
                
#                 try:
#                     history_cursor = db.sms_logs.find({
#                         "user_id": user_id,
#                         "$or": [
#                             {"to_number": from_number},
#                             {"from_number": from_number}
#                         ]
#                     }).sort("created_at", -1).limit(10)
                    
#                     history = await history_cursor.to_list(length=10)
#                     history.reverse()
                    
#                     conversation_context = []
#                     for msg in history:
#                         role = "user" if msg["direction"] == "inbound" else "assistant"
#                         conversation_context.append({
#                             "role": role,
#                             "content": msg["message"]
#                         })
                    
#                     conversation_context.append({
#                         "role": "user",
#                         "content": body
#                     })
                    
#                     ai_response = await openai_service.generate_chat_response(
#                         messages=conversation_context,
#                         system_prompt="""You are a helpful AI assistant for a call center business. 
#                         You help answer customer questions about services, pricing, appointments, and general inquiries.
#                         Be professional, friendly, and helpful. Keep responses under 150 words."""
#                     )
                    
#                     if ai_response.get("success"):
#                         ai_message = ai_response.get("response", "I'm here to help! How can I assist you?")
#                         source = "openai"
#                     else:
#                         ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                         source = "fallback"
#                 except Exception as e:
#                     logger.error(f"OpenAI error: {e}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
        
#         logger.info(f"📤 AI Response ({source}): {ai_message[:100]}...")
        
#         # ============================================
#         # STEP 4: Send AI response via Twilio
#         # ============================================
        
#         twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
#         try:
#             send_result = await sms_service.send_sms(
#                 to_number=from_number,
#                 message=ai_message,
#                 from_number=twilio_phone,
#                 user_id=user_id,
#                 campaign_id=campaign_id  # 🆕 Include campaign tracking in response
#             )
            
#             if send_result.get("success"):
#                 logger.info(f"✅ AI response sent to customer")
#             else:
#                 logger.error(f"❌ Failed to send: {send_result.get('error')}")
#         except Exception as e:
#             logger.error(f"❌ Error sending SMS: {e}")
        
#         # ============================================
#         # STEP 5: Store AI response for ALL users
#         # ============================================
        
#         for user in users:
#             uid = str(user["_id"])
            
#             ai_sms_data = {
#                 "user_id": uid,
#                 "to_number": from_number,
#                 "from_number": twilio_phone,
#                 "message": ai_message,
#                 "status": "sent",
#                 "direction": "outbound",
#                 "campaign_id": campaign_id,  # 🆕 Track campaign in response
#                 "created_at": datetime.utcnow()
#             }
            
#             await db.sms_messages.insert_one(ai_sms_data.copy())
            
#             ai_sms_log = ai_sms_data.copy()
#             ai_sms_log["is_reply"] = True
#             ai_sms_log["has_replies"] = False
#             ai_sms_log["reply_count"] = 0
            
#             await db.sms_logs.insert_one(ai_sms_log)
        
#         logger.info(f"✅ Complete! ({source})")
        
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml"
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Webhook error: {e}")
#         import traceback
#         traceback.print_exc()
#         return Response(
#             content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
#             media_type="application/xml",
#             status_code=500
#         )

# backend/app/api/v1/sms.py - ✅ COMPLETE FILE WITH HISTORY CLEARING FOR CUSTOM SCRIPTS

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import Response
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import os

from app.database import get_database
from app.api.deps import get_current_user
from app.schemas.sms import SMSSendRequest, SMSBulkRequest, SMSResponse, SMSStatsResponse
from app.services.sms import sms_service
from app.services.openai import openai_service
from bson import ObjectId

router = APIRouter()
logger = logging.getLogger(__name__)


# ============================================
# HELPER: Get conversation state
# ============================================
async def _get_conversation_state(phone_number: str, user_id: str, db) -> Dict[str, Any]:
    """Get conversation state for appointment booking"""
    state = await db.conversation_states.find_one({
        "phone_number": phone_number,
        "user_id": user_id
    })
    
    if not state:
        return {
            "booking_in_progress": False,
            "current_step": None,
            "collected_data": {}
        }
    
    return state


# ============================================
# HELPER: Update conversation state
# ============================================
async def _update_conversation_state(
    phone_number: str, 
    user_id: str, 
    updates: Dict[str, Any], 
    db
):
    """Update conversation state"""
    updates["updated_at"] = datetime.utcnow()
    
    await db.conversation_states.update_one(
        {"phone_number": phone_number, "user_id": user_id},
        {"$set": updates},
        upsert=True
    )


# ============================================
# HELPER: Process appointment booking
# ============================================
async def _process_appointment_booking(
    user_message: str,
    conversation_state: Dict[str, Any],
    user_id: str,
    phone_number: str,
    db
) -> Dict[str, Any]:
    """Process appointment booking flow"""
    from app.services.appointment import appointment_service
    from app.services.email_automation import email_automation_service
    
    current_step = conversation_state.get("current_step", "start")
    collected_data = conversation_state.get("collected_data", {})
    
    logger.info(f"📅 Appointment Booking Step: {current_step}")
    logger.info(f"   Collected so far: {list(collected_data.keys())}")
    
    # Step 1: Get name
    if current_step == "start":
        collected_data["name"] = user_message.strip()
        
        await _update_conversation_state(
            phone_number, user_id,
            {"current_step": "get_email", "collected_data": collected_data},
            db
        )
        
        return {
            "response": f"Great, {collected_data['name']}! What's your email address?"
        }
    
    # Step 2: Get email
    elif current_step == "get_email":
        collected_data["email"] = user_message.strip()
        
        await _update_conversation_state(
            phone_number, user_id,
            {"current_step": "get_service", "collected_data": collected_data},
            db
        )
        
        return {
            "response": "Perfect! What service are you interested in? (e.g., consultation, cleaning, repair)"
        }
    
    # Step 3: Get service
    elif current_step == "get_service":
        collected_data["service"] = user_message.strip()
        
        await _update_conversation_state(
            phone_number, user_id,
            {"current_step": "get_datetime", "collected_data": collected_data},
            db
        )
        
        return {
            "response": "When would you like to schedule? (e.g., 'tomorrow at 2pm', 'Friday at 10am')"
        }
    
    # Step 4: Get date/time and create appointment
    elif current_step == "get_datetime":
        from app.services.google_calendar import google_calendar_service
        import dateparser
        
        parsed_date = dateparser.parse(
            user_message,
            settings={'PREFER_DATES_FROM': 'future', 'TIMEZONE': 'UTC'}
        )
        
        if not parsed_date:
            return {
                "response": "I couldn't understand that date. Please try again with something like 'tomorrow at 2pm' or 'Friday at 10am'."
            }
        
        # Create appointment
        try:
            appointment_result = await appointment_service.book_appointment(
                user_id=user_id,
                customer_name=collected_data["name"],
                customer_email=collected_data["email"],
                customer_phone=phone_number,
                appointment_date=parsed_date,
                appointment_time=parsed_date.strftime("%H:%M"),
                service_type=collected_data["service"],
                duration_minutes=60,
                notes="Booked via SMS"
            )
            
            if appointment_result.get("success"):
                # Clear conversation state
                await _update_conversation_state(
                    phone_number, user_id,
                    {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                    db
                )
                
                formatted_date = parsed_date.strftime("%A, %B %d at %I:%M %p")
                
                return {
                    "response": f"Perfect! Your appointment for {collected_data['service']} is confirmed for {formatted_date}. I've sent a confirmation email to {collected_data['email']}. Looking forward to seeing you!"
                }
            else:
                return {
                    "response": f"I'm having trouble booking that time. Please try a different time or call us directly."
                }
        
        except Exception as e:
            logger.error(f"Appointment booking error: {e}")
            return {
                "response": "I apologize, there was an error booking your appointment. Please try again or contact us directly."
            }
    
    return {
        "response": "I'm here to help! How can I assist you?"
    }


# ============================================
# HELPER: Match Campaign Builder workflow
# ============================================
async def _match_campaign_workflow(user_input: str, user_id: str, db) -> Optional[Dict]:
    """Match user input against Campaign Builder workflows"""
    try:
        workflows_cursor = db.flows.find({
            "user_id": user_id,
            "active": True
        })
        workflows = await workflows_cursor.to_list(length=None)
        
        if not workflows:
            return None
        
        user_input_lower = user_input.lower().strip()
        
        for workflow in workflows:
            workflow_name = workflow.get("name", "Unnamed")
            nodes = workflow.get("nodes", [])
            
            for node in nodes:
                node_data = node.get("data", {})
                node_message = node_data.get("message", "")
                node_transitions = node_data.get("transitions", [])
                
                if not node_transitions or not node_message:
                    continue
                
                for keyword in node_transitions:
                    if not keyword:
                        continue
                    
                    keyword_clean = str(keyword).strip().lower()
                    
                    if keyword_clean and keyword_clean in user_input_lower:
                        logger.info(f"✅ Campaign match: '{keyword_clean}'")
                        
                        return {
                            "found": True,
                            "response": node_message,
                            "workflow_id": str(workflow["_id"]),
                            "workflow_name": workflow_name,
                            "node_id": node.get("id"),
                            "matched_keyword": keyword_clean
                        }
        
        logger.info(f"❌ No campaign match")
        return None
        
    except Exception as e:
        logger.error(f"Campaign matching error: {e}")
        return None


# ============================================
# ✅ SMS WEBHOOK WITH IMPROVED CUSTOM SCRIPT HANDLING
# ============================================

@router.post("/webhook")
async def sms_webhook(
    request: Request,
    db = Depends(get_database)
):
    """
    ✅ Handle incoming SMS webhook with:
    - 🆕 Custom AI script from campaign (Priority 0)
    - Priority 1: Appointment booking flow
    - Priority 2: Campaign Builder responses
    - Priority 3: OpenAI fallback
    """
    try:
        # Extract Twilio form data
        form_data = await request.form()
        
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        body = form_data.get("Body")
        message_sid = form_data.get("MessageSid")
        sms_status = form_data.get("SmsStatus")
        
        logger.info(f"\n{'='*80}")
        logger.info(f"📨 INCOMING SMS WEBHOOK")
        logger.info(f"{'='*80}")
        logger.info(f"   From: {from_number}")
        logger.info(f"   To: {to_number}")
        logger.info(f"   Message: {body}")
        logger.info(f"{'='*80}\n")
        
        # ============================================
        # 🆕 STEP 0: Check if reply is from bulk campaign
        # ============================================
        
        campaign_id = None
        original_campaign = None
        custom_ai_script = None  # 🆕 STORE CUSTOM SCRIPT
        
        try:
            # Find if this customer received a message from a campaign
            original_sms = await db.sms_messages.find_one({
                "to_number": from_number,
                "direction": "outbound",
                "campaign_id": {"$exists": True, "$ne": None}
            }, sort=[("created_at", -1)])  # Get most recent
            
            if original_sms:
                campaign_id = original_sms.get("campaign_id")
                
                # Get campaign details
                original_campaign = await db.sms_campaigns.find_one({
                    "campaign_id": campaign_id
                })
                
                if original_campaign:
                    logger.info(f"🎯 Reply is from bulk campaign: {campaign_id}")
                    
                    # 🆕 GET CUSTOM AI SCRIPT FROM CAMPAIGN
                    custom_ai_script = original_campaign.get("custom_ai_script")
                    
                    if custom_ai_script:
                        # ✅ ENSURE IT'S A VALID STRING
                        custom_ai_script = str(custom_ai_script).strip()
                        
                        if len(custom_ai_script) >= 10:
                            logger.info(f"📝 Custom AI script found: {len(custom_ai_script)} characters")
                            logger.info(f"   First 100 chars: {custom_ai_script[:100]}...")
                            
                            # ✅ 🆕 CLEAR OLD CONVERSATION HISTORY FOR FRESH START
                            logger.info(f"🧹 Clearing old conversation history for fresh start with custom script")
                            
                            delete_result = await db.sms_logs.delete_many({
                                "$or": [
                                    {"to_number": from_number},
                                    {"from_number": from_number}
                                ]
                            })
                            
                            logger.info(f"   ✅ Deleted {delete_result.deleted_count} old messages from history")
                        else:
                            logger.warning(f"⚠️ Custom AI script too short ({len(custom_ai_script)} chars), ignoring")
                            custom_ai_script = None
                    else:
                        logger.info(f"ℹ️ No custom AI script for this campaign")
                    
                    # Update campaign recipient status
                    await db.sms_campaigns.update_one(
                        {
                            "_id": original_campaign["_id"],
                            "recipients.phone_number": from_number
                        },
                        {
                            "$set": {
                                "recipients.$.status": "replied"
                            }
                        }
                    )
        except Exception as e:
            logger.warning(f"Error checking campaign: {e}")
        
        # ============================================
        # STEP 1: Find users and store incoming SMS
        # ============================================
        
        users = await db.users.find({"role": {"$ne": "admin"}}).to_list(length=100)
        
        if not users:
            logger.warning("⚠️ No users found")
            return Response(
                content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
                media_type="application/xml"
            )
        
        # Store incoming SMS for ALL users
        for user in users:
            user_id = str(user["_id"])
            
            sms_data = {
                "user_id": user_id,
                "to_number": to_number,
                "from_number": from_number,
                "message": body,
                "status": "received",
                "direction": "inbound",
                "twilio_sid": message_sid,
                "twilio_status": sms_status,
                "campaign_id": campaign_id,
                "created_at": datetime.utcnow()
            }
            
            await db.sms_messages.insert_one(sms_data.copy())
            
            sms_log_data = sms_data.copy()
            sms_log_data["is_reply"] = True if campaign_id else False
            sms_log_data["has_replies"] = False
            sms_log_data["reply_count"] = 0
            
            await db.sms_logs.insert_one(sms_log_data)
        
        logger.info(f"✅ Incoming message stored for {len(users)} users")
        
        # ============================================
        # STEP 2: Generate AI Response
        # ============================================
        
        ai_message = None
        source = "none"
        
        # Use first user for processing
        user_id = str(users[0]["_id"])
        
        # Get conversation state
        conversation_state = await _get_conversation_state(from_number, user_id, db)
        
        # ============================================
        # 🆕 PRIORITY 0: Use Custom AI Script (if from campaign and not booking)
        # ============================================
        if custom_ai_script and not conversation_state.get("booking_in_progress"):
            logger.info(f"\n{'='*80}")
            logger.info(f"🎯 PRIORITY 0: USING CUSTOM CAMPAIGN AI SCRIPT")
            logger.info(f"{'='*80}")
            logger.info(f"   Script length: {len(custom_ai_script)} characters")
            logger.info(f"   Customer message: '{body}'")
            logger.info(f"{'='*80}\n")
            
            # Check if appointment booking keywords
            if any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
                logger.info("📅 Switching to appointment booking flow...")
                
                await _update_conversation_state(
                    from_number, user_id,
                    {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
                    db
                )
                
                ai_message = "Great! I can help you book an appointment. First, may I have your name?"
                source = "appointment_booking"
            
            else:
                # ✅ Use custom script with OpenAI - NO HISTORY
                try:
                    # ✅ 🆕 DON'T USE HISTORY - START FRESH WITH CUSTOM SCRIPT
                    conversation_context = []
                    
                    # Only add current message
                    conversation_context.append({
                        "role": "user",
                        "content": body
                    })
                    
                    logger.info(f"🤖 Calling OpenAI with custom script...")
                    logger.info(f"   System prompt length: {len(custom_ai_script)} chars")
                    logger.info(f"   System prompt preview: {custom_ai_script[:200]}...")
                    logger.info(f"   🆕 Using FRESH conversation (no history)")
                    logger.info(f"   User message: {body}")
                    
                    # 🆕 USE CUSTOM AI SCRIPT AS SYSTEM PROMPT
                    ai_response = await openai_service.generate_chat_response(
                        messages=conversation_context,
                        system_prompt=custom_ai_script,  # ✅ CUSTOM SCRIPT HERE
                        max_tokens=150
                    )
                    
                    if ai_response.get("success"):
                        ai_message = ai_response.get("response", "Thank you for your message!")
                        source = "custom_ai_script"
                        
                        logger.info(f"✅ Custom AI script response generated successfully")
                        logger.info(f"   Response length: {len(ai_message)} chars")
                        logger.info(f"   Response preview: {ai_message[:100]}...")
                    else:
                        logger.error(f"❌ OpenAI failed: {ai_response.get('error')}")
                        ai_message = "Thank you for your message. Our team will get back to you shortly!"
                        source = "fallback"
                        
                except Exception as e:
                    logger.error(f"❌ Custom AI script error: {e}")
                    import traceback
                    traceback.print_exc()
                    ai_message = "Thank you for your message. Our team will get back to you shortly!"
                    source = "fallback"
        
        # ============================================
        # PRIORITY 1: Handle Active Appointment Booking
        # ============================================
        elif conversation_state.get("booking_in_progress"):
            logger.info("📅 Continuing appointment booking...")
            
            booking_result = await _process_appointment_booking(
                body, conversation_state, user_id, from_number, db
            )
            
            ai_message = booking_result["response"]
            source = "appointment_booking"
        
        # ============================================
        # PRIORITY 2: Check if User Wants to Book
        # ============================================
        elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
            logger.info("📅 Starting new appointment booking...")
            
            await _update_conversation_state(
                from_number, user_id,
                {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
                db
            )
            
            ai_message = "Great! I can help you book an appointment. First, may I have your name?"
            source = "appointment_booking"
        
        # ============================================
        # PRIORITY 3: Check Campaign Builder
        # ============================================
        elif not ai_message:  # Only if not already handled by custom script
            campaign_match = await _match_campaign_workflow(
                user_input=body,
                user_id=user_id,
                db=db
            )
            
            if campaign_match and campaign_match.get("found"):
                ai_message = campaign_match["response"]
                source = "campaign"
                logger.info(f"✅ Using Campaign: {campaign_match['workflow_name']}")
            
            # ============================================
            # PRIORITY 4: Use OpenAI (default)
            # ============================================
            else:
                logger.info(f"🤖 Using default OpenAI")
                
                try:
                    history_cursor = db.sms_logs.find({
                        "user_id": user_id,
                        "$or": [
                            {"to_number": from_number},
                            {"from_number": from_number}
                        ]
                    }).sort("created_at", -1).limit(10)
                    
                    history = await history_cursor.to_list(length=10)
                    history.reverse()
                    
                    conversation_context = []
                    for msg in history:
                        role = "user" if msg["direction"] == "inbound" else "assistant"
                        conversation_context.append({
                            "role": role,
                            "content": msg["message"]
                        })
                    
                    conversation_context.append({
                        "role": "user",
                        "content": body
                    })
                    
                    ai_response = await openai_service.generate_chat_response(
                        messages=conversation_context,
                        system_prompt="""You are a helpful AI assistant for a call center business. 
                        You help answer customer questions about services, pricing, appointments, and general inquiries.
                        Be professional, friendly, and helpful. Keep responses under 150 words."""
                    )
                    
                    if ai_response.get("success"):
                        ai_message = ai_response.get("response", "I'm here to help! How can I assist you?")
                        source = "openai"
                    else:
                        ai_message = "Thank you for your message. Our team will get back to you shortly!"
                        source = "fallback"
                except Exception as e:
                    logger.error(f"OpenAI error: {e}")
                    ai_message = "Thank you for your message. Our team will get back to you shortly!"
                    source = "fallback"
        
        # ============================================
        # STEP 3: Send AI response via Twilio
        # ============================================
        
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        logger.info(f"\n{'='*80}")
        logger.info(f"📤 SENDING AI RESPONSE")
        logger.info(f"{'='*80}")
        logger.info(f"   Source: {source}")
        logger.info(f"   Response: {ai_message[:100]}...")
        logger.info(f"{'='*80}\n")
        
        try:
            send_result = await sms_service.send_sms(
                to_number=from_number,
                message=ai_message,
                from_number=twilio_phone,
                user_id=user_id,
                campaign_id=campaign_id
            )
            
            if send_result.get("success"):
                logger.info(f"✅ AI response sent to customer")
            else:
                logger.error(f"❌ Failed to send: {send_result.get('error')}")
        except Exception as e:
            logger.error(f"❌ Error sending SMS: {e}")
        
        # ============================================
        # STEP 4: Store AI response for ALL users
        # ============================================
        
        for user in users:
            uid = str(user["_id"])
            
            ai_sms_data = {
                "user_id": uid,
                "to_number": from_number,
                "from_number": twilio_phone,
                "message": ai_message,
                "status": "sent",
                "direction": "outbound",
                "campaign_id": campaign_id,
                "created_at": datetime.utcnow()
            }
            
            await db.sms_messages.insert_one(ai_sms_data.copy())
            
            ai_sms_log = ai_sms_data.copy()
            ai_sms_log["is_reply"] = True
            ai_sms_log["has_replies"] = False
            ai_sms_log["reply_count"] = 0
            
            await db.sms_logs.insert_one(ai_sms_log)
        
        logger.info(f"✅ Complete! Response sent via {source}")
        
        return Response(
            content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            media_type="application/xml"
        )
        
    except Exception as e:
        logger.error(f"❌ Webhook error: {e}")
        import traceback
        traceback.print_exc()
        
        return Response(
            content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            media_type="application/xml",
            status_code=500
        )


# ============================================
# REST OF THE FILE REMAINS UNCHANGED
# ============================================

@router.post("/send", response_model=dict, status_code=status.HTTP_201_CREATED)
async def send_sms(
    request: SMSSendRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Send a single SMS"""
    try:
        user_id = str(current_user["_id"])
        
        result = await sms_service.send_sms(
            to_number=request.to_number,
            message=request.message,
            from_number=request.from_number,
            user_id=user_id
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to send SMS")
            )
        
        return {
            "success": True,
            "message": "SMS sent successfully",
            "sms_id": result.get("sms_id"),
            "twilio_sid": result.get("twilio_sid")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/bulk", response_model=dict)
async def send_bulk_sms(
    request: SMSBulkRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Send bulk SMS"""
    try:
        user_id = str(current_user["_id"])
        
        result = await sms_service.send_bulk_sms(
            to_numbers=request.to_numbers,
            message=request.message,
            from_number=request.from_number,
            user_id=user_id,
            batch_size=request.batch_size
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error sending bulk SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/", response_model=list)
async def list_sms(
    skip: int = 0,
    limit: int = 50,
    direction: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """List SMS messages"""
    try:
        user_id = str(current_user["_id"])
        
        messages = await sms_service.get_sms_list(
            user_id=user_id,
            skip=skip,
            limit=limit,
            direction=direction,
            status=status
        )
        
        return messages
        
    except Exception as e:
        logger.error(f"Error listing SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=SMSStatsResponse)
async def get_sms_stats(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get SMS statistics"""
    try:
        user_id = str(current_user["_id"])
        
        stats = await sms_service.get_sms_stats(user_id)
        
        return SMSStatsResponse(**stats)
        
    except Exception as e:
        logger.error(f"Error getting SMS stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{sms_id}")
async def delete_sms(
    sms_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Delete SMS message"""
    try:
        user_id = str(current_user["_id"])
        
        success = await sms_service.delete_sms(sms_id, user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SMS not found"
            )
        
        return {"success": True, "message": "SMS deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )