# # backend/app/api/v1/voice.py - COMPLETE FIXED VERSION

# from fastapi import APIRouter, Depends, Request, HTTPException, status
# from fastapi.responses import Response, PlainTextResponse, JSONResponse, FileResponse
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from datetime import datetime
# from bson import ObjectId
# from typing import Optional, List
# from pydantic import BaseModel, Field
# import logging
# import os
# from pathlib import Path

# from app.database import get_database
# from app.api.deps import get_current_user
# from app.services.ai_agent import ai_agent_service
# from app.services.elevenlabs import elevenlabs_service
# from app.services.twilio import twilio_service
# from app.services.call_handler import get_call_handler

# logger = logging.getLogger(__name__)
# router = APIRouter()


# # ============================================
# # PYDANTIC SCHEMAS
# # ============================================

# class VoiceAgentCreate(BaseModel):
#     name: str
#     description: Optional[str] = None
#     voice_id: str
#     voice_settings: Optional[dict] = None
#     workflow_id: Optional[str] = None
#     system_prompt: Optional[str] = None
#     greeting_message: Optional[str] = None
#     personality_traits: Optional[List[str]] = []
#     knowledge_base: Optional[dict] = None
#     is_active: Optional[bool] = True


# class VoiceAgentUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     voice_id: Optional[str] = None
#     voice_settings: Optional[dict] = None
#     workflow_id: Optional[str] = None
#     system_prompt: Optional[str] = None
#     greeting_message: Optional[str] = None
#     personality_traits: Optional[List[str]] = None
#     knowledge_base: Optional[dict] = None
#     is_active: Optional[bool] = None


# class VoiceTestRequest(BaseModel):
#     text: str
#     voice_id: str


# # ============================================
# # HELPER FUNCTION: GENERATE AUDIO
# # ============================================

# async def generate_audio_response(
#     text: str,
#     agent_config: Optional[dict],
#     base_url: str
# ) -> str:
#     """Generate audio using ElevenLabs and return TwiML"""
#     try:
#         voice_id = agent_config.get("voice_id") if agent_config else None
#         voice_settings = agent_config.get("voice_settings", {}) if agent_config else {}
        
#         # ✅ FIX: Extract voice settings with defaults
#         stability = voice_settings.get("stability", 0.5)
#         similarity_boost = voice_settings.get("similarity_boost", 0.75)
        
#         logger.info(f"🎙️ Voice settings - Stability: {stability}, Similarity: {similarity_boost}")
        
#         if voice_id:
#             logger.info(f"🎤 Generating ElevenLabs audio with voice: {voice_id}")
            
#             audio_url = await elevenlabs_service.text_to_speech_for_call(
#                 text=text,
#                 voice_id=voice_id,
#                 stability=stability,  # ✅ Pass the actual values
#                 similarity_boost=similarity_boost  # ✅ Pass the actual values
#             )
            
#             if audio_url:
#                 # Make sure URL is complete
#                 if not audio_url.startswith("http"):
#                     audio_url = f"{base_url}{audio_url}"
#                 logger.info(f"✅ Audio generated: {audio_url}")
#                 return f'<Play>{audio_url}</Play>'
        
#         # Fallback to Twilio voice
#         logger.info("⚙️ Using Twilio voice")
#         return f'<Say voice="alice">{text}</Say>'
        
#     except Exception as e:
#         logger.error(f"❌ Error generating audio: {e}")
#         return f'<Say voice="alice">{text}</Say>'


# # ============================================
# # AUDIO FILE SERVING ENDPOINT
# # ============================================

# @router.get("/static/audio/{filename}")
# async def serve_audio_file(filename: str):
#     """Serve audio files for Twilio playback"""
#     try:
#         audio_dir = Path("static/audio")
#         file_path = audio_dir / filename
        
#         if file_path.exists() and file_path.is_file():
#             return FileResponse(
#                 path=str(file_path),
#                 media_type="audio/mpeg",
#                 headers={
#                     "Cache-Control": "public, max-age=3600"
#                 }
#             )
#         else:
#             raise HTTPException(status_code=404, detail="Audio file not found")
            
#     except Exception as e:
#         logger.error(f"❌ Error serving audio file: {e}")
#         raise HTTPException(status_code=500, detail="Error serving audio")


# # ============================================
# # TWILIO WEBHOOK - INCOMING CALL
# # ============================================

# @router.api_route("/webhook/incoming", methods=["GET", "POST"])
# async def handle_incoming_call(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Handle incoming/outbound call initialization with workflow"""
#     try:
#         if request.method == "GET":
#             return PlainTextResponse("Webhook is active", status_code=200)
        
#         form_data = await request.form()
#         call_sid = form_data.get("CallSid")
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         direction = form_data.get("Direction", "inbound")
        
#         logger.info(f"📞 Call webhook: {call_sid} from {from_number} ({direction})")
        
#         # Find or create call record
#         call_record = await db.calls.find_one({"twilio_call_sid": call_sid})
        
#         if not call_record:
#             # Create new call record for inbound calls
#             call_data = {
#                 "twilio_call_sid": call_sid,
#                 "direction": direction,
#                 "from_number": from_number,
#                 "to_number": to_number,
#                 "status": "in-progress",
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow()
#             }
#             result = await db.calls.insert_one(call_data)
#             call_record = await db.calls.find_one({"_id": result.inserted_id})
#             logger.info(f"✅ Created call record: {result.inserted_id}")
        
#         # Get ANY active agent
#         agent = await db.voice_agents.find_one({"is_active": True})
        
#         if not agent:
#             logger.error("❌ No active agent found")
#             return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Say voice="alice">Sorry, no agent is available.</Say>
#     <Hangup/>
# </Response>""", media_type="application/xml")
        
#         # Store agent in call record
#         await db.calls.update_one(
#             {"_id": call_record["_id"]},
#             {"$set": {"agent_id": agent["_id"]}}
#         )
        
#         # Create conversation
#         conversation_data = {
#             "call_sid": call_sid,
#             "agent_id": agent["_id"],
#             "workflow_id": agent.get("workflow_id"),
#             "messages": [],
#             "context": {},
#             "created_at": datetime.utcnow()
#         }
#         await db.conversations.insert_one(conversation_data)
        
#         # Generate greeting
#         greeting = agent.get("greeting_message", "Hello! How can I help you today?")
        
#         # Get base URL
#         base_url = str(request.base_url).rstrip('/')
        
#         # Generate audio with agent's voice settings
#         audio_tag = await generate_audio_response(greeting, agent, base_url)
        
#         # Build TwiML
#         twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Gather 
#         input="speech" 
#         action="{base_url}/api/v1/voice/webhook/gather" 
#         method="POST" 
#         timeout="10"
#         speechTimeout="3">
#         {audio_tag}
#         <Pause length="1"/>
#     </Gather>
#     <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
# </Response>"""
        
#         return Response(content=twiml, media_type="application/xml")
        
#     except Exception as e:
#         logger.error(f"❌ Error in incoming webhook: {e}")
#         import traceback
#         traceback.print_exc()
        
#         return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Say voice="alice">Sorry, an error occurred.</Say>
#     <Hangup/>
# </Response>""", media_type="application/xml")


# # ============================================
# # TWILIO WEBHOOK - GATHER SPEECH
# # ============================================

# @router.post("/webhook/gather")
# async def handle_gather(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Process user speech input"""
#     try:
#         form_data = await request.form()
#         call_sid = form_data.get("CallSid")
#         speech_result = form_data.get("SpeechResult", "")
        
#         logger.info(f"🎤 User said: '{speech_result}'")
        
#         # Handle empty speech
#         if not speech_result:
#             base_url = str(request.base_url).rstrip('/')
#             twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Gather 
#         input="speech" 
#         action="{base_url}/api/v1/voice/webhook/gather" 
#         method="POST" 
#         timeout="10"
#         speechTimeout="3">
#         <Say voice="alice">I didn't hear anything. Please try again.</Say>
#         <Pause length="1"/>
#     </Gather>
#     <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
# </Response>"""
#             return Response(content=twiml, media_type="application/xml")
        
#         # Get conversation and agent
#         conversation = await db.conversations.find_one({"call_sid": call_sid})
#         if not conversation:
#             raise HTTPException(status_code=404, detail="Conversation not found")
        
#         agent = await db.voice_agents.find_one({"_id": conversation["agent_id"]})
#         if not agent:
#             raise HTTPException(status_code=404, detail="Agent not found")
        
#         # Get AI response
#         call_handler = get_call_handler(db)
#         ai_response = await call_handler.process_user_input(
#             call_sid=call_sid,
#             user_input=speech_result,
#             conversation_id=str(conversation["_id"]),
#             agent_config=agent
#         )
        
#         # Get base URL
#         base_url = str(request.base_url).rstrip('/')
        
#         # Check if conversation should end
#         if ai_response.lower() in ["goodbye", "bye", "thank you", "thanks"]:
#             audio_tag = await generate_audio_response("Goodbye! Have a great day!", agent, base_url)
#             twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     {audio_tag}
#     <Pause length="1"/>
#     <Say voice="alice">Goodbye!</Say>
#     <Hangup/>
# </Response>"""
#         else:
#             audio_tag = await generate_audio_response(ai_response, agent, base_url)
#             twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
# <Response>
#     <Gather 
#         input="speech" 
#         action="{base_url}/api/v1/voice/webhook/gather" 
#         method="POST" 
#         timeout="10"
#         speechTimeout="3">
#         {audio_tag}
#         <Pause length="1"/>
#     </Gather>
#     <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
# </Response>"""
        
#         return Response(content=twiml, media_type="application/xml")
        
#     except Exception as e:
#         logger.error(f"❌ Error in gather webhook: {e}")
#         return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
# <Response><Hangup/></Response>""", media_type="application/xml")


# # ============================================
# # CALL STATUS WEBHOOK
# # ============================================

# @router.post("/webhook/call-status")
# async def handle_call_status(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Handle call status updates"""
#     try:
#         form_data = await request.form()
#         call_sid = form_data.get("CallSid")
#         call_status = form_data.get("CallStatus")
#         call_duration = form_data.get("CallDuration")
        
#         logger.info(f"📊 Call status: {call_sid} -> {call_status}")
        
#         # Update call record
#         update_data = {
#             "status": call_status,
#             "updated_at": datetime.utcnow()
#         }
        
#         if call_status == "completed" and call_duration:
#             update_data["duration"] = int(call_duration)
#             update_data["ended_at"] = datetime.utcnow()
        
#         await db.calls.update_one(
#             {"twilio_call_sid": call_sid},
#             {"$set": update_data}
#         )
        
#         return Response(content="OK", status_code=200)
        
#     except Exception as e:
#         logger.error(f"❌ Error updating call status: {e}")
#         return Response(content="Error", status_code=500)


# # ============================================
# # VOICE AGENT CRUD ENDPOINTS
# # ============================================

# @router.get("/agents")
# async def list_voice_agents(
#     is_active: Optional[bool] = None,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """List voice agents for current user"""
#     try:
#         query = {"user_id": str(current_user["_id"])}
#         if is_active is not None:
#             query["is_active"] = is_active
        
#         agents = await db.voice_agents.find(query).to_list(100)
        
#         # Convert ObjectId to string
#         for agent in agents:
#             agent["_id"] = str(agent["_id"])
#             if agent.get("workflow_id"):
#                 agent["workflow_id"] = str(agent["workflow_id"])
        
#         return agents
        
#     except Exception as e:
#         logger.error(f"❌ Error listing agents: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/agents")
# async def create_voice_agent(
#     agent_data: VoiceAgentCreate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Create a new voice agent"""
#     try:
#         agent_dict = agent_data.dict()
#         agent_dict["user_id"] = str(current_user["_id"])
#         agent_dict["created_at"] = datetime.utcnow()
#         agent_dict["updated_at"] = datetime.utcnow()
        
#         # Convert workflow_id to ObjectId if provided
#         if agent_dict.get("workflow_id"):
#             agent_dict["workflow_id"] = ObjectId(agent_dict["workflow_id"])
        
#         # ✅ FIX: Ensure default voice_settings if not provided
#         if not agent_dict.get("voice_settings"):
#             agent_dict["voice_settings"] = {
#                 "stability": 0.5,
#                 "similarity_boost": 0.75
#             }
        
#         logger.info(f"📝 Creating agent with data: {agent_dict}")
        
#         result = await db.voice_agents.insert_one(agent_dict)
        
#         created_agent = await db.voice_agents.find_one({"_id": result.inserted_id})
#         created_agent["_id"] = str(created_agent["_id"])
        
#         if created_agent.get("workflow_id"):
#             created_agent["workflow_id"] = str(created_agent["workflow_id"])
        
#         logger.info(f"✅ Agent created successfully: {created_agent}")
#         return created_agent
        
#     except Exception as e:
#         logger.error(f"❌ Error creating agent: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.get("/agents/{agent_id}")
# async def get_voice_agent(
#     agent_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get a specific voice agent"""
#     try:
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": str(current_user["_id"])
#         })
        
#         if not agent:
#             raise HTTPException(status_code=404, detail="Agent not found")
        
#         agent["_id"] = str(agent["_id"])
#         if agent.get("workflow_id"):
#             agent["workflow_id"] = str(agent["workflow_id"])
        
#         return agent
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error getting agent: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.patch("/agents/{agent_id}")
# async def update_voice_agent(
#     agent_id: str,
#     agent_data: VoiceAgentUpdate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Update a voice agent"""
#     try:
#         # Check ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": str(current_user["_id"])
#         })
        
#         if not agent:
#             raise HTTPException(status_code=404, detail="Agent not found")
        
#         # ✅ FIX: Prepare update data properly
#         update_dict = {k: v for k, v in agent_data.dict(exclude_none=True).items()}
        
#         if update_dict:
#             update_dict["updated_at"] = datetime.utcnow()
            
#             # Convert workflow_id to ObjectId if provided
#             if "workflow_id" in update_dict and update_dict["workflow_id"]:
#                 update_dict["workflow_id"] = ObjectId(update_dict["workflow_id"])
#             elif "workflow_id" in update_dict and not update_dict["workflow_id"]:
#                 update_dict["workflow_id"] = None
            
#             # ✅ CRITICAL FIX: Log the voice_settings being saved
#             if "voice_settings" in update_dict:
#                 logger.info(f"📝 Saving voice_settings: {update_dict['voice_settings']}")
            
#             logger.info(f"📝 Updating agent {agent_id} with data: {update_dict}")
            
#             await db.voice_agents.update_one(
#                 {"_id": ObjectId(agent_id)},
#                 {"$set": update_dict}
#             )
        
#         # Return updated agent
#         updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
#         updated_agent["_id"] = str(updated_agent["_id"])
        
#         if updated_agent.get("workflow_id"):
#             updated_agent["workflow_id"] = str(updated_agent["workflow_id"])
        
#         logger.info(f"✅ Agent updated successfully. Voice settings: {updated_agent.get('voice_settings')}")
#         return updated_agent
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error updating agent: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.delete("/agents/{agent_id}")
# async def delete_voice_agent(
#     agent_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Delete a voice agent"""
#     try:
#         result = await db.voice_agents.delete_one({
#             "_id": ObjectId(agent_id),
#             "user_id": str(current_user["_id"])
#         })
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Agent not found")
        
#         return {"message": "Agent deleted successfully"}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error deleting agent: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # ============================================
# # VOICE TESTING ENDPOINTS
# # ============================================

# # ✅ FIX 1: Add the /available-voices endpoint that frontend expects
# @router.get("/available-voices")
# async def get_available_voices_for_frontend(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get available ElevenLabs voices - Frontend endpoint"""
#     try:
#         result = await elevenlabs_service.get_available_voices()
#         if result.get("success"):
#             return {"voices": result.get("voices", [])}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to fetch voices")
#     except Exception as e:
#         logger.error(f"❌ Error fetching voices: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# # Keep the existing /elevenlabs/voices endpoint too
# @router.get("/elevenlabs/voices")
# async def get_available_voices(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get available ElevenLabs voices"""
#     try:
#         result = await elevenlabs_service.get_available_voices()
#         if result.get("success"):
#             return {"voices": result.get("voices", [])}
#         else:
#             raise HTTPException(status_code=500, detail="Failed to fetch voices")
#     except Exception as e:
#         logger.error(f"❌ Error fetching voices: {e}")
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/test-voice")
# async def test_voice_endpoint(
#     test_data: VoiceTestRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Test a voice with sample text"""
#     try:
#         result = await elevenlabs_service.test_voice(
#             text=test_data.text,
#             voice_id=test_data.voice_id
#         )
        
#         if result.get("success"):
#             return {
#                 "success": True,
#                 "audio_url": result.get("audio_url"),
#                 "message": "Voice test successful"
#             }
#         else:
#             raise HTTPException(status_code=500, detail="Failed to test voice")
#     except Exception as e:
#         logger.error(f"❌ Error testing voice: {e}")
#         raise HTTPException(status_code=500, detail=str(e))



# backend/app/api/v1/voice.py - COMPLETE FILE WITH GREETING NULL CHECK FIX

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import Response, PlainTextResponse, JSONResponse, FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field
import logging
import os
from pathlib import Path

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
    name: str
    description: Optional[str] = None
    voice_id: str
    voice_settings: Optional[dict] = None
    workflow_id: Optional[str] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    personality_traits: Optional[List[str]] = []
    knowledge_base: Optional[dict] = None
    is_active: Optional[bool] = True


class VoiceAgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    voice_id: Optional[str] = None
    voice_settings: Optional[dict] = None
    workflow_id: Optional[str] = None
    system_prompt: Optional[str] = None
    greeting_message: Optional[str] = None
    personality_traits: Optional[List[str]] = None
    knowledge_base: Optional[dict] = None
    is_active: Optional[bool] = None


class VoiceTestRequest(BaseModel):
    text: str
    voice_id: str


# ============================================
# HELPER FUNCTION: GENERATE AUDIO
# ============================================

async def generate_audio_response(
    text: str,
    agent_config: Optional[dict],
    base_url: str
) -> str:
    """Generate audio using ElevenLabs and return TwiML"""
    try:
        voice_id = agent_config.get("voice_id") if agent_config else None
        voice_settings = agent_config.get("voice_settings", {}) if agent_config else {}
        
        # ✅ FIX: Extract voice settings with defaults
        stability = voice_settings.get("stability", 0.5)
        similarity_boost = voice_settings.get("similarity_boost", 0.75)
        
        logger.info(f"🎙️ Voice settings - Stability: {stability}, Similarity: {similarity_boost}")
        
        if voice_id:
            logger.info(f"🎤 Generating ElevenLabs audio with voice: {voice_id}")
            
            audio_url = await elevenlabs_service.text_to_speech_for_call(
                text=text,
                voice_id=voice_id,
                stability=stability,
                similarity_boost=similarity_boost
            )
            
            if audio_url:
                # Make sure URL is complete
                if not audio_url.startswith("http"):
                    audio_url = f"{base_url}{audio_url}"
                logger.info(f"✅ Audio generated: {audio_url}")
                return f'<Play>{audio_url}</Play>'
        
        # Fallback to Twilio voice
        logger.info("⚙️ Using Twilio voice")
        return f'<Say voice="alice">{text}</Say>'
        
    except Exception as e:
        logger.error(f"❌ Error generating audio: {e}")
        return f'<Say voice="alice">{text}</Say>'


# ============================================
# AUDIO FILE SERVING ENDPOINT
# ============================================

@router.get("/static/audio/{filename}")
async def serve_audio_file(filename: str):
    """Serve audio files for Twilio playback"""
    try:
        audio_dir = Path("static/audio")
        file_path = audio_dir / filename
        
        if file_path.exists() and file_path.is_file():
            return FileResponse(
                path=str(file_path),
                media_type="audio/mpeg",
                headers={
                    "Cache-Control": "public, max-age=3600"
                }
            )
        else:
            raise HTTPException(status_code=404, detail="Audio file not found")
            
    except Exception as e:
        logger.error(f"❌ Error serving audio file: {e}")
        raise HTTPException(status_code=500, detail="Error serving audio")


# ============================================
# TWILIO WEBHOOK - INCOMING CALL
# ============================================

@router.api_route("/webhook/incoming", methods=["GET", "POST"])
async def handle_incoming_call(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle incoming/outbound call initialization with workflow"""
    try:
        if request.method == "GET":
            return PlainTextResponse("Webhook is active", status_code=200)
        
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        direction = form_data.get("Direction", "inbound")
        
        logger.info(f"📞 Call webhook: {call_sid} from {from_number} ({direction})")
        
        # Find or create call record
        call_record = await db.calls.find_one({"twilio_call_sid": call_sid})
        
        if not call_record:
            # Create new call record for inbound calls
            call_data = {
                "twilio_call_sid": call_sid,
                "direction": direction,
                "from_number": from_number,
                "to_number": to_number,
                "status": "in-progress",
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow()
            }
            result = await db.calls.insert_one(call_data)
            call_record = await db.calls.find_one({"_id": result.inserted_id})
            logger.info(f"✅ Created call record: {result.inserted_id}")
        
        # Get ANY active agent
        agent = await db.voice_agents.find_one({"is_active": True})
        
        if not agent:
            logger.error("❌ No active agent found")
            return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, no agent is available.</Say>
    <Hangup/>
</Response>""", media_type="application/xml")
        
        # Store agent in call record
        await db.calls.update_one(
            {"_id": call_record["_id"]},
            {"$set": {"agent_id": agent["_id"]}}
        )
        
        # Create conversation
        conversation_data = {
            "call_sid": call_sid,
            "agent_id": agent["_id"],
            "workflow_id": agent.get("workflow_id"),
            "messages": [],
            "context": {},
            "created_at": datetime.utcnow()
        }
        await db.conversations.insert_one(conversation_data)
        
        # ✅ FIX: Generate greeting with NULL CHECK
        greeting_message = agent.get("greeting_message")
        
        if not greeting_message or greeting_message.strip() == "":
            greeting_message = "Hello! How can I help you today?"
        
        logger.info(f"📢 Greeting message: {greeting_message}")
        
        # Get base URL
        base_url = str(request.base_url).rstrip('/')
        
        # Generate audio with agent's voice settings
        audio_tag = await generate_audio_response(greeting_message, agent, base_url)
        
        # Build TwiML
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/gather" 
        method="POST" 
        timeout="10"
        speechTimeout="3">
        {audio_tag}
        <Pause length="1"/>
    </Gather>
    <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error in incoming webhook: {e}")
        import traceback
        traceback.print_exc()
        
        return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Sorry, an error occurred.</Say>
    <Hangup/>
</Response>""", media_type="application/xml")


# ============================================
# TWILIO WEBHOOK - GATHER SPEECH
# ============================================

@router.post("/webhook/gather")
async def handle_gather(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Process user speech input"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        speech_result = form_data.get("SpeechResult", "")
        
        logger.info(f"🎤 User said: '{speech_result}'")
        
        # Handle empty speech
        if not speech_result:
            base_url = str(request.base_url).rstrip('/')
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/gather" 
        method="POST" 
        timeout="10"
        speechTimeout="3">
        <Say voice="alice">I didn't hear anything. Please try again.</Say>
        <Pause length="1"/>
    </Gather>
    <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
</Response>"""
            return Response(content=twiml, media_type="application/xml")
        
        # Get conversation and agent
        conversation = await db.conversations.find_one({"call_sid": call_sid})
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        agent = await db.voice_agents.find_one({"_id": conversation["agent_id"]})
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Get AI response
        call_handler = get_call_handler(db)
        ai_response = await call_handler.process_user_input(
            call_sid=call_sid,
            user_input=speech_result,
            conversation_id=str(conversation["_id"]),
            agent_config=agent
        )
        
        # Get base URL
        base_url = str(request.base_url).rstrip('/')
        
        # Check if conversation should end
        if ai_response.lower() in ["goodbye", "bye", "thank you", "thanks"]:
            audio_tag = await generate_audio_response("Goodbye! Have a great day!", agent, base_url)
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    {audio_tag}
    <Pause length="1"/>
    <Say voice="alice">Goodbye!</Say>
    <Hangup/>
</Response>"""
        else:
            audio_tag = await generate_audio_response(ai_response, agent, base_url)
            twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather 
        input="speech" 
        action="{base_url}/api/v1/voice/webhook/gather" 
        method="POST" 
        timeout="10"
        speechTimeout="3">
        {audio_tag}
        <Pause length="1"/>
    </Gather>
    <Redirect>{base_url}/api/v1/voice/webhook/gather</Redirect>
</Response>"""
        
        return Response(content=twiml, media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error in gather webhook: {e}")
        return Response(content="""<?xml version="1.0" encoding="UTF-8"?>
<Response><Hangup/></Response>""", media_type="application/xml")


# ============================================
# CALL STATUS WEBHOOK
# ============================================

@router.post("/webhook/call-status")
async def handle_call_status(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle call status updates"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        call_duration = form_data.get("CallDuration")
        
        logger.info(f"📊 Call status: {call_sid} -> {call_status}")
        
        # Update call record
        update_data = {
            "status": call_status,
            "updated_at": datetime.utcnow()
        }
        
        if call_status == "completed" and call_duration:
            update_data["duration"] = int(call_duration)
            update_data["ended_at"] = datetime.utcnow()
        
        await db.calls.update_one(
            {"twilio_call_sid": call_sid},
            {"$set": update_data}
        )
        
        return Response(content="OK", status_code=200)
        
    except Exception as e:
        logger.error(f"❌ Error updating call status: {e}")
        return Response(content="Error", status_code=500)


# ============================================
# VOICE AGENT CRUD ENDPOINTS
# ============================================

@router.get("/agents")
async def list_voice_agents(
    is_active: Optional[bool] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """List voice agents for current user"""
    try:
        query = {"user_id": str(current_user["_id"])}
        if is_active is not None:
            query["is_active"] = is_active
        
        agents = await db.voice_agents.find(query).to_list(100)
        
        # Convert ObjectId to string
        for agent in agents:
            agent["_id"] = str(agent["_id"])
            if agent.get("workflow_id"):
                agent["workflow_id"] = str(agent["workflow_id"])
        
        return agents
        
    except Exception as e:
        logger.error(f"❌ Error listing agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/agents")
async def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new voice agent"""
    try:
        agent_dict = agent_data.dict()
        agent_dict["user_id"] = str(current_user["_id"])
        agent_dict["created_at"] = datetime.utcnow()
        agent_dict["updated_at"] = datetime.utcnow()
        
        # Convert workflow_id to ObjectId if provided
        if agent_dict.get("workflow_id"):
            agent_dict["workflow_id"] = ObjectId(agent_dict["workflow_id"])
        
        # ✅ FIX: Ensure default voice_settings if not provided
        if not agent_dict.get("voice_settings"):
            agent_dict["voice_settings"] = {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        
        # ✅ FIX: Ensure default greeting_message if not provided
        if not agent_dict.get("greeting_message"):
            agent_dict["greeting_message"] = "Hello! How can I help you today?"
        
        logger.info(f"📝 Creating agent with data: {agent_dict}")
        
        result = await db.voice_agents.insert_one(agent_dict)
        
        created_agent = await db.voice_agents.find_one({"_id": result.inserted_id})
        created_agent["_id"] = str(created_agent["_id"])
        
        if created_agent.get("workflow_id"):
            created_agent["workflow_id"] = str(created_agent["workflow_id"])
        
        logger.info(f"✅ Agent created successfully: {created_agent}")
        return created_agent
        
    except Exception as e:
        logger.error(f"❌ Error creating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/agents/{agent_id}")
async def get_voice_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific voice agent"""
    try:
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": str(current_user["_id"])
        })
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        agent["_id"] = str(agent["_id"])
        if agent.get("workflow_id"):
            agent["workflow_id"] = str(agent["workflow_id"])
        
        return agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error getting agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/agents/{agent_id}")
async def update_voice_agent(
    agent_id: str,
    agent_data: VoiceAgentUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a voice agent"""
    try:
        # Check ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": str(current_user["_id"])
        })
        
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # ✅ FIX: Prepare update data properly
        update_dict = {k: v for k, v in agent_data.dict(exclude_none=True).items()}
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            
            # Convert workflow_id to ObjectId if provided
            if "workflow_id" in update_dict and update_dict["workflow_id"]:
                update_dict["workflow_id"] = ObjectId(update_dict["workflow_id"])
            elif "workflow_id" in update_dict and not update_dict["workflow_id"]:
                update_dict["workflow_id"] = None
            
            # ✅ CRITICAL FIX: Log the voice_settings being saved
            if "voice_settings" in update_dict:
                logger.info(f"📝 Saving voice_settings: {update_dict['voice_settings']}")
            
            logger.info(f"📝 Updating agent {agent_id} with data: {update_dict}")
            
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {"$set": update_dict}
            )
        
        # Return updated agent
        updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
        updated_agent["_id"] = str(updated_agent["_id"])
        
        if updated_agent.get("workflow_id"):
            updated_agent["workflow_id"] = str(updated_agent["workflow_id"])
        
        logger.info(f"✅ Agent updated successfully. Voice settings: {updated_agent.get('voice_settings')}")
        return updated_agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/agents/{agent_id}")
async def delete_voice_agent(
    agent_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a voice agent"""
    try:
        result = await db.voice_agents.delete_one({
            "_id": ObjectId(agent_id),
            "user_id": str(current_user["_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        return {"message": "Agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# VOICE TESTING ENDPOINTS
# ============================================

# ✅ FIX 1: Add the /available-voices endpoint that frontend expects
@router.get("/available-voices")
async def get_available_voices_for_frontend(
    current_user: dict = Depends(get_current_user)
):
    """Get available ElevenLabs voices - Frontend endpoint"""
    try:
        result = await elevenlabs_service.get_available_voices()
        if result.get("success"):
            return {"voices": result.get("voices", [])}
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch voices")
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Keep the existing /elevenlabs/voices endpoint too
@router.get("/elevenlabs/voices")
async def get_available_voices(
    current_user: dict = Depends(get_current_user)
):
    """Get available ElevenLabs voices"""
    try:
        result = await elevenlabs_service.get_available_voices()
        if result.get("success"):
            return {"voices": result.get("voices", [])}
        else:
            raise HTTPException(status_code=500, detail="Failed to fetch voices")
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-voice")
async def test_voice_endpoint(
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
            raise HTTPException(status_code=500, detail="Failed to test voice")
    except Exception as e:
        logger.error(f"❌ Error testing voice: {e}")
        raise HTTPException(status_code=500, detail=str(e))