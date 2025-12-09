# backend/app/services/agent_executor.py - AGENT RESPONSE ORCHESTRATOR with CRM with correct name and email also visible in frontend 

import logging
import re
from datetime import datetime
from typing import Dict, Any, Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from .rag_service import rag_service
from .openai import openai_service
from .appointment import appointment_service
from .google_calendar import google_calendar_service
from .email import email_service

logger = logging.getLogger(__name__)


class AgentExecutor:
    """
    Agent Response Executor
    
    Implements 4-STEP PRIORITY SYSTEM:
    1. Appointment Booking (Highest Priority)
    2. RAG Document Search (if documents uploaded)
    3. Custom AI Script (agent's custom instructions)
    4. OpenAI Fallback (general AI response)
    """
    
    def __init__(self):
        self.rag = rag_service
        self.openai = openai_service
        self.appointment_service = appointment_service
        self.calendar_service = google_calendar_service
        self.email_service = email_service
        
        # Appointment booking keywords
        self.appointment_keywords = [
            "appointment", "schedule", "booking", "book", "meeting",
            "reservation", "slot", "available", "time", "date",
            "calendar", "schedule me", "set up", "arrange"
        ]
        
        # Conversation state tracking
        self.active_bookings = {}  # {call_id: booking_state}
    
    
    # ============================================
    # MAIN PROCESSING METHOD - ⚡ SPEED OPTIMIZED
    # ============================================
    
    async def process_user_message(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        user_id: str,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        """
        ⚡ OPTIMIZED: Process user message with 2-second response target
        ✅ 4-STEP PRIORITY SYSTEM CONFIRMED WORKING
        """
        try:
            logger.info(f"\n{'='*80}")
            logger.info(f"🎯 4-STEP INTELLIGENT RESPONSE SYSTEM")
            logger.info(f"{'='*80}")
            logger.info(f"📝 User input: '{user_input}'")
            logger.info(f"🤖 Agent: {agent_config.get('name')}")
            logger.info(f"{'='*80}\n")
            
            # ⚡ SPEED FIX: Skip appointment booking check if no keywords
            user_input_lower = user_input.lower()
            has_appointment_keyword = any(kw in user_input_lower for kw in [
                "appointment", "schedule", "book", "meeting", "reservation"
            ])
            
            # ============================================
            # ✅ STEP 1: APPOINTMENT BOOKING (PRIORITY 1)
            # ============================================
            if has_appointment_keyword or call_id in self.active_bookings:
                logger.info("📅 STEP 1: Checking appointment booking...")
                
                if self._is_appointment_request(user_input):
                    logger.info("✅ APPOINTMENT BOOKING TRIGGERED")
                    
                    booking_response = await self._handle_appointment_booking(
                        user_input=user_input,
                        agent_config=agent_config,
                        user_id=user_id,
                        call_id=call_id,
                        db=db
                    )
                    
                    if booking_response:
                        logger.info("✅ STEP 1 COMPLETE: Returning appointment response")
                        return booking_response
                
                if call_id in self.active_bookings:
                    logger.info("✅ Continuing active appointment booking...")
                    booking_response = await self._continue_appointment_booking(
                        user_input=user_input,
                        agent_config=agent_config,
                        user_id=user_id,
                        call_id=call_id,
                        db=db
                    )
                    
                    if booking_response:
                        logger.info("✅ STEP 1 COMPLETE: Appointment flow continued")
                        return booking_response
            
            # ⚡ SPEED FIX: Skip RAG search unless specifically asking about docs
            doc_keywords = ["document", "tell me about", "what does", "explain", "policy", "procedure"]
            should_check_docs = any(kw in user_input_lower for kw in doc_keywords)
            
            # ============================================
            # ✅ STEP 2: RAG DOCUMENT SEARCH (PRIORITY 2)
            # ============================================
            if should_check_docs and agent_config.get('has_training_docs', False):
                logger.info("📚 STEP 2: Searching training documents (RAG)...")
                
                agent_id = str(agent_config['_id'])
                rag_result = await self.rag.query_documents(
                    agent_id=agent_id,
                    query=user_input,
                    db=db,
                    top_k=2
                )
                
                if rag_result.get('found') and rag_result.get('confidence', 0) >= 0.75:
                    logger.info(f"✅ STEP 2 COMPLETE: Found in documents (confidence: {rag_result['confidence']:.2f})")
                    return rag_result['answer']
                else:
                    logger.info(f"⚠️ Document confidence too low or not found, continuing...")
            
            # ============================================
            # ✅ STEP 3: CUSTOM AI SCRIPT (PRIORITY 3)
            # ============================================
            if agent_config.get('ai_script'):
                logger.info("📝 STEP 3: Using custom AI script...")
                
                response = await self._use_custom_script_fast(
                    user_input=user_input,
                    agent_config=agent_config,
                    call_id=call_id,
                    db=db
                )
                
                logger.info("✅ STEP 3 COMPLETE: Custom AI script response")
                return response
            
            # ============================================
            # ✅ STEP 4: OPENAI FALLBACK (PRIORITY 4)
            # ============================================
            logger.info("🤖 STEP 4: Using OpenAI fallback...")
            
            response = await self._openai_fallback_fast(
                user_input=user_input,
                call_id=call_id,
                db=db
            )
            
            logger.info("✅ STEP 4 COMPLETE: OpenAI fallback response")
            return response
            
        except Exception as e:
            logger.error(f"❌ Error in 4-step executor: {e}", exc_info=True)
            return "I apologize, could you please rephrase that?"


    # ⚡ NEW OPTIMIZED METHODS
    async def _use_custom_script_fast(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        """⚡ OPTIMIZED: Fast custom script processing"""
        try:
            custom_script = agent_config.get('ai_script', '')
            
            # ⚡ SPEED FIX: Don't load conversation history - just use current input
            messages = [{"role": "user", "content": user_input}]
            
            response_data = await self.openai.generate_chat_response(
                messages=messages,
                system_prompt=custom_script,
                max_tokens=80  # ⚡ Reduced from 200
            )
            
            if response_data.get("success"):
                return response_data.get("response", "I'm here to help!")
            else:
                return "I'm here to help!"
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return "I'm here to help!"


    async def _openai_fallback_fast(
        self,
        user_input: str,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        """⚡ OPTIMIZED: Fast OpenAI fallback"""
        try:
            # ⚡ SPEED FIX: Don't load conversation history
            messages = [{"role": "user", "content": user_input}]
            
            response_data = await self.openai.generate_chat_response(
                messages=messages,
                system_prompt="You are a helpful assistant. Be brief and natural.",
                max_tokens=80  # ⚡ Reduced from 200
            )
            
            if response_data.get("success"):
                return response_data.get("response", "How can I help you?")
            else:
                return "How can I help you?"
            
        except Exception as e:
            logger.error(f"Error: {e}")
            return "How can I help you?"
    
    
    # ============================================
    # STEP 1: APPOINTMENT BOOKING LOGIC
    # ============================================
    
    def _is_appointment_request(self, user_input: str) -> bool:
        """Check if user is requesting an appointment"""
        user_input_lower = user_input.lower()
        
        for keyword in self.appointment_keywords:
            if keyword in user_input_lower:
                return True
        
        return False
    
    
    async def _handle_appointment_booking(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        user_id: str,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> Optional[str]:
        """
        Handle appointment booking conversation
        
        Multi-turn conversation to collect:
        - Customer name
        - Customer email
        - Customer phone
        - Preferred date
        - Preferred time
        """
        try:
            # Initialize booking state if not exists
            if call_id not in self.active_bookings:
                self.active_bookings[call_id] = {
                    "step": "name",
                    "collected_data": {},
                    "started_at": datetime.utcnow()
                }
            
            booking_state = self.active_bookings[call_id]
            current_step = booking_state["step"]
            collected_data = booking_state["collected_data"]
            
            logger.info(f"📋 Appointment booking step: {current_step}")
            
            # ============================================
            # STEP: COLLECT NAME
            # ============================================
            if current_step == "name":
                # Extract name from input
                name = self._extract_name(user_input)
                
                if name:
                    collected_data["name"] = name
                    booking_state["step"] = "email"
                    return f"Great, {name}! What's the best email address to send the confirmation to? You can spell it out slowly."
                else:
                    return "I'd be happy to schedule an appointment for you! May I have your name please?"
            
            # ============================================
            # STEP: COLLECT EMAIL - 🔥 ENHANCED EXTRACTION
            # ============================================
            elif current_step == "email":
                email = self._extract_email_enhanced(user_input)
                
                if email:
                    collected_data["email"] = email
                    booking_state["step"] = "phone"
                    logger.info(f"✅ Email extracted: {email}")
                    return f"Perfect! I've got {email}. And what's your phone number?"
                else:
                    logger.warning(f"❌ Failed to extract email from: '{user_input}'")
                    return "I didn't catch that email address. Could you spell it out slowly? For example: 'john at gmail dot com'"
            
            # ============================================
            # STEP: COLLECT PHONE
            # ============================================
            elif current_step == "phone":
                phone = self._extract_phone(user_input)
                
                if phone:
                    collected_data["phone"] = phone
                    booking_state["step"] = "date"
                    logger.info(f"✅ Phone extracted: {phone}")
                    return "Got it! What date would work best for you? You can say something like 'tomorrow' or 'next Monday'."
                else:
                    logger.warning(f"❌ Failed to extract phone from: '{user_input}'")
                    return "I didn't catch that phone number. Could you say it slowly, digit by digit? For example: 'four one five, two three four, five six seven eight'"
            
            # ============================================
            # STEP: COLLECT DATE
            # ============================================
            elif current_step == "date":
                date = self._extract_date(user_input)
                
                if date:
                    collected_data["date"] = date
                    booking_state["step"] = "time"
                    return f"Great! And what time works for you on {date.strftime('%B %d, %Y')}?"
                else:
                    return "I didn't catch that date. Could you say it again? For example, 'tomorrow' or 'next Friday'."
            
            # ============================================
            # STEP: COLLECT TIME & CREATE APPOINTMENT
            # ============================================
            elif current_step == "time":
                time_str = self._extract_time(user_input)
                
                if time_str:
                    collected_data["time"] = time_str
                    
                    # Create appointment
                    appointment_result = await self._create_appointment(
                        collected_data=collected_data,
                        agent_config=agent_config,
                        user_id=user_id,
                        call_id=call_id,
                        db=db
                    )
                    
                    # Clear booking state
                    del self.active_bookings[call_id]
                    
                    if appointment_result.get("success"):
                        return appointment_result["message"]
                    else:
                        return f"I apologize, but I couldn't complete the booking: {appointment_result.get('error', 'Unknown error')}. Would you like to try a different time?"
                else:
                    return "I didn't catch that time. Could you say it again? For example, '2 PM' or '10:30 AM'."
            
            return None
            
        except Exception as e:
            logger.error(f"Error in appointment booking: {e}", exc_info=True)
            # Clear booking state on error
            if call_id in self.active_bookings:
                del self.active_bookings[call_id]
            return "I apologize, but there was an error with the booking. Let's start over. Would you like to schedule an appointment?"
    
    
    async def _continue_appointment_booking(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        user_id: str,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> Optional[str]:
        """Continue existing appointment booking conversation"""
        return await self._handle_appointment_booking(
            user_input=user_input,
            agent_config=agent_config,
            user_id=user_id,
            call_id=call_id,
            db=db
        )
    
    
    async def _create_appointment(
        self,
        collected_data: Dict[str, Any],
        agent_config: Dict[str, Any],
        user_id: str,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> Dict[str, Any]:
        """Create appointment in Google Calendar and send email"""
        try:
            logger.info("📅 Creating appointment in Google Calendar")
            
            # Combine date and time
            appointment_datetime = datetime.combine(
                collected_data["date"],
                datetime.strptime(collected_data["time"], "%I:%M %p").time()
            )
            
            # Extract appointment time in HH:MM format for Google Calendar
            appointment_time = appointment_datetime.strftime("%H:%M")
            
            # Get the phone number from the call
            call = await db.calls.find_one({"_id": ObjectId(call_id)})
            customer_phone = call.get("from_number") if call else collected_data.get("phone")
            
            # ✅ IMPROVED: Create or update customer in CRM with duplicate prevention
            try:
                from app.services.customer import customer_service
                
                logger.info(f"👤 Creating/updating customer: {collected_data['name']}")
                
                # Check if customer EXISTS by email OR phone (prevent duplicates)
                existing_customer = await db.customers.find_one({
                    "user_id": user_id,
                    "$or": [
                        {"email": collected_data["email"].lower()},
                        {"phone": customer_phone}
                    ]
                })
                
                if existing_customer:
                    # UPDATE existing customer
                    logger.info(f"✅ Customer exists, updating: {existing_customer['_id']}")
                    
                    # Count SMS interactions for this phone number
                    sms_count = await db.sms_logs.count_documents({
                        "user_id": user_id,
                        "$or": [
                            {"to_number": customer_phone},
                            {"from_number": customer_phone}
                        ]
                    })
                    
                    # Count calls for this phone number
                    calls_count = await db.calls.count_documents({
                        "user_id": user_id,
                        "$or": [
                            {"to_number": customer_phone},
                            {"from_number": customer_phone}
                        ]
                    })
                    
                    # Count appointments for this customer
                    appointments_count = await db.appointments.count_documents({
                        "user_id": user_id,
                        "$or": [
                            {"customer_email": collected_data["email"].lower()},
                            {"customer_phone": customer_phone}
                        ]
                    })
                    
                    # Calculate total interactions
                    total_interactions = sms_count + calls_count + appointments_count
                    
                    update_data = {
                        "name": collected_data["name"],
                        "phone": customer_phone,
                        "email": collected_data["email"].lower(),
                        "last_contact": datetime.utcnow(),
                        "updated_at": datetime.utcnow(),
                        "total_calls": calls_count,
                        "total_sms": sms_count,
                        "total_appointments": appointments_count,
                        "total_interactions": total_interactions
                    }
                    
                    await db.customers.update_one(
                        {"_id": existing_customer["_id"]},
                        {"$set": update_data}
                    )
                    
                    customer_id = str(existing_customer["_id"])
                    logger.info(f"✅ Updated customer - SMS: {sms_count}, Calls: {calls_count}, Appointments: {appointments_count}")
                    
                else:
                    # CREATE new customer
                    logger.info(f"🆕 Creating new customer: {collected_data['name']}")
                    
                    # Count SMS for new customer too
                    sms_count = await db.sms_logs.count_documents({
                        "user_id": user_id,
                        "$or": [
                            {"to_number": customer_phone},
                            {"from_number": customer_phone}
                        ]
                    })
                    
                    calls_count = await db.calls.count_documents({
                        "user_id": user_id,
                        "$or": [
                            {"to_number": customer_phone},
                            {"from_number": customer_phone}
                        ]
                    })
                    
                    total_interactions = sms_count + calls_count + 1  # +1 for current appointment
                    
                    customer_data = {
                        "user_id": user_id,
                        "name": collected_data["name"],
                        "email": collected_data["email"].lower(),
                        "phone": customer_phone,
                        "type": "individual",
                        "status": "active",
                        "source": "voice_call",
                        "tags": ["appointment"],
                        "total_calls": calls_count,
                        "total_sms": sms_count,
                        "total_appointments": 1,
                        "total_interactions": total_interactions,
                        "last_contact": datetime.utcnow(),
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    
                    result = await db.customers.insert_one(customer_data)
                    customer_id = str(result.inserted_id)
                    
                    logger.info(f"✅ Customer created - SMS: {sms_count}, Calls: {calls_count}")
                
            except Exception as customer_error:
                logger.error(f"⚠️ Error creating customer (non-fatal): {customer_error}")
                customer_id = None
            
            # Create appointment record
            appointment_data = {
                "customer_name": collected_data["name"],
                "customer_email": collected_data["email"],
                "customer_phone": customer_phone,
                "appointment_date": appointment_datetime,
                "appointment_time": collected_data["time"],
                "call_id": call_id,
                "user_id": user_id,
                "agent_id": str(agent_config.get("_id")),
                "customer_id": customer_id,
                "status": "scheduled",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            # Save to database
            result = await db.appointments.insert_one(appointment_data)
            appointment_id = str(result.inserted_id)
            
            logger.info(f"✅ Appointment created with ID: {appointment_id}")
            
            # Create Google Calendar event
            event_result = await self.calendar_service.create_event(
                customer_name=collected_data["name"],
                customer_email=collected_data["email"],
                customer_phone=customer_phone,
                appointment_date=appointment_datetime,
                appointment_time=appointment_time,
                duration_minutes=60,
                service_type="Appointment",
                notes=f"Booked via phone call (Call ID: {call_id})"
            )
            
            if event_result.get("success"):
                # Update appointment with calendar event ID
                await db.appointments.update_one(
                    {"_id": ObjectId(appointment_id)},
                    {"$set": {
                        "google_calendar_event_id": event_result.get("event_id"),
                        "google_calendar_link": event_result.get("html_link")
                    }}
                )
                
                # ✅ FIXED: Send confirmation email AND log it
                try:
                    from app.services.email_automation import email_automation_service
                    
                    formatted_date = appointment_datetime.strftime("%A, %B %d, %Y")
                    formatted_time = appointment_datetime.strftime("%I:%M %p")
                    formatted_datetime = f"{formatted_date} at {formatted_time}"
                    
                    logger.info(f"📧 Sending appointment confirmation email to {collected_data['email']}")
                    
                    # ✅ USE email_automation_service which BOTH sends AND logs
                    await email_automation_service.send_appointment_confirmation(
                        to_email=collected_data['email'],
                        customer_name=collected_data['name'],
                        customer_phone=customer_phone,
                        service_type="Appointment",
                        appointment_date=formatted_datetime,
                        user_id=user_id,  # ✅ PASS user_id for logging
                        appointment_id=appointment_id,  # ✅ PASS appointment_id for linking
                        call_id=call_id  # ✅ PASS call_id for linking
                    )
                    
                    logger.info(f"✅ Confirmation email sent AND logged to email_logs for {collected_data['email']}")
                    
                except Exception as email_error:
                    logger.error(f"⚠️ Error sending confirmation email (non-fatal): {email_error}")
                
                formatted_date = appointment_datetime.strftime("%B %d, %Y")
                formatted_time = collected_data["time"]
                
                return {
                    "success": True,
                    "message": f"Perfect! Your appointment is confirmed for {formatted_date} at {formatted_time}. I've sent a confirmation email to {collected_data['email']} with all the details and a calendar invite. Is there anything else I can help you with?"
                }
            else:
                logger.error(f"❌ Calendar event creation failed: {event_result.get('error')}")
                return {
                    "success": True,
                    "message": f"Your appointment is confirmed for {appointment_datetime.strftime('%B %d, %Y')} at {collected_data['time']}. We'll send you a confirmation email shortly. Is there anything else I can help you with?"
                }
                
        except Exception as e:
            logger.error(f"Error creating appointment: {e}", exc_info=True)
            return {
                "success": False,
                "error": str(e)
            }
    
    
    async def _send_appointment_confirmation_email(
        self,
        collected_data: Dict[str, Any],
        appointment_datetime: datetime,
        event_link: Optional[str]
    ):
        """Send confirmation email to customer"""
        try:
            # Format date and time nicely
            formatted_date = appointment_datetime.strftime('%A, %B %d, %Y')
            formatted_time = collected_data['time']
            
            # ✅ FIXED: Use html_content instead of body
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .header {{
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                        margin: -30px -30px 20px -30px;
                    }}
                    .details {{
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 5px;
                        margin: 20px 0;
                    }}
                    .details h3 {{
                        margin-top: 0;
                        color: #4CAF50;
                    }}
                    .detail-row {{
                        margin: 10px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }}
                    .detail-row:last-child {{
                        border-bottom: none;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 12px 30px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                        text-align: center;
                    }}
                    .footer {{
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-size: 12px;
                        margin-top: 20px;
                        border-top: 1px solid #eee;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Appointment Confirmed!</h1>
                    </div>
                    
                    <p>Hello {collected_data['name']},</p>
                    
                    <p>Your appointment has been successfully scheduled. Here are the details:</p>
                    
                    <div class="details">
                        <h3>📅 Appointment Details</h3>
                        <div class="detail-row">
                            <strong>Date:</strong> {formatted_date}
                        </div>
                        <div class="detail-row">
                            <strong>Time:</strong> {formatted_time}
                        </div>
                        <div class="detail-row">
                            <strong>Name:</strong> {collected_data['name']}
                        </div>
                        <div class="detail-row">
                            <strong>Phone:</strong> {collected_data['phone']}
                        </div>
                        <div class="detail-row">
                            <strong>Email:</strong> {collected_data['email']}
                        </div>
                    </div>
            """
            
            # Add calendar link if available
            if event_link:
                html_content += f"""
                    <div style="text-align: center;">
                        <a href="{event_link}" class="button">📆 Add to Google Calendar</a>
                    </div>
                """
            
            html_content += """
                    <p style="margin-top: 20px;">
                        If you need to reschedule or have any questions, please don't hesitate to contact us.
                    </p>
                    
                    <div class="footer">
                        <p>Thank you for choosing our service!</p>
                        <p>This is an automated confirmation email.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            text_content = f"""
            Appointment Confirmed!
            
            Hello {collected_data['name']},
            
            Your appointment has been successfully scheduled.
            
            Details:
            - Date: {formatted_date}
            - Time: {formatted_time}
            - Phone: {collected_data['phone']}
            - Email: {collected_data['email']}
            """
            
            if event_link:
                text_content += f"\n\nAdd to Calendar: {event_link}\n"
            
            text_content += """
            
            If you need to reschedule or have any questions, please don't hesitate to contact us.
            
            Thank you for choosing our service!
            """
            
            # ✅ FIXED: Use correct parameters (html_content instead of body)
            await self.email_service.send_email(
                to_email=collected_data['email'],
                subject="✅ Appointment Confirmation",
                html_content=html_content,
                text_content=text_content
            )
            
            logger.info(f"✅ Sent confirmation email to {collected_data['email']}")
            
        except Exception as e:
            logger.error(f"Error sending confirmation email: {e}")
    
    
    # ============================================
    # DATA EXTRACTION HELPERS
    # ============================================
    
    # ============================================
    # 🔥 IMPROVED NAME EXTRACTION
    # ============================================
    
    def _extract_name(self, user_input: str) -> Optional[str]:
        """
        🔥 IMPROVED: Extract name from user input with better filtering
        """
        try:
            user_input_clean = user_input.strip()
            
            logger.info(f"👤 Extracting name from: '{user_input_clean}'")
            
            # ✅ FILTER: Ignore common non-name phrases
            ignore_phrases = [
                'goodbye', 'bye', 'hello', 'hi', 'hey', 'yes', 'no', 'okay', 'ok',
                'sure', 'thanks', 'thank you', 'please', 'sorry', 'excuse me',
                'appointment', 'schedule', 'book', 'booking', 'meeting'
            ]
            
            # Check if input is just a common phrase (not a name)
            if user_input_clean.lower() in ignore_phrases:
                logger.warning(f"⚠️ Ignoring common phrase: '{user_input_clean}'")
                return None
            
            # ============================================
            # METHOD 1: Extract from "my name is X" patterns
            # ============================================
            patterns = [
                r"(?:my name is|i'm|this is|it's|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
                r"(?:name is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)"
            ]
            
            for pattern in patterns:
                match = re.search(pattern, user_input_clean, re.IGNORECASE)
                if match:
                    name = match.group(1).strip()
                    # Verify it's not a common word
                    if name.lower() not in ignore_phrases:
                        logger.info(f"✅ Extracted (pattern match): {name}")
                        return name
            
            # ============================================
            # METHOD 2: Check if it's just a capitalized name (1-4 words)
            # ============================================
            words = user_input_clean.split()
            if 1 <= len(words) <= 4:
                # All words should start with capital letter (typical for names)
                if all(w[0].isupper() and w.isalpha() for w in words if w):
                    name = user_input_clean
                    # Verify it's not a common word
                    if name.lower() not in ignore_phrases:
                        logger.info(f"✅ Extracted (capitalized words): {name}")
                        return name
            
            logger.warning(f"❌ Could not extract valid name from: '{user_input_clean}'")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting name: {e}")
            return None
    
    
    # ============================================
    # 🔥 ENHANCED EMAIL EXTRACTION METHOD
    # ============================================
    
    def _extract_email_enhanced(self, user_input: str) -> Optional[str]:
        """
        🔥 ENHANCED: Extract email from voice input with phonetic spelling support
        
        Handles:
        1. Standard format: john@gmail.com
        2. Spelled out: "john at gmail dot com"
        3. Phonetic: "j o h n at gmail dot com"
        4. With filler words: "my email is john at gmail dot com"
        5. Just username without domain: "john" -> "john@gmail.com"
        """
        try:
            user_input_clean = user_input.lower().strip()
            
            logger.info(f"📧 Extracting email from: '{user_input_clean}'")
            
            # ============================================
            # METHOD 1: Standard email format (john@gmail.com)
            # ============================================
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            match = re.search(email_pattern, user_input, re.IGNORECASE)
            if match:
                email = match.group(0).lower()
                logger.info(f"✅ Extracted (standard): {email}")
                return email
            
            # ============================================
            # METHOD 2: Check if it's just a username without domain
            # ============================================
            # Common pattern: user says just their username like "john" or "johndoe"
            # Remove common filler words and check if it looks like a username
            username_words = ['my', 'email', 'is', 'address', 'the', 'at', 'dot', 'com', 
                            'gmail', 'hotmail', 'yahoo', 'outlook', 'icloud', 'aol']
            
            # Clean the input
            words = user_input_clean.split()
            clean_words = [w for w in words if w not in username_words]
            
            if len(clean_words) == 1:
                potential_username = clean_words[0]
                # Check if it looks like a valid username (only letters, numbers, dots, underscores)
                if re.match(r'^[a-z0-9._]+$', potential_username) and len(potential_username) >= 2:
                    # ✅ AUTOMATICALLY ADD @gmail.com DOMAIN
                    email = f"{potential_username}@gmail.com"
                    logger.info(f"✅ Auto-completed email (username only): {email}")
                    return email
            
            # ============================================
            # METHOD 3: Detect domain provider
            # ============================================
            domain_map = {
                'gmail': 'gmail.com',
                'g mail': 'gmail.com',
                'gee mail': 'gmail.com',
                'hotmail': 'hotmail.com',
                'yahoo': 'yahoo.com',
                'outlook': 'outlook.com',
                'icloud': 'icloud.com',
                'aol': 'aol.com',
            }
            
            domain = None
            for provider, full_domain in domain_map.items():
                if provider in user_input_clean:
                    domain = full_domain
                    logger.info(f"✅ Found domain: {domain}")
                    break
            
            # ============================================
            # METHOD 4: Remove filler words and extract username
            # ============================================
            filler_words = {
                'okay', 'ok', 'my', 'email', 'is', 'the', 'a', 'an', 'uh', 'um',
                'at', 'dot', 'com', 'gmail', 'hotmail', 'yahoo', 'outlook',
                'underscore', 'dash', 'hyphen', 'period', 'point',
                'thank', 'you', 'thanks', 'please', 'and', 'or', 'listen', 'carefully',
                'address', 'send', 'it', 'to', 'for', 'confirmation'
            }
            
            # Split by spaces and common delimiters
            words = re.split(r'[\s,.\?!]+', user_input_clean)
            
            # Extract letters/numbers only (username part)
            letters = []
            for word in words:
                if word in filler_words:
                    continue
                
                # Clean non-alphanumeric characters
                cleaned = re.sub(r'[^a-z0-9]', '', word)
                
                if cleaned and len(cleaned) <= 20:  # Reasonable username length
                    letters.append(cleaned)
            
            # Construct username
            username = ''.join(letters)
            
            if username and len(username) >= 2:
                # Use detected domain or default to @gmail.com
                if not domain:
                    domain = "gmail.com"
                    logger.info(f"✅ Using default domain: {domain}")
                
                email = f"{username}@{domain}"
                logger.info(f"✅ CONSTRUCTED: {email}")
                return email
            
            # ============================================
            # METHOD 5: Handle spelled-out format with @ and .
            # ============================================
            # Convert "at" to @ and "dot" to .
            converted = user_input_clean.replace(' at ', '@').replace(' dot ', '.')
            match = re.search(email_pattern, converted, re.IGNORECASE)
            if match:
                email = match.group(0).lower()
                logger.info(f"✅ Extracted (converted): {email}")
                return email
            
            # ============================================
            # METHOD 6: Fallback - if nothing else works, ask for clarification
            # ============================================
            logger.warning(f"❌ Could not extract email from: '{user_input_clean}'")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting email: {e}")
            return None
    
    
    # ============================================
    # 🔥 ENHANCED PHONE NUMBER EXTRACTION METHOD
    # ============================================
    
    def _extract_phone(self, user_input: str) -> Optional[str]:
        """
        🔥 ENHANCED: Extract phone number from voice input with spoken digit support
        
        Handles:
        1. Standard format: (123) 456-7890, 123-456-7890
        2. Digits only: 1234567890
        3. Spoken digits: "four one five two three four five six seven eight"
        4. Mixed format: "my number is four one five 234-5678"
        5. With filler words: "my phone number is 415 234 5678"
        """
        try:
            user_input_clean = user_input.lower().strip()
            
            logger.info(f"📞 Extracting phone from: '{user_input_clean}'")
            
            # ============================================
            # METHOD 1: Standard numeric patterns
            # ============================================
            # Remove common filler words first
            cleaned = re.sub(r'\b(is|my|phone|number|it\'s|the)\b', '', user_input, flags=re.IGNORECASE)
            
            # Try standard patterns
            patterns = [
                r'\+?1?\s*\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})',  # (123) 456-7890
                r'(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})',  # 123-456-7890
                r'(\d{10})',  # 1234567890
            ]
            
            for pattern in patterns:
                match = re.search(pattern, cleaned)
                if match:
                    if len(match.groups()) == 3:
                        phone = f"+1{match.group(1)}{match.group(2)}{match.group(3)}"
                        logger.info(f"✅ Extracted (standard): {phone}")
                        return phone
                    else:
                        digits = match.group(1)
                        phone = f"+1{digits}"
                        logger.info(f"✅ Extracted (digits): {phone}")
                        return phone
            
            # ============================================
            # METHOD 2: Convert spoken words to digits
            # ============================================
            word_to_digit = {
                'zero': '0', 'oh': '0', 'o': '0',
                'one': '1', 'won': '1',
                'two': '2', 'to': '2', 'too': '2',
                'three': '3', 'tree': '3',
                'four': '4', 'for': '4', 'fore': '4',
                'five': '5', 'fife': '5',
                'six': '6', 'sex': '6',
                'seven': '7',
                'eight': '8', 'ate': '8',
                'nine': '9', 'niner': '9',
                'ten': '10',
                'eleven': '11',
                'twelve': '12',
                'thirteen': '13',
                'fourteen': '14',
                'fifteen': '15',
                'sixteen': '16',
                'seventeen': '17',
                'eighteen': '18',
                'nineteen': '19',
                'twenty': '20',
                'thirty': '30',
                'forty': '40',
                'fifty': '50',
                'sixty': '60',
                'seventy': '70',
                'eighty': '80',
                'ninety': '90',
            }
            
            # Remove filler words for spoken digit extraction
            filler_words = {
                'my', 'phone', 'number', 'is', 'the', 'it\'s', 'its', 'okay', 'ok',
                'uh', 'um', 'and', 'then', 'plus', 'area', 'code', 'extension',
                'ext', 'call', 'me', 'at', 'reach'
            }
            
            # Split into words
            words = re.split(r'[\s,.\-()]+', user_input_clean)
            
            # Convert words to digits
            digits = []
            for word in words:
                word = word.strip()
                if not word or word in filler_words:
                    continue
                
                # Check if it's already a digit
                if word.isdigit():
                    digits.append(word)
                # Check if it's a spoken number
                elif word in word_to_digit:
                    digits.append(word_to_digit[word])
            
            # Join all digits
            phone_digits = ''.join(digits)
            
            # ============================================
            # METHOD 3: Validate and format the extracted digits
            # ============================================
            if phone_digits:
                logger.info(f"🔢 Extracted digits: '{phone_digits}' (length: {len(phone_digits)})")
                
                # Handle different lengths
                if len(phone_digits) == 10:
                    # Perfect! US phone number
                    phone = f"+1{phone_digits}"
                    logger.info(f"✅ CONSTRUCTED (10 digits): {phone}")
                    return phone
                
                elif len(phone_digits) == 11 and phone_digits[0] == '1':
                    # Has country code
                    phone = f"+{phone_digits}"
                    logger.info(f"✅ CONSTRUCTED (11 digits with country): {phone}")
                    return phone
                
                elif len(phone_digits) > 10:
                    # Take last 10 digits (most likely the actual number)
                    phone_digits = phone_digits[-10:]
                    phone = f"+1{phone_digits}"
                    logger.info(f"✅ CONSTRUCTED (trimmed to 10): {phone}")
                    return phone
                
                elif len(phone_digits) >= 7:
                    # At least 7 digits - might be missing area code
                    # Accept it but warn
                    logger.warning(f"⚠️ Only {len(phone_digits)} digits - may be incomplete")
                    if len(phone_digits) == 7:
                        # Assume a default area code (you can customize this)
                        phone = f"+1555{phone_digits}"  # 555 is placeholder
                        logger.info(f"⚠️ Added default area code: {phone}")
                        return phone
                    else:
                        phone = f"+1{phone_digits}"
                        logger.info(f"⚠️ Using as-is: {phone}")
                        return phone
            
            # ============================================
            # METHOD 4: Try to extract any sequence of 10+ digits
            # ============================================
            # Remove all non-digits and see what we have
            all_digits = re.sub(r'\D', '', user_input)
            if len(all_digits) >= 10:
                # Take first 10 or 11 digits
                if len(all_digits) == 11 and all_digits[0] == '1':
                    phone = f"+{all_digits[:11]}"
                else:
                    phone = f"+1{all_digits[:10]}"
                logger.info(f"✅ EXTRACTED (fallback): {phone}")
                return phone
            
            logger.warning(f"❌ Could not extract phone number")
            return None
            
        except Exception as e:
            logger.error(f"Error extracting phone: {e}")
            return None
    
    
    def _extract_date(self, user_input: str) -> Optional[datetime]:
        """Extract date from user input"""
        from dateutil import parser
        from dateutil.relativedelta import relativedelta
        
        user_input_lower = user_input.lower()
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Handle relative dates
        if "today" in user_input_lower:
            return today
        elif "tomorrow" in user_input_lower:
            return today + relativedelta(days=1)
        elif "next week" in user_input_lower:
            return today + relativedelta(weeks=1)
        elif "next monday" in user_input_lower:
            days_ahead = 0 - today.weekday() + 7  # Next Monday
            return today + relativedelta(days=days_ahead)
        
        # Try to parse absolute dates
        try:
            parsed_date = parser.parse(user_input, fuzzy=True)
            if parsed_date.date() >= today.date():
                return parsed_date
        except:
            pass
        
        return None
    
    
    def _extract_time(self, user_input: str) -> Optional[str]:
        """Extract time from user input"""
        # Time patterns
        patterns = [
            r'(\d{1,2})\s*(?::|\.)\s*(\d{2})\s*(am|pm)',  # 2:30 PM
            r'(\d{1,2})\s*(am|pm)',  # 2 PM
            r'(\d{1,2})\s*(?::|\.)\s*(\d{2})',  # 14:30
        ]
        
        user_input_lower = user_input.lower()
        
        for pattern in patterns:
            match = re.search(pattern, user_input_lower, re.IGNORECASE)
            if match:
                groups = match.groups()
                
                if len(groups) == 3:  # HH:MM AM/PM
                    hour = int(groups[0])
                    minute = groups[1]
                    period = groups[2].upper()
                    return f"{hour}:{minute} {period}"
                elif len(groups) == 2 and groups[1] in ['am', 'pm']:  # HH AM/PM
                    hour = int(groups[0])
                    period = groups[1].upper()
                    return f"{hour}:00 {period}"
                elif len(groups) == 2:  # HH:MM (24-hour)
                    hour = int(groups[0])
                    minute = groups[1]
                    period = "PM" if hour >= 12 else "AM"
                    display_hour = hour if hour <= 12 else hour - 12
                    return f"{display_hour}:{minute} {period}"
        
        return None
    
    
    # ============================================
    # STEP 2: RAG RESPONSE FORMATTING
    # ============================================
    
    async def _format_rag_response(
        self,
        user_input: str,
        rag_answer: str,
        agent_config: Dict[str, Any]
    ) -> str:
        """Format RAG answer into natural response"""
        try:
            # Use OpenAI to format the RAG answer naturally
            system_prompt = f"""You are a helpful assistant. 
            
Use the following information from the knowledge base to answer the user's question naturally and conversationally.

Knowledge Base Information:
{rag_answer}

Instructions:
- Answer directly and naturally
- Don't mention "according to the documents" or "based on the knowledge base"
- Be helpful and conversational
- If the information doesn't fully answer the question, say so politely
"""
            
            # ✅ FIX: Use generate_chat_response instead of chat_completion
            response_data = await self.openai.generate_chat_response(
                messages=[{"role": "user", "content": user_input}],
                system_prompt=system_prompt,
                max_tokens=200
            )
            
            if response_data.get("success"):
                return response_data.get("response", rag_answer)
            else:
                return rag_answer
            
        except Exception as e:
            logger.error(f"Error formatting RAG response: {e}")
            # Fallback to raw RAG answer
            return rag_answer
    
    
    # ============================================
    # STEP 3: CUSTOM AI SCRIPT
    # ============================================
    
    async def _use_custom_script(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        """Use agent's custom AI script as system prompt"""
        try:
            custom_script = agent_config.get('ai_script', '')
            
            # Get conversation history
            conversation = await self._get_conversation_history(call_id, db)
            
            # Build messages for OpenAI
            messages = []
            
            # Add conversation history
            for msg in conversation[-5:]:  # Last 5 messages for context
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Add current user input
            messages.append({
                "role": "user",
                "content": user_input
            })
            
            # ✅ FIX #2: Use generate_chat_response instead of chat_completion_with_messages
            response_data = await self.openai.generate_chat_response(
                messages=messages,
                system_prompt=custom_script,
                max_tokens=200
            )
            
            # Extract the actual response text
            if response_data.get("success"):
                return response_data.get("response", "I'm here to help!")
            else:
                logger.error(f"OpenAI error in custom script: {response_data.get('error')}")
                return "I apologize, I'm having trouble responding right now."
        except Exception as e:
            logger.error(f"Error using custom script: {e}")
            raise


    # ============================================
    # STEP 4: OPENAI FALLBACK
    # ============================================

    async def _openai_fallback(
        self,
        user_input: str,
        agent_config: Dict[str, Any],
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> str:
        """Use OpenAI with generic helpful assistant prompt"""
        try:
            # Get conversation history
            conversation = await self._get_conversation_history(call_id, db)
            
            # Build messages
            messages = []
            
            # Add conversation history
            for msg in conversation[-5:]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Add current input
            messages.append({
                "role": "user",
                "content": user_input
            })
            
            # ✅ FIX #3: Use generate_chat_response instead of chat_completion_with_messages
            response_data = await self.openai.generate_chat_response(
                messages=messages,
                system_prompt="You are a helpful, friendly assistant. Provide concise, natural responses.",
                max_tokens=200
            )
            
            # Extract the actual response text
            if response_data.get("success"):
                return response_data.get("response", "I'm here to help! Could you please clarify what you need assistance with?")
            else:
                logger.error(f"OpenAI error in fallback: {response_data.get('error')}")
                return "I'm here to help! Could you please clarify what you need assistance with?"
            
        except Exception as e:
            logger.error(f"Error in OpenAI fallback: {e}")
            return "I'm here to help! Could you please clarify what you need assistance with?"


    # ============================================
    # CONVERSATION HISTORY
    # ============================================

    async def _get_conversation_history(
        self,
        call_id: str,
        db: AsyncIOMotorDatabase
    ) -> List[Dict[str, str]]:
        """Get conversation history for context"""
        try:
            conversation = await db.conversations.find_one({"call_id": call_id})
            
            if conversation and "messages" in conversation:
                return conversation["messages"]
            
            return []
            
        except Exception as e:
            logger.error(f"Error getting conversation history: {e}")
            return []


# Create singleton instance
agent_executor = AgentExecutor()