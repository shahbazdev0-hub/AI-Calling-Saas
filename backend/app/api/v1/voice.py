# # backend/app/api/v1/voice.py - ✅ COMPLETE FIXED VERSION WITH RECORDING SUPPORT

# from fastapi import APIRouter, Depends, Request, HTTPException, status
# from fastapi.responses import Response, PlainTextResponse, JSONResponse, FileResponse
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from datetime import datetime
# from bson import ObjectId
# from typing import Optional, List
# from pydantic import BaseModel, Field
# import logging
# import os
# import re
# from pathlib import Path

# from app.database import get_database
# from app.api.deps import get_current_user
# from app.services.ai_agent import ai_agent_service
# from app.services.elevenlabs import elevenlabs_service
# from app.services.twilio import twilio_service
# from app.services.call_handler import get_call_handler
# from app.services.sms import sms_service

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


# # ============================================
# # HELPER FUNCTION - GENERATE AUDIO RESPONSE
# # ============================================

# async def generate_audio_response(text: str, agent: dict, base_url: str) -> str:
#     """Generate audio response using ElevenLabs"""
#     try:
#         voice_id = agent.get("voice_id") or os.getenv("ELEVENLABS_VOICE_ID")
#         voice_settings = agent.get("voice_settings", {})
#         stability = voice_settings.get("stability", 0.5)
#         similarity_boost = voice_settings.get("similarity_boost", 0.75)
        
#         logger.info(f"🎙️ Generating audio with voice: {voice_id}")
#         logger.info(f"📊 Voice settings - Stability: {stability}, Similarity: {similarity_boost}")
        
#         audio_url = await elevenlabs_service.text_to_speech_for_call(
#             text=text,
#             voice_id=voice_id,
#             stability=stability,
#             similarity_boost=similarity_boost
#         )
        
#         if audio_url:
#             full_audio_url = f"{base_url}/api/v1/voice{audio_url}"
#             logger.info(f"✅ Audio URL: {full_audio_url}")
#             return f'<Play>{full_audio_url}</Play>'
#         else:
#             logger.warning("⚠️ Audio generation failed, using fallback")
#             return f'<Say voice="alice">{text}</Say>'
            
#     except Exception as e:
#         logger.error(f"❌ Error generating audio: {e}")
#         return f'<Say voice="alice">{text}</Say>'


# # ============================================
# # TWILIO FILE SERVING ENDPOINT
# # ============================================

# @router.get("/static/audio/{filename}")
# async def serve_audio_file(filename: str):
#     """Serve audio files for Twilio playback"""
#     try:
#         audio_dir = Path("backend/static/audio")
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
#             logger.error(f"❌ Audio file not found: {file_path}")
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
#     """Handle incoming/outbound call initialization"""
#     try:
#         if request.method == "GET":
#             return PlainTextResponse("Webhook is active", status_code=200)
        
#         form_data = await request.form()
#         call_sid = form_data.get("CallSid")
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         direction = form_data.get("Direction", "inbound")
        
#         logger.info(f"📞 Call webhook: {call_sid} from {from_number} ({direction})")
        
#         # ✅ FIXED: Determine customer phone correctly
#         twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "")
        
#         if from_number == twilio_number:
#             # Outbound call - customer is TO
#             customer_phone = to_number
#             call_direction = "outbound"
#         else:
#             # Inbound call - customer is FROM
#             customer_phone = from_number
#             call_direction = "inbound"
        
#         logger.info(f"📋 Direction: {call_direction}, Customer: {customer_phone}")
        
#         # Find or create call record
#         call_record = await db.calls.find_one({"twilio_call_sid": call_sid})
        
#         if not call_record:
#             call_data = {
#                 "direction": call_direction,
#                 "from_number": from_number,
#                 "to_number": to_number,
#                 "phone_number": customer_phone,  # ✅ FIXED: Store customer phone
#                 "status": "initiated",
#                 "twilio_call_sid": call_sid,
#                 "call_sid": call_sid,  # ✅ Also store in legacy field
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow(),
#                 # ✅ Initialize recording fields
#                 "recording_url": None,
#                 "recording_sid": None,
#                 "recording_duration": 0
#             }
            
#             result = await db.calls.insert_one(call_data)
#             call_id = result.inserted_id
#             logger.info(f"✅ Created new call record: {call_id}")
#         else:
#             call_id = call_record["_id"]
#             logger.info(f"✅ Found existing call record: {call_id}")
        
#         # Find agent
#         agent = await db.voice_agents.find_one({"is_active": True})
#         if not agent:
#             raise HTTPException(status_code=404, detail="No active agent found")
        
#         agent_id = agent["_id"]
        
#         # Create or update conversation
#         conversation = await db.conversations.find_one({"call_sid": call_sid})
        
#         if not conversation:
#             conversation_data = {
#                 "call_id": call_id,
#                 "call_sid": call_sid,
#                 "agent_id": agent_id,
#                 "messages": [],
#                 "metadata": {
#                     "appointment_data": {},
#                     "current_step": "greeting"
#                 },
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
            
#             result = await db.conversations.insert_one(conversation_data)
#             logger.info(f"✅ Created conversation: {result.inserted_id}")
        
#         # Get greeting message
#         greeting_message = await ai_agent_service.get_greeting_message(agent)
#         if not greeting_message or greeting_message.strip() == "":
#             greeting_message = "Hello! How can I help you today?"
        
#         logger.info(f"📢 Greeting message: {greeting_message}")
        
#         # Get base URL
#         base_url = str(request.base_url).rstrip('/')
        
#         # Generate audio response
#         audio_tag = await generate_audio_response(greeting_message, agent, base_url)
        
#         # Build TwiML response
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
# # CALL STATUS WEBHOOK - ✅ SIMPLIFIED (NO RECORDING HERE)
# # ============================================

# @router.post("/webhook/call-status")
# async def handle_call_status(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """✅ FIXED: Handle call status updates (recordings handled separately)"""
#     try:
#         form_data = await request.form()
#         call_sid = form_data.get("CallSid")
#         call_status = form_data.get("CallStatus")
#         duration = form_data.get("CallDuration")
        
#         logger.info(f"📊 Call status update: {call_sid} - {call_status}")
        
#         # Build update data
#         update_data = {
#             "status": call_status,
#             "updated_at": datetime.utcnow()
#         }
        
#         if duration:
#             update_data["duration"] = int(duration)
        
#         if call_status == "completed":
#             update_data["ended_at"] = datetime.utcnow()
        
#         await db.calls.update_one(
#             {"twilio_call_sid": call_sid},
#             {"$set": update_data}
#         )
        
#         logger.info(f"✅ Call {call_sid} status updated to {call_status}")
        
#         # ✅ SEND POST-CALL SMS WHEN CALL COMPLETES
#         if call_status == "completed":
#             logger.info(f"📱 Call completed - triggering post-call SMS")
            
#             try:
#                 # Get call details
#                 call = await db.calls.find_one({"twilio_call_sid": call_sid})
                
#                 if call:
#                     # Get customer phone from phone_number field
#                     customer_phone = call.get("phone_number")
                    
#                     # Get Twilio's number
#                     twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "")
                    
#                     logger.info(f"📋 Call direction: {call.get('direction')}")
#                     logger.info(f"📞 Customer phone: {customer_phone}")
#                     logger.info(f"📞 Twilio number: {twilio_number}")
                    
#                     # Only send SMS if valid customer phone
#                     if customer_phone and customer_phone != twilio_number:
#                         # Check if appointment was booked
#                         conversation = await db.conversations.find_one({"call_sid": call_sid})
#                         appointment_data = conversation.get("metadata", {}).get("appointment_data", {}) if conversation else {}
                        
#                         # Build SMS message
#                         if appointment_data.get("email") and appointment_data.get("name"):
#                             message = f"Thank you for calling, {appointment_data.get('name')}! Your appointment has been confirmed. We've sent a confirmation email to {appointment_data.get('email')}. Looking forward to seeing you!"
#                         else:
#                             message = "Thank you for calling! We appreciate your business. If you need any further assistance, please don't hesitate to contact us. Have a great day!"
                        
#                         # Send SMS
#                         logger.info(f"📤 Sending post-call SMS to {customer_phone}")
#                         sms_result = await sms_service.send_sms(
#                             to_number=customer_phone,
#                             message=message,
#                             metadata={"call_sid": call_sid, "type": "post_call"}
#                         )
                        
#                         if sms_result.get("success"):
#                             logger.info(f"✅ POST-CALL SMS SENT SUCCESSFULLY!")
#                             logger.info(f"   To: {customer_phone}")
#                             logger.info(f"   SID: {sms_result.get('twilio_sid')}")
#                         else:
#                             logger.error(f"❌ Failed to send post-call SMS: {sms_result.get('error')}")
#                     else:
#                         logger.warning(f"⚠️ Skipping SMS: Invalid customer phone or Twilio number")
#                         logger.warning(f"   Customer: {customer_phone}, Twilio: {twilio_number}")
#                 else:
#                     logger.warning("⚠️ Call record not found for SMS sending")
                    
#             except Exception as sms_error:
#                 logger.error(f"❌ Error sending post-call SMS: {sms_error}")
#                 import traceback
#                 traceback.print_exc()
        
#         return Response(content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>', media_type="application/xml")
        
#     except Exception as e:
#         logger.error(f"❌ Error in call status webhook: {e}")
#         import traceback
#         traceback.print_exc()
#         return Response(content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>', media_type="application/xml")


# # ============================================
# # 🎙️ RECORDING STATUS WEBHOOK - ✅ THIS IS THE CRITICAL ONE
# # ============================================

# @router.post("/webhook/recording-status")
# async def handle_recording_status(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """
#     ✅ CRITICAL: This webhook receives recording data from Twilio
#     Twilio calls this AFTER the call completes and recording is ready
#     """
#     try:
#         form_data = await request.form()
        
#         # ✅ Extract ALL recording fields from Twilio
#         call_sid = form_data.get("CallSid")
#         recording_url = form_data.get("RecordingUrl")
#         recording_sid = form_data.get("RecordingSid")
#         recording_duration = form_data.get("RecordingDuration")
#         recording_status = form_data.get("RecordingStatus")
        
#         # ✅ Log EVERYTHING for debugging
#         logger.info(f"\n{'='*80}")
#         logger.info(f"🎙️ RECORDING WEBHOOK RECEIVED")
#         logger.info(f"{'='*80}")
#         logger.info(f"📞 Call SID: {call_sid}")
#         logger.info(f"🎵 Recording URL: {recording_url}")
#         logger.info(f"🆔 Recording SID: {recording_sid}")
#         logger.info(f"⏱️  Duration: {recording_duration}s")
#         logger.info(f"📊 Status: {recording_status}")
#         logger.info(f"{'='*80}\n")
        
#         # ✅ Validate required fields
#         if not call_sid:
#             logger.error("❌ Missing CallSid in recording webhook")
#             return Response(content="Missing CallSid", status_code=400)
        
#         if not recording_url:
#             logger.error("❌ Missing RecordingUrl in recording webhook")
#             return Response(content="Missing RecordingUrl", status_code=400)
        
#         # ✅ Only save if recording is completed
#         if recording_status == "completed":
#             # Build update data
#             update_data = {
#                 "recording_url": recording_url,
#                 "recording_sid": recording_sid,
#                 "updated_at": datetime.utcnow()
#             }
            
#             # Add duration if present
#             if recording_duration:
#                 try:
#                     update_data["recording_duration"] = int(recording_duration)
#                 except (ValueError, TypeError):
#                     logger.warning(f"⚠️ Invalid recording duration: {recording_duration}")
#                     update_data["recording_duration"] = 0
            
#             # ✅ Update the database
#             result = await db.calls.update_one(
#                 {"twilio_call_sid": call_sid},
#                 {"$set": update_data}
#             )
            
#             if result.matched_count > 0:
#                 logger.info(f"✅ RECORDING SAVED TO DATABASE")
#                 logger.info(f"   Call SID: {call_sid}")
#                 logger.info(f"   Recording URL: {recording_url}")
#                 logger.info(f"   Modified: {result.modified_count} document(s)")
#             else:
#                 logger.warning(f"⚠️ NO CALL FOUND WITH SID: {call_sid}")
#                 logger.warning(f"   Recording URL: {recording_url}")
                
#                 # ✅ Try to find the call by any field
#                 call = await db.calls.find_one({"twilio_call_sid": call_sid})
#                 if call:
#                     logger.info(f"   Call exists: {call.get('_id')}")
#                 else:
#                     logger.error(f"   Call does not exist in database!")
#         else:
#             logger.info(f"ℹ️  Recording status is '{recording_status}', not saving yet")
        
#         return Response(content="OK", status_code=200)
        
#     except Exception as e:
#         logger.error(f"❌ ERROR IN RECORDING WEBHOOK: {e}")
#         import traceback
#         traceback.print_exc()
#         return Response(content="Error", status_code=500)


# # ============================================
# # VOICE AGENT CRUD ENDPOINTS
# # ============================================

# @router.post("/agents", status_code=status.HTTP_201_CREATED)
# async def create_voice_agent(
#     agent_data: VoiceAgentCreate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Create a new voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         agent_dict = {
#             **agent_data.model_dump(),
#             "user_id": user_id,
#             "created_at": datetime.utcnow(),
#             "updated_at": datetime.utcnow()
#         }
        
#         if agent_data.workflow_id:
#             agent_dict["workflow_id"] = ObjectId(agent_data.workflow_id)
        
#         result = await db.voice_agents.insert_one(agent_dict)
#         agent_dict["_id"] = result.inserted_id
        
#         logger.info(f"Created voice agent: {result.inserted_id}")
        
#         return {
#             "message": "Voice agent created successfully",
#             "agent_id": str(result.inserted_id)
#         }
        
#     except Exception as e:
#         logger.error(f"Error creating voice agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/agents")
# async def get_voice_agents(
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get all voice agents for current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         agents = await db.voice_agents.find({"user_id": user_id}).to_list(100)
        
#         for agent in agents:
#             agent["_id"] = str(agent["_id"])
#             if agent.get("workflow_id"):
#                 agent["workflow_id"] = str(agent["workflow_id"])
        
#         return {"agents": agents}
        
#     except Exception as e:
#         logger.error(f"Error fetching voice agents: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/agents/{agent_id}")
# async def get_voice_agent(
#     agent_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Get specific voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(status_code=404, detail="Voice agent not found")
        
#         agent["_id"] = str(agent["_id"])
#         if agent.get("workflow_id"):
#             agent["workflow_id"] = str(agent["workflow_id"])
        
#         return agent
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error fetching voice agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.patch("/agents/{agent_id}")
# async def update_voice_agent(
#     agent_id: str,
#     agent_data: VoiceAgentUpdate,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Update voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         update_dict = {k: v for k, v in agent_data.model_dump(exclude_unset=True).items()}
#         update_dict["updated_at"] = datetime.utcnow()
        
#         if "workflow_id" in update_dict and update_dict["workflow_id"]:
#             update_dict["workflow_id"] = ObjectId(update_dict["workflow_id"])
        
#         result = await db.voice_agents.update_one(
#             {"_id": ObjectId(agent_id), "user_id": user_id},
#             {"$set": update_dict}
#         )
        
#         if result.matched_count == 0:
#             raise HTTPException(status_code=404, detail="Voice agent not found")
        
#         logger.info(f"Updated voice agent: {agent_id}")
        
#         return {"message": "Voice agent updated successfully"}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error updating voice agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.delete("/agents/{agent_id}")
# async def delete_voice_agent(
#     agent_id: str,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Delete voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         result = await db.voice_agents.delete_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if result.deleted_count == 0:
#             raise HTTPException(status_code=404, detail="Voice agent not found")
        
#         logger.info(f"Deleted voice agent: {agent_id}")
        
#         return {"message": "Voice agent deleted successfully"}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error deleting voice agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/agents/{agent_id}/test")
# async def test_voice_agent(
#     agent_id: str,
#     test_request: VoiceTestRequest,
#     current_user: dict = Depends(get_current_user),
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Test voice agent with text input"""
#     try:
#         user_id = str(current_user["_id"])
        
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(status_code=404, detail="Voice agent not found")
        
#         # Generate audio response
#         audio_result = await elevenlabs_service.generate_audio(
#             text=test_request.text,
#             voice_id=agent.get("voice_id")
#         )
        
#         if audio_result.get("success"):
#             return {
#                 "success": True,
#                 "audio_url": f"/static/audio/{audio_result['filename']}"
#             }
#         else:
#             raise HTTPException(
#                 status_code=500,
#                 detail="Failed to generate audio"
#             )
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"Error testing voice agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/voices")
# async def get_available_voices(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get available ElevenLabs voices"""
#     try:
#         voices = await elevenlabs_service.get_voices()
#         return voices
        
#     except Exception as e:
#         logger.error(f"Error fetching voices: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.get("/available-voices")
# async def get_available_voices_alt(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Alternative endpoint for available voices"""
#     try:
#         voices = await elevenlabs_service.get_voices()
#         return voices
        
#     except Exception as e:
#         logger.error(f"Error fetching voices: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# @router.post("/test-voice")
# async def test_voice(
#     test_request: VoiceTestRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Test a voice with sample text"""
#     try:
#         audio_result = await elevenlabs_service.text_to_speech(
#             text=test_request.text,
#             voice_id=test_request.voice_id if hasattr(test_request, 'voice_id') else None,
#             save_to_file=True
#         )
        
#         if audio_result.get("success"):
#             return {
#                 "success": True,
#                 "audio_url": audio_result.get("audio_url")
#             }
#         else:
#             raise HTTPException(
#                 status_code=500,
#                 detail="Failed to generate audio"
#             )
        
#     except Exception as e:
#         logger.error(f"Error testing voice: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )

# backend/app/api/v1/voice.py - ✅ COMPLETE FIXED VERSION WITH RECORDING & SMS LOGGING

from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import Response, PlainTextResponse, JSONResponse, FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field
import logging
import os
import re
from pathlib import Path

from app.database import get_database
from app.api.deps import get_current_user
from app.services.ai_agent import ai_agent_service
from app.services.elevenlabs import elevenlabs_service
from app.services.twilio import twilio_service
from app.services.call_handler import get_call_handler
from app.services.sms import sms_service

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


# ============================================
# HELPER FUNCTION - GENERATE AUDIO RESPONSE
# ============================================

async def generate_audio_response(text: str, agent: dict, base_url: str) -> str:
    """Generate audio response using ElevenLabs"""
    try:
        voice_id = agent.get("voice_id") or os.getenv("ELEVENLABS_VOICE_ID")
        voice_settings = agent.get("voice_settings", {})
        stability = voice_settings.get("stability", 0.5)
        similarity_boost = voice_settings.get("similarity_boost", 0.75)
        
        logger.info(f"🎙️ Generating audio with voice: {voice_id}")
        logger.info(f"📊 Voice settings - Stability: {stability}, Similarity: {similarity_boost}")
        
        audio_url = await elevenlabs_service.text_to_speech_for_call(
            text=text,
            voice_id=voice_id,
            stability=stability,
            similarity_boost=similarity_boost
        )
        
        if audio_url:
            full_audio_url = f"{base_url}/api/v1/voice{audio_url}"
            logger.info(f"✅ Audio URL: {full_audio_url}")
            return f'<Play>{full_audio_url}</Play>'
        else:
            logger.warning("⚠️ Audio generation failed, using fallback")
            return f'<Say voice="alice">{text}</Say>'
            
    except Exception as e:
        logger.error(f"❌ Error generating audio: {e}")
        return f'<Say voice="alice">{text}</Say>'


# ============================================
# TWILIO FILE SERVING ENDPOINT
# ============================================

