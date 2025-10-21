# backend/app/api/v1/sms.py - MILESTONE 3 COMPLETE

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from typing import Optional

from app.schemas.sms import (
    SMSSendRequest,
    SMSBulkRequest,
    SMSResponse,
    SMSStatsResponse
)
from app.api.deps import get_current_user
from app.services.sms import sms_service
from app.tasks.sms_tasks import send_sms_task, send_bulk_sms_task
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=dict)
async def get_sms_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    direction: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get SMS messages for the current user"""
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Fetching SMS messages for user: {user_id}")
        
        result = await sms_service.get_sms_messages(
            user_id=user_id,
            skip=skip,
            limit=limit,
            status=status,
            direction=direction
        )
        
        logger.info(f"Found {result.get('total', 0)} SMS messages for user {user_id}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error fetching SMS messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/stats", response_model=dict)
async def get_sms_stats(
    current_user: dict = Depends(get_current_user)
):
    """Get SMS statistics for the current user"""
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Fetching SMS stats for user: {user_id}")
        
        stats = await sms_service.get_sms_stats(user_id)
        
        logger.info(f"SMS stats for user {user_id}: {stats}")
        
        return stats
        
    except Exception as e:
        logger.error(f"Error fetching SMS stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{sms_id}", response_model=dict)
async def get_sms(
    sms_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific SMS message"""
    try:
        user_id = str(current_user["_id"])
        
        sms = await sms_service.get_sms_by_id(sms_id, user_id)
        
        if not sms:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SMS message not found"
            )
        
        return sms
        
    except Exception as e:
        logger.error(f"Error fetching SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/send", response_model=dict)
async def send_sms(
    sms_request: SMSSendRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Send a single SMS message"""
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Sending SMS to {sms_request.to_number} for user {user_id}")
        
        # Queue SMS for sending
        send_sms_task.delay(
            to_number=sms_request.to_number,
            message=sms_request.message,
            user_id=user_id,
            from_number=sms_request.from_number
        )
        
        return {
            "success": True,
            "message": "SMS queued for sending",
            "to_number": sms_request.to_number
        }
        
    except Exception as e:
        logger.error(f"Error sending SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/bulk", response_model=dict)
async def send_bulk_sms(
    bulk_request: SMSBulkRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Send bulk SMS messages"""
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"Sending bulk SMS to {len(bulk_request.to_numbers)} recipients for user {user_id}")
        
        # Queue bulk SMS for sending
        send_bulk_sms_task.delay(
            to_numbers=bulk_request.to_numbers,
            message=bulk_request.message,
            user_id=user_id,
            from_number=bulk_request.from_number,
            batch_size=bulk_request.batch_size
        )
        
        return {
            "success": True,
            "message": "Bulk SMS queued for sending",
            "recipient_count": len(bulk_request.to_numbers)
        }
        
    except Exception as e:
        logger.error(f"Error sending bulk SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{sms_id}", response_model=dict)
async def delete_sms(
    sms_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an SMS message"""
    try:
        user_id = str(current_user["_id"])
        
        success = await sms_service.delete_sms(sms_id, user_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SMS message not found"
            )
        
        logger.info(f"Deleted SMS {sms_id}")
        
        return {"message": "SMS deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting SMS: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/webhook", response_model=dict)
async def sms_webhook(webhook_data: dict):
    """Handle incoming SMS webhook from Twilio"""
    try:
        logger.info(f"Received SMS webhook: {webhook_data}")
        
        result = await sms_service.handle_incoming_sms(webhook_data)
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing SMS webhook: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )