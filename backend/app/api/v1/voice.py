# backend/app/api/v1/voice.py - COMPLETE VERSION WITH SMS + VOICE LOADING FIXED

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import Response, PlainTextResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field
import os

from app.database import get_database
from app.api.deps import get_current_user
from app.services.ai_agent import ai_agent_service
from app.services.elevenlabs import elevenlabs_service
from app.services.twilio import twilio_service
from app.services.call_handler import CallHandlerService, get_call_handler

import logging

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================
# PYDANTIC SCHEMAS
# ============================================

class VoiceAgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    voice_id: str  # ElevenLabs voice ID
    workflow_id: Optional[str] = None  # AI Campaign workflow ID
    system_prompt: Optional[str] = None  # Optional (workflow takes priority)
    greeting_message: Optional[str] = None  # Optional (workflow handles greeting)
    stability: float = Field(default=0.5, ge=0, le=1)
    similarity_boost: float = Field(default=0.75, ge=0, le=1)
    is_active: bool = True


class VoiceAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    voice_id: Optional[str] = None
    workflow_id: Optional[str] = None
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
# HELPER FUNCTION: GENERATE ELEVENLABS AUDIO
# ============================================

async def generate_audio_response(
    text: str,
    agent_config: Optional[dict],
    base_url: str
) -> str:
    """Generate audio using ElevenLabs ONLY and return TwiML"""
    try:
        # Get voice settings from agent
        voice_id = agent_config.get("voice_id") if agent_config else None
        voice_settings = agent_config.get("voice_settings", {}) if agent_config else {}
        stability = voice_settings.get("stability", 0.5)
        similarity_boost = voice_settings.get("similarity_boost", 0.75)
        
        # Only use ElevenLabs if voice_id is configured
        if voice_id:
            logger.info(f"🎙️ Generating ElevenLabs audio with voice: {voice_id}")
            
            audio_url = await elevenlabs_service.text_to_speech_for_call(
                text=text,
                voice_id=voice_id,
                stability=stability,
                similarity_boost=similarity_boost
            )
            
            if audio_url:
                full_audio_url = f"{base_url}{audio_url}"
                logger.info(f"✅ Audio generated: {full_audio_url}")
                return f'<Play>{full_audio_url}</Play>'
            else:
                logger.error("❌ ElevenLabs failed, using Twilio voice")
                return f'<Say voice="alice">{text}</Say>'
        else:
            logger.info("ℹ️ No voice_id configured, using Twilio voice")
            return f'<Say voice="alice">{text}</Say>'
            
    except Exception as e:
        logger.error(f"❌ Error generating audio: {e}")
        return f'<Say voice="alice">{text}</Say>'


# ============================================
# TWILIO WEBHOOK ENDPOINTS
# ============================================

@router.api_route("/webhook/incoming", methods=["GET", "POST"])
async def handle_incoming_call(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle incoming call from Twilio with speech gathering"""
    try:
        if request.method == "GET":
            return PlainTextResponse("Webhook is active", status_code=200)
        
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        call_status = form_data.get("CallStatus")
        
        logger.info(f"📞 Incoming call: {call_sid} from {from_number}")
        
        # Initialize call handler
        call_handler = get_call_handler(db)
        
        # Handle incoming call
        call_record = await call_handler.handle_incoming_call(
            call_sid=call_sid,
            from_number=from_number,
            to_number=to_number
        )
        
        logger.info(f"✅ Call record created: {call_record.get('_id')}")
        
        # Get default agent
        agent = await db.voice_agents.find_one({"is_active": True})
        agent_id = str(agent["_id"]) if agent else None
        
        if agent_id:
            await db.calls.update_one(
                {"_id": call_record["_id"]},
                {"$set": {"agent_id": ObjectId(agent_id)}}
            )
            logger.info(f"✅ Assigned agent: {agent.get('name', 'Unknown')}")
        
        # Get greeting
        greeting = await ai_agent_service.get_greeting(agent_id)
        
        # Create conversation record
        conversation_data = {
            "call_id": call_record["_id"],
            "user_id": call_record.get("user_id"),
            "agent_id": ObjectId(agent_id) if agent_id else None,
            "messages": [{
                "role": "assistant",
                "content": greeting,
                "timestamp": datetime.utcnow()
            }],
            "started_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.conversations.insert_one(conversation_data)
        logger.info(f"✅ Conversation record created")
        
        # Get base URL for audio files
        base_url = str(request.base_url).rstrip('/')
        
        # Generate audio for greeting using ElevenLabs
        audio_tag = await generate_audio_response(greeting, agent, base_url)
        
        # Build TwiML response with improved speech settings
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, reschedule, cancel, yes, no, thanks, help">
        {audio_tag}
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error handling incoming call: {str(e)}")
        import traceback
        traceback.print_exc()
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, we're experiencing technical difficulties. Please try again later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.post("/webhook/incoming/process-speech")
async def process_speech(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Process speech input from user with ElevenLabs voice response"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        speech_result = form_data.get("SpeechResult", "").strip()
        confidence = form_data.get("Confidence", "0")
        
        logger.info(f"🎤 Speech received: '{speech_result}' (confidence: {confidence})")
        
        # Improved confidence threshold
        if not speech_result or float(confidence) < 0.5:
            logger.warning(f"⚠️ Low confidence or empty speech")
            
            base_url = str(request.base_url).rstrip('/')
            
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, yes, no">
        <Say voice="alice">I'm sorry, I didn't catch that. Could you please speak a bit louder?</Say>
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
            return Response(content=twiml, media_type="application/xml")
        
        # Get call record
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
        
        logger.info(f"🤖 AI Response: {ai_response}")
        
        # Check if conversation should end
        should_end = await ai_agent_service.should_end_conversation(ai_response, speech_result)
        
        # Get base URL for audio files
        base_url = str(request.base_url).rstrip('/')
        
        # Generate audio response using ElevenLabs
        audio_tag = await generate_audio_response(ai_response, agent_config, base_url)
        
        if should_end:
            logger.info("👋 Conversation ending - generating TwiML with goodbye")
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {audio_tag}
    <Hangup/>
</Response>"""
        else:
            # Continue conversation
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, reschedule, cancel, yes, no, thanks, help">
        {audio_tag}
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error processing speech: {str(e)}")
        import traceback
        traceback.print_exc()
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I apologize, but I'm having trouble processing your request. Please try again later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.post("/webhook/call-status")
async def call_status_callback(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """✅ FIXED: Handle call status updates - SMS Working"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        call_duration = form_data.get("CallDuration", "0")
        
        logger.info(f"📊 Call status update: {call_sid} - {call_status}")
        
        # Update call record
        update_data = {
            "status": call_status,
            "updated_at": datetime.utcnow()
        }
        
        if call_status == "completed":
            update_data["duration"] = int(call_duration)
            update_data["ended_at"] = datetime.utcnow()
            
            # ✅ FIXED: Determine customer's phone number based on call direction
            call = await db.calls.find_one({"call_sid": call_sid})
            if call:
                call_direction = call.get("direction", "outbound")
                from_number = call.get("from_number")
                to_number = call.get("to_number")
                twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
                
                # ✅ CRITICAL FIX: Determine customer number based on direction
                if call_direction == "inbound":
                    customer_number = from_number  # Customer called us
                else:
                    customer_number = to_number  # We called customer
                
                logger.info(f"📞 Call completed:")
                logger.info(f"   Direction: {call_direction}")
                logger.info(f"   From: {from_number}")
                logger.info(f"   To: {to_number}")
                logger.info(f"   Customer: {customer_number}")
                logger.info(f"   Twilio: {twilio_number}")
                
                # ✅ VALIDATION: Only send SMS if valid and different from Twilio number
                if customer_number and customer_number != twilio_number:
                    from app.services.post_call import post_call_service
                    
                    logger.info(f"📱 Sending post-call SMS to CUSTOMER: {customer_number}")
                    
                    try:
                        await post_call_service.send_post_call_sms(
                            call_id=str(call["_id"]),
                            to_number=customer_number
                        )
                        logger.info(f"✅ Post-call SMS sent successfully to {customer_number}")
                    except Exception as sms_error:
                        logger.error(f"❌ Failed to send post-call SMS: {sms_error}")
                else:
                    if not customer_number:
                        logger.warning(f"⚠️ No customer number found for call {call_sid}")
                    elif customer_number == twilio_number:
                        logger.info(f"ℹ️ Skipping SMS - test call (same number)")
                    else:
                        logger.warning(f"⚠️ Invalid phone numbers")
        
        # Update call in database
        await db.calls.update_one(
            {"call_sid": call_sid},
            {"$set": update_data}
        )
        
        return JSONResponse(content={"status": "success"})
        
    except Exception as e:
        logger.error(f"❌ Error in call status callback: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)


# ============================================
# VOICE AGENT CRUD ENDPOINTS
# ============================================

@router.post("/agents", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        # Convert workflow_id to ObjectId if provided
        workflow_id = None
        if agent_data.workflow_id:
            try:
                workflow_id = ObjectId(agent_data.workflow_id)
                logger.info(f"✅ Linking agent to workflow: {agent_data.workflow_id}")
            except Exception as e:
                logger.warning(f"⚠️ Invalid workflow_id: {agent_data.workflow_id}")
        
        agent_dict = {
            "user_id": user_id,
            "name": agent_data.name,
            "description": agent_data.description,
            "voice_id": agent_data.voice_id,
            "workflow_id": workflow_id,
            "system_prompt": agent_data.system_prompt or "You are a helpful AI assistant for a call center.",
            "greeting_message": agent_data.greeting_message or "Hello! How can I help you today?",
            "voice_settings": {
                "stability": agent_data.stability,
                "similarity_boost": agent_data.similarity_boost
            },
            "personality_traits": [],
            "knowledge_base": {},
            "is_active": agent_data.is_active,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.voice_agents.insert_one(agent_dict)
        agent_dict["_id"] = str(result.inserted_id)
        
        if agent_dict["workflow_id"]:
            agent_dict["workflow_id"] = str(agent_dict["workflow_id"])
        
        logger.info(f"✅ Voice agent created: {agent_dict['name']}")
        
        return agent_dict
        
    except Exception as e:
        logger.error(f"❌ Error creating voice agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/agents")
async def list_voice_agents(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = 0,
    limit: int = 50,
    is_active: Optional[bool] = None
):
    """List all voice agents for current user"""
    try:
        query = {"user_id": str(current_user["_id"])}
        if is_active is not None:
            query["is_active"] = is_active
        
        agents = await db.voice_agents.find(query).skip(skip).limit(limit).to_list(length=limit)
        
        formatted_agents = []
        for agent in agents:
            formatted_agents.append({
                "_id": str(agent["_id"]),
                "user_id": str(agent["user_id"]),
                "name": agent.get("name"),
                "description": agent.get("description"),
                "voice_id": agent.get("voice_id"),
                "workflow_id": str(agent["workflow_id"]) if agent.get("workflow_id") else None,
                "system_prompt": agent.get("system_prompt"),
                "greeting_message": agent.get("greeting_message"),
                "voice_settings": agent.get("voice_settings", {}),
                "is_active": agent.get("is_active", True),
                "created_at": agent.get("created_at"),
                "updated_at": agent.get("updated_at")
            })
        
        total = await db.voice_agents.count_documents(query)
        
        return {
            "agents": formatted_agents,
            "total": total,
            "page": skip // limit + 1 if limit > 0 else 1,
            "page_size": limit
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing agents: {str(e)}")
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
        if agent.get("workflow_id"):
            agent["workflow_id"] = str(agent["workflow_id"])
        
        return agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching agent: {str(e)}")
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
        
        update_dict = {"updated_at": datetime.utcnow()}
        
        if agent_data.name is not None:
            update_dict["name"] = agent_data.name
        if agent_data.description is not None:
            update_dict["description"] = agent_data.description
        if agent_data.voice_id is not None:
            update_dict["voice_id"] = agent_data.voice_id
        if agent_data.workflow_id is not None:
            try:
                update_dict["workflow_id"] = ObjectId(agent_data.workflow_id) if agent_data.workflow_id else None
            except:
                update_dict["workflow_id"] = None
        if agent_data.system_prompt is not None:
            update_dict["system_prompt"] = agent_data.system_prompt
        if agent_data.greeting_message is not None:
            update_dict["greeting_message"] = agent_data.greeting_message
        if agent_data.voice_settings is not None:
            update_dict["voice_settings"] = agent_data.voice_settings
        if agent_data.personality_traits is not None:
            update_dict["personality_traits"] = agent_data.personality_traits
        if agent_data.knowledge_base is not None:
            update_dict["knowledge_base"] = agent_data.knowledge_base
        if agent_data.is_active is not None:
            update_dict["is_active"] = agent_data.is_active
        
        result = await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id), "user_id": str(current_user["_id"])},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
        updated_agent["_id"] = str(updated_agent["_id"])
        updated_agent["user_id"] = str(updated_agent["user_id"])
        if updated_agent.get("workflow_id"):
            updated_agent["workflow_id"] = str(updated_agent["workflow_id"])
        
        logger.info(f"✅ Voice agent updated: {agent_id}")
        
        return updated_agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating agent: {str(e)}")
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
        logger.error(f"❌ Error deleting agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================
# ELEVENLABS VOICE ENDPOINTS - ✅ BOTH PATHS
# ============================================

@router.get("/available-voices")
async def get_available_voices_v1(current_user: dict = Depends(get_current_user)):
    """Get available ElevenLabs voices (v1 path for backward compatibility)"""
    try:
        result = await elevenlabs_service.get_available_voices()
        
        if result.get("success"):
            return {"voices": result.get("voices", [])}
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to fetch voices")
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get voices: {str(e)}"
        )


@router.get("/voices")
async def get_available_voices_v2(current_user: dict = Depends(get_current_user)):
    """Get available ElevenLabs voices (v2 path)"""
    try:
        result = await elevenlabs_service.get_available_voices()
        
        if result.get("success"):
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to fetch voices")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/test-voice")
async def test_voice_v1(
    test_data: VoiceTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Test a voice with sample text (v1 path)"""
    try:
        result = await elevenlabs_service.test_voice(
            text=test_data.text,
            voice_id=test_data.voice_id
        )
        
        if result.get("success"):
            return {
                "success": True,
                "audio_url": result.get("audio_url"),
                "message": "Voice test successful"
            }
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to test voice")
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error testing voice: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test voice: {str(e)}"
        )


@router.post("/test")
async def test_voice_v2(
    test_request: VoiceTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Test a voice with sample text (v2 path)"""
    try:
        result = await elevenlabs_service.test_voice(
            text=test_request.text,
            voice_id=test_request.voice_id
        )
        
        if result.get("success"):
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to generate test audio")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error testing voice: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )




# backend/app/api/v1/voice.py - 🔧 COMPLETE FIXED VERSION without script follow

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import Response, PlainTextResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field
import logging

from app.database import get_database
from app.api.deps import get_current_user
from app.services.ai_agent import ai_agent_service
from app.services.elevenlabs import elevenlabs_service
from app.services.twilio import twilio_service
from app.services.call_handler import get_call_handler

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================
# PYDANTIC SCHEMAS
# ============================================

class VoiceAgentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    voice_id: str
    workflow_id: Optional[str] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    stability: float = Field(default=0.5, ge=0, le=1)
    similarity_boost: float = Field(default=0.75, ge=0, le=1)
    is_active: bool = True


class VoiceAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    voice_id: Optional[str] = None
    workflow_id: Optional[str] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    voice_settings: Optional[dict] = None
    is_active: Optional[bool] = None


class VoiceTestRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    voice_id: str


class MakeCallRequest(BaseModel):
    to_number: str = Field(..., min_length=10)
    agent_id: Optional[str] = None


# ============================================
# VOICE AGENT CRUD ENDPOINTS
# ============================================

@router.post("/agents")
async def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new voice agent"""
    try:
        agent_dict = {
            "user_id": str(current_user["_id"]),
            "name": agent_data.name,
            "description": agent_data.description,
            "voice_id": agent_data.voice_id,
            "workflow_id": ObjectId(agent_data.workflow_id) if agent_data.workflow_id else None,
            "system_prompt": agent_data.system_prompt or "You are a helpful AI assistant.",
            "greeting_message": agent_data.greeting_message or "Hello! How can I help you today?",
            "voice_settings": {
                "stability": agent_data.stability,
                "similarity_boost": agent_data.similarity_boost
            },
            "is_active": agent_data.is_active,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.voice_agents.insert_one(agent_dict)
        agent_dict["_id"] = str(result.inserted_id)
        agent_dict["user_id"] = str(agent_dict["user_id"])
        if agent_dict.get("workflow_id"):
            agent_dict["workflow_id"] = str(agent_dict["workflow_id"])
        
        logger.info(f"✅ Voice agent created: {agent_dict['_id']}")
        return agent_dict
        
    except Exception as e:
        logger.error(f"❌ Error creating agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/agents")
async def list_voice_agents(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all voice agents for current user"""
    try:
        agents = []
        cursor = db.voice_agents.find({"user_id": str(current_user["_id"])})
        
        async for agent in cursor:
            agent["_id"] = str(agent["_id"])
            agent["user_id"] = str(agent["user_id"])
            if agent.get("workflow_id"):
                agent["workflow_id"] = str(agent["workflow_id"])
            agents.append(agent)
        
        return agents
        
    except Exception as e:
        logger.error(f"❌ Error listing agents: {str(e)}")
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
        if agent.get("workflow_id"):
            agent["workflow_id"] = str(agent["workflow_id"])
        
        return agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching agent: {str(e)}")
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
        
        update_dict = {"updated_at": datetime.utcnow()}
        
        if agent_data.name is not None:
            update_dict["name"] = agent_data.name
        if agent_data.description is not None:
            update_dict["description"] = agent_data.description
        if agent_data.voice_id is not None:
            update_dict["voice_id"] = agent_data.voice_id
        if agent_data.workflow_id is not None:
            try:
                update_dict["workflow_id"] = ObjectId(agent_data.workflow_id) if agent_data.workflow_id else None
            except:
                update_dict["workflow_id"] = None
        if agent_data.system_prompt is not None:
            update_dict["system_prompt"] = agent_data.system_prompt
        if agent_data.greeting_message is not None:
            update_dict["greeting_message"] = agent_data.greeting_message
        if agent_data.voice_settings is not None:
            update_dict["voice_settings"] = agent_data.voice_settings
        if agent_data.is_active is not None:
            update_dict["is_active"] = agent_data.is_active
        
        result = await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id), "user_id": str(current_user["_id"])},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
        updated_agent["_id"] = str(updated_agent["_id"])
        updated_agent["user_id"] = str(updated_agent["user_id"])
        if updated_agent.get("workflow_id"):
            updated_agent["workflow_id"] = str(updated_agent["workflow_id"])
        
        logger.info(f"✅ Voice agent updated: {agent_id}")
        return updated_agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating agent: {str(e)}")
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
        return {"message": "Voice agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting agent: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================
# ELEVENLABS VOICE ENDPOINTS
# ============================================

@router.get("/available-voices")
async def get_available_voices(current_user: dict = Depends(get_current_user)):
    """Get available ElevenLabs voices"""
    try:
        result = await elevenlabs_service.get_available_voices()
        
        if result.get("success"):
            return {"voices": result.get("voices", [])}
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to fetch voices")
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/test-voice")
async def test_voice(
    test_data: VoiceTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Test a voice with sample text"""
    try:
        result = await elevenlabs_service.test_voice(
            text=test_data.text,
            voice_id=test_data.voice_id
        )
        
        if result.get("success"):
            return {
                "success": True,
                "audio_url": result.get("audio_url"),
                "message": "Voice test successful"
            }
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Failed to test voice")
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error testing voice: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================
# CALL MANAGEMENT ENDPOINTS
# ============================================

@router.post("/make-call")
async def make_outbound_call(
    call_data: MakeCallRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Initiate an outbound call"""
    try:
        agent_id = call_data.agent_id
        
        if not agent_id:
            agent = await db.voice_agents.find_one({
                "user_id": str(current_user["_id"]),
                "is_active": True
            })
            if agent:
                agent_id = str(agent["_id"])
        
        if not agent_id:
            raise HTTPException(
                status_code=404,
                detail="No active voice agent found"
            )
        
        call = twilio_service.make_call(
            to_number=call_data.to_number,
            from_number=None
        )
        
        logger.info(f"✅ Call initiated to {call_data.to_number}")
        return {
            "success": True,
            "message": "Call initiated successfully",
            "call_sid": call.sid,
            "status": call.status
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error making call: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ============================================
# 🔧 HELPER FUNCTION - AUDIO GENERATION (FIXED)
# ============================================

async def generate_audio_response(text: str, agent: Optional[dict], base_url: str) -> str:
    """
    🔧 FIXED: Generate audio response using ElevenLabs or fallback to Twilio
    Uses correct method name: text_to_speech_for_call
    """
    try:
        if agent and agent.get("voice_id"):
            voice_id = agent["voice_id"]
            voice_settings = agent.get("voice_settings", {})
            stability = voice_settings.get("stability", 0.5)
            similarity_boost = voice_settings.get("similarity_boost", 0.75)
            
            logger.info(f"🎤 Generating audio with ElevenLabs voice: {voice_id}")
            
            # 🔧 FIXED: Use correct method name
            audio_url = await elevenlabs_service.text_to_speech_for_call(
                text=text,
                voice_id=voice_id,
                stability=stability,
                similarity_boost=similarity_boost
            )
            
            if audio_url:
                full_audio_url = f"{base_url}{audio_url}"
                logger.info(f"✅ Audio generated: {full_audio_url}")
                return f'<Play>{full_audio_url}</Play>'
            else:
                logger.error("❌ ElevenLabs failed, using Twilio voice")
                return f'<Say voice="alice">{text}</Say>'
        else:
            logger.info("ℹ️ No voice_id configured, using Twilio voice")
            return f'<Say voice="alice">{text}</Say>'
            
    except Exception as e:
        logger.error(f"❌ Error generating audio: {e}")
        return f'<Say voice="alice">{text}</Say>'


# ============================================
# 🔧 TWILIO WEBHOOK ENDPOINTS - FIXED VERSION
# ============================================

@router.api_route("/webhook/incoming", methods=["GET", "POST"])
async def handle_incoming_call(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    🎯 FIXED: Handle incoming call with proper workflow metadata initialization
    """
    try:
        if request.method == "GET":
            return PlainTextResponse("Webhook is active", status_code=200)
        
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        
        logger.info(f"📞 Incoming call: {call_sid} from {from_number}")
        
        # 1️⃣ Initialize call handler and create call record
        call_handler = get_call_handler(db)
        call_record = await call_handler.handle_incoming_call(
            call_sid=call_sid,
            from_number=from_number,
            to_number=to_number
        )
        
        logger.info(f"✅ Call record created: {call_record.get('_id')}")
        
        # 2️⃣ Get default active agent
        agent = await db.voice_agents.find_one({"is_active": True})
        agent_id = str(agent["_id"]) if agent else None
        
        if not agent_id:
            logger.error("❌ No active agent found")
            error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, no agent is available at the moment.</Say>
    <Hangup/>
</Response>"""
            return Response(content=error_twiml, media_type="application/xml")
        
        # Update call with agent ID
        await db.calls.update_one(
            {"_id": call_record["_id"]},
            {"$set": {"agent_id": ObjectId(agent_id)}}
        )
        logger.info(f"✅ Assigned agent: {agent.get('name', 'Unknown')}")
        
        # 3️⃣ 🔧 NEW: Get workflow info if agent has workflow configured
        workflow_id = None
        start_node_id = None
        start_node_type = None
        
        if agent and agent.get("workflow_id"):
            workflow_id = str(agent["workflow_id"])
            logger.info(f"📋 Agent has workflow configured: {workflow_id}")
            
            try:
                # Import workflow engine
                from app.services.workflow_engine import workflow_engine
                
                # Get workflow
                workflow = await workflow_engine.get_workflow(workflow_id)
                
                if workflow:
                    # Find start node
                    start_node = await workflow_engine.find_start_node(workflow)
                    
                    if start_node:
                        start_node_id = start_node.get("id")
                        start_node_type = start_node.get("type", "begin")
                        logger.info(f"✅ Found start node: {start_node_id} (Type: {start_node_type})")
                    else:
                        logger.warning("⚠️ No start node found in workflow")
                else:
                    logger.warning(f"⚠️ Workflow not found: {workflow_id}")
                    
            except Exception as e:
                logger.error(f"❌ Error loading workflow: {e}")
                import traceback
                traceback.print_exc()
        
        # 4️⃣ Get greeting message (from workflow if configured)
        greeting = await ai_agent_service.get_greeting(agent_id)
        logger.info(f"✅ Greeting: {greeting[:50]}...")
        
        # 5️⃣ 🔧 FIXED: Create conversation record WITH workflow metadata
        conversation_data = {
            "call_id": call_record["_id"],
            "user_id": call_record.get("user_id"),
            "agent_id": ObjectId(agent_id),
            "messages": [{
                "role": "assistant",
                "content": greeting,
                "timestamp": datetime.utcnow(),
                # 🔧 FIXED: Add workflow metadata to initial greeting message
                "metadata": {
                    "workflow_id": workflow_id,
                    "node_id": start_node_id,
                    "node_type": start_node_type,
                    "is_start": True
                } if workflow_id and start_node_id else {}
            }],
            # 🔧 FIXED: Add workflow metadata to conversation
            "metadata": {
                "workflow_id": workflow_id,
                "appointment_data": {}
            } if workflow_id else {},
            "started_at": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.conversations.insert_one(conversation_data)
        logger.info(f"✅ Conversation record created with workflow metadata")
        
        # 6️⃣ Get base URL for audio files
        base_url = str(request.base_url).rstrip('/')
        
        # 7️⃣ Generate audio for greeting using ElevenLabs
        audio_tag = await generate_audio_response(greeting, agent, base_url)
        
        # 8️⃣ Build TwiML response with speech gathering
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, reschedule, cancel, yes, no, thanks, help, name, email, phone, date, time">
        {audio_tag}
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
        
        logger.info(f"✅ Sending initial TwiML response with gathering")
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error handling incoming call: {str(e)}")
        import traceback
        traceback.print_exc()
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, we're experiencing technical difficulties. Please try again later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.post("/webhook/incoming/process-speech")
async def process_speech(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    🎯 Process user speech and generate AI response
    """
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        speech_result = form_data.get("SpeechResult", "").strip()
        confidence = form_data.get("Confidence", "0")
        
        logger.info(f"🎤 Speech received: '{speech_result}' (confidence: {confidence})")
        
        # Improved confidence threshold
        if not speech_result or float(confidence) < 0.5:
            logger.warning(f"⚠️ Low confidence or empty speech")
            
            base_url = str(request.base_url).rstrip('/')
            
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, yes, no, name, email, phone, date, time">
        <Say voice="alice">I'm sorry, I didn't catch that. Could you please speak a bit louder?</Say>
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
            return Response(content=twiml, media_type="application/xml")
        
        # Get call record
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
        
        # 🎯 Process with AI agent (workflow or OpenAI fallback)
        ai_response = await ai_agent_service.process_message(
            user_input=speech_result,
            call_id=str(call_record["_id"]),
            agent_config=agent_config
        )
        
        logger.info(f"🤖 AI Response: {ai_response[:100]}...")
        
        # 🔧 FIXED: Check if conversation should end (with simpler logic if method doesn't exist)
        should_end = False
        try:
            if hasattr(ai_agent_service, 'should_end_conversation'):
                should_end = await ai_agent_service.should_end_conversation(ai_response, speech_result)
            else:
                # Simple fallback: check for goodbye phrases
                goodbye_phrases = ["goodbye", "bye", "thank you for calling", "have a great day"]
                should_end = any(phrase in ai_response.lower() for phrase in goodbye_phrases)
        except Exception as e:
            logger.warning(f"⚠️ Error checking conversation end: {e}")
            should_end = False
        
        # Get base URL for audio files
        base_url = str(request.base_url).rstrip('/')
        
        # Generate audio response using ElevenLabs
        audio_tag = await generate_audio_response(ai_response, agent_config, base_url)
        
        if should_end:
            logger.info("👋 Conversation ending - generating TwiML with goodbye")
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {audio_tag}
    <Pause length="1"/>
    <Hangup/>
</Response>"""
        else:
            # Continue conversation
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/incoming/process-speech" 
        method="POST" 
        timeout="8"
        speechTimeout="auto"
        maxSpeechTime="120"
        speechModel="phone_call"
        enhanced="true"
        language="en-US"
        hints="appointment, booking, schedule, service, quote, reschedule, cancel, yes, no, thanks, help, name, email, phone, date, time">
        {audio_tag}
        <Pause length="2"/>
    </Gather>
    <Hangup/>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error processing speech: {str(e)}")
        import traceback
        traceback.print_exc()
        
        error_twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I apologize, but I'm having trouble processing your request. Please try again later.</Say>
    <Hangup/>
</Response>"""
        
        return Response(content=error_twiml, media_type="application/xml")


@router.post("/webhook/call-status")
async def call_status_callback(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle call status updates from Twilio"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        call_duration = form_data.get("CallDuration")
        
        logger.info(f"📊 Call status update: {call_sid} -> {call_status}")
        
        call_handler = get_call_handler(db)
        
        await call_handler.update_call_status(
            call_sid=call_sid,
            status=call_status,
            duration=int(call_duration) if call_duration else None
        )
        
        return Response(content="OK", status_code=200)
        
    except Exception as e:
        logger.error(f"❌ Error handling call status: {str(e)}")
        return Response(content="Error", status_code=500)


