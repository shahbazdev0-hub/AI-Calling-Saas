# backend/app/services/email_poller.py - GMAIL IMAP POLLING SERVICE (COMPLETE WITH APPOINTMENT BOOKING)

import asyncio
import imaplib
import email
from email.header import decode_header
from datetime import datetime, timedelta
import logging
import os
import re
from typing import Optional, Dict, Any, List
import dateparser

from app.database import get_database
from app.services.openai import openai_service
from app.services.email_automation import email_automation_service

logger = logging.getLogger(__name__)


class EmailPollerService:
    """
    Gmail IMAP Polling Service
    Automatically checks inbox and processes emails with AI responses
    """
    
    def __init__(self):
        self.imap_host = "imap.gmail.com"
        self.imap_port = 993
        self.email_user = os.getenv("EMAIL_USER")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        self.from_email = os.getenv("EMAIL_FROM")
        self.polling_interval = 60  # Check every 60 seconds
        self.is_running = False
        self.processed_uids = set()  # Track processed emails
        
    def is_configured(self) -> bool:
        """Check if email polling is configured"""
        return all([self.email_user, self.email_password])
    
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
        """Extract email address from string"""
        if not email_string:
            return ""
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', email_string)
        return match.group(0).lower() if match else email_string.lower()
    
    def _get_email_body(self, msg) -> str:
        """Extract email body from message"""
        body = ""
        
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                
                # Skip attachments
                if "attachment" in content_disposition:
                    continue
                
                # Get text content
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
            # Not multipart
            try:
                payload = msg.get_payload(decode=True)
                if payload:
                    charset = msg.get_content_charset() or 'utf-8'
                    body = payload.decode(charset, errors='ignore')
            except Exception as e:
                logger.error(f"Error decoding body: {e}")
        
        # ✅ IMPROVED: Clean up the body - extract only the new message
        lines = body.split('\n')
        clean_lines = []
        
        for line in lines:
            line_stripped = line.strip()
            
            # Stop at quoted text indicators
            if line_stripped.startswith('>'):
                break
            # Stop at "On ... wrote:" patterns
            if re.match(r'^On .+ wrote:$', line_stripped):
                break
            if 'wrote:' in line_stripped and ('@' in line_stripped or 'On ' in line_stripped):
                break
            # Stop at common signature indicators
            if line_stripped == '--' or line_stripped == '---':
                break
            if line_stripped.startswith('Sent from my'):
                break
            if line_stripped.startswith('Get Outlook'):
                break
            # Stop at forwarded message indicators
            if '---------- Forwarded message' in line_stripped:
                break
                
            clean_lines.append(line)
        
        result = '\n'.join(clean_lines).strip()
        
        # ✅ If result is empty, try to get at least the first line
        if not result and body:
            first_line = body.split('\n')[0].strip()
            if first_line and not first_line.startswith('>'):
                result = first_line
        
        # ✅ Final truncation to prevent huge emails
        if len(result) > 2000:
            result = result[:2000] + "..."
        
        logger.info(f"📝 Extracted body ({len(result)} chars): {result[:100]}...")
        
        return result
    
    async def _get_conversation_state(self, email_address: str, user_id: str, db) -> Dict[str, Any]:
        """Get conversation state for email"""
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
    
    def _extract_date_time(self, text: str) -> Optional[datetime]:
        """Extract date and time from natural language text"""
        try:
            text_lower = text.lower().strip()
            
            # Try dateparser first (handles "tomorrow", "next monday", etc.)
            parsed_date = dateparser.parse(
                text_lower,
                settings={
                    'PREFER_DATES_FROM': 'future',
                    'RETURN_AS_TIMEZONE_AWARE': False
                }
            )
            
            if parsed_date:
                # If no time specified, default to 10 AM
                if parsed_date.hour == 0 and parsed_date.minute == 0:
                    parsed_date = parsed_date.replace(hour=10, minute=0)
                
                logger.info(f"✅ Parsed date: {parsed_date}")
                return parsed_date
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Date parsing error: {e}")
            return None
    
    async def _create_email_appointment(
        self,
        collected_data: Dict,
        user_id: str,
        email_address: str,
        db
    ) -> Dict:
        """Create appointment in Google Calendar and send confirmation email"""
        try:
            from app.services.google_calendar import google_calendar_service
            from app.services.email_automation import email_automation_service
            
            logger.info(f"\n{'='*80}")
            logger.info(f"📅 CREATING EMAIL APPOINTMENT")
            logger.info(f"   Name: {collected_data.get('name')}")
            logger.info(f"   Email: {collected_data.get('email')}")
            logger.info(f"   Phone: {collected_data.get('phone')}")
            logger.info(f"   Service: {collected_data.get('service')}")
            logger.info(f"   Date: {collected_data.get('date')}")
            logger.info(f"{'='*80}\n")
            
            customer_name = collected_data["name"]
            customer_email = collected_data["email"]
            customer_phone = collected_data["phone"]
            service_type = collected_data.get("service", "General Appointment")
            appointment_date = datetime.fromisoformat(collected_data["date"])
            appointment_time = appointment_date.strftime("%H:%M")
            
            # ✅ CREATE GOOGLE CALENDAR EVENT
            calendar_result = await google_calendar_service.create_event(
                customer_name=customer_name,
                customer_email=customer_email,
                customer_phone=customer_phone,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                duration_minutes=60,
                service_type=service_type,
                notes="Booked via email"
            )
            
            if not calendar_result.get("success"):
                raise Exception(f"Calendar error: {calendar_result.get('error')}")
            
            # ✅ SAVE TO DATABASE
            appointment_data = {
                "user_id": user_id,
                "customer_name": customer_name,
                "customer_email": customer_email,
                "customer_phone": customer_phone,
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
            
            logger.info(f"✅ Appointment created in DB: {appointment_id}")
            
            # ✅ SEND CONFIRMATION EMAIL
            try:
                formatted_date = appointment_date.strftime("%A, %B %d, %Y at %I:%M %p")
                formatted_time = appointment_date.strftime("%I:%M %p")
                
                await email_automation_service.send_appointment_confirmation(
                    to_email=customer_email,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    service_type=service_type,
                    appointment_date=formatted_date,
                    user_id=user_id,
                    appointment_id=appointment_id,
                    call_id=None
                )
                
                logger.info(f"✅ Confirmation email sent to {customer_email}")
                
            except Exception as email_error:
                logger.error(f"⚠️ Failed to send confirmation email: {email_error}")
            
            # ✅ RESET BOOKING STATE
            await self._update_conversation_state(
                email_address, user_id,
                {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                db
            )
            
            # ✅ RETURN SUCCESS MESSAGE
            response = f"""✅ Appointment Confirmed!

Thank you, {customer_name}! Your appointment has been successfully booked.

📋 Appointment Details:
- Service: {service_type}
- Date & Time: {formatted_date}
- Contact: {customer_phone}
- Email: {customer_email}

📧 A confirmation email has been sent to {customer_email}
📅 Calendar invitation: {calendar_result.get('html_link', 'Available in your email')}

If you need to reschedule or cancel, please reply to this email.

We look forward to serving you!"""
            
            return {
                "response": response,
                "booking_complete": True
            }
            
        except Exception as e:
            logger.error(f"❌ Error creating appointment: {e}", exc_info=True)
            import traceback
            traceback.print_exc()
            
            # Reset state
            await self._update_conversation_state(
                email_address, user_id,
                {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                db
            )
            
            return {
                "response": f"I apologize, but there was an error creating your appointment: {str(e)}\n\nPlease contact us directly to complete your booking.",
                "booking_complete": True
            }
    
    async def _process_appointment_booking(
        self,
        user_message: str,
        conversation_state: Dict,
        user_id: str,
        email_address: str,
        db
    ) -> Dict[str, Any]:
        """
        Process appointment booking flow - MATCHES SMS LOGIC
        Collects: name -> email -> phone -> service -> date/time
        Then creates Google Calendar event and sends confirmation email
        """
        try:
            current_step = conversation_state.get("current_step", "start")
            collected_data = conversation_state.get("collected_data", {})
            
            logger.info(f"📅 Appointment booking - Step: {current_step}")
            logger.info(f"   Collected so far: {list(collected_data.keys())}")
            
            # Step 1: Start - Ask for name
            if current_step == "start":
                await self._update_conversation_state(
                    email_address, user_id,
                    {"current_step": "get_name", "collected_data": {}},
                    db
                )
                return {
                    "response": "I'd be happy to help you book an appointment! First, may I have your full name?",
                    "booking_complete": False
                }
            
            # Step 2: Collect name, ask for email
            elif current_step == "get_name":
                collected_data["name"] = user_message.strip()[:100]
                await self._update_conversation_state(
                    email_address, user_id,
                    {"current_step": "get_email", "collected_data": collected_data},
                    db
                )
                return {
                    "response": f"Thank you, {collected_data['name']}! What's your email address?",
                    "booking_complete": False
                }
            
            # Step 3: Collect email, ask for phone
            elif current_step == "get_email":
                # Extract email from message
                email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', user_message)
                if email_match:
                    collected_data["email"] = email_match.group(0)
                else:
                    # Use the from_email if no valid email in message
                    collected_data["email"] = email_address
                
                await self._update_conversation_state(
                    email_address, user_id,
                    {"current_step": "get_phone", "collected_data": collected_data},
                    db
                )
                return {
                    "response": "Great! What's the best phone number to reach you?",
                    "booking_complete": False
                }
            
            # Step 4: Collect phone, ask for service
            elif current_step == "get_phone":
                # Extract phone number
                phone_match = re.search(r'[\d\s\-\(\)]+', user_message)
                if phone_match:
                    collected_data["phone"] = phone_match.group(0).strip()[:50]
                else:
                    collected_data["phone"] = user_message.strip()[:50]
                
                await self._update_conversation_state(
                    email_address, user_id,
                    {"current_step": "get_service", "collected_data": collected_data},
                    db
                )
                return {
                    "response": "Perfect! Which service would you like to book?\n\nAvailable services:\n- Power Washing\n- Christmas Lights\n- House Painting\n- General Maintenance",
                    "booking_complete": False
                }
            
            # Step 5: Collect service, ask for date/time
            elif current_step == "get_service":
                collected_data["service"] = user_message.strip()[:200]
                await self._update_conversation_state(
                    email_address, user_id,
                    {"current_step": "get_date", "collected_data": collected_data},
                    db
                )
                return {
                    "response": f"Excellent! When would you like to schedule {collected_data['service']}?\n\nPlease provide a date and time (e.g., 'tomorrow at 2pm' or 'next Monday at 10am')",
                    "booking_complete": False
                }
            
            # Step 6: Collect date/time and CREATE APPOINTMENT
            elif current_step == "get_date":
                # Parse date/time from message
                appointment_date = self._extract_date_time(user_message)
                
                if not appointment_date:
                    return {
                        "response": "I couldn't understand that date/time. Please try again with a format like 'tomorrow at 2pm' or 'December 25 at 10am'",
                        "booking_complete": False
                    }
                
                collected_data["date"] = appointment_date.isoformat()
                
                # ✅ CREATE APPOINTMENT IN GOOGLE CALENDAR
                return await self._create_email_appointment(
                    collected_data, user_id, email_address, db
                )
            
            else:
                # Unknown step, reset
                await self._update_conversation_state(
                    email_address, user_id,
                    {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                    db
                )
                return {
                    "response": "I apologize for the confusion. How can I help you today?",
                    "booking_complete": True
                }
                
        except Exception as e:
            logger.error(f"❌ Error in appointment booking: {e}", exc_info=True)
            await self._update_conversation_state(
                email_address, user_id,
                {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                db
            )
            return {
                "response": "I apologize, but there was an error processing your appointment. Please try again or contact us directly.",
                "booking_complete": True
            }
    
    async def _generate_ai_response(
        self,
        from_email: str,
        subject: str,
        body: str,
        user_id: str,
        db
    ) -> Optional[str]:
        """Generate AI response for incoming email"""
        try:
            # ✅ TRUNCATE body to prevent token overflow
            max_body_length = 1000
            truncated_body = body[:max_body_length] if len(body) > max_body_length else body
            
            # ✅ TRUNCATE subject
            max_subject_length = 200
            truncated_subject = subject[:max_subject_length] if len(subject) > max_subject_length else subject
            
            full_message = f"{truncated_subject}\n\n{truncated_body}" if truncated_subject else truncated_body
            message_lower = full_message.lower()
            
            # Get conversation state
            conversation_state = await self._get_conversation_state(from_email, user_id, db)
            
            # Check for topic keywords
            booking_keywords = ["book", "appointment", "schedule", "reserve"]
            is_booking_request = any(word in message_lower for word in booking_keywords)
            
            topic_change_keywords = [
                "price", "pricing", "cost", "pay", "payment", "fee",
                "support", "help", "issue", "problem", "error",
                "what is", "what are", "how do", "can you tell", "tell me",
                "service", "offer", "package", "plan", "feature",
                "question", "info", "information", "explain",
                "deep learning", "machine learning", "ai", "artificial"
            ]
            is_topic_change = any(word in message_lower for word in topic_change_keywords)
            
            ai_message = None
            source = "none"
            
            # PRIORITY 1: Continue appointment booking (if not changing topic)
            if conversation_state.get("booking_in_progress") and not is_topic_change:
                logger.info("📅 Continuing appointment booking...")
                result = await self._process_appointment_booking(
                    truncated_body, conversation_state, user_id, from_email, db
                )
                ai_message = result["response"]
                source = "appointment_booking"
            
            # PRIORITY 2: Start new booking
            elif is_booking_request and not is_topic_change:
                logger.info("📅 Starting new appointment booking...")
                await self._update_conversation_state(
                    from_email, user_id,
                    {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
                    db
                )
                result = await self._process_appointment_booking(
                    truncated_body, {"current_step": "start", "collected_data": {}}, user_id, from_email, db
                )
                ai_message = result["response"]
                source = "appointment_booking"
            
            # PRIORITY 3: Reset booking on topic change
            elif is_topic_change and conversation_state.get("booking_in_progress"):
                logger.info("🔄 Topic change detected, resetting booking...")
                await self._update_conversation_state(
                    from_email, user_id,
                    {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                    db
                )
            
            # PRIORITY 4: Use OpenAI
            if not ai_message:
                logger.info("🤖 Using OpenAI for response...")
                
                # ✅ LIMIT conversation history to last 5 messages only
                history_cursor = db.email_logs.find({
                    "user_id": user_id,
                    "$or": [
                        {"to_email": from_email},
                        {"from_email": from_email}
                    ]
                }).sort("created_at", -1).limit(5)
                
                history = await history_cursor.to_list(length=5)
                history.reverse()
                
                conversation_context = []
                for msg in history:
                    role = "user" if msg.get("direction") == "inbound" else "assistant"
                    content = msg.get("content", "") or msg.get("text_content", "")
                    if content:
                        # ✅ TRUNCATE each message in history
                        truncated_content = content[:500] if len(content) > 500 else content
                        conversation_context.append({"role": role, "content": truncated_content})
                
                # ✅ Add current message (already truncated)
                conversation_context.append({"role": "user", "content": full_message})
                
                ai_response = await openai_service.generate_chat_response(
                    messages=conversation_context,
                    system_prompt="""You are a helpful AI assistant for a call center business responding to customer emails.
                    You help answer questions about services, pricing, appointments, and general inquiries.
                    Be professional, friendly, and concise.
                    Keep responses under 200 words.
                    
                    Answer questions directly and helpfully. For example:
                    - If asked "what is AI?" explain artificial intelligence clearly
                    - If asked "what is deep learning?" explain deep learning clearly
                    - If asked about services, describe call center services
                    - If asked about pricing, provide helpful pricing information""",
                    max_tokens=300
                )
                
                if ai_response.get("success"):
                    ai_message = ai_response.get("response")
                    source = "openai"
                else:
                    ai_message = "Thank you for your email. Our team will review and respond shortly."
                    source = "fallback"
            
            logger.info(f"✅ Generated response (source: {source})")
            return ai_message
            
        except Exception as e:
            logger.error(f"❌ Error generating response: {e}", exc_info=True)
            return "Thank you for your email. Our team will respond shortly."
    
    async def process_email(self, uid: str, msg, db) -> bool:
        """Process a single email and send AI response"""
        try:
            # Extract email details
            from_email = self._extract_email_address(msg.get("From", ""))
            to_email = self._extract_email_address(msg.get("To", ""))
            subject = self._decode_header_value(msg.get("Subject", ""))
            body = self._get_email_body(msg)
            
            # Skip if it's from ourselves (avoid loops)
            if from_email.lower() == self.email_user.lower():
                logger.info(f"⏭️ Skipping email from self: {from_email}")
                return False
            
            # Skip if body is empty
            if not body.strip():
                logger.info(f"⏭️ Skipping empty email from {from_email}")
                return False
            
            logger.info(f"\n{'='*60}")
            logger.info(f"📨 Processing email from: {from_email}")
            logger.info(f"   Subject: {subject[:100]}...")
            logger.info(f"   Body: {body[:100]}...")
            logger.info(f"{'='*60}\n")
            
            # Get user (first active user)
            users = await db.users.find({"is_active": True}).to_list(length=1)
            if not users:
                logger.warning("⚠️ No active users found")
                return False
            
            user_id = str(users[0]["_id"])
            
            # Store incoming email (truncated for storage)
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
            
            # Generate AI response
            ai_response = await self._generate_ai_response(
                from_email, subject, body, user_id, db
            )
            
            if ai_response:
                # Send response
                reply_subject = subject if subject.lower().startswith("re:") else f"Re: {subject}"
                reply_subject = reply_subject[:200] if len(reply_subject) > 200 else reply_subject
                
                await email_automation_service.send_email(
                    to_email=from_email,
                    subject=reply_subject,
                    html_content=f"""
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px;">
                        {ai_response.replace(chr(10), '<br>')}
                        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #666;">This is an automated response from CallCenter SaaS.</p>
                    </div>
                    """,
                    user_id=user_id,
                    text_content=ai_response
                )
                
                # Log outbound response
                response_log = {
                    "user_id": user_id,
                    "to_email": from_email,
                    "from_email": self.from_email,
                    "subject": reply_subject,
                    "content": ai_response,
                    "text_content": ai_response,
                    "status": "sent",
                    "direction": "outbound",
                    "is_auto_reply": True,
                    "created_at": datetime.utcnow(),
                    "sent_at": datetime.utcnow(),
                    "opened_count": 0,
                    "clicked_count": 0,
                    "clicked_links": []
                }
                await db.email_logs.insert_one(response_log)
                
                logger.info(f"✅ AI response sent to {from_email}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Error processing email: {e}", exc_info=True)
            return False
    
    async def check_inbox(self):
        """Check Gmail inbox for new emails"""
        if not self.is_configured():
            logger.warning("⚠️ Email poller not configured")
            return
        
        mail = None
        try:
            # Connect to Gmail IMAP
            mail = imaplib.IMAP4_SSL(self.imap_host, self.imap_port)
            mail.login(self.email_user, self.email_password)
            mail.select("INBOX")
            
            # Search for unread emails from today
            date_str = (datetime.now() - timedelta(days=1)).strftime("%d-%b-%Y")
            status, messages = mail.search(None, f'(UNSEEN SINCE {date_str})')
            
            if status != "OK":
                logger.error("❌ Failed to search inbox")
                return
            
            email_ids = messages[0].split()
            
            if not email_ids:
                logger.debug("📭 No new emails")
                return
            
            logger.info(f"📬 Found {len(email_ids)} new email(s)")
            
            # Get database
            db = await get_database()
            
            # Process each email
            for email_id in email_ids:
                uid = email_id.decode()
                
                # Skip if already processed
                if uid in self.processed_uids:
                    continue
                
                # Fetch email
                status, msg_data = mail.fetch(email_id, "(RFC822)")
                if status != "OK":
                    continue
                
                # Parse email
                raw_email = msg_data[0][1]
                msg = email.message_from_bytes(raw_email)
                
                # Process and mark as processed
                await self.process_email(uid, msg, db)
                self.processed_uids.add(uid)
                
                # Keep processed UIDs set manageable
                if len(self.processed_uids) > 1000:
                    self.processed_uids = set(list(self.processed_uids)[-500:])
            
        except imaplib.IMAP4.abort as e:
            logger.warning(f"⚠️ IMAP connection aborted: {e}")
        except imaplib.IMAP4.error as e:
            logger.error(f"❌ IMAP error: {e}")
        except Exception as e:
            logger.error(f"❌ Error checking inbox: {e}", exc_info=True)
        finally:
            # ✅ Safely close connection
            if mail:
                try:
                    mail.close()
                except:
                    pass
                try:
                    mail.logout()
                except:
                    pass
    
    async def start_polling(self):
        """Start the email polling loop"""
        if not self.is_configured():
            logger.error("❌ Cannot start polling - email not configured")
            return
        
        self.is_running = True
        logger.info(f"🚀 Email poller started (checking every {self.polling_interval}s)")
        
        while self.is_running:
            try:
                await self.check_inbox()
            except Exception as e:
                logger.error(f"❌ Polling error: {e}")
            
            await asyncio.sleep(self.polling_interval)
    
    def stop_polling(self):
        """Stop the email polling loop"""
        self.is_running = False
        logger.info("🛑 Email poller stopped")


# Create singleton instance
email_poller_service = EmailPollerService()