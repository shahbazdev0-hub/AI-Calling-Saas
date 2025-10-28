# backend/app/services/appointment.py - COMPLETE CORRECTED VERSION
"""
Appointment Service - Handles appointment booking logic
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta, timezone
from bson import ObjectId

from app.database import get_database
from app.services.google_calendar import google_calendar_service
from app.services.email import email_service

logger = logging.getLogger(__name__)


class AppointmentService:
    """Service for managing appointments"""
    
    async def check_availability(
        self,
        date: datetime,
        duration_minutes: int = 60,
        workflow_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Check availability for a given date
        
        Args:
            date: Date to check
            duration_minutes: Appointment duration
            workflow_id: Optional workflow ID to get working hours
        
        Returns:
            Available time slots
        """
        try:
            logger.info(f"📅 Checking availability for {date.date()}")
            
            # Get working hours from workflow/campaign if available
            working_hours = None
            if workflow_id:
                working_hours = await self._get_working_hours_from_workflow(workflow_id)
            
            # Check Google Calendar
            if google_calendar_service.is_configured():
                logger.info("📆 Using Google Calendar for availability")
                return await google_calendar_service.check_availability(
                    date=date,
                    duration_minutes=duration_minutes,
                    working_hours=working_hours
                )
            else:
                # Fallback: return default working hours slots
                logger.info("⚠️ Google Calendar not configured, using default slots")
                return self._get_default_availability(date, working_hours)
            
        except Exception as e:
            logger.error(f"❌ Error checking availability: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _get_working_hours_from_workflow(self, workflow_id: str) -> Optional[Dict[str, str]]:
        """Get working hours from workflow configuration"""
        try:
            db = await get_database()
            workflow = await db.workflows.find_one({"_id": ObjectId(workflow_id)})
            
            if workflow and workflow.get("working_hours"):
                return workflow["working_hours"]
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error getting workflow working hours: {e}")
            return None
    
    def _get_default_availability(
        self,
        date: datetime,
        working_hours: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Get default availability slots when Google Calendar is not configured"""
        try:
            if not working_hours:
                working_hours = {"start": "09:00", "end": "17:00"}
            
            # Generate slots every 30 minutes
            start_hour, start_minute = map(int, working_hours["start"].split(':'))
            end_hour, end_minute = map(int, working_hours["end"].split(':'))
            
            available_slots = []
            current_hour = start_hour
            current_minute = start_minute
            
            while (current_hour < end_hour) or (current_hour == end_hour and current_minute < end_minute):
                available_slots.append(f"{current_hour:02d}:{current_minute:02d}")
                
                # Add 30 minutes
                current_minute += 30
                if current_minute >= 60:
                    current_minute = 0
                    current_hour += 1
            
            return {
                "success": True,
                "date": date.date().isoformat(),
                "available_slots": available_slots,
                "total_slots": len(available_slots),
                "source": "default"
            }
            
        except Exception as e:
            logger.error(f"❌ Error generating default slots: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_appointment(
        self,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        appointment_date: datetime,
        appointment_time: str,
        service_type: Optional[str] = None,
        notes: Optional[str] = None,
        call_id: Optional[str] = None,
        user_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        workflow_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new appointment
        
        Args:
            customer_name: Customer name
            customer_email: Customer email
            customer_phone: Customer phone
            appointment_date: Date
            appointment_time: Time as "HH:MM"
            service_type: Service type
            notes: Additional notes
            call_id: Associated call ID
            user_id: Business owner ID
            agent_id: Voice agent ID
            workflow_id: Workflow ID
        
        Returns:
            Created appointment details
        """
        try:
            logger.info(f"📝 Creating appointment for {customer_name} on {appointment_date.date()} at {appointment_time}")
            
            db = await get_database()
            
            # Create Google Calendar event if configured
            google_event_id = None
            if google_calendar_service.is_configured():
                logger.info("📆 Creating Google Calendar event...")
                calendar_result = await google_calendar_service.create_event(
                    customer_name=customer_name,
                    customer_email=customer_email,
                    customer_phone=customer_phone,
                    appointment_date=appointment_date,
                    appointment_time=appointment_time,
                    duration_minutes=60,
                    service_type=service_type,
                    notes=notes
                )
                
                if calendar_result.get("success"):
                    google_event_id = calendar_result.get("event_id")
                    logger.info(f"✅ Google Calendar event created: {google_event_id}")
                else:
                    logger.warning(f"⚠️ Failed to create Google Calendar event: {calendar_result.get('error')}")
            
            # Save appointment to database
            appointment_data = {
                "customer_name": customer_name,
                "customer_email": customer_email,
                "customer_phone": customer_phone,
                "appointment_date": appointment_date,
                "appointment_time": appointment_time,
                "service_type": service_type,
                "notes": notes,
                "call_id": call_id,
                "user_id": user_id,
                "agent_id": agent_id,
                "workflow_id": workflow_id,
                "google_calendar_event_id": google_event_id,
                "status": "scheduled",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            
            result = await db.appointments.insert_one(appointment_data)
            appointment_id = str(result.inserted_id)
            
            logger.info(f"✅ Appointment created in database: {appointment_id}")
            
            # Send confirmation email
            await self._send_confirmation_email(
                customer_name=customer_name,
                customer_email=customer_email,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                service_type=service_type
            )
            
            return {
                "success": True,
                "appointment_id": appointment_id,
                "google_event_id": google_event_id,
                "message": "Appointment created successfully"
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _send_confirmation_email(
        self,
        customer_name: str,
        customer_email: str,
        appointment_date: datetime,
        appointment_time: str,
        service_type: Optional[str] = None
    ):
        """Send appointment confirmation email"""
        try:
            subject = "Appointment Confirmation"
            
            service_text = f" for {service_type}" if service_type else ""
            
            # ✅ FIXED: Use 'html_content' to match email_service.send_email() signature
            html_content = f"""
            <html>
            <body>
                <h2>Appointment Confirmed</h2>
                <p>Dear {customer_name},</p>
                <p>Your appointment{service_text} has been confirmed!</p>
                
                <h3>Appointment Details:</h3>
                <ul>
                    <li><strong>Date:</strong> {appointment_date.strftime('%B %d, %Y')}</li>
                    <li><strong>Time:</strong> {appointment_time}</li>
                    {f'<li><strong>Service:</strong> {service_type}</li>' if service_type else ''}
                </ul>
                
                <p>We look forward to seeing you!</p>
                
                <p>If you need to reschedule or cancel, please contact us.</p>
                
                <p>Best regards,<br>Your Team</p>
            </body>
            </html>
            """
            
            # ✅ FIXED: Changed from 'html_body' to 'html_content'
            await email_service.send_email(
                to_email=customer_email,
                subject=subject,
                html_content=html_content
            )
            
            logger.info(f"✅ Confirmation email sent to {customer_email}")
            
        except Exception as e:
            logger.error(f"❌ Error sending confirmation email: {e}")
            # Don't raise exception - email failure shouldn't stop appointment creation
    
    async def get_appointments(
        self,
        user_id: Optional[str] = None,
        status: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        skip: int = 0,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get appointments with filters"""
        try:
            db = await get_database()
            
            query = {}
            if user_id:
                query["user_id"] = user_id
            if status:
                query["status"] = status
            if date_from or date_to:
                query["appointment_date"] = {}
                if date_from:
                    query["appointment_date"]["$gte"] = date_from
                if date_to:
                    query["appointment_date"]["$lte"] = date_to
            
            appointments = await db.appointments.find(query)\
                .skip(skip)\
                .limit(limit)\
                .sort("appointment_date", 1)\
                .to_list(length=limit)
            
            # Format appointments
            formatted = []
            for apt in appointments:
                formatted.append({
                    "id": str(apt["_id"]),
                    "customer_name": apt.get("customer_name"),
                    "customer_email": apt.get("customer_email"),
                    "customer_phone": apt.get("customer_phone"),
                    "appointment_date": apt.get("appointment_date"),
                    "appointment_time": apt.get("appointment_time"),
                    "service_type": apt.get("service_type"),
                    "status": apt.get("status"),
                    "google_calendar_event_id": apt.get("google_calendar_event_id"),
                    "created_at": apt.get("created_at")
                })
            
            return formatted
            
        except Exception as e:
            logger.error(f"❌ Error getting appointments: {e}")
            return []
    
    async def cancel_appointment(self, appointment_id: str) -> Dict[str, Any]:
        """Cancel an appointment"""
        try:
            db = await get_database()
            
            # Get appointment
            appointment = await db.appointments.find_one({"_id": ObjectId(appointment_id)})
            
            if not appointment:
                return {
                    "success": False,
                    "error": "Appointment not found"
                }
            
            # Cancel Google Calendar event if exists
            if appointment.get("google_calendar_event_id"):
                await google_calendar_service.cancel_event(
                    appointment["google_calendar_event_id"]
                )
            
            # Update appointment status
            await db.appointments.update_one(
                {"_id": ObjectId(appointment_id)},
                {"$set": {
                    "status": "cancelled",
                    "updated_at": datetime.utcnow()
                }}
            )
            
            logger.info(f"✅ Appointment cancelled: {appointment_id}")
            
            return {
                "success": True,
                "message": "Appointment cancelled successfully"
            }
            
        except Exception as e:
            logger.error(f"❌ Error cancelling appointment: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Create singleton instance
appointment_service = AppointmentService()