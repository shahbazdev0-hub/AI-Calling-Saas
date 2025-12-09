# backend/app/services/appointment.py - COMPLETE WITH EMAIL LOGGING FIX AND FIXED get_db

from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from bson import ObjectId
import logging

from app.database import get_database
from app.services.google_calendar import google_calendar_service
from app.services.email_automation import email_automation_service
from app.services.customer import customer_service  # ✅ NEW

logger = logging.getLogger(__name__)


class AppointmentService:
    """Service for managing appointments"""
    
    def __init__(self):
        self.db = None
    
    async def get_db(self):
        """Get database connection - FIXED: Proper None comparison"""
        if self.db is None:
            self.db = await get_database()
        return self.db
    
    async def create_appointment(
        self,
        user_id: str,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        service_type: str,
        appointment_date: datetime,
        duration_minutes: int = 60,
        notes: Optional[str] = None,
        call_id: Optional[str] = None,
        workflow_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new appointment
        
        Args:
            user_id: User ID
            customer_name: Customer name
            customer_email: Customer email
            customer_phone: Customer phone
            service_type: Type of service
            appointment_date: Appointment date/time
            duration_minutes: Duration in minutes (default 60)
            notes: Additional notes
            call_id: Associated call ID
            workflow_id: Associated workflow ID
            
        Returns:
            Dict with appointment details and Google Calendar event
        """
        try:
            logger.info(f"📅 Creating appointment for {customer_name}")
            
            # ✅ NEW - Auto-create customer if not exists
            customer_result = await customer_service.find_or_create_customer(
                user_id=user_id,
                name=customer_name,
                email=customer_email,
                phone=customer_phone
            )
            
            if customer_result.get("success"):
                if customer_result.get("created"):
                    logger.info(f"✅ New customer created: {customer_name}")
                else:
                    logger.info(f"✅ Existing customer found: {customer_name}")
            
            # Create Google Calendar event
            calendar_result = await google_calendar_service.create_event(
                summary=f"{service_type} - {customer_name}",
                description=f"Service: {service_type}\nCustomer: {customer_name}\nPhone: {customer_phone}\nEmail: {customer_email}\n\nNotes: {notes or 'N/A'}",
                start_time=appointment_date,
                duration_minutes=duration_minutes,
                attendee_email=customer_email
            )
            
            if not calendar_result.get("success"):
                raise Exception(f"Failed to create calendar event: {calendar_result.get('error')}")
            
            # Save to database
            db = await self.get_db()
            
            appointment_data = {
                "user_id": user_id,
                "customer_name": customer_name,
                "customer_email": customer_email,
                "customer_phone": customer_phone,
                "service_type": service_type,
                "appointment_date": appointment_date,
                "duration_minutes": duration_minutes,
                "notes": notes,
                "status": "scheduled",
                "google_calendar_event_id": calendar_result.get("event_id"),
                "google_calendar_link": calendar_result.get("event_link"),
                "call_id": call_id,
                "workflow_id": workflow_id,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await db.appointments.insert_one(appointment_data)
            appointment_id = str(result.inserted_id)
            
            logger.info(f"✅ Appointment created: {appointment_id}")
            
            # ✅ NEW - Update customer appointment count
            if customer_result.get("success") and customer_result.get("customer"):
                customer_id = customer_result["customer"].get("id")
                if customer_id:
                    await db.customers.update_one(
                        {"_id": ObjectId(customer_id)},
                        {
                            "$inc": {"total_appointments": 1, "total_interactions": 1},
                            "$set": {"last_contact_at": datetime.utcnow()}
                        }
                    )
            
            # Send confirmation email using email_automation_service
            try:
                formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                
                await email_automation_service.send_appointment_confirmation(
                    to_email=customer_email,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    service_type=service_type,
                    appointment_date=formatted_date,
                    user_id=user_id,
                    appointment_id=appointment_id,
                    call_id=call_id
                )
                
                logger.info(f"✅ Confirmation email sent and logged to {customer_email}")
                
            except Exception as email_error:
                logger.error(f"❌ Failed to send confirmation email: {email_error}")
                # Don't fail the appointment creation if email fails
            
            return {
                "success": True,
                "appointment_id": appointment_id,
                "google_calendar_event_id": calendar_result.get("event_id"),
                "google_calendar_link": calendar_result.get("event_link"),
                "message": "Appointment created successfully"
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def get_appointments(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 50,
        status_filter: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get appointments for a user"""
        try:
            db = await self.get_db()
            
            # Build query
            query = {"user_id": user_id}
            
            if status_filter:
                query["status"] = status_filter
            
            if from_date or to_date:
                date_query = {}
                if from_date:
                    date_query["$gte"] = from_date
                if to_date:
                    date_query["$lte"] = to_date
                if date_query:
                    query["appointment_date"] = date_query
            
            # Get total count
            total = await db.appointments.count_documents(query)
            
            # Get appointments
            cursor = db.appointments.find(query).sort("appointment_date", -1).skip(skip).limit(limit)
            appointments = await cursor.to_list(length=limit)
            
            # Format appointments
            for appointment in appointments:
                appointment["_id"] = str(appointment["_id"])
                if appointment.get("call_id"):
                    appointment["call_id"] = str(appointment["call_id"])
                if appointment.get("workflow_id"):
                    appointment["workflow_id"] = str(appointment["workflow_id"])
            
            return {
                "appointments": appointments,
                "total": total,
                "page": skip // limit + 1,
                "page_size": limit
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting appointments: {e}")
            return {
                "appointments": [],
                "total": 0,
                "error": str(e)
            }
    
    async def get_appointment(
        self,
        appointment_id: str,
        user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get a specific appointment"""
        try:
            db = await self.get_db()
            
            appointment = await db.appointments.find_one({
                "_id": ObjectId(appointment_id),
                "user_id": user_id
            })
            
            if appointment:
                appointment["_id"] = str(appointment["_id"])
                if appointment.get("call_id"):
                    appointment["call_id"] = str(appointment["call_id"])
                if appointment.get("workflow_id"):
                    appointment["workflow_id"] = str(appointment["workflow_id"])
            
            return appointment
            
        except Exception as e:
            logger.error(f"❌ Error getting appointment: {e}")
            return None
    
    async def update_appointment(
        self,
        appointment_id: str,
        user_id: str,
        update_data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update an appointment"""
        try:
            db = await self.get_db()
            
            update_data["updated_at"] = datetime.utcnow()
            
            result = await db.appointments.update_one(
                {"_id": ObjectId(appointment_id), "user_id": user_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_appointment(appointment_id, user_id)
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error updating appointment: {e}")
            return None
    
    async def cancel_appointment(
        self,
        appointment_id: str,
        user_id: str,
        reason: Optional[str] = None
    ) -> bool:
        """Cancel an appointment"""
        try:
            # Get appointment
            appointment = await self.get_appointment(appointment_id, user_id)
            if not appointment:
                return False
            
            # Cancel Google Calendar event
            if appointment.get("google_calendar_event_id"):
                await google_calendar_service.delete_event(
                    appointment["google_calendar_event_id"]
                )
            
            # Update status in database
            db = await self.get_db()
            await db.appointments.update_one(
                {"_id": ObjectId(appointment_id)},
                {
                    "$set": {
                        "status": "cancelled",
                        "cancellation_reason": reason,
                        "cancelled_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            logger.info(f"✅ Appointment {appointment_id} cancelled")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error cancelling appointment: {e}")
            return False
    
    async def get_appointment_stats(self, user_id: str) -> Dict[str, int]:
        """Get appointment statistics"""
        try:
            db = await self.get_db()
            
            # Total appointments
            total = await db.appointments.count_documents({"user_id": user_id})
            
            # By status
            scheduled = await db.appointments.count_documents({
                "user_id": user_id,
                "status": "scheduled"
            })
            
            completed = await db.appointments.count_documents({
                "user_id": user_id,
                "status": "completed"
            })
            
            cancelled = await db.appointments.count_documents({
                "user_id": user_id,
                "status": "cancelled"
            })
            
            # This month
            month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            this_month = await db.appointments.count_documents({
                "user_id": user_id,
                "created_at": {"$gte": month_start}
            })
            
            return {
                "total": total,
                "scheduled": scheduled,
                "completed": completed,
                "cancelled": cancelled,
                "this_month": this_month
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting appointment stats: {e}")
            return {
                "total": 0,
                "scheduled": 0,
                "completed": 0,
                "cancelled": 0,
                "this_month": 0
            }


# Create singleton instance
appointment_service = AppointmentService()