# # backend/app/services/email_poller.py - ✅ COMPLETE WITH EXACT SMS LOGIC orginal 

# import asyncio
# import imaplib
# import email
# from email.header import decode_header
# from datetime import datetime, timedelta
# import logging
# import os
# import re
# from typing import Optional, Dict, Any, List

# from app.database import get_database
# from app.services.openai import openai_service
# from app.services.email_automation import email_automation_service

# logger = logging.getLogger(__name__)


# class EmailPollerService:
#     """
#     Gmail IMAP Polling Service
    
#     ✅ APPLIES EXACT SMS INBOUND LOGIC:
#     - Priority 1: Active appointment booking (name → email → service → date)
#     - Priority 2: New appointment booking request
#     - Priority 3: OpenAI response for other questions
#     """
    
#     def __init__(self):
#         self.imap_host = "imap.gmail.com"
#         self.imap_port = 993
#         self.email_user = os.getenv("EMAIL_USER")
#         self.email_password = os.getenv("EMAIL_PASSWORD")
#         self.from_email = os.getenv("EMAIL_FROM")
#         self.polling_interval = 60  # Check every 60 seconds
#         self.is_running = False
#         self.processed_uids = set()
        
#         logger.info("=" * 80)
#         logger.info("📧 EMAIL POLLER SERVICE INITIALIZED")
#         logger.info("=" * 80)
#         logger.info(f"   Email User: {self.email_user}")
#         logger.info(f"   From Email: {self.from_email}")
#         logger.info(f"   Polling Interval: {self.polling_interval}s")
#         logger.info("=" * 80)
    
#     def is_configured(self) -> bool:
#         """Check if email service is configured"""
#         return all([self.email_user, self.email_password])
    
#     # ============================================
#     # EMAIL PARSING HELPERS
#     # ============================================
    
#     def _decode_header_value(self, value) -> str:
#         """Decode email header value"""
#         if value is None:
#             return ""
#         decoded_parts = decode_header(value)
#         result = ""
#         for part, encoding in decoded_parts:
#             if isinstance(part, bytes):
#                 result += part.decode(encoding or 'utf-8', errors='ignore')
#             else:
#                 result += part
#         return result
    
#     def _extract_email_address(self, email_string: str) -> str:
#         """Extract email address from 'Name <email@example.com>' format"""
#         if not email_string:
#             return ""
#         match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', email_string)
#         return match.group(0).lower() if match else email_string.lower()
    
#     def _get_email_body(self, msg) -> str:
#         """Extract clean email body (removes signatures and quoted text)"""
#         body = ""
        
#         # Handle multipart emails
#         if msg.is_multipart():
#             for part in msg.walk():
#                 content_type = part.get_content_type()
#                 content_disposition = str(part.get("Content-Disposition"))
                
#                 # Skip attachments
#                 if "attachment" in content_disposition:
#                     continue
                
#                 # Get plain text content
#                 if content_type == "text/plain":
#                     try:
#                         payload = part.get_payload(decode=True)
#                         if payload:
#                             charset = part.get_content_charset() or 'utf-8'
#                             body = payload.decode(charset, errors='ignore')
#                             break
#                     except Exception as e:
#                         logger.error(f"Error decoding part: {e}")
#         else:
#             try:
#                 payload = msg.get_payload(decode=True)
#                 if payload:
#                     charset = msg.get_content_charset() or 'utf-8'
#                     body = payload.decode(charset, errors='ignore')
#             except Exception as e:
#                 logger.error(f"Error decoding body: {e}")
        
#         # Clean the body - remove quoted text and signatures
#         lines = body.split('\n')
#         clean_lines = []
        
#         for line in lines:
#             line_stripped = line.strip()
            
#             # Stop at quoted text
#             if line_stripped.startswith('>'):
#                 break
            
#             # Stop at "wrote:" lines
#             if 'wrote:' in line_stripped.lower():
#                 break
            
#             # Stop at date/time stamps (email replies)
#             if line_stripped.lower().startswith('on ') and (' at ' in line_stripped.lower() or ', ' in line_stripped):
#                 break
            
#             # Stop at signature separators
#             if line_stripped in ['--', '---', '___']:
#                 break
            
#             # Stop at common signature starters
#             if any(line_stripped.lower().startswith(sig) for sig in ['sent from', 'get outlook', 'sent via']):
#                 break
            
#             clean_lines.append(line)
        
#         result = '\n'.join(clean_lines).strip()
        
#         # Fallback: if no clean result, take first non-quoted line
#         if not result and body:
#             for line in body.split('\n'):
#                 if line.strip() and not line.strip().startswith('>'):
#                     result = line.strip()
#                     break
        
#         logger.info(f"📝 Extracted body: '{result[:100]}{'...' if len(result) > 100 else ''}'")
#         return result
    
#     # ============================================
#     # ✅ CONVERSATION STATE MANAGEMENT (FROM SMS)
#     # ============================================
    
#     async def _get_conversation_state(self, email_address: str, user_id: str, db) -> Dict[str, Any]:
#         """Get or create conversation state for email thread"""
#         state = await db.email_conversation_states.find_one({
#             "email_address": email_address,
#             "user_id": user_id
#         })
        
#         if not state:
#             state = {
#                 "email_address": email_address,
#                 "user_id": user_id,
#                 "booking_in_progress": False,
#                 "current_step": None,
#                 "collected_data": {},
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
#             await db.email_conversation_states.insert_one(state)
        
#         return state
    
#     async def _update_conversation_state(self, email_address: str, user_id: str, updates: Dict, db):
#         """Update conversation state"""
#         updates["updated_at"] = datetime.utcnow()
#         await db.email_conversation_states.update_one(
#             {"email_address": email_address, "user_id": user_id},
#             {"$set": updates},
#             upsert=True
#         )
    
#     async def _clear_conversation_state(self, email_address: str, user_id: str, db):
#         """Clear conversation state after booking completion"""
#         await db.email_conversation_states.delete_one({
#             "email_address": email_address,
#             "user_id": user_id
#         })
    
#     # ============================================
#     # ✅ DATA EXTRACTION HELPERS (FROM SMS)
#     # ============================================
    
#     def _extract_name(self, text: str) -> Optional[str]:
#         """Extract name from text - Accept ANY reasonable text as name"""
#         text = text.strip()
        
#         # Accept anything between 2-50 characters as a name
#         if len(text) < 2 or len(text) > 50:
#             logger.warning(f"❌ Name too short/long: '{text}'")
#             return None
        
#         # Take first 3 words max
#         words = text.split()[:3]
#         name = " ".join(words)
        
#         # Capitalize each word
#         name = " ".join([word.capitalize() for word in name.split()])
        
#         logger.info(f"✅ Extracted name: '{name}'")
#         return name if len(name) >= 2 else None
    
