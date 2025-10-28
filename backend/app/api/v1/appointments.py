# backend/app/api/v1/appointments.py - NEW FILE
"""
Appointment API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from datetime import datetime

from app.api.deps import get_current_user
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AvailabilityRequest,
    AvailabilityResponse
)
from app.services.appointment import appointment_service

import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/check-availability", response_model=dict)
async def check_availability(
    request: AvailabilityRequest,
    current_user: dict = Depends(get_current_user)
):
    """Check available time slots for a date"""
    try:
        result = await appointment_service.check_availability(
            date=request.date,
            duration_minutes=request.duration_minutes
        )
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Error checking availability: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new appointment"""
    try:
        user_id = str(current_user["_id"])
        
        result = await appointment_service.create_appointment(
            customer_name=appointment_data.customer_name,
            customer_email=appointment_data.customer_email,
            customer_phone=appointment_data.customer_phone,
            appointment_date=appointment_data.appointment_date,
            appointment_time=appointment_data.appointment_time,
            service_type=appointment_data.service_type,
            notes=appointment_data.notes,
            user_id=user_id
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to create appointment")
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error creating appointment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/", response_model=List[AppointmentResponse])
async def list_appointments(
    current_user: dict = Depends(get_current_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 50
):
    """List appointments"""
    try:
        user_id = str(current_user["_id"])
        
        appointments = await appointment_service.get_appointments(
            user_id=user_id,
            status=status_filter,
            date_from=date_from,
            date_to=date_to,
            skip=skip,
            limit=limit
        )
        
        return appointments
        
    except Exception as e:
        logger.error(f"❌ Error listing appointments: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{appointment_id}", response_model=dict)
async def cancel_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Cancel an appointment"""
    try:
        result = await appointment_service.cancel_appointment(appointment_id)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result.get("error", "Appointment not found")
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error cancelling appointment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )