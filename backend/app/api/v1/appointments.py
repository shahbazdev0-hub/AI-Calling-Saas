
# # backend/app/api/v1/appointments.py - ✅ WORKING VERSION appointmnt withou frontend google calender 

# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from typing import Optional
# from datetime import datetime

# from app.api.deps import get_current_user
# from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
# from app.services.appointment import appointment_service

# import logging

# logger = logging.getLogger(__name__)
# router = APIRouter()


# @router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
# async def create_appointment(
#     appointment_data: AppointmentCreate,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Create a new appointment"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await appointment_service.create_appointment(
#             customer_name=appointment_data.customer_name,
#             customer_email=appointment_data.customer_email,
#             customer_phone=appointment_data.customer_phone,
#             appointment_date=appointment_data.appointment_date,
#             service_type=appointment_data.service_type,
#             notes=appointment_data.notes,
#             user_id=user_id
#         )
        
#         if not result.get("success"):
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail=result.get("error", "Failed to create appointment")
#             )
        
#         return result
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error creating appointment: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/stats")
# async def get_appointment_stats(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get appointment statistics"""
#     try:
#         user_id = str(current_user["_id"])
#         stats = await appointment_service.get_appointment_stats(user_id)
#         return stats
        
#     except Exception as e:
#         logger.error(f"❌ Error getting stats: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/")
# async def list_appointments(
#     current_user: dict = Depends(get_current_user),
#     date_from: Optional[datetime] = None,
#     date_to: Optional[datetime] = None,
#     skip: int = 0,
#     limit: int = 50
# ):
#     """List appointments - NO STATUS FILTER"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # ✅ CRITICAL: Only pass parameters the service actually accepts
#         result = await appointment_service.get_appointments(
#             user_id=user_id,
#             skip=skip,
#             limit=limit
#         )
        
#         return result
        
#     except Exception as e:
#         logger.error(f"❌ Error listing appointments: {e}", exc_info=True)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/{appointment_id}")
# async def get_appointment(
#     appointment_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get a specific appointment"""
#     try:
#         user_id = str(current_user["_id"])
        
#         appointment = await appointment_service.get_appointment(
#             appointment_id=appointment_id,
#             user_id=user_id
#         )
        
#         if not appointment:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Appointment not found"
#             )
        
#         return appointment
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error getting appointment: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/{appointment_id}")
# async def cancel_appointment(
#     appointment_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Cancel an appointment"""
#     try:
#         user_id = str(current_user["_id"])
        
#         appointment = await appointment_service.get_appointment(appointment_id, user_id)
#         if not appointment:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Appointment not found"
#             )
        
#         result = await appointment_service.cancel_appointment(appointment_id)
        
#         if not result:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to cancel appointment"
#             )
        
#         return {
#             "success": True,
#             "message": "Appointment cancelled successfully"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error cancelling appointment: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )

# backend/app/api/v1/appointments.py - ✅ COMPLETE FIX

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from datetime import datetime
from bson import ObjectId

from app.api.deps import get_current_user
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.services.appointment import appointment_service

import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/stats")
async def get_appointment_stats(
    current_user: dict = Depends(get_current_user)
):
    """Get appointment statistics"""
    try:
        user_id = str(current_user["_id"])
        stats = await appointment_service.get_appointment_stats(user_id)
        return stats
        
    except Exception as e:
        logger.error(f"❌ Error getting appointment stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/")
async def list_appointments(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """
    ✅ FIXED: List appointments with proper ObjectId serialization
    """
    try:
        user_id = str(current_user["_id"])
        
        from app.database import get_database
        db = await get_database()
        
        # Build query
        query = {"user_id": user_id}
        
        if status:
            query["status"] = status
        
        # Date range filter
        if date_from or date_to:
            query["appointment_date"] = {}
            if date_from:
                query["appointment_date"]["$gte"] = datetime.fromisoformat(date_from.replace('Z', '+00:00'))
            if date_to:
                query["appointment_date"]["$lte"] = datetime.fromisoformat(date_to.replace('Z', '+00:00'))
        
        logger.info(f"📅 Query: {query}")
        
        # Get total count
        total = await db.appointments.count_documents(query)
        
        # Get appointments
        cursor = db.appointments.find(query).sort("appointment_date", -1).skip(skip).limit(limit)
        appointments = await cursor.to_list(length=limit)
        
        # ✅ CRITICAL FIX: Convert ALL ObjectIds to strings
        formatted_appointments = []
        for apt in appointments:
            formatted_apt = {
                "id": str(apt["_id"]),
                "customer_name": apt.get("customer_name", ""),
                "customer_email": apt.get("customer_email", ""),
                "customer_phone": apt.get("customer_phone", ""),
                "appointment_date": apt.get("appointment_date").isoformat() if apt.get("appointment_date") else None,
                "appointment_time": apt.get("appointment_time", ""),
                "service_type": apt.get("service_type", "Appointment"),
                "status": apt.get("status", "scheduled"),
                "notes": apt.get("notes"),
                "duration_minutes": apt.get("duration_minutes", 60),
                "google_calendar_event_id": apt.get("google_calendar_event_id"),
                "google_calendar_link": apt.get("google_calendar_link"),
                "call_id": str(apt["call_id"]) if apt.get("call_id") else None,
                "user_id": str(apt["user_id"]) if apt.get("user_id") else None,
                "agent_id": str(apt["agent_id"]) if apt.get("agent_id") else None,
                "workflow_id": str(apt["workflow_id"]) if apt.get("workflow_id") else None,
                "created_at": apt.get("created_at").isoformat() if apt.get("created_at") else None,
                "updated_at": apt.get("updated_at").isoformat() if apt.get("updated_at") else None,
            }
            formatted_appointments.append(formatted_apt)
        
        logger.info(f"✅ Found {len(formatted_appointments)} appointments")
        
        return {
            "appointments": formatted_appointments,
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "page_size": limit
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing appointments: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list appointments: {str(e)}"
        )


@router.post("/", status_code=status.HTTP_201_CREATED)
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
            appointment_time=getattr(appointment_data, 'appointment_time', None),
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


@router.get("/{appointment_id}")
async def get_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific appointment"""
    try:
        user_id = str(current_user["_id"])
        
        appointment = await appointment_service.get_appointment(
            appointment_id=appointment_id,
            user_id=user_id
        )
        
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment not found"
            )
        
        return appointment
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting appointment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.put("/{appointment_id}")
async def update_appointment(
    appointment_id: str,
    appointment_data: AppointmentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an appointment"""
    try:
        user_id = str(current_user["_id"])
        
        result = await appointment_service.update_appointment(
            appointment_id=appointment_id,
            user_id=user_id,
            **appointment_data.dict(exclude_unset=True)
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to update appointment")
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating appointment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{appointment_id}")
async def delete_appointment(
    appointment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete an appointment"""
    try:
        user_id = str(current_user["_id"])
        
        result = await appointment_service.delete_appointment(
            appointment_id=appointment_id,
            user_id=user_id
        )
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to delete appointment")
            )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting appointment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )