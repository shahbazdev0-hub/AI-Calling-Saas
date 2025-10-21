# backend/app/api/v1/voice.py - COMPLETE WITH TIMEOUT FIX ONLY

from fastapi import APIRouter, Request, HTTPException, Depends, status
from fastapi.responses import Response
from typing import Optional, List
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field
import logging

from app.api.deps import get_current_user, get_database
from app.services.ai_agent import ai_agent_service
from app.services.elevenlabs import elevenlabs_service
from app.services.twilio import twilio_service
from app.services.call_handler import CallHandlerService, get_call_handler
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()
logger = logging.getLogger(__name__)

# ============================================
# PYDANTIC SCHEMAS
# ============================================

class VoiceAgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    voice_id: str
    system_prompt: str = Field(..., min_length=10)
    greeting_message: str
    voice_settings: dict = Field(default_factory=lambda: {"stability": 0.5, "similarity_boost": 0.75})
    personality_traits: List[str] = Field(default_factory=list)
    knowledge_base: dict = Field(default_factory=dict)
    is_active: bool = True


class VoiceAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    voice_id: Optional[str] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    voice_settings: Optional[dict] = None
    personality_traits: Optional[List[str]] = None
    knowledge_base: Optional[dict] = None
    is_active: Optional[bool] = None


class VoiceTestRequest(BaseModel):
    text: str
    voice_id: str


# ============================================
# TWILIO WEBHOOK ENDPOINTS
# ============================================

@router.api_route("/webhook/incoming", methods=["GET", "POST"])
async def handle_incoming_call(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Handle incoming call from Twilio with speech gathering
    Supports both GET (webhook verification) and POST (actual calls)
    """
    try:
        # Log the request method
        logger.info(f"🔥 Incoming request: {request.method} /webhook/incoming")
        
        # Handle GET request (webhook verification)
        if request.method == "GET":
            logger.info("✅ GET request received - webhook verification")
            simple_response = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Webhook is working correctly.</Say>
</Response>"""
            return Response(content=simple_response, media_type="application/xml")
        
        # Handle POST request (actual incoming call)
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        
        logger.info(f"📞 Incoming call: {call_sid} from {from_number} to {to_number}")
        
        # Get the base URL from request
        base_url = str(request.base_url).rstrip('/')
        webhook_base = f"{base_url}/api/v1/voice/webhook/incoming"
        
        # Initialize call handler
        call_handler = get_call_handler(db)
        
        # Create or update call record
        call_record = await call_handler.handle_incoming_call(
            call_sid=call_sid,
            from_number=from_number,
            to_number=to_number
        )
        
        logger.info(f"✅ Call record created: {call_record.get('_id')}")
        
        # Get AI agent greeting
        greeting = await ai_agent_service.get_greeting(call_record.get("agent_id"))
        
        # 🔥 FIX 1: Updated TwiML with longer timeouts
        twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{webhook_base}/process-speech" 
        method="POST" 
        timeout="10"
        speechTimeout="3"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, service, quote, schedule, email, phone"
        profanityFilter="false">
        <Say voice="alice">{greeting}</Say>
    </Gather>
    <Say voice="alice">I didn't hear a response. Please call back when you're ready.</Say>
    <Hangup/>
</Response>"""
        
        logger.info("📤 Sending TwiML with speech gathering to Twilio")
        
        return Response(
            content=twiml_response,
            media_type="application/xml"
        )
        
    except Exception as e:
        logger.error(f"❌ Error in incoming call webhook: {str(e)}", exc_info=True)
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, we're experiencing technical difficulties. Please try again later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.api_route("/webhook/incoming/process-speech", methods=["GET", "POST"])
async def process_speech(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Process the user's speech input and continue conversation
    Supports both GET and POST methods
    """
    try:
        logger.info(f"🔥 Speech processing request: {request.method}")
        
        # Handle GET request
        if request.method == "GET":
            simple_response = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Speech processing endpoint is ready.</Say>
</Response>"""
            return Response(content=simple_response, media_type="application/xml")
        
        # Handle POST request
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        speech_result = form_data.get("SpeechResult", "")
        confidence = form_data.get("Confidence", "0")
        
        logger.info(f"🗣️ Speech received from {call_sid}: '{speech_result}' (confidence: {confidence})")
        
        # 🔥 FIX 3: No speech detected - give user more time
        if not speech_result:
            twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="10"
        speechTimeout="3"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true">
        <Say voice="alice">I'm sorry, I didn't hear anything. Could you please repeat that?</Say>
        <Pause length="2"/>
    </Gather>
    <Say voice="alice">I'm still not hearing anything. Please call back when you're ready. Goodbye.</Say>
    <Hangup/>
</Response>"""
            return Response(content=twiml, media_type="application/xml")
        
        # Get call record
        call_handler = get_call_handler(db)
        call_record = await db.calls.find_one({"call_sid": call_sid})
        
        if not call_record:
            logger.error(f"❌ Call record not found: {call_sid}")
            error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, I couldn't find your call information.</Say>
    <Hangup/>
</Response>"""
            return Response(content=error_twiml, media_type="application/xml")
        
        # Get agent configuration
        agent_config = None
        if call_record.get("agent_id"):
            agent_config = await db.voice_agents.find_one({"_id": ObjectId(call_record["agent_id"])})
        
        # Process with AI agent
        ai_response = await ai_agent_service.process_user_input(
            user_input=speech_result,
            call_id=str(call_record["_id"]),
            agent_config=agent_config
        )
        
        # Save conversation turn
        await call_handler.save_conversation_turn(
            call_id=str(call_record["_id"]),
            role="user",
            content=speech_result
        )
        
        await call_handler.save_conversation_turn(
            call_id=str(call_record["_id"]),
            role="assistant",
            content=ai_response
        )
        
        logger.info(f"🤖 AI Response: {ai_response}")
        
        # Check if conversation should end
        should_end = await ai_agent_service.should_end_conversation(ai_response)
        
        if should_end:
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">{ai_response}</Say>
    <Hangup/>
</Response>"""
        else:
            # 🔥 FIX 2: Continue conversation with longer timeouts
            base_url = str(request.base_url).rstrip('/')
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="10"
        speechTimeout="3"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, service, quote, schedule, email, phone, yes, no">
        <Say voice="alice">{ai_response}</Say>
        <Pause length="2"/>
    </Gather>
    <Say voice="alice">I didn't hear a response. Thank you for calling. Goodbye.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error processing speech: {str(e)}", exc_info=True)
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I'm sorry, I encountered an error. Please try calling back later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.post("/webhook/status")
async def handle_call_status(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle call status updates from Twilio"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        duration = form_data.get("CallDuration")
        
        logger.info(f"📊 Call status update: {call_sid} -> {call_status} (duration: {duration})")
        
        call_handler = get_call_handler(db)
        await call_handler.update_call_status(
            call_sid=call_sid,
            status=call_status,
            duration=int(duration) if duration else None
        )
        
        # 🔥 Trigger automation on call completion
        if call_status == "completed":
            await call_handler.generate_call_log(call_sid)
            
            # Get call details for automation
            call = await db.calls.find_one({"call_sid": call_sid})
            if call:
                # Trigger post-call automation
                await trigger_call_completed_automation(
                    call_id=str(call["_id"]),
                    user_id=str(call["user_id"]),
                    phone_number=call.get("phone_number") or call.get("from_number"),
                    db=db
                )
        
        return {"status": "ok"}
        
    except Exception as e:
        logger.error(f"❌ Error in status webhook: {str(e)}")
        return {"status": "error", "message": str(e)}


# 🔥 Trigger automation after call completion
async def trigger_call_completed_automation(
    call_id: str, 
    user_id: str, 
    phone_number: str,
    db: AsyncIOMotorDatabase
):
    """
    Trigger automation after call completes
    Sends SMS and emails based on active automations
    """
    try:
        logger.info(f"🤖 Triggering post-call automation for call {call_id}")
        
        # Find active automations with call_completed trigger
        automations = await db.automations.find({
            "user_id": user_id,
            "is_active": True,
            "trigger_type": "call_completed"
        }).to_list(length=100)
        
        logger.info(f"📋 Found {len(automations)} active automations for user {user_id}")
        
        if not automations:
            return
        
        # Import services
        from app.services.sms import sms_service
        from app.services.email import email_service
        
        # Execute each automation
        for automation in automations:
            try:
                logger.info(f"🔄 Processing automation: {automation.get('name')}")
                logger.info(f"   Actions: {automation.get('actions', [])}")
                
                actions = automation.get("actions", [])
                
                # Execute each action
                for action in actions:
                    try:
                        if action == "send_sms" and phone_number:
                            # Send SMS
                            sms_message = automation.get("sms_message", "Thank you for your call! We'll be in touch soon.")
                            logger.info(f"📱 Sending SMS to {phone_number}")
                            
                            sms_result = sms_service.send_sms(
                                to_number=phone_number,
                                message=sms_message
                            )
                            
                            if sms_result.get("success"):
                                logger.info(f"✅ SMS sent successfully to {phone_number}")
                                
                                # Save SMS record
                                await db.sms_messages.insert_one({
                                    "user_id": user_id,
                                    "to_number": phone_number,
                                    "message": sms_message,
                                    "status": "sent",
                                    "call_id": ObjectId(call_id),
                                    "automation_id": automation["_id"],
                                    "created_at": datetime.utcnow()
                                })
                            else:
                                logger.error(f"❌ Failed to send SMS: {sms_result.get('error')}")
                        
                        elif action == "send_email":
                            # Send Email
                            email_recipient = automation.get("email_recipient")
                            if not email_recipient:
                                logger.warning(f"⚠️ No email recipient configured")
                                continue
                            
                            email_subject = automation.get("email_subject", "Call Summary")
                            email_body = automation.get("email_body", "Thank you for your recent call.")
                            
                            logger.info(f"📧 Sending email to {email_recipient}")
                            
                            email_result = await email_service.send_email(
                                to_email=email_recipient,
                                subject=email_subject,
                                body=email_body
                            )
                            
                            if email_result:
                                logger.info(f"✅ Email sent successfully to {email_recipient}")
                            else:
                                logger.error(f"❌ Failed to send email")
                        
                        elif action == "create_task":
                            # Create Task
                            task_title = automation.get("task_title", "Follow up on call")
                            task_description = automation.get("task_description", f"Follow up on call {call_id}")
                            
                            await db.tasks.insert_one({
                                "user_id": user_id,
                                "title": task_title,
                                "description": task_description,
                                "call_id": ObjectId(call_id),
                                "automation_id": automation["_id"],
                                "status": "pending",
                                "created_at": datetime.utcnow()
                            })
                            
                            logger.info(f"✅ Task created: {task_title}")
                        
                    except Exception as action_error:
                        logger.error(f"❌ Error executing action {action}: {str(action_error)}")
                        continue
                
                # Log automation execution
                await db.automation_logs.insert_one({
                    "automation_id": automation["_id"],
                    "call_id": ObjectId(call_id),
                    "user_id": user_id,
                    "trigger": "call_completed",
                    "executed_at": datetime.utcnow(),
                    "status": "completed",
                    "actions_executed": actions,
                    "started_at": datetime.utcnow(),
                    "completed_at": datetime.utcnow()
                })
                
                logger.info(f"✅ Automation {automation['_id']} executed successfully")
                
            except Exception as automation_error:
                logger.error(f"❌ Error executing automation {automation.get('_id')}: {str(automation_error)}")
                
                # Log failed execution
                await db.automation_logs.insert_one({
                    "automation_id": automation["_id"],
                    "call_id": ObjectId(call_id),
                    "user_id": user_id,
                    "trigger": "call_completed",
                    "executed_at": datetime.utcnow(),
                    "status": "failed",
                    "error": str(automation_error),
                    "started_at": datetime.utcnow(),
                    "completed_at": datetime.utcnow()
                })
        
        logger.info(f"✅ Post-call automation completed for call {call_id}")
        
    except Exception as e:
        logger.error(f"❌ Error in trigger_call_completed_automation: {str(e)}")


# ============================================
# VOICE AGENTS CRUD ENDPOINTS
# ============================================

@router.get("/agents")
async def get_voice_agents(
    skip: int = 0,
    limit: int = 50,
    is_active: Optional[bool] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all voice agents for the current user"""
    try:
        filter_query = {"user_id": str(current_user["_id"])}
        
        if is_active is not None:
            filter_query["is_active"] = is_active
        
        agents_cursor = db.voice_agents.find(filter_query).skip(skip).limit(limit)
        agents = await agents_cursor.to_list(length=limit)
        
        # Format agents
        formatted_agents = []
        for agent in agents:
            agent["_id"] = str(agent["_id"])
            agent["user_id"] = str(agent["user_id"])
            formatted_agents.append(agent)
        
        total = await db.voice_agents.count_documents(filter_query)
        
        return {
            "agents": formatted_agents,
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "page_size": limit
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching voice agents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/agents")
async def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new voice agent"""
    try:
        agent_dict = {
            **agent_data.model_dump(),
            "user_id": str(current_user["_id"]),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.voice_agents.insert_one(agent_dict)
        agent_dict["_id"] = str(result.inserted_id)
        
        logger.info(f"✅ Voice agent created: {agent_dict['name']}")
        
        return agent_dict
        
    except Exception as e:
        logger.error(f"❌ Error creating voice agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/agents/{agent_id}")
async def get_voice_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific voice agent"""
    try:
        if not ObjectId.is_valid(agent_id):
            raise HTTPException(status_code=400, detail="Invalid agent ID")
        
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": str(current_user["_id"])
        })
        
        if not agent:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        agent["_id"] = str(agent["_id"])
        agent["user_id"] = str(agent["user_id"])
        
        return agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching voice agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.patch("/agents/{agent_id}")
async def update_voice_agent(
    agent_id: str,
    agent_data: VoiceAgentUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a voice agent"""
    try:
        if not ObjectId.is_valid(agent_id):
            raise HTTPException(status_code=400, detail="Invalid agent ID")
        
        update_data = {k: v for k, v in agent_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id), "user_id": str(current_user["_id"])},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
        updated_agent["_id"] = str(updated_agent["_id"])
        updated_agent["user_id"] = str(updated_agent["user_id"])
        
        logger.info(f"✅ Voice agent updated: {agent_id}")
        
        return updated_agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating voice agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/agents/{agent_id}")
async def delete_voice_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a voice agent"""
    try:
        if not ObjectId.is_valid(agent_id):
            raise HTTPException(status_code=400, detail="Invalid agent ID")
        
        result = await db.voice_agents.delete_one({
            "_id": ObjectId(agent_id),
            "user_id": str(current_user["_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        logger.info(f"✅ Voice agent deleted: {agent_id}")
        
        return {"success": True, "message": "Voice agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting voice agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================
# ELEVENLABS VOICE ENDPOINTS
# ============================================

@router.get("/voices")
async def get_available_voices(
    current_user: dict = Depends(get_current_user)
):
    """Get available ElevenLabs voices"""
    try:
        voices = await elevenlabs_service.get_voices()
        return {"voices": voices}
        
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get voices: {str(e)}"
        )


@router.post("/test-voice")
async def test_voice(
    test_data: VoiceTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Test a voice with sample text"""
    try:
        audio_url = await elevenlabs_service.text_to_speech(
            text=test_data.text,
            voice_id=test_data.voice_id
        )
        
        return {"audio_url": audio_url}
        
    except Exception as e:
        logger.error(f"❌ Error testing voice: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test voice: {str(e)}"
        )