#     def _extract_email(self, text: str) -> Optional[str]:
#         """Extract email address from text"""
#         email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#         match = re.search(email_pattern, text)
#         if match:
#             logger.info(f"✅ Extracted email: '{match.group(0)}'")
#             return match.group(0).lower()
#         logger.warning(f"❌ No email found in: '{text}'")
#         return None
    
#     def _extract_date_time(self, text: str) -> Optional[datetime]:
#         """Extract date/time from natural language"""
#         try:
#             import dateparser
#             parsed_date = dateparser.parse(
#                 text.lower().strip(),
#                 settings={'PREFER_DATES_FROM': 'future', 'RETURN_AS_TIMEZONE_AWARE': False}
#             )
            
#             if parsed_date:
#                 # If no time specified, default to 10 AM
#                 if parsed_date.hour == 0 and parsed_date.minute == 0:
#                     parsed_date = parsed_date.replace(hour=10, minute=0)
                
#                 logger.info(f"✅ Extracted date: '{parsed_date}'")
#                 return parsed_date
            
#             logger.warning(f"❌ No date found in: '{text}'")
#             return None
#         except Exception as e:
#             logger.error(f"Date parsing error: {e}")
#             return None
    
#     # ============================================
#     # ✅ APPOINTMENT BOOKING LOGIC (EXACT SMS FLOW)
#     # ============================================
    
#     async def _process_appointment_booking(
#         self, 
#         user_message: str, 
#         conversation_state: Dict, 
#         user_id: str, 
#         email_address: str, 
#         db
#     ) -> Dict:
#         """
#         Process appointment booking conversation
#         ✅ EXACT SMS FLOW: name → email → service → date
#         """
#         try:
#             collected_data = conversation_state.get("collected_data", {})
#             current_step = conversation_state.get("current_step")
            
#             logger.info(f"\n{'='*80}")
#             logger.info(f"📅 APPOINTMENT BOOKING")
#             logger.info(f"   Current step: {current_step}")
#             logger.info(f"   Collected so far: {list(collected_data.keys())}")
#             logger.info(f"   User message: '{user_message}'")
#             logger.info(f"{'='*80}\n")
            
#             # ✅ STEP 1: Collect NAME
#             if not collected_data.get("name"):
#                 logger.info("🔍 Step 1: Collecting NAME")
#                 name = self._extract_name(user_message)
#                 if name:
#                     collected_data["name"] = name
#                     await self._update_conversation_state(
#                         email_address, user_id,
#                         {"collected_data": collected_data, "current_step": "name", "booking_in_progress": True},
#                         db
#                     )
#                     logger.info(f"✅ Name collected: '{name}'")
#                     return {
#                         "response": f"Thank you, {name}! What's your email address so I can send you a confirmation?",
#                         "booking_complete": False
#                     }
#                 else:
#                     logger.warning("⚠️ Could not extract name")
#                     return {
#                         "response": "I didn't catch your name. Could you please tell me your name?",
#                         "booking_complete": False
#                     }
            
#             # ✅ STEP 2: Collect EMAIL
#             elif not collected_data.get("email"):
#                 logger.info("🔍 Step 2: Collecting EMAIL")
#                 extracted_email = self._extract_email(user_message)
#                 if extracted_email:
#                     collected_data["email"] = extracted_email
#                     await self._update_conversation_state(
#                         email_address, user_id,
#                         {"collected_data": collected_data, "current_step": "email", "booking_in_progress": True},
#                         db
#                     )
#                     logger.info(f"✅ Email collected: '{extracted_email}'")
#                     return {
#                         "response": "Great! We offer the following services:\n- Power Washing\n- Christmas Lights Installation\n- House Painting\n- General Maintenance\n\nWhich service would you like?",
#                         "booking_complete": False
#                     }
#                 else:
#                     logger.warning("⚠️ Could not extract email")
#                     return {
#                         "response": "I didn't find a valid email address. Could you please provide your email?",
#                         "booking_complete": False
#                     }
            
#             # ✅ STEP 3: Collect SERVICE
#             elif not collected_data.get("service"):
#                 logger.info("🔍 Step 3: Collecting SERVICE")
#                 service = user_message.strip()
                
#                 # Map common variations to service names
#                 service_lower = service.lower()
#                 if "power" in service_lower or "wash" in service_lower:
#                     service = "Power Washing"
#                 elif "christmas" in service_lower or "light" in service_lower:
#                     service = "Christmas Lights Installation"
#                 elif "paint" in service_lower:
#                     service = "House Painting"
#                 elif "maintenance" in service_lower or "general" in service_lower:
#                     service = "General Maintenance"
#                 else:
#                     service = service.title()  # Capitalize properly
                
#                 collected_data["service"] = service
#                 await self._update_conversation_state(
#                     email_address, user_id,
#                     {"collected_data": collected_data, "current_step": "service", "booking_in_progress": True},
#                     db
#                 )
#                 logger.info(f"✅ Service collected: '{service}'")
#                 return {
#                     "response": f"Perfect! When would you like to schedule {service}? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
#                     "booking_complete": False
#                 }
            
#             # ✅ STEP 4: Collect DATE and CREATE APPOINTMENT
#             elif not collected_data.get("date"):
#                 logger.info("🔍 Step 4: Collecting DATE")
#                 appointment_date = self._extract_date_time(user_message)
#                 if appointment_date:
#                     collected_data["date"] = appointment_date.isoformat()
#                     logger.info(f"✅ Date collected: '{appointment_date}'")
#                     logger.info("🎯 Creating appointment now...")
                    
#                     # ✅ All data collected - create appointment!
#                     return await self._create_appointment(
#                         collected_data, user_id, email_address, db
#                     )
#                 else:
#                     logger.warning("⚠️ Could not extract date")
#                     return {
#                         "response": "I didn't understand the date/time. Please try again with something like 'tomorrow at 2pm' or 'Friday at 10am'.",
#                         "booking_complete": False
#                     }
            
#             # Shouldn't reach here
#             else:
#                 logger.warning("⚠️ Unexpected state")
#                 return await self._create_appointment(
#                     collected_data, user_id, email_address, db
#                 )
                
#         except Exception as e:
#             logger.error(f"❌ Error processing appointment: {e}", exc_info=True)
#             await self._clear_conversation_state(email_address, user_id, db)
#             return {
#                 "response": "I apologize, but there was an error processing your appointment. Please try again or contact us directly.",
#                 "booking_complete": False
#             }
    
#     async def _create_appointment(self, collected_data: Dict, user_id: str, email_address: str, db) -> Dict:
#         """Create appointment in Google Calendar and database"""
#         try:
#             from app.services.google_calendar import google_calendar_service
            
#             logger.info(f"\n{'='*80}")
#             logger.info(f"📅 CREATING APPOINTMENT")
#             logger.info(f"   Name: {collected_data.get('name')}")
#             logger.info(f"   Email: {collected_data.get('email')}")
#             logger.info(f"   Service: {collected_data.get('service')}")
#             logger.info(f"   Date: {collected_data.get('date')}")
#             logger.info(f"{'='*80}\n")
            
#             customer_name = collected_data["name"]
#             customer_email = collected_data["email"]
#             appointment_date = datetime.fromisoformat(collected_data["date"])
#             service_type = collected_data.get("service", "General Appointment")
#             appointment_time = appointment_date.strftime("%H:%M")
            
#             # ✅ Create Google Calendar event
#             calendar_result = await google_calendar_service.create_event(
#                 customer_name=customer_name,
#                 customer_email=customer_email,
#                 customer_phone=email_address,  # Use email as contact
#                 appointment_date=appointment_date,
#                 appointment_time=appointment_time,
#                 duration_minutes=60,
#                 service_type=service_type,
#                 notes="Booked via email"
#             )
            
#             if not calendar_result.get("success"):
#                 raise Exception(f"Calendar error: {calendar_result.get('error')}")
            
#             logger.info(f"✅ Google Calendar event created: {calendar_result.get('event_id')}")
            
#             # ✅ Save to database
#             appointment_data = {
#                 "user_id": user_id,
#                 "customer_name": customer_name,
#                 "customer_email": customer_email,
#                 "customer_phone": email_address,
#                 "service": service_type,
#                 "appointment_date": appointment_date,
#                 "status": "confirmed",
#                 "google_calendar_event_id": calendar_result.get("event_id"),
#                 "google_calendar_link": calendar_result.get("html_link"),
#                 "booking_source": "email",
#                 "created_at": datetime.utcnow()
#             }
            
#             result = await db.appointments.insert_one(appointment_data)
#             appointment_id = str(result.inserted_id)
            
#             logger.info(f"✅ Appointment saved to database: {appointment_id}")
            
#             # ✅ Send confirmation email
#             try:
#                 formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                
#                 await email_automation_service.send_appointment_confirmation(
#                     to_email=customer_email,
#                     customer_name=customer_name,
#                     customer_phone=email_address,
#                     service_type=service_type,
#                     appointment_date=formatted_date,
#                     user_id=user_id,
#                     appointment_id=appointment_id,
#                     call_id=None
#                 )
                
#                 logger.info(f"✅ Confirmation email sent to {customer_email}")
                
#             except Exception as e:
#                 logger.error(f"❌ Error sending confirmation email: {e}")
            
#             # ✅ Clear conversation state
#             await self._clear_conversation_state(email_address, user_id, db)
            
#             # Format response
#             date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
#             response = f"Perfect! Your appointment for {service_type} is confirmed for {date_str}. I've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
            
#             logger.info(f"✅ BOOKING COMPLETE!")
            
#             return {
#                 "response": response,
#                 "booking_complete": True
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error creating appointment: {e}", exc_info=True)
#             await self._clear_conversation_state(email_address, user_id, db)
#             return {
#                 "response": "I apologize, but there was an error creating your appointment. Please try again or contact us directly.",
#                 "booking_complete": True
#             }
    
#     # ============================================
#     # ✅ AI RESPONSE GENERATION (PRIORITY LOGIC)
#     # ============================================
    
#     async def _generate_ai_response(
#         self, 
#         from_email: str, 
#         subject: str, 
#         body: str, 
#         user_id: str, 
#         db
#     ) -> Optional[str]:
#         """
#         Generate AI response using EXACT SMS WEBHOOK PRIORITY LOGIC:
#         - Priority 1: Active appointment booking
#         - Priority 2: New appointment booking request
#         - Priority 3: OpenAI for other questions
#         """
#         try:
#             if not body or len(body.strip()) < 2:
#                 logger.warning("⚠️ Empty body, skipping AI response")
#                 return None
            
#             logger.info(f"\n{'='*80}")
#             logger.info(f"📧 PROCESSING EMAIL")
#             logger.info(f"   From: {from_email}")
#             logger.info(f"   Subject: {subject}")
#             logger.info(f"   Body: '{body[:100]}{'...' if len(body) > 100 else ''}'")
#             logger.info(f"{'='*80}\n")
            
#             # Get conversation state
#             conversation_state = await self._get_conversation_state(from_email, user_id, db)
            
#             logger.info(f"📊 Conversation State:")
#             logger.info(f"   Booking in progress: {conversation_state.get('booking_in_progress')}")
#             logger.info(f"   Current step: {conversation_state.get('current_step')}")
#             logger.info(f"   Collected data: {list(conversation_state.get('collected_data', {}).keys())}")
            
#             ai_message = None
#             source = None
            
#             # ============================================
#             # ✅ PRIORITY 1: Handle Active Appointment Booking
#             # ============================================
#             if conversation_state.get("booking_in_progress"):
#                 logger.info("🎯 PRIORITY 1: Continuing active appointment booking...")
                
#                 booking_result = await self._process_appointment_booking(
#                     body, conversation_state, user_id, from_email, db
#                 )
                
#                 ai_message = booking_result["response"]
#                 source = "appointment_booking"
                
#                 logger.info(f"✅ Appointment booking response generated")
            
#             # ============================================
#             # ✅ PRIORITY 2: Check if User Wants to Book
#             # ============================================
#             elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
#                 logger.info("🎯 PRIORITY 2: Starting new appointment booking...")
                
#                 await self._update_conversation_state(
#                     from_email, user_id,
#                     {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
#                     db
#                 )
                
#                 ai_message = "Great! I can help you book an appointment. First, may I have your name?"
#                 source = "appointment_booking"
                
#                 logger.info(f"✅ New booking initiated")
            
#             # ============================================
#             # ✅ PRIORITY 3: Use OpenAI for Other Questions
#             # ============================================
#             else:
#                 logger.info("🎯 PRIORITY 3: Using OpenAI for general response...")
                
#                 try:
#                     # Get recent conversation history
#                     recent_emails = await db.email_logs.find({
#                         "from_email": from_email,
#                         "user_id": user_id
#                     }).sort("created_at", -1).limit(5).to_list(length=5)
                    
#                     # Build conversation context
#                     conversation_history = []
#                     for email_log in reversed(recent_emails):
#                         conversation_history.append({
#                             "role": "user",
#                             "content": email_log.get("content", "")[:200]
#                         })
                    
#                     # Add current message
#                     conversation_history.append({
#                         "role": "user",
#                         "content": body
#                     })
                    
#                     # Call OpenAI
#                     system_prompt = """You are a helpful customer service assistant for a home services company. 
# We offer: Power Washing, Christmas Lights Installation, House Painting, and General Maintenance.
# Be friendly, concise, and helpful. If asked about booking, guide them to say "I want to book an appointment".
# Keep responses under 150 words."""
                    