@router.get("/static/audio/{filename}")
async def serve_audio_file(filename: str):
    """Serve audio files for Twilio playback"""
    try:
        audio_dir = Path("backend/static/audio")
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
            logger.error(f"❌ Audio file not found: {file_path}")
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
    """Handle incoming/outbound call initialization"""
    try:
        if request.method == "GET":
            return PlainTextResponse("Webhook is active", status_code=200)
        
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        direction = form_data.get("Direction", "inbound")
        
        logger.info(f"📞 Call webhook: {call_sid} from {from_number} ({direction})")
        
        # ✅ FIXED: Determine customer phone correctly
        twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "")
        
        if from_number == twilio_number:
            # Outbound call - customer is TO
            customer_phone = to_number
            call_direction = "outbound"
        else:
            # Inbound call - customer is FROM
            customer_phone = from_number
            call_direction = "inbound"
        
        logger.info(f"📋 Direction: {call_direction}, Customer: {customer_phone}")
        
        # Find or create call record
        call_record = await db.calls.find_one({"twilio_call_sid": call_sid})
        
        if not call_record:
            call_data = {
                "direction": call_direction,
                "from_number": from_number,
                "to_number": to_number,
                "phone_number": customer_phone,  # ✅ FIXED: Store customer phone
                "status": "initiated",
                "twilio_call_sid": call_sid,
                "call_sid": call_sid,  # ✅ Also store in legacy field
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                # ✅ Initialize recording fields
                "recording_url": None,
                "recording_sid": None,
                "recording_duration": 0
            }
            
            result = await db.calls.insert_one(call_data)
            call_id = result.inserted_id
            logger.info(f"✅ Created new call record: {call_id}")
        else:
            call_id = call_record["_id"]
            logger.info(f"✅ Found existing call record: {call_id}")
        
        # Find agent
        agent = await db.voice_agents.find_one({"is_active": True})
        if not agent:
            raise HTTPException(status_code=404, detail="No active agent found")
        
        agent_id = agent["_id"]
        
        # Create or update conversation
        conversation = await db.conversations.find_one({"call_sid": call_sid})
        
        if not conversation:
            conversation_data = {
                "call_id": call_id,
                "call_sid": call_sid,
                "agent_id": agent_id,
                "messages": [],
                "metadata": {
                    "appointment_data": {},
                    "current_step": "greeting"
                },
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await db.conversations.insert_one(conversation_data)
            logger.info(f"✅ Created conversation: {result.inserted_id}")
        
        # Get greeting message
        greeting_message = await ai_agent_service.get_greeting_message(agent)
        if not greeting_message or greeting_message.strip() == "":
            greeting_message = "Hello! How can I help you today?"
        
        logger.info(f"📢 Greeting message: {greeting_message}")
        
        # Get base URL
        base_url = str(request.base_url).rstrip('/')
        
        # Generate audio response
        audio_tag = await generate_audio_response(greeting_message, agent, base_url)
        
        # Build TwiML response
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
# CALL STATUS WEBHOOK - ✅ FIXED WITH SMS LOGGING
# ============================================

@router.post("/webhook/call-status")
async def handle_call_status(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """✅ FIXED: Handle call status updates with proper SMS logging"""
    try:
        form_data = await request.form()
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        duration = form_data.get("CallDuration")
        
        logger.info(f"📊 Call status update: {call_sid} - {call_status}")
        
        # Build update data
        update_data = {
            "status": call_status,
            "updated_at": datetime.utcnow()
        }
        
        if duration:
            update_data["duration"] = int(duration)
        
        if call_status == "completed":
            update_data["ended_at"] = datetime.utcnow()
        
        await db.calls.update_one(
            {"twilio_call_sid": call_sid},
            {"$set": update_data}
        )
        
        logger.info(f"✅ Call {call_sid} status updated to {call_status}")
        
        # ✅ SEND POST-CALL SMS WHEN CALL COMPLETES
        if call_status == "completed":
            logger.info(f"📱 Call completed - triggering post-call SMS")
            
            try:
                # Get call details
                call = await db.calls.find_one({"twilio_call_sid": call_sid})
                
                if call:
                    # Get customer phone from phone_number field
                    customer_phone = call.get("phone_number")
                    user_id = call.get("user_id")  # ✅ Get user_id
                    
                    # Get Twilio's number
                    twilio_number = os.getenv("TWILIO_PHONE_NUMBER", "")
                    
                    logger.info(f"📋 Call direction: {call.get('direction')}")
                    logger.info(f"📞 Customer phone: {customer_phone}")
                    logger.info(f"📞 Twilio number: {twilio_number}")
                    
                    # Only send SMS if valid customer phone
                    if customer_phone and customer_phone != twilio_number:
                        # Check if appointment was booked
                        conversation = await db.conversations.find_one({"call_sid": call_sid})
                        appointment_data = conversation.get("metadata", {}).get("appointment_data", {}) if conversation else {}
                        
                        # Get customer name and email from appointment data
                        customer_name = appointment_data.get("name", "Customer")
                        customer_email = appointment_data.get("email")
                        
                        # Build SMS message
                        if customer_email and customer_name:
                            message = f"Thank you for calling, {customer_name}! Your appointment has been confirmed. We've sent a confirmation email to {customer_email}. Looking forward to seeing you!"
                        else:
                            message = "Thank you for calling! We appreciate your business. If you need any further assistance, please don't hesitate to contact us. Have a great day!"
                        
                        # ✅ FIXED: Send SMS with proper context for logging
                        logger.info(f"📤 Sending post-call SMS to {customer_phone}")
                        sms_result = await sms_service.send_sms(
                            to_number=customer_phone,
                            message=message,
                            user_id=user_id,  # ✅ Pass user_id
                            call_id=str(call["_id"]),  # ✅ Pass call_id
                            customer_name=customer_name,  # ✅ Pass customer_name
                            customer_email=customer_email,  # ✅ Pass customer_email
                            metadata={"call_sid": call_sid, "type": "post_call"}
                        )
                        
                        if sms_result.get("success"):
                            logger.info(f"✅ POST-CALL SMS SENT AND LOGGED SUCCESSFULLY!")
                            logger.info(f"   To: {customer_phone}")
                            logger.info(f"   SID: {sms_result.get('twilio_sid')}")
                        else:
                            logger.error(f"❌ Failed to send post-call SMS: {sms_result.get('error')}")
                    else:
                        logger.warning(f"⚠️ Skipping SMS: Invalid customer phone or Twilio number")
                        logger.warning(f"   Customer: {customer_phone}, Twilio: {twilio_number}")
                else:
                    logger.warning("⚠️ Call record not found for SMS sending")
                    
            except Exception as sms_error:
                logger.error(f"❌ Error sending post-call SMS: {sms_error}")
                import traceback
                traceback.print_exc()
        
        return Response(content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>', media_type="application/xml")
        
    except Exception as e:
        logger.error(f"❌ Error in call status webhook: {e}")
        import traceback
        traceback.print_exc()
        return Response(content='<?xml version="1.0" encoding="UTF-8"?><Response></Response>', media_type="application/xml")


# ============================================
# 🎙️ RECORDING STATUS WEBHOOK
# ============================================

@router.post("/webhook/recording-status")
async def handle_recording_status(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """✅ CRITICAL: This webhook receives recording data from Twilio"""
    try:
        form_data = await request.form()
        
        call_sid = form_data.get("CallSid")
        recording_url = form_data.get("RecordingUrl")
        recording_sid = form_data.get("RecordingSid")
        recording_duration = form_data.get("RecordingDuration")
        recording_status = form_data.get("RecordingStatus")
        
        logger.info(f"\n{'='*80}")
        logger.info(f"🎙️ RECORDING WEBHOOK RECEIVED")
        logger.info(f"{'='*80}")
        logger.info(f"📞 Call SID: {call_sid}")
        logger.info(f"🎵 Recording URL: {recording_url}")
        logger.info(f"🆔 Recording SID: {recording_sid}")
        logger.info(f"⏱️  Duration: {recording_duration}s")
        logger.info(f"📊 Status: {recording_status}")
        logger.info(f"{'='*80}\n")
        
        if not call_sid:
            logger.error("❌ Missing CallSid in recording webhook")
            return Response(content="Missing CallSid", status_code=400)
        
        if not recording_url:
            logger.error("❌ Missing RecordingUrl in recording webhook")
            return Response(content="Missing RecordingUrl", status_code=400)
        
        if recording_status == "completed":
            update_data = {
                "recording_url": recording_url,
                "recording_sid": recording_sid,
                "updated_at": datetime.utcnow()
            }
            
            if recording_duration:
                try:
                    update_data["recording_duration"] = int(recording_duration)
                except (ValueError, TypeError):
                    logger.warning(f"⚠️ Invalid recording duration: {recording_duration}")
                    update_data["recording_duration"] = 0
            
            result = await db.calls.update_one(
                {"twilio_call_sid": call_sid},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                logger.info(f"✅ RECORDING SAVED TO DATABASE")
                logger.info(f"   Call SID: {call_sid}")
                logger.info(f"   Recording URL: {recording_url}")
                logger.info(f"   Modified: {result.modified_count} document(s)")
            else:
                logger.warning(f"⚠️ NO CALL FOUND WITH SID: {call_sid}")
        else:
            logger.info(f"ℹ️  Recording status is '{recording_status}', not saving yet")
        
        return Response(content="OK", status_code=200)
        
    except Exception as e:
        logger.error(f"❌ ERROR IN RECORDING WEBHOOK: {e}")
        import traceback
        traceback.print_exc()
        return Response(content="Error", status_code=500)


# ============================================
# VOICE AGENT CRUD ENDPOINTS
# ============================================

@router.post("/agents", status_code=status.HTTP_201_CREATED)
async def create_voice_agent(
    agent_data: VoiceAgentCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        agent_dict = {
            **agent_data.model_dump(),
            "user_id": user_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        if agent_data.workflow_id:
            agent_dict["workflow_id"] = ObjectId(agent_data.workflow_id)
        
        result = await db.voice_agents.insert_one(agent_dict)
        agent_dict["_id"] = result.inserted_id
        
        logger.info(f"Created voice agent: {result.inserted_id}")
        
        return {
            "message": "Voice agent created successfully",
            "agent_id": str(result.inserted_id)
        }
        
    except Exception as e:
        logger.error(f"Error creating voice agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/agents")
async def get_voice_agents(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all voice agents for current user"""
    try:
        user_id = str(current_user["_id"])
        
        agents = await db.voice_agents.find({"user_id": user_id}).to_list(100)
        
        for agent in agents:
            agent["_id"] = str(agent["_id"])
            if agent.get("workflow_id"):
                agent["workflow_id"] = str(agent["workflow_id"])
        
        return {"agents": agents}
        
    except Exception as e:
        logger.error(f"Error fetching voice agents: {e}")
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
    """Get specific voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        agent["_id"] = str(agent["_id"])
        if agent.get("workflow_id"):
            agent["workflow_id"] = str(agent["workflow_id"])
        
        return agent
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching voice agent: {e}")
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
    """Update voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        update_dict = {k: v for k, v in agent_data.model_dump(exclude_unset=True).items()}
        update_dict["updated_at"] = datetime.utcnow()
        
        if "workflow_id" in update_dict and update_dict["workflow_id"]:
            update_dict["workflow_id"] = ObjectId(update_dict["workflow_id"])
        
        result = await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id), "user_id": user_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        logger.info(f"Updated voice agent: {agent_id}")
        
        return {"message": "Voice agent updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating voice agent: {e}")
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
    """Delete voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        result = await db.voice_agents.delete_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        logger.info(f"Deleted voice agent: {agent_id}")
        
        return {"message": "Voice agent deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting voice agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/agents/{agent_id}/test")
async def test_voice_agent(
    agent_id: str,
    test_request: VoiceTestRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Test voice agent with text input"""
    try:
        user_id = str(current_user["_id"])
        
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(status_code=404, detail="Voice agent not found")
        
        # Generate audio response
        audio_result = await elevenlabs_service.generate_audio(
            text=test_request.text,
            voice_id=agent.get("voice_id")
        )
        
        if audio_result.get("success"):
            return {
                "success": True,
                "audio_url": f"/static/audio/{audio_result['filename']}"
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate audio"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error testing voice agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/voices")
async def get_available_voices(
    current_user: dict = Depends(get_current_user)
):
    """Get available ElevenLabs voices"""
    try:
        voices = await elevenlabs_service.get_voices()
        return voices
        
    except Exception as e:
        logger.error(f"Error fetching voices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/available-voices")
async def get_available_voices_alt(
    current_user: dict = Depends(get_current_user)
):
    """Alternative endpoint for available voices"""
    try:
        voices = await elevenlabs_service.get_voices()
        return voices
        
    except Exception as e:
        logger.error(f"Error fetching voices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/test-voice")
async def test_voice(
    test_request: VoiceTestRequest,
    current_user: dict = Depends(get_current_user)
):
    """Test a voice with sample text"""
    try:
        audio_result = await elevenlabs_service.text_to_speech(
            text=test_request.text,
            voice_id=test_request.voice_id if hasattr(test_request, 'voice_id') else None,
            save_to_file=True
        )
        
        if audio_result.get("success"):
            return {
                "success": True,
                "audio_url": audio_result.get("audio_url")
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate audio"
            )
        
    except Exception as e:
        logger.error(f"Error testing voice: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )