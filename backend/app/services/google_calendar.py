# backend/app/services/google_calendar.py - COMPLETE CORRECTED VERSION
"""
Google Calendar Integration Service
"""

import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)


class GoogleCalendarService:
    """Service for Google Calendar API integration"""
    
    def __init__(self):
        """Initialize Google Calendar service"""
        self.credentials_file = os.getenv("GOOGLE_CALENDAR_CREDENTIALS_FILE")
        self.calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
        self.service = None
        
        if self.credentials_file and os.path.exists(self.credentials_file):
            try:
                self._initialize_service()
                logger.info("✅ Google Calendar service initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Google Calendar: {e}")
        else:
            logger.warning("⚠️ Google Calendar credentials not configured")
    
    def _initialize_service(self):
        """Initialize Google Calendar API service"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                self.credentials_file,
                scopes=['https://www.googleapis.com/auth/calendar']
            )
            
            self.service = build('calendar', 'v3', credentials=credentials)
            logger.info("✅ Google Calendar API service built successfully")
            
        except Exception as e:
            logger.error(f"❌ Error building Google Calendar service: {e}")
            raise
    
    def is_configured(self) -> bool:
        """Check if Google Calendar is configured"""
        return self.service is not None
    
    async def check_availability(
        self,
        date: datetime,
        duration_minutes: int = 60,
        working_hours: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Check available time slots for a given date"""
        try:
            if not self.is_configured():
                logger.warning("⚠️ Google Calendar not configured")
                return {
                    "success": False,
                    "error": "Google Calendar not configured"
                }
            
            if not working_hours:
                working_hours = {"start": "09:00", "end": "17:00"}
            
            # ✅ FIX: Ensure date is timezone-aware
            if date.tzinfo is None:
                date = date.replace(tzinfo=timezone.utc)
            
            start_time = datetime.combine(date.date(), datetime.strptime(working_hours["start"], "%H:%M").time())
            end_time = datetime.combine(date.date(), datetime.strptime(working_hours["end"], "%H:%M").time())
            
            # ✅ FIX: Make start_time and end_time timezone-aware
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            if end_time.tzinfo is None:
                end_time = end_time.replace(tzinfo=timezone.utc)
            
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_time.isoformat(),
                timeMax=end_time.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            available_slots = []
            current_time = start_time
            
            while current_time + timedelta(minutes=duration_minutes) <= end_time:
                slot_end = current_time + timedelta(minutes=duration_minutes)
                
                is_available = True
                for event in events:
                    event_start_str = event['start'].get('dateTime', event['start'].get('date'))
                    event_end_str = event['end'].get('dateTime', event['end'].get('date'))
                    
                    # Parse event times
                    event_start = datetime.fromisoformat(event_start_str.replace('Z', '+00:00'))
                    event_end = datetime.fromisoformat(event_end_str.replace('Z', '+00:00'))
                    
                    # ✅ FIX: Ensure event times are timezone-aware
                    if event_start.tzinfo is None:
                        event_start = event_start.replace(tzinfo=timezone.utc)
                    if event_end.tzinfo is None:
                        event_end = event_end.replace(tzinfo=timezone.utc)
                    
                    if (current_time < event_end and slot_end > event_start):
                        is_available = False
                        break
                
                if is_available:
                    available_slots.append(current_time.strftime("%H:%M"))
                
                current_time += timedelta(minutes=30)
            
            logger.info(f"✅ Found {len(available_slots)} available slots for {date.date()}")
            
            return {
                "success": True,
                "date": date.date().isoformat(),
                "available_slots": available_slots,
                "total_slots": len(available_slots)
            }
            
        except Exception as e:
            logger.error(f"❌ Error checking availability: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e)
            }
    
    async def create_event(
        self,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        appointment_date: datetime,
        appointment_time: str,
        duration_minutes: int = 60,
        service_type: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a Google Calendar event WITHOUT inviting attendees
        
        Args:
            customer_name: Customer name
            customer_email: Customer email
            customer_phone: Customer phone
            appointment_date: Appointment date
            appointment_time: Time as "HH:MM"
            duration_minutes: Duration
            service_type: Type of service
            notes: Additional notes
        
        Returns:
            Dictionary with event details
        """
        try:
            if not self.is_configured():
                logger.warning("⚠️ Google Calendar not configured")
                return {
                    "success": False,
                    "error": "Google Calendar not configured"
                }
            
            # Parse time
            hour, minute = map(int, appointment_time.split(':'))
            start_datetime = appointment_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            end_datetime = start_datetime + timedelta(minutes=duration_minutes)
            
            # Build event summary and description
            summary = f"Appointment: {customer_name}"
            if service_type:
                summary += f" - {service_type}"
            
            description = f"Customer: {customer_name}\n"
            description += f"Email: {customer_email}\n"
            description += f"Phone: {customer_phone}\n"
            if notes:
                description += f"\nNotes: {notes}"
            
            # ✅ FIXED: Create event WITHOUT attendees (service accounts can't invite attendees)
            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': 'UTC',
                },
                # ❌ REMOVED: attendees field that caused 403 error
                # 'attendees': [{'email': customer_email}],
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},  # 1 day before
                        {'method': 'popup', 'minutes': 60},  # 1 hour before
                    ],
                },
            }
            
            # ✅ FIXED: Insert event WITHOUT sendUpdates parameter
            created_event = self.service.events().insert(
                calendarId=self.calendar_id,
                body=event
                # ❌ REMOVED: sendUpdates='all' parameter
            ).execute()
            
            logger.info(f"✅ Created Google Calendar event: {created_event['id']}")
            
            return {
                "success": True,
                "event_id": created_event['id'],
                "event_link": created_event.get('htmlLink'),
                "message": "Event created successfully"
            }
            
        except HttpError as e:
            logger.error(f"❌ Google Calendar API error: {e}")
            return {
                "success": False,
                "error": f"Google Calendar API error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"❌ Error creating event: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e)
            }
    
    async def cancel_event(self, event_id: str) -> Dict[str, Any]:
        """Cancel a Google Calendar event"""
        try:
            if not self.is_configured():
                return {
                    "success": False,
                    "error": "Google Calendar not configured"
                }
            
            # ✅ FIXED: Delete without sendUpdates parameter
            self.service.events().delete(
                calendarId=self.calendar_id,
                eventId=event_id
                # ❌ REMOVED: sendUpdates='all'
            ).execute()
            
            logger.info(f"✅ Cancelled Google Calendar event: {event_id}")
            
            return {
                "success": True,
                "message": "Event cancelled successfully"
            }
            
        except HttpError as e:
            logger.error(f"❌ Error cancelling event: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def update_event(
        self,
        event_id: str,
        appointment_date: Optional[datetime] = None,
        appointment_time: Optional[str] = None,
        duration_minutes: int = 60
    ) -> Dict[str, Any]:
        """Update a Google Calendar event"""
        try:
            if not self.is_configured():
                return {
                    "success": False,
                    "error": "Google Calendar not configured"
                }
            
            # Get existing event
            event = self.service.events().get(
                calendarId=self.calendar_id,
                eventId=event_id
            ).execute()
            
            # Update time if provided
            if appointment_date and appointment_time:
                hour, minute = map(int, appointment_time.split(':'))
                start_datetime = appointment_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
                end_datetime = start_datetime + timedelta(minutes=duration_minutes)
                
                event['start'] = {
                    'dateTime': start_datetime.isoformat(),
                    'timeZone': 'UTC',
                }
                event['end'] = {
                    'dateTime': end_datetime.isoformat(),
                    'timeZone': 'UTC',
                }
            
            # ✅ FIXED: Update without sendUpdates parameter
            updated_event = self.service.events().update(
                calendarId=self.calendar_id,
                eventId=event_id,
                body=event
                # ❌ REMOVED: sendUpdates='all'
            ).execute()
            
            logger.info(f"✅ Updated Google Calendar event: {event_id}")
            
            return {
                "success": True,
                "event_id": updated_event['id'],
                "message": "Event updated successfully"
            }
            
        except HttpError as e:
            logger.error(f"❌ Error updating event: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Create singleton instance
google_calendar_service = GoogleCalendarService()