#                     ai_response = await openai_service.generate_completion(
#                         messages=[
#                             {"role": "system", "content": system_prompt},
#                             *conversation_history
#                         ],
#                         max_tokens=150
#                     )
                    
#                     if ai_response.get("success"):
#                         ai_message = ai_response["content"].strip()
#                         if not ai_message:
#                             ai_message = "Thank you for your email. How can I assist you?"
#                         source = "openai"
#                         logger.info(f"✅ OpenAI response generated")
#                     else:
#                         ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                         source = "fallback"
#                         logger.warning(f"⚠️ OpenAI failed, using fallback")
                        
#                 except Exception as e:
#                     logger.error(f"❌ OpenAI error: {e}")
#                     ai_message = "Thank you for your message. Our team will get back to you shortly!"
#                     source = "fallback"
            
#             logger.info(f"✅ Response generated (source: {source})")
#             logger.info(f"   Response: '{ai_message[:100]}{'...' if len(ai_message) > 100 else ''}'")
            
#             return ai_message
            
#         except Exception as e:
#             logger.error(f"❌ Error generating AI response: {e}", exc_info=True)
#             return "Thank you for your email. Our team will respond shortly."
    
#     # ============================================
#     # EMAIL PROCESSING
#     # ============================================
    
#     async def process_email(self, uid: str, msg, db) -> bool:
#         """Process incoming email and generate AI response"""
#         try:
#             # Extract email details
#             from_email = self._extract_email_address(msg.get("From", ""))
#             to_email = self._extract_email_address(msg.get("To", ""))
#             subject = self._decode_header_value(msg.get("Subject", ""))
#             body = self._get_email_body(msg)
            
#             # Skip emails from self
#             if from_email.lower() == self.email_user.lower():
#                 logger.info(f"⏭️ Skipping email from self")
#                 return False
            
#             # Skip empty emails
#             if not body.strip():
#                 logger.info(f"⏭️ Skipping empty email")
#                 return False
            
#             logger.info(f"📨 Processing email from: {from_email}")
#             logger.info(f"   Subject: {subject}")
            
#             # Get first active user
#             users = await db.users.find({"is_active": True}).to_list(length=1)
#             if not users:
#                 logger.warning("⚠️ No active users found")
#                 return False
            
#             user_id = str(users[0]["_id"])
            
#             # ✅ Store incoming email in database
#             email_log_data = {
#                 "user_id": user_id,
#                 "to_email": to_email,
#                 "from_email": from_email,
#                 "subject": subject[:500] if len(subject) > 500 else subject,
#                 "content": body[:5000] if len(body) > 5000 else body,
#                 "text_content": body[:5000] if len(body) > 5000 else body,
#                 "status": "received",
#                 "direction": "inbound",
#                 "created_at": datetime.utcnow(),
#                 "opened_count": 0,
#                 "clicked_count": 0,
#                 "clicked_links": []
#             }
            
#             await db.email_logs.insert_one(email_log_data)
#             logger.info(f"✅ Incoming email stored in database")
            
#             # ✅ Generate AI response
#             ai_response = await self._generate_ai_response(
#                 from_email, subject, body, user_id, db
#             )
            
#             if not ai_response:
#                 logger.info("⏭️ No AI response generated")
#                 return True
            
#             # ✅ Send AI response via SMTP
#             try:
#                 response_subject = f"Re: {subject}" if not subject.startswith("Re:") else subject
                
#                 await email_automation_service.send_email(
#                     to_email=from_email,
#                     subject=response_subject,
#                     html_content=f"""
#                     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
#                         <p>{ai_response.replace(chr(10), '<br>')}</p>
#                         <br>
#                         <p style="color: #666; font-size: 12px;">
#                             This is an automated response. If you need immediate assistance, 
#                             please contact us directly.
#                         </p>
#                     </div>
#                     """,
#                     user_id=user_id
#                 )
                
#                 logger.info(f"✅ AI response email sent to {from_email}")
                
#                 # ✅ Store outbound email in database
#                 outbound_log = {
#                     "user_id": user_id,
#                     "to_email": from_email,
#                     "from_email": self.from_email,
#                     "subject": response_subject,
#                     "content": ai_response,
#                     "text_content": ai_response,
#                     "status": "sent",
#                     "direction": "outbound",
#                     "created_at": datetime.utcnow()
#                 }
                
#                 await db.email_logs.insert_one(outbound_log)
#                 logger.info(f"✅ Outbound AI response stored in database")
                
#             except Exception as e:
#                 logger.error(f"❌ Error sending AI response: {e}")
            
#             return True
            
#         except Exception as e:
#             logger.error(f"❌ Error processing email: {e}", exc_info=True)
#             return False
    
#     # ============================================
#     # INBOX POLLING
#     # ============================================
    
#     async def check_inbox(self):
#         """Check inbox for new emails"""
#         if not self.is_configured():
#             logger.error("❌ Email not configured")
#             return
        
#         mail = None
#         try:
#             # Connect to Gmail IMAP
#             mail = imaplib.IMAP4_SSL(self.imap_host, self.imap_port)
#             mail.login(self.email_user, self.email_password)
#             mail.select("INBOX")
            
#             # Search for unread emails
#             status, messages = mail.search(None, "UNSEEN")
#             if status != "OK":
#                 return
            
#             email_ids = messages[0].split()
            
#             if not email_ids:
#                 logger.info("📭 No new emails")
#                 return
            
#             logger.info(f"📬 Found {len(email_ids)} new email(s)")
            
#             # Get database connection
#             db = await get_database()
            
#             # Process each email
#             for email_id in email_ids:
#                 uid = email_id.decode()
                
#                 # Skip if already processed
#                 if uid in self.processed_uids:
#                     continue
                
#                 # Fetch email
#                 status, msg_data = mail.fetch(email_id, "(RFC822)")
#                 if status != "OK":
#                     continue
                
#                 raw_email = msg_data[0][1]
#                 msg = email.message_from_bytes(raw_email)
                
#                 # Process the email
#                 await self.process_email(uid, msg, db)
                
#                 # Mark as processed
#                 self.processed_uids.add(uid)
                
#                 # Prevent memory leak - keep only last 1000 UIDs
#                 if len(self.processed_uids) > 1000:
#                     self.processed_uids = set(list(self.processed_uids)[-500:])
            
#         except Exception as e:
#             logger.error(f"❌ Inbox check error: {e}", exc_info=True)
#         finally:
#             # Close connection
#             if mail:
#                 try:
#                     mail.close()
#                 except:
#                     pass
#                 try:
#                     mail.logout()
#                 except:
#                     pass
    
#     async def start_polling(self):
#         """Start polling inbox"""
#         if not self.is_configured():
#             logger.error("❌ Email not configured - cannot start polling")
#             return
        
#         self.is_running = True
#         logger.info(f"🚀 Email poller started (checking every {self.polling_interval}s)")
#         logger.info(f"📧 Monitoring: {self.email_user}")
#         logger.info("=" * 80)
        
#         while self.is_running:
#             try:
#                 await self.check_inbox()
#             except Exception as e:
#                 logger.error(f"❌ Polling error: {e}", exc_info=True)
            
#             # Wait before next check
#             await asyncio.sleep(self.polling_interval)
    
#     def stop_polling(self):
#         """Stop polling inbox"""
#         self.is_running = False
#         logger.info("🛑 Email poller stopped")


# # Create singleton instance
# email_poller_service = EmailPollerService()

# backend/app/services/email_poller.py - ✅ COMPLETE FIXED VERSION

import asyncio
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timedelta
import logging
import os
import re
from typing import Optional, Dict, Any, List

from app.database import get_database
from app.services.openai import openai_service
from app.services.email_automation import email_automation_service

logger = logging.getLogger(__name__)


class EmailPollerService:
    """
    Gmail IMAP Polling Service
    
    ✅ APPLIES EXACT SMS INBOUND LOGIC:
    - Priority 1: Active appointment booking (name → email → service → date)
    - Priority 2: New appointment booking request
    - Priority 3: OpenAI response for other questions
    
    ✅ NEW FEATURES:
    - Date filtering (only process emails from last 7 days)
    - Automated email detection (skip Google+, Facebook, etc.)
    """
    
    def __init__(self):
        self.imap_host = "imap.gmail.com"
        self.imap_port = 993
        self.email_user = os.getenv("EMAIL_USER")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        self.from_email = os.getenv("EMAIL_FROM")
        self.polling_interval = 60  # Check every 60 seconds
        self.is_running = False
        self.processed_uids = set()
        
        # ✅ NEW: Only process emails from last N days
        self.days_to_check = 7
        
        logger.info("=" * 80)
        logger.info("📧 EMAIL POLLER SERVICE INITIALIZED")
        logger.info("=" * 80)
        logger.info(f"   Email User: {self.email_user}")
        logger.info(f"   From Email: {self.from_email}")
        logger.info(f"   Polling Interval: {self.polling_interval}s")
        logger.info(f"   Days to Check: {self.days_to_check}")
        logger.info("=" * 80)
    
    def is_configured(self) -> bool:
        """Check if email service is configured"""
        return all([self.email_user, self.email_password])
    
    # ============================================
    # ✅ NEW: AUTOMATED EMAIL DETECTION
    # ============================================
    
    def _is_automated_email(self, email_address: str) -> bool:
        """✅ Filter out automated/notification emails"""
        automated_patterns = [
            "noreply",
            "no-reply",
            "notifications",
            "notification",
            "plus.google.com",
            "facebook.com",
            "facebookmail.com",
            "twitter.com",
            "twittermail.com",
            "linkedin.com",
            "google.com",
            "youtube.com",
            "instagram.com",
            "automated",
            "donotreply",
            "mailer-daemon",
            "postmaster"
        ]
        
        email_lower = email_address.lower()
        return any(pattern in email_lower for pattern in automated_patterns)
    
    # ============================================
    # EMAIL PARSING HELPERS
    # ============================================
    
    def _decode_header_value(self, value) -> str:
        """Decode email header value"""
        if value is None:
            return ""
        decoded_parts = decode_header(value)
        result = ""
        for part, encoding in decoded_parts:
            if isinstance(part, bytes):
                result += part.decode(encoding or 'utf-8', errors='ignore')
            else:
                result += part
        return result
    
    def _extract_email_address(self, email_string: str) -> str:
        """Extract email address from 'Name <email@example.com>' format"""
        if not email_string:
            return ""
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', email_string)
        return match.group(0).lower() if match else email_string.lower()
    
    def _get_email_body(self, msg) -> str:
        """Extract clean email body (removes signatures and quoted text)"""
        body = ""
        
        # Handle multipart emails
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                
                # Skip attachments
                if "attachment" in content_disposition:
                    continue
                
                # Get plain text content
                if content_type == "text/plain":
                    try:
                        payload = part.get_payload(decode=True)
                        if payload:
                            charset = part.get_content_charset() or 'utf-8'
                            body = payload.decode(charset, errors='ignore')
                            break
                    except Exception as e:
                        logger.error(f"Error decoding part: {e}")
        else:
            try:
                payload = msg.get_payload(decode=True)
                if payload:
                    charset = msg.get_content_charset() or 'utf-8'
                    body = payload.decode(charset, errors='ignore')
            except Exception as e:
                logger.error(f"Error decoding body: {e}")
        
        # Clean the body - remove quoted text and signatures
        lines = body.split('\n')
        clean_lines = []
        
        for line in lines:
            line_stripped = line.strip()
            
            # Stop at quoted text
            if line_stripped.startswith('>'):
                break
            
            # Stop at "wrote:" lines
            if 'wrote:' in line_stripped.lower():
                break
            
            # Stop at date/time stamps (email replies)
            if line_stripped.lower().startswith('on ') and (' at ' in line_stripped.lower() or ', ' in line_stripped):
                break
            
            # Stop at signature separators
            if line_stripped in ['--', '---', '___']:
                break
            
            # Stop at common signature starters
            if any(line_stripped.lower().startswith(sig) for sig in ['sent from', 'get outlook', 'sent via']):
                break
            
            clean_lines.append(line)
        
        result = '\n'.join(clean_lines).strip()
        
        # Fallback: if no clean result, take first non-quoted line
        if not result and body:
            for line in body.split('\n'):
                if line.strip() and not line.strip().startswith('>'):
                    result = line.strip()
                    break
        
        logger.info(f"📝 Extracted body: '{result[:100]}{'...' if len(result) > 100 else ''}'")
        return result
    
    # ============================================
    # CONVERSATION STATE MANAGEMENT
    # ============================================
    
    async def _get_conversation_state(self, email_address: str, user_id: str, db) -> Dict[str, Any]:
        """Get or create conversation state for email thread"""
        state = await db.email_conversation_states.find_one({
            "email_address": email_address,
            "user_id": user_id
        })
        
        if not state:
            state = {
                "email_address": email_address,
                "user_id": user_id,
                "booking_in_progress": False,
                "current_step": None,
                "collected_data": {},
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.email_conversation_states.insert_one(state)
        
        return state
    
    async def _update_conversation_state(self, email_address: str, user_id: str, updates: Dict, db):
        """Update conversation state"""
        updates["updated_at"] = datetime.utcnow()
        await db.email_conversation_states.update_one(
            {"email_address": email_address, "user_id": user_id},
            {"$set": updates},
            upsert=True
        )
    
    async def _clear_conversation_state(self, email_address: str, user_id: str, db):
        """Clear conversation state after booking completion"""
        await db.email_conversation_states.delete_one({
            "email_address": email_address,
            "user_id": user_id
        })
    
    # ============================================
    # DATA EXTRACTION HELPERS
    # ============================================
    
    def _extract_name(self, text: str) -> Optional[str]:
        """Extract name from text - Accept ANY reasonable text as name"""
        text = text.strip()
        
        # Accept anything between 2-50 characters as a name
        if len(text) < 2 or len(text) > 50:
            logger.warning(f"❌ Name too short/long: '{text}'")
            return None
        
        # Take first 3 words max
        words = text.split()[:3]
        name = " ".join(words)
        
        # Capitalize each word
        name = " ".join([word.capitalize() for word in name.split()])
        
        logger.info(f"✅ Extracted name: '{name}'")
        return name if len(name) >= 2 else None
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        if match:
            logger.info(f"✅ Extracted email: '{match.group(0)}'")
            return match.group(0).lower()
        logger.warning(f"❌ No email found in: '{text}'")
        return None
    
    def _extract_date_time(self, text: str) -> Optional[datetime]:
        """Extract date/time from natural language"""
        try:
            import dateparser
            parsed_date = dateparser.parse(
                text.lower().strip(),
                settings={'PREFER_DATES_FROM': 'future', 'RETURN_AS_TIMEZONE_AWARE': False}
            )
            
            if parsed_date:
                # If no time specified, default to 10 AM
                if parsed_date.hour == 0 and parsed_date.minute == 0:
                    parsed_date = parsed_date.replace(hour=10, minute=0)
                
                logger.info(f"✅ Extracted date: '{parsed_date}'")
                return parsed_date
            
            logger.warning(f"❌ No date found in: '{text}'")
            return None
        except Exception as e:
            logger.error(f"Date parsing error: {e}")
            return None
    
    # ============================================
    # APPOINTMENT BOOKING LOGIC
    # ============================================
    
    async def _process_appointment_booking(
        self, 
        user_message: str, 
        conversation_state: Dict, 
        user_id: str, 
        email_address: str, 
        db
    ) -> Dict:
        """
        Process appointment booking conversation
        ✅ EXACT SMS FLOW: name → email → service → date
        """
        try:
            collected_data = conversation_state.get("collected_data", {})
            current_step = conversation_state.get("current_step")
            
            logger.info(f"\n{'='*80}")
            logger.info(f"📅 APPOINTMENT BOOKING")
            logger.info(f"   Current step: {current_step}")
            logger.info(f"   Collected so far: {list(collected_data.keys())}")
            logger.info(f"   User message: '{user_message}'")
            logger.info(f"{'='*80}\n")
            
            # STEP 1: Collect NAME
            if not collected_data.get("name"):
                logger.info("🔍 Step 1: Collecting NAME")
                name = self._extract_name(user_message)
                if name:
                    collected_data["name"] = name
                    await self._update_conversation_state(
                        email_address, user_id,
                        {"collected_data": collected_data, "current_step": "name", "booking_in_progress": True},
                        db
                    )
                    logger.info(f"✅ Name collected: '{name}'")
                    return {
                        "response": f"Thank you, {name}! What's your email address so I can send you a confirmation?",
                        "booking_complete": False
                    }
                else:
                    logger.warning("⚠️ Could not extract name")
                    return {
                        "response": "I didn't catch your name. Could you please tell me your name?",
                        "booking_complete": False
                    }
            
            # STEP 2: Collect EMAIL
            elif not collected_data.get("email"):
                logger.info("🔍 Step 2: Collecting EMAIL")
                extracted_email = self._extract_email(user_message)
                if extracted_email:
                    collected_data["email"] = extracted_email
                    await self._update_conversation_state(
                        email_address, user_id,
                        {"collected_data": collected_data, "current_step": "email", "booking_in_progress": True},
                        db
                    )
                    logger.info(f"✅ Email collected: '{extracted_email}'")
                    return {
                        "response": "Great! We offer the following services:\n- Power Washing\n- Christmas Lights Installation\n- House Painting\n- General Maintenance\n\nWhich service would you like?",
                        "booking_complete": False
                    }
                else:
                    logger.warning("⚠️ Could not extract email")
                    return {
                        "response": "I didn't find a valid email address. Could you please provide your email?",
                        "booking_complete": False
                    }
            
            # STEP 3: Collect SERVICE
            elif not collected_data.get("service"):
                logger.info("🔍 Step 3: Collecting SERVICE")
                service = user_message.strip()
                
                # Map common variations to service names
                service_lower = service.lower()
                if "power" in service_lower or "wash" in service_lower:
                    service = "Power Washing"
                elif "christmas" in service_lower or "light" in service_lower:
                    service = "Christmas Lights Installation"
                elif "paint" in service_lower:
                    service = "House Painting"
                elif "maintenance" in service_lower or "general" in service_lower:
                    service = "General Maintenance"
                else:
                    service = service.title()
                
                collected_data["service"] = service
                await self._update_conversation_state(
                    email_address, user_id,
                    {"collected_data": collected_data, "current_step": "service", "booking_in_progress": True},
                    db
                )
                logger.info(f"✅ Service collected: '{service}'")
                return {
                    "response": f"Perfect! When would you like to schedule {service}? (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
                    "booking_complete": False
                }
            
            # STEP 4: Collect DATE and CREATE APPOINTMENT
            elif not collected_data.get("date"):
                logger.info("🔍 Step 4: Collecting DATE")
                appointment_date = self._extract_date_time(user_message)
                if appointment_date:
                    collected_data["date"] = appointment_date.isoformat()
                    logger.info(f"✅ Date collected: '{appointment_date}'")
                    logger.info("🎯 Creating appointment now...")
                    
                    return await self._create_appointment(
                        collected_data, user_id, email_address, db
                    )
                else:
                    logger.warning("⚠️ Could not extract date")
                    return {
                        "response": "I didn't understand the date/time. Please try again with something like 'tomorrow at 2pm' or 'Friday at 10am'.",
                        "booking_complete": False
                    }
            
            else:
                logger.warning("⚠️ Unexpected state")
                return await self._create_appointment(
                    collected_data, user_id, email_address, db
                )
                
        except Exception as e:
            logger.error(f"❌ Error processing appointment: {e}", exc_info=True)
            await self._clear_conversation_state(email_address, user_id, db)
            return {
                "response": "I apologize, but there was an error processing your appointment. Please try again or contact us directly.",
                "booking_complete": False
            }
    
    async def _create_appointment(self, collected_data: Dict, user_id: str, email_address: str, db) -> Dict:
        """Create appointment in Google Calendar and database"""
        try:
            from app.services.google_calendar import google_calendar_service
            
            logger.info(f"\n{'='*80}")
            logger.info(f"📅 CREATING APPOINTMENT")
            logger.info(f"   Name: {collected_data.get('name')}")
            logger.info(f"   Email: {collected_data.get('email')}")
            logger.info(f"   Service: {collected_data.get('service')}")
            logger.info(f"   Date: {collected_data.get('date')}")
            logger.info(f"{'='*80}\n")
            
            # ✅ FIXED: Access dictionary keys correctly
            customer_name = collected_data.get("name", "Customer")
            customer_email = collected_data.get("email", email_address)
            appointment_date = datetime.fromisoformat(collected_data["date"])
            service_type = collected_data.get("service", "General Appointment")
            appointment_time = appointment_date.strftime("%H:%M")
            
            # Create Google Calendar event
            calendar_result = await google_calendar_service.create_event(
                customer_name=customer_name,
                customer_email=customer_email,
                customer_phone=email_address,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                duration_minutes=60,
                service_type=service_type,
                notes="Booked via email"
            )
            
            if not calendar_result.get("success"):
                raise Exception(f"Calendar error: {calendar_result.get('error')}")
            
            logger.info(f"✅ Google Calendar event created: {calendar_result.get('event_id')}")
            
            # Save to database
            appointment_data = {
                "user_id": user_id,
                "customer_name": customer_name,
                "customer_email": customer_email,
                "customer_phone": email_address,
                "service": service_type,
                "appointment_date": appointment_date,
                "status": "confirmed",
                "google_calendar_event_id": calendar_result.get("event_id"),
                "google_calendar_link": calendar_result.get("html_link"),
                "booking_source": "email",
                "created_at": datetime.utcnow()
            }
            
            result = await db.appointments.insert_one(appointment_data)
            appointment_id = str(result.inserted_id)
            
            logger.info(f"✅ Appointment saved to database: {appointment_id}")
            
            # Send confirmation email
            try:
                formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                
                await email_automation_service.send_appointment_confirmation(
                    to_email=customer_email,
                    customer_name=customer_name,
                    customer_phone=email_address,
                    service_type=service_type,
                    appointment_date=formatted_date,
                    user_id=user_id,
                    appointment_id=appointment_id,
                    call_id=None
                )
                
                logger.info(f"✅ Confirmation email sent to {customer_email}")
                
            except Exception as e:
                logger.error(f"❌ Error sending confirmation email: {e}")
            
            # Clear conversation state
            await self._clear_conversation_state(email_address, user_id, db)
            
            # Format response
            date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
            response = f"Perfect! Your appointment for {service_type} is confirmed for {date_str}. I've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
            
            logger.info(f"✅ BOOKING COMPLETE!")
            
            return {
                "response": response,
                "booking_complete": True
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment: {e}", exc_info=True)
            # ✅ FIXED: Proper error handling
            try:
                await self._clear_conversation_state(email_address, user_id, db)
            except Exception as clear_error:
                logger.error(f"❌ Error clearing state: {clear_error}")
            
            return {
                "response": "I apologize, but there was an error creating your appointment. Please try again or contact us directly.",
                "booking_complete": True
            }
    
    # ============================================
    # AI RESPONSE GENERATION
    # ============================================
    
    async def _generate_ai_response(
        self, 
        from_email: str, 
        subject: str, 
        body: str, 
        user_id: str, 
        db
    ) -> Optional[str]:
        """
        Generate AI response using EXACT SMS WEBHOOK PRIORITY LOGIC:
        - Priority 1: Active appointment booking
        - Priority 2: New appointment booking request
        - Priority 3: OpenAI for other questions
        """
        try:
            if not body or len(body.strip()) < 2:
                logger.warning("⚠️ Empty body, skipping AI response")
                return None
            
            logger.info(f"\n{'='*80}")
            logger.info(f"📧 PROCESSING EMAIL")
            logger.info(f"   From: {from_email}")
            logger.info(f"   Subject: {subject}")
            logger.info(f"   Body: '{body[:100]}{'...' if len(body) > 100 else ''}'")
            logger.info(f"{'='*80}\n")
            
            # Get conversation state
            conversation_state = await self._get_conversation_state(from_email, user_id, db)
            
            logger.info(f"📊 Conversation State:")
            logger.info(f"   Booking in progress: {conversation_state.get('booking_in_progress')}")
            logger.info(f"   Current step: {conversation_state.get('current_step')}")
            logger.info(f"   Collected data: {list(conversation_state.get('collected_data', {}).keys())}")
            
            ai_message = None
            source = None
            
            # PRIORITY 1: Handle Active Appointment Booking
            if conversation_state.get("booking_in_progress"):
                logger.info("🎯 PRIORITY 1: Continuing active appointment booking...")
                
                booking_result = await self._process_appointment_booking(
                    body, conversation_state, user_id, from_email, db
                )
                
                ai_message = booking_result["response"]
                source = "appointment_booking"
                
                logger.info(f"✅ Appointment booking response generated")
            
            # PRIORITY 2: Check if User Wants to Book
            elif any(word in body.lower() for word in ["book", "appointment", "schedule", "reserve"]):
                logger.info("🎯 PRIORITY 2: Starting new appointment booking...")
                
                await self._update_conversation_state(
                    from_email, user_id,
                    {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
                    db
                )
                
                ai_message = "Great! I can help you book an appointment. First, may I have your name?"
                source = "appointment_booking"
                
                logger.info(f"✅ New booking initiated")
            
            # PRIORITY 3: Use OpenAI for Other Questions
            else:
                logger.info("🎯 PRIORITY 3: Using OpenAI for general response...")
                
                try:
                    # Get recent conversation history
                    recent_emails = await db.email_logs.find({
                        "from_email": from_email,
                        "user_id": user_id
                    }).sort("created_at", -1).limit(5).to_list(length=5)
                    
                    # Build conversation context
                    conversation_history = []
                    for email_log in reversed(recent_emails):
                        conversation_history.append({
                            "role": "user",
                            "content": email_log.get("content", "")[:200]
                        })
                    
                    # Add current message
                    conversation_history.append({
                        "role": "user",
                        "content": body
                    })
                    
                    # Call OpenAI
                    system_prompt = """You are a helpful customer service assistant for a home services company. 
We offer: Power Washing, Christmas Lights Installation, House Painting, and General Maintenance.
Be friendly, concise, and helpful. If asked about booking, guide them to say "I want to book an appointment".
Keep responses under 150 words."""
                    
                    ai_response = await openai_service.generate_completion(
                        messages=conversation_history,
                        system_prompt=system_prompt,
                        max_tokens=150
                    )
                    
                    if ai_response.get("success"):
                        ai_message = ai_response["content"].strip()
                        if not ai_message:
                            ai_message = "Thank you for your email. How can I assist you?"
                        source = "openai"
                        logger.info(f"✅ OpenAI response generated")
                    else:
                        ai_message = "Thank you for your message. Our team will get back to you shortly!"
                        source = "fallback"
                        logger.warning(f"⚠️ OpenAI failed, using fallback")
                        
                except Exception as e:
                    logger.error(f"❌ OpenAI error: {e}")
                    ai_message = "Thank you for your message. Our team will get back to you shortly!"
                    source = "fallback"
            
            logger.info(f"✅ Response generated (source: {source})")
            logger.info(f"   Response: '{ai_message[:100]}{'...' if len(ai_message) > 100 else ''}'")
            
            return ai_message
            
        except Exception as e:
            logger.error(f"❌ Error generating AI response: {e}", exc_info=True)
            return "Thank you for your email. Our team will respond shortly."
    
    # ============================================
    # EMAIL PROCESSING
    # ============================================
    
    async def process_email(self, uid: str, msg, db) -> bool:
        """Process incoming email and generate AI response"""
        try:
            # Extract email details
            from_email = self._extract_email_address(msg.get("From", ""))
            to_email = self._extract_email_address(msg.get("To", ""))
            subject = self._decode_header_value(msg.get("Subject", ""))
            body = self._get_email_body(msg)
            
            # ✅ NEW: Skip automated emails
            if self._is_automated_email(from_email):
                logger.info(f"⏭️ Skipping automated email from {from_email}")
                return False
            
            # Skip emails from self
            if from_email.lower() == self.email_user.lower():
                logger.info(f"⏭️ Skipping email from self")
                return False
            
            # Skip empty emails
            if not body.strip():
                logger.info(f"⏭️ Skipping empty email")
                return False
            
            logger.info(f"📨 Processing email from: {from_email}")
            logger.info(f"   Subject: {subject}")
            
            # Get first active user
            users = await db.users.find({"is_active": True}).to_list(length=1)
            if not users:
                logger.warning("⚠️ No active users found")
                return False
            
            user_id = str(users[0]["_id"])
            
            # Store incoming email in database
            email_log_data = {
                "user_id": user_id,
                "to_email": to_email,
                "from_email": from_email,
                "subject": subject[:500] if len(subject) > 500 else subject,
                "content": body[:5000] if len(body) > 5000 else body,
                "text_content": body[:5000] if len(body) > 5000 else body,
                "status": "received",
                "direction": "inbound",
                "created_at": datetime.utcnow(),
                "opened_count": 0,
                "clicked_count": 0,
                "clicked_links": []
            }
            
            await db.email_logs.insert_one(email_log_data)
            logger.info(f"✅ Incoming email stored in database")
            
            # Generate AI response
            ai_response = await self._generate_ai_response(
                from_email, subject, body, user_id, db
            )
            
            if not ai_response:
                logger.info("⏭️ No AI response generated")
                return True
            
            # Send AI response via SMTP
            try:
                response_subject = f"Re: {subject}" if not subject.startswith("Re:") else subject
                
                await email_automation_service.send_email(
                    to_email=from_email,
                    subject=response_subject,
                    html_content=f"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <p>{ai_response.replace(chr(10), '<br>')}</p>
                        <br>
                        <p style="color: #666; font-size: 12px;">
                            This is an automated response. If you need immediate assistance, 
                            please contact us directly.
                        </p>
                    </div>
                    """,
                    user_id=user_id
                )
                
                logger.info(f"✅ AI response email sent to {from_email}")
                
                # Store outbound email in database
                outbound_log = {
                    "user_id": user_id,
                    "to_email": from_email,
                    "from_email": self.from_email,
                    "subject": response_subject,
                    "content": ai_response,
                    "text_content": ai_response,
                    "status": "sent",
                    "direction": "outbound",
                    "created_at": datetime.utcnow()
                }
                
                await db.email_logs.insert_one(outbound_log)
                logger.info(f"✅ Outbound AI response stored in database")
                
            except Exception as e:
                logger.error(f"❌ Error sending AI response: {e}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error processing email: {e}", exc_info=True)
            return False
    
    # ============================================
    # ✅ UPDATED: INBOX POLLING WITH DATE FILTER
    # ============================================
    
    async def check_inbox(self):
        """✅ Check inbox for new emails (last 7 days only)"""
        if not self.is_configured():
            logger.error("❌ Email not configured")
            return
        
        mail = None
        try:
            # Connect to Gmail IMAP
            mail = imaplib.IMAP4_SSL(self.imap_host, self.imap_port)
            mail.login(self.email_user, self.email_password)
            mail.select("INBOX")
            
            # ✅ NEW: Only get emails from last N days
            cutoff_date = (datetime.now() - timedelta(days=self.days_to_check)).strftime("%d-%b-%Y")
            search_criteria = f'(UNSEEN SINCE {cutoff_date})'
            
            logger.info(f"🔍 Searching for emails since: {cutoff_date}")
            
            status, messages = mail.search(None, search_criteria)
            if status != "OK":
                logger.warning("⚠️ IMAP search failed")
                return
            
            email_ids = messages[0].split()
            
            if not email_ids:
                logger.info("📭 No new emails")
                return
            
            logger.info(f"📬 Found {len(email_ids)} new email(s) (last {self.days_to_check} days)")
            
            # Get database connection
            db = await get_database()
            
            # Process each email
            processed_count = 0
            skipped_count = 0
            
            for email_id in email_ids:
                uid = email_id.decode()
                
                # Skip if already processed
                if uid in self.processed_uids:
                    skipped_count += 1
                    continue
                
                # Fetch email
                status, msg_data = mail.fetch(email_id, "(RFC822)")
                if status != "OK":
                    continue
                
                raw_email = msg_data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Process the email
                success = await self.process_email(uid, msg, db)
                
                if success:
                    processed_count += 1
                else:
                    skipped_count += 1
                
                # Mark as processed
                self.processed_uids.add(uid)
                
                # Prevent memory leak - keep only last 1000 UIDs
                if len(self.processed_uids) > 1000:
                    self.processed_uids = set(list(self.processed_uids)[-500:])
            
            logger.info(f"✅ Processed: {processed_count}, Skipped: {skipped_count}")
            
        except Exception as e:
            logger.error(f"❌ Inbox check error: {e}", exc_info=True)
        finally:
            # Close connection
            if mail:
                try:
                    mail.close()
                    mail.logout()
                except:
                    pass
    
    async def start_polling(self):
        """Start polling inbox"""
        if not self.is_configured():
            logger.error("❌ Email not configured - cannot start polling")
            return
        
        self.is_running = True
        logger.info(f"🚀 Email poller started (checking every {self.polling_interval}s)")
        logger.info(f"📧 Monitoring: {self.email_user}")
        logger.info(f"📅 Processing emails from last {self.days_to_check} days only")
        logger.info("=" * 80)
        
        while self.is_running:
            try:
                await self.check_inbox()
            except Exception as e:
                logger.error(f"❌ Polling error: {e}", exc_info=True)
            
            # Wait before next check
            await asyncio.sleep(self.polling_interval)
    
    def stop_polling(self):
        """Stop polling inbox"""
        self.is_running = False
        logger.info("🛑 Email poller stopped")


# Create singleton instance
email_poller_service = EmailPollerService()