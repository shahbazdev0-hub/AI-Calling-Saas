# backend/app/api/v1/email_webhook.py - EMAIL INBOUND WEBHOOK WITH AI RESPONSE (FIXED)

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
from typing import Dict, Any, Optional
import logging
import re
import json

from app.database import get_database
from app.services.openai import openai_service
from app.services.email_automation import email_automation_service

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================
# HELPER: Extract email address from string
# ============================================
def extract_email(email_string: str) -> str:
    """Extract email address from string like 'Name <email@example.com>'"""
    if not email_string:
        return ""
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', email_string)
    return match.group(0) if match else email_string


# ============================================
# HELPER: Get conversation state for email
# ============================================
async def _get_email_conversation_state(email_address: str, user_id: str, db) -> Dict[str, Any]:
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


# ============================================
# HELPER: Update conversation state
# ============================================
async def _update_email_conversation_state(
    email_address: str, 
    user_id: str, 
    updates: Dict[str, Any], 
    db
):
    """Update conversation state for email thread"""
    updates["updated_at"] = datetime.utcnow()
    
    await db.email_conversation_states.update_one(
        {"email_address": email_address, "user_id": user_id},
        {"$set": updates},
        upsert=True
    )


# ============================================
# HELPER: Match Campaign Builder workflow
# ============================================
async def _match_email_campaign_workflow(
    user_input: str,
    user_id: str,
    db
) -> Optional[Dict[str, Any]]:
    """Check if user input matches any Campaign Builder workflow"""
    try:
        # Get all active workflows for user
        workflows = await db.workflows.find({
            "user_id": user_id,
            "is_active": True
        }).to_list(length=100)
        
        if not workflows:
            return None
        
        user_input_lower = user_input.lower().strip()
        user_words = set(user_input_lower.split())
        
        for workflow in workflows:
            workflow_name = workflow.get("name", "Unknown")
            nodes = workflow.get("nodes", [])
            
            for node in nodes:
                node_data = node.get("data", {})
                keywords = node_data.get("keywords", [])
                
                if not keywords:
                    continue
                
                for keyword in keywords:
                    keyword_clean = keyword.lower().strip()
                    
                    # Check for keyword match
                    if keyword_clean in user_input_lower or keyword_clean in user_words:
                        node_message = node_data.get("message", "")
                        
                        if node_message:
                            logger.info(f"✅ Email Campaign match: '{keyword_clean}' in {workflow_name}")
                            
                            return {
                                "found": True,
                                "response": node_message,
                                "workflow_id": str(workflow["_id"]),
                                "workflow_name": workflow_name,
                                "node_id": node.get("id"),
                                "matched_keyword": keyword_clean
                            }
        
        return None
        
    except Exception as e:
        logger.error(f"Email campaign matching error: {e}")
        return None


# ============================================
# HELPER: Process appointment booking via email
# ============================================
async def _process_email_appointment_booking(
    user_message: str,
    conversation_state: Dict[str, Any],
    user_id: str,
    email_address: str,
    db
) -> Dict[str, Any]:
    """Process appointment booking steps via email"""
    
    current_step = conversation_state.get("current_step", "start")
    collected_data = conversation_state.get("collected_data", {})
    
    if current_step == "start":
        # Ask for name
        await _update_email_conversation_state(
            email_address, user_id,
            {"current_step": "get_name", "collected_data": {}},
            db
        )
        return {"response": "I'd be happy to help you book an appointment! First, may I have your name?"}
    
    elif current_step == "get_name":
        # Store name, ask for phone
        collected_data["name"] = user_message.strip()
        await _update_email_conversation_state(
            email_address, user_id,
            {"current_step": "get_phone", "collected_data": collected_data},
            db
        )
        return {"response": f"Thank you, {collected_data['name']}! What's the best phone number to reach you?"}
    
    elif current_step == "get_phone":
        # Store phone, ask for service
        collected_data["phone"] = user_message.strip()
        await _update_email_conversation_state(
            email_address, user_id,
            {"current_step": "get_service", "collected_data": collected_data},
            db
        )
        return {"response": "Great! What service are you interested in booking?"}
    
    elif current_step == "get_service":
        # Store service, ask for date
        collected_data["service"] = user_message.strip()
        await _update_email_conversation_state(
            email_address, user_id,
            {"current_step": "get_date", "collected_data": collected_data},
            db
        )
        return {"response": "Perfect! What date and time would work best for you?"}
    
    elif current_step == "get_date":
        # Store date, complete booking
        collected_data["date"] = user_message.strip()
        collected_data["email"] = email_address
        
        # Create appointment in database
        appointment_data = {
            "user_id": user_id,
            "customer_name": collected_data.get("name"),
            "customer_email": email_address,
            "customer_phone": collected_data.get("phone"),
            "service_type": collected_data.get("service"),
            "requested_date": collected_data.get("date"),
            "status": "pending",
            "source": "email",
            "created_at": datetime.utcnow()
        }
        
        result = await db.appointments.insert_one(appointment_data)
        
        # Reset conversation state
        await _update_email_conversation_state(
            email_address, user_id,
            {"booking_in_progress": False, "current_step": None, "collected_data": {}},
            db
        )
        
        response = f"""Thank you, {collected_data['name']}! Your appointment request has been submitted.

📋 Appointment Details:
- Name: {collected_data['name']}
- Phone: {collected_data['phone']}
- Service: {collected_data['service']}
- Requested Date: {collected_data['date']}

We will confirm your appointment shortly. You'll receive a confirmation email once it's scheduled."""
        
        return {"response": response, "appointment_id": str(result.inserted_id)}
    
    else:
        # Unknown step, reset
        await _update_email_conversation_state(
            email_address, user_id,
            {"booking_in_progress": False, "current_step": None, "collected_data": {}},
            db
        )
        return {"response": "I apologize for the confusion. How can I help you today?"}


# ============================================
# MAIN WEBHOOK: SendGrid Inbound Parse
# ============================================
@router.post("/webhook/inbound")
async def email_inbound_webhook(
    request: Request,
    db = Depends(get_database)
):
    """
    ✅ Handle incoming email webhook with AI response logic:
    - Priority 1: Appointment booking flow (if in progress and not changing topic)
    - Priority 2: New appointment booking request
    - Priority 3: Campaign Builder responses
    - Priority 4: OpenAI fallback
    
    This endpoint receives emails from SendGrid Inbound Parse or similar services.
    """
    try:
        # Parse form data (SendGrid sends as multipart form)
        form_data = await request.form()
        
        # Extract email fields
        from_email = extract_email(form_data.get("from", ""))
        to_email = extract_email(form_data.get("to", ""))
        subject = form_data.get("subject", "")
        text_body = form_data.get("text", "")
        html_body = form_data.get("html", "")
        
        # Use text body, fallback to stripped HTML
        body = text_body.strip() if text_body else ""
        if not body and html_body:
            # Simple HTML strip
            body = re.sub(r'<[^>]+>', '', html_body).strip()
        
        logger.info(f"\n{'='*80}")
        logger.info(f"📨 INCOMING EMAIL WEBHOOK")
        logger.info(f"{'='*80}")
        logger.info(f"   From: {from_email}")
        logger.info(f"   To: {to_email}")
        logger.info(f"   Subject: {subject}")
        logger.info(f"   Body: {body[:200]}...")
        logger.info(f"{'='*80}\n")
        
        # Get ALL active users (or match by to_email domain)
        users_cursor = db.users.find({"is_active": True})
        users = await users_cursor.to_list(length=None)
        
        if not users:
            logger.warning("⚠️ No active users found")
            return JSONResponse(
                status_code=200,
                content={"status": "no_users"}
            )
        
        primary_user = users[0]
        user_id = str(primary_user["_id"])
        
        logger.info(f"📌 Using user_id: {user_id} ({primary_user.get('email', 'Unknown')})")
        
        # ============================================
        # STEP 1: Store incoming email for ALL users
        # ============================================
        for user in users:
            uid = str(user["_id"])
            
            email_log_data = {
                "user_id": uid,
                "to_email": to_email,
                "from_email": from_email,
                "subject": subject,
                "content": body,
                "text_content": text_body,
                "html_content": html_body,
                "status": "received",
                "direction": "inbound",
                "created_at": datetime.utcnow(),
                "opened_count": 0,
                "clicked_count": 0,
                "clicked_links": []
            }
            
            await db.email_logs.insert_one(email_log_data.copy())
        
        logger.info(f"✅ Incoming email stored for {len(users)} user(s)")
        
        # ============================================
        # STEP 2: Generate AI Response
        # ============================================
        
        ai_message = None
        source = "none"
        
        # Combine subject and body for processing
        full_message = f"{subject}\n\n{body}" if subject else body
        message_lower = full_message.lower()
        
        # Get conversation state
        conversation_state = await _get_email_conversation_state(from_email, user_id, db)
        
        # ✅ IMPROVED: Check if user is changing topics (not continuing booking)
        booking_keywords = ["book", "appointment", "schedule", "reserve"]
        is_booking_request = any(word in message_lower for word in booking_keywords)
        
        # Check if this is a different topic (pricing, support, general questions, etc.)
        topic_change_keywords = [
            "price", "pricing", "cost", "pay", "payment", "fee", "charge",
            "support", "help", "issue", "problem", "error", "trouble",
            "integrate", "api", "documentation", "docs", "guide",
            "cancel", "refund", "question", "info", "information",
            "service", "offer", "package", "plan", "feature"
        ]
        is_topic_change = any(word in message_lower for word in topic_change_keywords)
        
        # Also check if message is too short to be a booking step response
        is_short_response = len(body.strip()) < 5
        
        # PRIORITY 1: Handle Active Appointment Booking (but allow topic changes)
        if conversation_state.get("booking_in_progress") and not is_topic_change and not is_short_response:
            logger.info("📅 Continuing appointment booking via email...")
            
            booking_result = await _process_email_appointment_booking(
                body, conversation_state, user_id, from_email, db
            )
            
            ai_message = booking_result["response"]
            source = "appointment_booking"
        
        # PRIORITY 2: Check if User Wants to Book (new booking request)
        elif is_booking_request and not is_topic_change:
            logger.info("📅 Starting new appointment booking via email...")
            
            # Reset any existing booking state
            await _update_email_conversation_state(
                from_email, user_id,
                {"booking_in_progress": True, "current_step": "start", "collected_data": {}},
                db
            )
            
            booking_result = await _process_email_appointment_booking(
                body, 
                {"current_step": "start", "collected_data": {}}, 
                user_id, 
                from_email, 
                db
            )
            
            ai_message = booking_result["response"]
            source = "appointment_booking"
        
        # PRIORITY 3: Handle topic change - reset booking and continue to OpenAI
        elif is_topic_change and conversation_state.get("booking_in_progress"):
            logger.info("🔄 Topic change detected, resetting booking state...")
            
            # Reset booking state
            await _update_email_conversation_state(
                from_email, user_id,
                {"booking_in_progress": False, "current_step": None, "collected_data": {}},
                db
            )
            
            # Will fall through to Campaign/OpenAI handling below
        
        # PRIORITY 4: Check Campaign Builder (if not already handled)
        if not ai_message:
            campaign_match = await _match_email_campaign_workflow(
                user_input=full_message,
                user_id=user_id,
                db=db
            )
            
            if campaign_match and campaign_match.get("found"):
                ai_message = campaign_match["response"]
                source = "campaign"
                logger.info(f"✅ Using Campaign: {campaign_match['workflow_name']}")
            
            # PRIORITY 5: Use OpenAI
            else:
                logger.info(f"🤖 Using OpenAI for email response")
                
                try:
                    # Get email conversation history
                    history_cursor = db.email_logs.find({
                        "user_id": user_id,
                        "$or": [
                            {"to_email": from_email},
                            {"from_email": from_email}
                        ]
                    }).sort("created_at", -1).limit(10)
                    
                    history = await history_cursor.to_list(length=10)
                    history.reverse()
                    
                    conversation_context = []
                    for msg in history:
                        role = "user" if msg.get("direction") == "inbound" else "assistant"
                        content = msg.get("content", "") or msg.get("text_content", "")
                        if content:
                            conversation_context.append({
                                "role": role,
                                "content": content
                            })
                    
                    conversation_context.append({
                        "role": "user",
                        "content": full_message
                    })
                    
                    ai_response = await openai_service.generate_chat_response(
                        messages=conversation_context,
                        system_prompt="""You are a helpful AI assistant for a call center business responding to emails. 
                        You help answer customer questions about services, pricing, appointments, and general inquiries.
                        Be professional, friendly, and thorough in your email responses. 
                        Format your responses appropriately for email communication.
                        Keep responses under 300 words.
                        
                        If asked about pricing, provide helpful information about typical pricing structures.
                        If asked about services, describe the call center services available.
                        If asked technical questions, provide helpful guidance and offer to connect them with support."""
                    )
                    
                    if ai_response.get("success"):
                        ai_message = ai_response.get("response", "Thank you for your email. Our team will get back to you shortly!")
                        source = "openai"
                    else:
                        ai_message = "Thank you for your email. Our team will review your message and respond shortly!"
                        source = "fallback"
                        
                except Exception as e:
                    logger.error(f"OpenAI error: {e}")
                    ai_message = "Thank you for your email. Our team will review your message and respond shortly!"
                    source = "fallback"
        
        # ============================================
        # STEP 3: Send AI Response Email
        # ============================================
        if ai_message:
            logger.info(f"📤 Sending AI response via email ({source})")
            
            # Generate reply subject
            reply_subject = subject if subject.lower().startswith("re:") else f"Re: {subject}"
            
            # Send email response
            try:
                await email_automation_service.send_email(
                    to_email=from_email,
                    subject=reply_subject,
                    html_content=f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                            .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 5px; }}
                            .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="content">
                                {ai_message.replace(chr(10), '<br>')}
                            </div>
                            <div class="footer">
                                <p>This is an automated response from CallCenter SaaS.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """,
                    user_id=user_id,
                    text_content=ai_message
                )
                
                # Log the outbound response
                response_log_data = {
                    "user_id": user_id,
                    "to_email": from_email,
                    "from_email": to_email,
                    "subject": reply_subject,
                    "content": ai_message,
                    "text_content": ai_message,
                    "status": "sent",
                    "direction": "outbound",
                    "ai_source": source,
                    "is_auto_reply": True,
                    "original_email_subject": subject,
                    "created_at": datetime.utcnow(),
                    "sent_at": datetime.utcnow(),
                    "opened_count": 0,
                    "clicked_count": 0,
                    "clicked_links": []
                }
                
                await db.email_logs.insert_one(response_log_data)
                
                logger.info(f"✅ AI response sent to {from_email}")
                
            except Exception as e:
                logger.error(f"❌ Failed to send AI response: {e}", exc_info=True)
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "from": from_email,
                "ai_response_sent": bool(ai_message),
                "source": source
            }
        )
        
    except Exception as e:
        logger.error(f"❌ Email webhook error: {e}", exc_info=True)
        return JSONResponse(
            status_code=200,  # Return 200 to prevent retries
            content={"status": "error", "message": str(e)}
        )


# ============================================
# WEBHOOK STATUS ENDPOINT
# ============================================
@router.get("/webhook/status")
async def email_webhook_status():
    """Check email webhook status"""
    return {
        "status": "active",
        "webhook_url": "/api/v1/email-webhook/webhook/inbound",
        "supported_providers": ["SendGrid", "Mailgun", "Custom"],
        "features": [
            "AI auto-response",
            "Campaign Builder integration",
            "Appointment booking",
            "Conversation history",
            "Topic change detection"
        ]
    }


# ============================================
# MANUAL TEST ENDPOINT (for development)
# ============================================
@router.post("/webhook/test")
async def test_email_webhook(
    request: Request,
    db = Depends(get_database)
):
    """
    Test endpoint to simulate incoming email
    Send JSON body with: from, to, subject, text
    """
    try:
        data = await request.json()
        
        # Create a mock form-like object
        class MockForm:
            def __init__(self, data):
                self._data = data
            
            def get(self, key, default=""):
                return self._data.get(key, default)
        
        # Create mock request with form method
        class MockRequest:
            def __init__(self, form_data):
                self._form_data = form_data
            
            async def form(self):
                return MockForm(self._form_data)
        
        # Map JSON keys to form keys
        form_data = {
            "from": data.get("from", data.get("from_email", "")),
            "to": data.get("to", data.get("to_email", "")),
            "subject": data.get("subject", ""),
            "text": data.get("text", data.get("body", "")),
            "html": data.get("html", "")
        }
        
        mock_request = MockRequest(form_data)
        
        # Call the actual webhook
        return await email_inbound_webhook(mock_request, db)
        
    except Exception as e:
        logger.error(f"Test webhook error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================
# RESET CONVERSATION STATE ENDPOINT
# ============================================
@router.post("/reset-state/{email_address}")
async def reset_email_conversation_state(
    email_address: str,
    db = Depends(get_database)
):
    """
    Reset conversation state for an email address
    Useful for testing or when user wants to start fresh
    """
    try:
        result = await db.email_conversation_states.delete_many({
            "email_address": email_address
        })
        
        return {
            "status": "success",
            "email_address": email_address,
            "deleted_count": result.deleted_count
        }
        
    except Exception as e:
        logger.error(f"Reset state error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
