# # backend/app/api/v1/voice.py - ✅ ONLY ELEVENLABS VOICE without ai follow up steps

# from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response, Query, Body, Request
# from fastapi.responses import StreamingResponse, PlainTextResponse
# from typing import Optional, List, Dict
# from datetime import datetime
# from bson import ObjectId
# from pathlib import Path
# import logging
# import asyncio
# import io
# import os

# from app.api.deps import get_current_user, get_database
# from app.schemas.voice import (
#     VoiceAgentCreate,
#     VoiceAgentCreateExtended,
#     VoiceAgentUpdate
# )
# from app.services.elevenlabs import elevenlabs_service
# from app.services.ai_agent import ai_agent_service
# from app.services.call_handler import call_handler_service
# from app.services.agent_executor import agent_executor
# from app.config import settings
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from twilio.twiml.voice_response import VoiceResponse, Gather, Connect, Stream

# logger = logging.getLogger(__name__)
# router = APIRouter()


# # ============================================
# # 🔥 WEBHOOK: /webhook/incoming - ONLY ELEVENLABS
# # ============================================

# @router.post("/webhook/incoming", response_class=PlainTextResponse)
# async def incoming_call_webhook(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """
#     ✅ Handle incoming Twilio call - ONLY ELEVENLABS VOICE
#     """
#     try:
#         form_data = await request.form()
        
#         call_sid = form_data.get("CallSid")
#         from_number = form_data.get("From")
#         to_number = form_data.get("To")
#         call_status = form_data.get("CallStatus")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"📞 INCOMING CALL WEBHOOK")
#         logger.info(f"{'='*80}")
#         logger.info(f"   Call SID: {call_sid}")
#         logger.info(f"   From: {from_number}")
#         logger.info(f"   To: {to_number}")
#         logger.info(f"   Status: {call_status}")
#         logger.info(f"{'='*80}\n")
        
#         # Find the call in database
#         call = await db.calls.find_one({"twilio_call_sid": call_sid})
        
#         if not call:
#             logger.warning(f"⚠️ Call {call_sid} not found in database")
#             call = {
#                 "twilio_call_sid": call_sid,
#                 "from_number": from_number,
#                 "to_number": to_number,
#                 "status": "in-progress",
#                 "direction": "outbound",
#                 "created_at": datetime.utcnow()
#             }
#             result = await db.calls.insert_one(call)
#             call["_id"] = result.inserted_id
        
#         # Get agent for this call
#         agent = None
#         if call.get("agent_id"):
#             agent = await db.voice_agents.find_one({"_id": ObjectId(call["agent_id"])})
        
#         # Extract base URL properly
#         base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
        
#         # Generate TwiML response
#         response = VoiceResponse()
        
#         # Get greeting message
#         if agent and agent.get("ai_script"):
#             greeting = agent["ai_script"].split('\n')[0][:300]
#         else:
#             greeting = "Hello! Thank you for calling. How can I help you today?"
        
#         logger.info(f"🎙️ Greeting: {greeting}")
        
#         # 🔥 ONLY ELEVENLABS - NO POLLY FALLBACK
#         try:
#             agent_voice_id = agent.get("voice_id") if agent else None
            
#             audio_response = await elevenlabs_service.text_to_speech(
#                 text=greeting,
#                 voice_id=agent_voice_id,
#                 save_to_file=True
#             )
            
#             if audio_response.get("success"):
#                 audio_url = audio_response.get("audio_url")
#                 full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
                
#                 logger.info(f"✅ ElevenLabs audio: {full_audio_url}")
                
#                 # Gather user speech
#                 gather = Gather(
#                     input='speech',
#                     timeout=5,
#                     action=f"{base_webhook_url}/process-speech",
#                     speechTimeout='auto',
#                     language='en-US',
#                     hints='appointment, schedule, book, yes, no, email, phone'
#                 )
#                 gather.play(full_audio_url)
#                 response.append(gather)
                
#                 # 🔥 FIXED: If no speech detected, just loop back - NO POLLY VOICE
#                 response.pause(length=1)
#                 response.redirect(f"{base_webhook_url}/incoming")
                
#             else:
#                 # If ElevenLabs fails completely, hangup gracefully
#                 logger.error(f"❌ ElevenLabs failed: {audio_response.get('error')}")
#                 response.say("We're experiencing technical difficulties. Please call back later.", voice='Polly.Joanna')
#                 response.hangup()
                
#         except Exception as e:
#             logger.error(f"❌ Error generating audio: {e}", exc_info=True)
#             response.say("We're experiencing technical difficulties. Please call back later.", voice='Polly.Joanna')
#             response.hangup()
        
#         # Update call status
#         await db.calls.update_one(
#             {"_id": call["_id"]},
#             {"$set": {
#                 "status": "in-progress",
#                 "answered_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }}
#         )
        
#         logger.info(f"✅ TwiML generated for {call_sid}")
#         return str(response)
        
#     except Exception as e:
#         logger.error(f"❌ Error in incoming webhook: {e}", exc_info=True)
#         response = VoiceResponse()
#         response.say("We're experiencing technical difficulties.", voice='Polly.Joanna')
#         response.hangup()
#         return str(response)


# # ============================================
# # 🔥 WEBHOOK: /webhook/process-speech - ONLY ELEVENLABS
# # ============================================

# @router.post("/webhook/process-speech", response_class=PlainTextResponse)
# async def process_speech_webhook(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """
#     Process user speech - ONLY ELEVENLABS VOICE
#     """
#     try:
#         form_data = await request.form()
        
#         call_sid = form_data.get("CallSid")
#         speech_result = form_data.get("SpeechResult", "")
#         confidence = form_data.get("Confidence", "0")
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"🎤 SPEECH INPUT")
#         logger.info(f"{'='*80}")
#         logger.info(f"   Call SID: {call_sid}")
#         logger.info(f"   User Said: {speech_result}")
#         logger.info(f"   Confidence: {confidence}")
#         logger.info(f"{'='*80}\n")
        
#         # Check if speech was captured
#         if not speech_result or speech_result.strip() == "":
#             logger.warning("⚠️ Empty speech result")
            
#             response = VoiceResponse()
            
#             # 🔥 FIXED: Generate "I didn't catch that" with ElevenLabs
#             try:
#                 retry_message = "I didn't catch that. Could you please repeat?"
#                 audio_response = await elevenlabs_service.text_to_speech(
#                     text=retry_message,
#                     save_to_file=True
#                 )
                
#                 if audio_response.get("success"):
#                     audio_url = audio_response.get("audio_url")
#                     full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
#                     response.play(full_audio_url)
#                 else:
#                     # Only use Polly if ElevenLabs completely fails
#                     response.say(retry_message, voice='Polly.Joanna')
#             except:
#                 response.say("I didn't catch that.", voice='Polly.Joanna')
            
#             base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
#             response.redirect(f"{base_webhook_url}/incoming")
#             return str(response)
        
#         # Find call
#         call = await db.calls.find_one({"twilio_call_sid": call_sid})
        
#         if not call:
#             logger.error(f"❌ Call {call_sid} not found")
#             response = VoiceResponse()
#             response.say("Sorry, there was an error.", voice='Polly.Joanna')
#             response.hangup()
#             return str(response)
        
#         # Get agent
#         agent = None
#         if call.get("agent_id"):
#             agent = await db.voice_agents.find_one({"_id": ObjectId(call["agent_id"])})
        
#         if not agent:
#             logger.warning(f"⚠️ No agent found")
#             agent = {
#                 "_id": ObjectId(),
#                 "name": "Default Agent",
#                 "ai_script": "I'm here to help you.",
#                 "has_training_docs": False
#             }
        
#         # Get user
#         user_id = call.get("user_id")
#         call_id = str(call["_id"])
        
#         # Process with 4-step executor
#         logger.info(f"🎯 Processing with 4-step executor...")
        
#         ai_response = await agent_executor.process_user_message(
#             user_input=speech_result,
#             agent_config=agent,
#             user_id=user_id,
#             call_id=call_id,
#             db=db
#         )
        
#         logger.info(f"🤖 AI Response: {ai_response}")
        
#         # Store conversation
#         await db.call_transcripts.insert_one({
#             "call_id": call["_id"],
#             "call_sid": call_sid,
#             "timestamp": datetime.utcnow(),
#             "speaker": "user",
#             "text": speech_result,
#             "confidence": float(confidence)
#         })
        
#         await db.call_transcripts.insert_one({
#             "call_id": call["_id"],
#             "call_sid": call_sid,
#             "timestamp": datetime.utcnow(),
#             "speaker": "agent",
#             "text": ai_response
#         })
        
#         # Extract base URL
#         base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
        
#         # 🔥 CRITICAL FIX: ONLY ELEVENLABS - NO POLLY AFTER
#         response = VoiceResponse()
        
#         try:
#             agent_voice_id = agent.get("voice_id") if agent else None
            
#             audio_response = await elevenlabs_service.text_to_speech(
#                 text=ai_response,
#                 voice_id=agent_voice_id,
#                 save_to_file=True
#             )
            
#             if audio_response.get("success"):
#                 audio_url = audio_response.get("audio_url")
#                 full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
                
#                 # 🔥 FIXED: Play ElevenLabs audio in Gather
#                 gather = Gather(
#                     input='speech',
#                     timeout=5,
#                     action=f"{base_webhook_url}/process-speech",
#                     speechTimeout='auto',
#                     language='en-US',
#                     hints='appointment, schedule, book, yes, no, email, phone, done, goodbye'
#                 )
#                 gather.play(full_audio_url)
#                 response.append(gather)
                
#                 # 🔥 CRITICAL FIX: NO POLLY SAY() HERE - Just redirect back
#                 response.pause(length=1)
#                 response.redirect(f"{base_webhook_url}/process-speech")
                
#             else:
#                 # If ElevenLabs fails, hangup gracefully
#                 logger.error(f"❌ ElevenLabs failed: {audio_response.get('error')}")
#                 response.say("Thank you for calling. Goodbye!", voice='Polly.Joanna')
#                 response.hangup()
                
#         except Exception as e:
#             logger.error(f"❌ Error generating response audio: {e}", exc_info=True)
#             response.say("Thank you for calling. Goodbye!", voice='Polly.Joanna')
#             response.hangup()
        
#         return str(response)
        
#     except Exception as e:
#         logger.error(f"❌ Error processing speech: {e}", exc_info=True)
#         response = VoiceResponse()
#         response.say("Sorry, there was an error. Goodbye!", voice='Polly.Joanna')
#         response.hangup()
#         return str(response)


# # ============================================
# # WEBHOOK: /webhook/call-status
# # ============================================

# @router.post("/webhook/call-status")
# async def call_status_webhook(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Handle call status updates"""
#     try:
#         form_data = await request.form()
        
#         call_sid = form_data.get("CallSid")
#         call_status = form_data.get("CallStatus")
#         call_duration = form_data.get("CallDuration", "0")
        
#         logger.info(f"📊 Call Status: {call_sid} -> {call_status} ({call_duration}s)")
        
#         update_data = {
#             "status": call_status,
#             "updated_at": datetime.utcnow()
#         }
        
#         if call_status == "completed":
#             update_data["ended_at"] = datetime.utcnow()
#             update_data["duration"] = int(call_duration) if call_duration else 0
        
#         await db.calls.update_one(
#             {"twilio_call_sid": call_sid},
#             {"$set": update_data}
#         )
        
#         return {"status": "success"}
        
#     except Exception as e:
#         logger.error(f"❌ Error updating call status: {e}")
#         return {"status": "error", "error": str(e)}


# # ============================================
# # WEBHOOK: /webhook/recording-status
# # ============================================

# @router.post("/webhook/recording-status")
# async def recording_status_webhook(
#     request: Request,
#     db: AsyncIOMotorDatabase = Depends(get_database)
# ):
#     """Handle recording status"""
#     try:
#         form_data = await request.form()
        
#         call_sid = form_data.get("CallSid")
#         recording_sid = form_data.get("RecordingSid")
#         recording_url = form_data.get("RecordingUrl")
#         recording_status = form_data.get("RecordingStatus")
#         recording_duration = form_data.get("RecordingDuration")
        
#         logger.info(f"🎙️ Recording: {recording_sid} -> {recording_status}")
        
#         if call_sid:
#             await db.calls.update_one(
#                 {"twilio_call_sid": call_sid},
#                 {"$set": {
#                     "recording_sid": recording_sid,
#                     "recording_url": recording_url,
#                     "recording_status": recording_status,
#                     "recording_duration": int(recording_duration) if recording_duration else 0,
#                     "recording_available": recording_status == "completed",
#                     "updated_at": datetime.utcnow()
#                 }}
#             )
        
#         return {"status": "success"}
        
#     except Exception as e:
#         logger.error(f"❌ Error handling recording: {e}")
#         return {"status": "error", "error": str(e)}


# # ============================================
# # ELEVENLABS VOICE ENDPOINTS
# # ============================================

# @router.get("/available-voices")
# async def get_available_voices(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get list of available ElevenLabs voices"""
#     try:
#         voices = await elevenlabs_service.get_available_voices()
        
#         return {
#             "success": True,
#             "voices": voices
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error fetching voices: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to fetch voices: {str(e)}"
#         )


# @router.post("/test-voice")
# async def test_voice(
#     test_data: Dict[str, str] = Body(...),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Test a voice by generating sample audio"""
#     try:
#         voice_id = test_data.get('voice_id')
#         text = test_data.get('text', 'Hello! This is a test of the voice synthesis.')
        
#         # 🔥 FIXED: Use correct method name
#         result = await elevenlabs_service.text_to_speech(
#             text=text,
#             voice_id=voice_id,
#             save_to_file=True
#         )
        
#         if result.get('success'):
#             return {
#                 "success": True,
#                 "audio_url": result.get('audio_url'),
#                 "message": "Voice test successful"
#             }
#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=result.get('error', 'Failed to generate audio')
#             )
            
#     except Exception as e:
#         logger.error(f"❌ Error testing voice: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to test voice: {str(e)}"
#         )


# # ============================================
# # VOICE AGENT MANAGEMENT ENDPOINTS
# # (Keep all existing endpoints for creating/updating/deleting agents)
# # ============================================

# @router.get("/agents")
# async def get_voice_agents(
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get all voice agents for current user"""
#     try:
#         user_id = str(current_user["_id"])
        
#         cursor = db.voice_agents.find({"user_id": user_id}).sort("created_at", -1)
#         agents = await cursor.to_list(length=100)
        
#         # Format response
#         for agent in agents:
#             agent["_id"] = str(agent["_id"])
#             agent["user_id"] = str(agent["user_id"])
            
#             # Count training documents
#             if agent.get("has_training_docs"):
#                 doc_count = await db.agent_documents.count_documents({
#                     "agent_id": agent["_id"],
#                     "status": "processed"
#                 })
#                 agent["training_doc_count"] = doc_count
#             else:
#                 agent["training_doc_count"] = 0
        
#         return {
#             "success": True,
#             "agents": agents,
#             "total": len(agents)
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error fetching agents: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to fetch agents: {str(e)}"
#         )


# @router.post("/agents", status_code=status.HTTP_201_CREATED)
# async def create_voice_agent(
#     agent_data: VoiceAgentCreateExtended,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Create a new voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Prepare agent document
#         agent_doc = {
#             "user_id": user_id,
#             "name": agent_data.name,
#             "ai_script": agent_data.ai_script,
#             "voice_id": agent_data.voice_id or os.getenv("ELEVENLABS_VOICE_ID"),
#             "phone_number": agent_data.phone_number,
#             "email": agent_data.email,
#             "company": agent_data.company,
#             "has_training_docs": False,
#             "workflow_id": agent_data.workflow_id if hasattr(agent_data, 'workflow_id') else None,
#             "created_at": datetime.utcnow(),
#             "updated_at": datetime.utcnow()
#         }
        
#         result = await db.voice_agents.insert_one(agent_doc)
#         agent_doc["_id"] = str(result.inserted_id)
#         agent_doc["user_id"] = user_id
        
#         logger.info(f"✅ Voice agent created: {agent_doc['name']} (ID: {agent_doc['_id']})")
        
#         return {
#             "success": True,
#             "agent": agent_doc,
#             "message": "Voice agent created successfully"
#         }
        
#     except Exception as e:
#         logger.error(f"❌ Error creating agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to create agent: {str(e)}"
#         )


# @router.put("/agents/{agent_id}")
# async def update_voice_agent(
#     agent_id: str,
#     agent_data: VoiceAgentUpdate,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Update a voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Verify ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # Prepare update data
#         update_data = agent_data.model_dump(exclude_unset=True)
#         update_data["updated_at"] = datetime.utcnow()
        
#         await db.voice_agents.update_one(
#             {"_id": ObjectId(agent_id)},
#             {"$set": update_data}
#         )
        
#         # Fetch updated agent
#         updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
#         updated_agent["_id"] = str(updated_agent["_id"])
#         updated_agent["user_id"] = str(updated_agent["user_id"])
        
#         logger.info(f"✅ Voice agent updated: {agent_id}")
        
#         return {
#             "success": True,
#             "agent": updated_agent,
#             "message": "Voice agent updated successfully"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error updating agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to update agent: {str(e)}"
#         )


# @router.delete("/agents/{agent_id}")
# async def delete_voice_agent(
#     agent_id: str,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete a voice agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Verify ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # Delete agent
#         await db.voice_agents.delete_one({"_id": ObjectId(agent_id)})
        
#         # Delete associated documents
#         await db.agent_documents.delete_many({"agent_id": agent_id})
#         await db.agent_embeddings.delete_many({"agent_id": agent_id})
        
#         logger.info(f"✅ Voice agent deleted: {agent_id}")
        
#         return {
#             "success": True,
#             "message": "Voice agent deleted successfully"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error deleting agent: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to delete agent: {str(e)}"
#         )


# # ============================================
# # DOCUMENT TRAINING ENDPOINTS
# # ============================================

# @router.post("/agents/{agent_id}/upload-training-doc")
# async def upload_training_document(
#     agent_id: str,
#     file: UploadFile = File(...),
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Upload training document for RAG"""
#     try:
#         from app.services.rag_service import rag_service
        
#         user_id = str(current_user["_id"])
        
#         # Verify agent ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # Read file content
#         file_content = await file.read()
        
#         # Process document with RAG service
#         result = await rag_service.upload_and_process_document(
#             file_content=file_content,
#             filename=file.filename,
#             content_type=file.content_type,
#             agent_id=agent_id,
#             user_id=user_id,
#             db=db
#         )
        
#         if result.get("success"):
#             # Update agent to mark it has training docs
#             await db.voice_agents.update_one(
#                 {"_id": ObjectId(agent_id)},
#                 {"$set": {
#                     "has_training_docs": True,
#                     "updated_at": datetime.utcnow()
#                 }}
#             )
            
#             return {
#                 "success": True,
#                 "document": result.get("document"),
#                 "message": "Training document uploaded and processed successfully"
#             }
#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail=result.get("error", "Failed to process document")
#             )
            
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error uploading training document: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to upload document: {str(e)}"
#         )


# @router.get("/agents/{agent_id}/training-docs")
# async def get_training_documents(
#     agent_id: str,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get all training documents for an agent"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Verify agent ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # Get documents
#         cursor = db.agent_documents.find({"agent_id": agent_id}).sort("created_at", -1)
#         documents = await cursor.to_list(length=100)
        
#         for doc in documents:
#             doc["_id"] = str(doc["_id"])
        
#         return {
#             "success": True,
#             "documents": documents,
#             "total": len(documents)
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error fetching training documents: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to fetch documents: {str(e)}"
#         )


# @router.delete("/agents/{agent_id}/training-docs/{doc_id}")
# async def delete_training_document(
#     agent_id: str,
#     doc_id: str,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """Delete a training document"""
#     try:
#         user_id = str(current_user["_id"])
        
#         # Verify agent ownership
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # Delete document and embeddings
#         await db.agent_documents.delete_one({"_id": ObjectId(doc_id)})
#         await db.agent_embeddings.delete_many({"document_id": doc_id})
        
#         # Check if agent still has documents
#         remaining_docs = await db.agent_documents.count_documents({
#             "agent_id": agent_id,
#             "status": "processed"
#         })
        
#         if remaining_docs == 0:
#             await db.voice_agents.update_one(
#                 {"_id": ObjectId(agent_id)},
#                 {"$set": {"has_training_docs": False}}
#             )
        
#         return {
#             "success": True,
#             "message": "Training document deleted successfully"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error deleting training document: {e}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to delete document: {str(e)}"
#         )


# # ============================================
# # BULK CAMPAIGN EXECUTION - ✅ COMPLETE FIX
# # ============================================

# @router.post("/agents/{agent_id}/execute-campaign")
# async def execute_bulk_campaign(
#     agent_id: str,
#     db: AsyncIOMotorDatabase = Depends(get_database),
#     current_user: dict = Depends(get_current_user)
# ):
#     """
#     Execute bulk calling campaign
#     Gets recipients from agent's contacts array
#     """
#     try:
#         from app.services.twilio import twilio_service
#         import os
        
#         user_id = str(current_user["_id"])
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"🚀 BULK CAMPAIGN EXECUTION")
#         logger.info(f"{'='*80}")
#         logger.info(f"   Agent ID: {agent_id}")
#         logger.info(f"   User ID: {user_id}")
#         logger.info(f"{'='*80}\n")
        
#         # ✅ STEP 1: Get agent from database
#         agent = await db.voice_agents.find_one({
#             "_id": ObjectId(agent_id),
#             "user_id": user_id
#         })
        
#         if not agent:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Agent not found"
#             )
        
#         # ✅ STEP 2: Get contacts from agent
#         contacts = agent.get("contacts", [])
        
#         if not contacts or len(contacts) == 0:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Agent has no contacts configured"
#             )
        
#         logger.info(f"📋 Found {len(contacts)} contacts in agent")
        
#         # ✅ STEP 3: Create campaign record
#         campaign_doc = {
#             "user_id": user_id,
#             "agent_id": agent_id,
#             "total_recipients": len(contacts),
#             "completed": 0,
#             "failed": 0,
#             "status": "in-progress",
#             "started_at": datetime.utcnow(),
#             "created_at": datetime.utcnow()
#         }
        
#         campaign_result = await db.campaigns.insert_one(campaign_doc)
#         campaign_id = str(campaign_result.inserted_id)
        
#         logger.info(f"✅ Campaign created: {campaign_id}")
        
#         # ✅ STEP 4: Execute calls for each contact
#         call_results = []
#         twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
#         for i, contact in enumerate(contacts, 1):
#             try:
#                 phone_number = contact.get("phone")
#                 contact_name = contact.get("name", "Unknown")
                
#                 if not phone_number:
#                     logger.warning(f"⚠️ Contact {i} has no phone number, skipping")
#                     continue
                
#                 logger.info(f"📞 Call {i}/{len(contacts)}: {contact_name} - {phone_number}")
                
#                 # Create call record
#                 call_doc = {
#                     "user_id": user_id,
#                     "agent_id": agent_id,
#                     "campaign_id": campaign_id,
#                     "to_number": phone_number,
#                     "from_number": twilio_phone,
#                     "contact_name": contact_name,
#                     "status": "initiated",
#                     "direction": "outbound",
#                     "created_at": datetime.utcnow()
#                 }
                
#                 call_result = await db.calls.insert_one(call_doc)
#                 call_id = str(call_result.inserted_id)
                
#                 # Make Twilio call
#                 twilio_result = twilio_service.make_call(
#                     to_number=phone_number,
#                     from_number=twilio_phone
#                 )
                
#                 if twilio_result.get("success"):
#                     # Update call with Twilio SID
#                     await db.calls.update_one(
#                         {"_id": ObjectId(call_id)},
#                         {"$set": {
#                             "twilio_call_sid": twilio_result["call_sid"],
#                             "status": twilio_result["status"]
#                         }}
#                     )
                    
#                     call_results.append({
#                         "name": contact_name,
#                         "phone": phone_number,
#                         "status": "success",
#                         "call_sid": twilio_result["call_sid"]
#                     })
                    
#                     # Update campaign completed count
#                     await db.campaigns.update_one(
#                         {"_id": ObjectId(campaign_id)},
#                         {"$inc": {"completed": 1}}
#                     )
                    
#                     logger.info(f"✅ Call initiated: {twilio_result['call_sid']}")
                    
#                 else:
#                     call_results.append({
#                         "name": contact_name,
#                         "phone": phone_number,
#                         "status": "failed",
#                         "error": twilio_result.get("error")
#                     })
                    
#                     # Update campaign failed count
#                     await db.campaigns.update_one(
#                         {"_id": ObjectId(campaign_id)},
#                         {"$inc": {"failed": 1}}
#                     )
                    
#                     logger.error(f"❌ Call failed: {twilio_result.get('error')}")
                
#                 # Small delay between calls (1 second)
#                 await asyncio.sleep(1)
                
#             except Exception as call_error:
#                 logger.error(f"❌ Error calling {contact.get('name')}: {call_error}")
#                 call_results.append({
#                     "name": contact.get("name", "Unknown"),
#                     "phone": contact.get("phone", "Unknown"),
#                     "status": "failed",
#                     "error": str(call_error)
#                 })
                
#                 # Update failed count
#                 await db.campaigns.update_one(
#                     {"_id": ObjectId(campaign_id)},
#                     {"$inc": {"failed": 1}}
#                 )
        
#         # ✅ STEP 5: Update campaign status to completed
#         await db.campaigns.update_one(
#             {"_id": ObjectId(campaign_id)},
#             {"$set": {
#                 "status": "completed",
#                 "completed_at": datetime.utcnow()
#             }}
#         )
        
#         # Calculate summary
#         successful = len([r for r in call_results if r["status"] == "success"])
#         failed = len([r for r in call_results if r["status"] == "failed"])
        
#         logger.info(f"\n{'='*80}")
#         logger.info(f"✅ BULK CAMPAIGN COMPLETED")
#         logger.info(f"{'='*80}")
#         logger.info(f"   Campaign ID: {campaign_id}")
#         logger.info(f"   Total Contacts: {len(contacts)}")
#         logger.info(f"   Successful: {successful}")
#         logger.info(f"   Failed: {failed}")
#         logger.info(f"{'='*80}\n")
        
#         return {
#             "success": True,
#             "campaign_id": campaign_id,
#             "total": len(contacts),
#             "successful": successful,
#             "failed": failed,
#             "results": call_results,
#             "message": f"Campaign executed: {successful} calls initiated, {failed} failed"
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"❌ Error executing campaign: {e}", exc_info=True)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to execute campaign: {str(e)}"
#         )



# backend/app/api/v1/voice.py - ✅ ONLY ELEVENLABS VOICE with follow up steps

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Response, Query, Body, Request
from fastapi.responses import StreamingResponse, PlainTextResponse
from typing import Optional, List, Dict
from datetime import datetime
from bson import ObjectId
from pathlib import Path
import logging
import asyncio
import io
import os

from app.api.deps import get_current_user, get_database
from app.schemas.voice import (
    VoiceAgentCreate,
    VoiceAgentCreateExtended,
    VoiceAgentUpdate
)
from app.services.elevenlabs import elevenlabs_service
from app.services.ai_agent import ai_agent_service
from app.services.call_handler import call_handler_service
from app.services.agent_executor import agent_executor
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorDatabase
from twilio.twiml.voice_response import VoiceResponse, Gather, Connect, Stream

logger = logging.getLogger(__name__)
router = APIRouter()


# ============================================
# 🔥 WEBHOOK: /webhook/incoming - ONLY ELEVENLABS
# ============================================

@router.post("/webhook/incoming", response_class=PlainTextResponse)
async def incoming_call_webhook(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    ✅ Handle incoming Twilio call - ONLY ELEVENLABS VOICE
    """
    try:
        form_data = await request.form()
        
        call_sid = form_data.get("CallSid")
        from_number = form_data.get("From")
        to_number = form_data.get("To")
        call_status = form_data.get("CallStatus")
        
        logger.info(f"\n{'='*80}")
        logger.info(f"📞 INCOMING CALL WEBHOOK")
        logger.info(f"{'='*80}")
        logger.info(f"   Call SID: {call_sid}")
        logger.info(f"   From: {from_number}")
        logger.info(f"   To: {to_number}")
        logger.info(f"   Status: {call_status}")
        logger.info(f"{'='*80}\n")
        
        # Find the call in database
        call = await db.calls.find_one({"twilio_call_sid": call_sid})
        
        if not call:
            logger.warning(f"⚠️ Call {call_sid} not found in database")
            call = {
                "twilio_call_sid": call_sid,
                "from_number": from_number,
                "to_number": to_number,
                "status": "in-progress",
                "direction": "outbound",
                "created_at": datetime.utcnow()
            }
            result = await db.calls.insert_one(call)
            call["_id"] = result.inserted_id
        
        # Get agent for this call
        agent = None
        if call.get("agent_id"):
            agent = await db.voice_agents.find_one({"_id": ObjectId(call["agent_id"])})
        
        # Extract base URL properly
        base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
        
        # Generate TwiML response
        response = VoiceResponse()
        
        # Get greeting message
        if agent and agent.get("ai_script"):
            greeting = agent["ai_script"].split('\n')[0][:300]
        else:
            greeting = "Hello! Thank you for calling. How can I help you today?"
        
        logger.info(f"🎙️ Greeting: {greeting}")
        
        # 🔥 ONLY ELEVENLABS - NO POLLY FALLBACK
        try:
            agent_voice_id = agent.get("voice_id") if agent else None
            
            audio_response = await elevenlabs_service.text_to_speech(
                text=greeting,
                voice_id=agent_voice_id,
                save_to_file=True
            )
            
            if audio_response.get("success"):
                audio_url = audio_response.get("audio_url")
                full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
                
                logger.info(f"✅ ElevenLabs audio: {full_audio_url}")
                
                # Gather user speech
                gather = Gather(
                    input='speech',
                    timeout=5,
                    action=f"{base_webhook_url}/process-speech",
                    speechTimeout='auto',
                    language='en-US',
                    hints='appointment, schedule, book, yes, no, email, phone'
                )
                gather.play(full_audio_url)
                response.append(gather)
                
                # 🔥 FIXED: If no speech detected, just loop back - NO POLLY VOICE
                response.pause(length=1)
                response.redirect(f"{base_webhook_url}/incoming")
                
            else:
                # If ElevenLabs fails completely, hangup gracefully
                logger.error(f"❌ ElevenLabs failed: {audio_response.get('error')}")
                response.say("We're experiencing technical difficulties. Please call back later.", voice='Polly.Joanna')
                response.hangup()
                
        except Exception as e:
            logger.error(f"❌ Error generating audio: {e}", exc_info=True)
            response.say("We're experiencing technical difficulties. Please call back later.", voice='Polly.Joanna')
            response.hangup()
        
        # Update call status
        await db.calls.update_one(
            {"_id": call["_id"]},
            {"$set": {
                "status": "in-progress",
                "answered_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        logger.info(f"✅ TwiML generated for {call_sid}")
        return str(response)
        
    except Exception as e:
        logger.error(f"❌ Error in incoming webhook: {e}", exc_info=True)
        response = VoiceResponse()
        response.say("We're experiencing technical difficulties.", voice='Polly.Joanna')
        response.hangup()
        return str(response)


# ============================================
# 🔥 WEBHOOK: /webhook/process-speech - ONLY ELEVENLABS
# ============================================

@router.post("/webhook/process-speech", response_class=PlainTextResponse)
async def process_speech_webhook(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Process user speech - ONLY ELEVENLABS VOICE
    """
    try:
        form_data = await request.form()
        
        call_sid = form_data.get("CallSid")
        speech_result = form_data.get("SpeechResult", "")
        confidence = form_data.get("Confidence", "0")
        
        logger.info(f"\n{'='*80}")
        logger.info(f"🎤 SPEECH INPUT")
        logger.info(f"{'='*80}")
        logger.info(f"   Call SID: {call_sid}")
        logger.info(f"   User Said: {speech_result}")
        logger.info(f"   Confidence: {confidence}")
        logger.info(f"{'='*80}\n")
        
        # Check if speech was captured
        if not speech_result or speech_result.strip() == "":
            logger.warning("⚠️ Empty speech result")
            
            response = VoiceResponse()
            
            # 🔥 FIXED: Generate "I didn't catch that" with ElevenLabs
            try:
                retry_message = "I didn't catch that. Could you please repeat?"
                audio_response = await elevenlabs_service.text_to_speech(
                    text=retry_message,
                    save_to_file=True
                )
                
                if audio_response.get("success"):
                    audio_url = audio_response.get("audio_url")
                    full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
                    response.play(full_audio_url)
                else:
                    # Only use Polly if ElevenLabs completely fails
                    response.say(retry_message, voice='Polly.Joanna')
            except:
                response.say("I didn't catch that.", voice='Polly.Joanna')
            
            base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
            response.redirect(f"{base_webhook_url}/incoming")
            return str(response)
        
        # Find call
        call = await db.calls.find_one({"twilio_call_sid": call_sid})
        
        if not call:
            logger.error(f"❌ Call {call_sid} not found")
            response = VoiceResponse()
            response.say("Sorry, there was an error.", voice='Polly.Joanna')
            response.hangup()
            return str(response)
        
        # Get agent
        agent = None
        if call.get("agent_id"):
            agent = await db.voice_agents.find_one({"_id": ObjectId(call["agent_id"])})
        
        if not agent:
            logger.warning(f"⚠️ No agent found")
            agent = {
                "_id": ObjectId(),
                "name": "Default Agent",
                "ai_script": "I'm here to help you.",
                "has_training_docs": False
            }
        
        # Get user
        user_id = call.get("user_id")
        call_id = str(call["_id"])
        
        # Process with 4-step executor
        logger.info(f"🎯 Processing with 4-step executor...")
        
        ai_response = await agent_executor.process_user_message(
            user_input=speech_result,
            agent_config=agent,
            user_id=user_id,
            call_id=call_id,
            db=db
        )
        
        logger.info(f"🤖 AI Response: {ai_response}")
        
        # Store conversation
        await db.call_transcripts.insert_one({
            "call_id": call["_id"],
            "call_sid": call_sid,
            "timestamp": datetime.utcnow(),
            "speaker": "user",
            "text": speech_result,
            "confidence": float(confidence)
        })
        
        await db.call_transcripts.insert_one({
            "call_id": call["_id"],
            "call_sid": call_sid,
            "timestamp": datetime.utcnow(),
            "speaker": "agent",
            "text": ai_response
        })
        
        # Extract base URL
        base_webhook_url = settings.TWILIO_WEBHOOK_URL.replace('/incoming', '')
        
        # 🔥 CRITICAL FIX: ONLY ELEVENLABS - NO POLLY AFTER
        response = VoiceResponse()
        
        try:
            agent_voice_id = agent.get("voice_id") if agent else None
            
            audio_response = await elevenlabs_service.text_to_speech(
                text=ai_response,
                voice_id=agent_voice_id,
                save_to_file=True
            )
            
            if audio_response.get("success"):
                audio_url = audio_response.get("audio_url")
                full_audio_url = f"{settings.TWILIO_WEBHOOK_URL.replace('/api/v1/voice/webhook/incoming', '')}{audio_url}"
                
                # 🔥 FIXED: Play ElevenLabs audio in Gather
                gather = Gather(
                    input='speech',
                    timeout=5,
                    action=f"{base_webhook_url}/process-speech",
                    speechTimeout='auto',
                    language='en-US',
                    hints='appointment, schedule, book, yes, no, email, phone, done, goodbye'
                )
                gather.play(full_audio_url)
                response.append(gather)
                
                # 🔥 CRITICAL FIX: NO POLLY SAY() HERE - Just redirect back
                response.pause(length=1)
                response.redirect(f"{base_webhook_url}/process-speech")
                
            else:
                # If ElevenLabs fails, hangup gracefully
                logger.error(f"❌ ElevenLabs failed: {audio_response.get('error')}")
                response.say("Thank you for calling. Goodbye!", voice='Polly.Joanna')
                response.hangup()
                
        except Exception as e:
            logger.error(f"❌ Error generating response audio: {e}", exc_info=True)
            response.say("Thank you for calling. Goodbye!", voice='Polly.Joanna')
            response.hangup()
        
        return str(response)
        
    except Exception as e:
        logger.error(f"❌ Error processing speech: {e}", exc_info=True)
        response = VoiceResponse()
        response.say("Sorry, there was an error. Goodbye!", voice='Polly.Joanna')
        response.hangup()
        return str(response)


# ============================================
# WEBHOOK: /webhook/call-status
# ============================================

@router.post("/webhook/call-status")
async def call_status_webhook(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle call status updates"""
    try:
        form_data = await request.form()
        
        call_sid = form_data.get("CallSid")
        call_status = form_data.get("CallStatus")
        call_duration = form_data.get("CallDuration", "0")
        
        logger.info(f"📊 Call Status: {call_sid} -> {call_status} ({call_duration}s)")
        
        update_data = {
            "status": call_status,
            "updated_at": datetime.utcnow()
        }
        
        if call_status == "completed":
            update_data["ended_at"] = datetime.utcnow()
            update_data["duration"] = int(call_duration) if call_duration else 0
        
        await db.calls.update_one(
            {"twilio_call_sid": call_sid},
            {"$set": update_data}
        )
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"❌ Error updating call status: {e}")
        return {"status": "error", "error": str(e)}


# ============================================
# WEBHOOK: /webhook/recording-status
# ============================================

@router.post("/webhook/recording-status")
async def recording_status_webhook(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Handle recording status"""
    try:
        form_data = await request.form()
        
        call_sid = form_data.get("CallSid")
        recording_sid = form_data.get("RecordingSid")
        recording_url = form_data.get("RecordingUrl")
        recording_status = form_data.get("RecordingStatus")
        recording_duration = form_data.get("RecordingDuration")
        
        logger.info(f"🎙️ Recording: {recording_sid} -> {recording_status}")
        
        if call_sid:
            await db.calls.update_one(
                {"twilio_call_sid": call_sid},
                {"$set": {
                    "recording_sid": recording_sid,
                    "recording_url": recording_url,
                    "recording_status": recording_status,
                    "recording_duration": int(recording_duration) if recording_duration else 0,
                    "recording_available": recording_status == "completed",
                    "updated_at": datetime.utcnow()
                }}
            )
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"❌ Error handling recording: {e}")
        return {"status": "error", "error": str(e)}


# ============================================
# ELEVENLABS VOICE ENDPOINTS
# ============================================

@router.get("/available-voices")
async def get_available_voices(
    current_user: dict = Depends(get_current_user)
):
    """Get list of available ElevenLabs voices"""
    try:
        voices = await elevenlabs_service.get_available_voices()
        
        return {
            "success": True,
            "voices": voices
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch voices: {str(e)}"
        )


@router.post("/test-voice")
async def test_voice(
    test_data: Dict[str, str] = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Test a voice by generating sample audio"""
    try:
        voice_id = test_data.get('voice_id')
        text = test_data.get('text', 'Hello! This is a test of the voice synthesis.')
        
        # 🔥 FIXED: Use correct method name
        result = await elevenlabs_service.text_to_speech(
            text=text,
            voice_id=voice_id,
            save_to_file=True
        )
        
        if result.get('success'):
            return {
                "success": True,
                "audio_url": result.get('audio_url'),
                "message": "Voice test successful"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get('error', 'Failed to generate audio')
            )
            
    except Exception as e:
        logger.error(f"❌ Error testing voice: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test voice: {str(e)}"
        )


# ============================================
# VOICE AGENT MANAGEMENT ENDPOINTS
# (Keep all existing endpoints for creating/updating/deleting agents)
# ============================================

@router.get("/agents")
async def get_voice_agents(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Get all voice agents for current user"""
    try:
        user_id = str(current_user["_id"])
        
        cursor = db.voice_agents.find({"user_id": user_id}).sort("created_at", -1)
        agents = await cursor.to_list(length=100)
        
        # Format response
        for agent in agents:
            agent["_id"] = str(agent["_id"])
            agent["user_id"] = str(agent["user_id"])
            
            # Count training documents
            if agent.get("has_training_docs"):
                doc_count = await db.agent_documents.count_documents({
                    "agent_id": agent["_id"],
                    "status": "processed"
                })
                agent["training_doc_count"] = doc_count
            else:
                agent["training_doc_count"] = 0
        
        return {
            "success": True,
            "agents": agents,
            "total": len(agents)
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching agents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch agents: {str(e)}"
        )


@router.post("/agents", status_code=status.HTTP_201_CREATED)
async def create_voice_agent(
    agent_data: VoiceAgentCreateExtended,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Create a new voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        logger.info(f"📥 Received agent data: {agent_data.model_dump()}")
        
        # ✅ Prepare agent document with ALL fields
        agent_doc = {
            "user_id": user_id,
            "name": agent_data.name,
            "description": agent_data.description or "",
            "voice_id": agent_data.voice_id,
            "voice_settings": agent_data.voice_settings or {
                "stability": 0.5,
                "similarity_boost": 0.75
            },
            "calling_mode": agent_data.calling_mode,
            "contacts": [contact.model_dump() for contact in agent_data.contacts],
            "ai_script": agent_data.ai_script,
            "system_prompt": agent_data.system_prompt or agent_data.ai_script,
            "greeting_message": agent_data.greeting_message or "Hello! Thanks for taking my call today.",
            "personality_traits": agent_data.personality_traits or ["friendly", "professional", "helpful"],
            "logic_level": agent_data.logic_level,
            "contact_frequency": agent_data.contact_frequency,
            "enable_calls": agent_data.enable_calls,
            "enable_emails": agent_data.enable_emails,
            "enable_sms": agent_data.enable_sms,
            "email_template": agent_data.email_template or "",  # ✅ NEW
            "sms_template": agent_data.sms_template or "",  # ✅ NEW
            "workflow_id": agent_data.workflow_id,
            "is_active": agent_data.is_active,
            "has_training_docs": False,
            "training_doc_ids": [],
            "in_call": False,
            "total_calls": 0,
            "successful_calls": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        logger.info(f"💾 Saving agent document: {agent_doc['name']}")
        
        result = await db.voice_agents.insert_one(agent_doc)
        agent_doc["_id"] = str(result.inserted_id)
        
        logger.info(f"✅ Voice agent created: {agent_doc['name']} (ID: {agent_doc['_id']})")
        
        # Format response
        response_agent = {
            "_id": agent_doc["_id"],
            "user_id": user_id,
            "name": agent_doc["name"],
            "description": agent_doc["description"],
            "voice_id": agent_doc["voice_id"],
            "calling_mode": agent_doc["calling_mode"],
            "contacts": agent_doc["contacts"],
            "ai_script": agent_doc["ai_script"],
            "logic_level": agent_doc["logic_level"],
            "contact_frequency": agent_doc["contact_frequency"],
            "enable_calls": agent_doc["enable_calls"],
            "enable_emails": agent_doc["enable_emails"],
            "enable_sms": agent_doc["enable_sms"],
            "email_template": agent_doc["email_template"],
            "sms_template": agent_doc["sms_template"],
            "has_training_docs": agent_doc["has_training_docs"],
            "training_doc_ids": agent_doc["training_doc_ids"],
            "is_active": agent_doc["is_active"],
            "in_call": agent_doc["in_call"],
            "total_calls": agent_doc["total_calls"],
            "successful_calls": agent_doc["successful_calls"],
            "created_at": agent_doc["created_at"].isoformat(),
            "updated_at": agent_doc["updated_at"].isoformat()
        }
        
        return {
            "success": True,
            "agent": response_agent,
            "message": "Voice agent created successfully"
        }
        
    except Exception as e:
        logger.error(f"❌ Error creating agent: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create agent: {str(e)}"
        )


@router.put("/agents/{agent_id}")
@router.patch("/agents/{agent_id}")  # ✅ ADD THIS LINE
async def update_voice_agent(
    agent_id: str,
    agent_data: VoiceAgentUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Update a voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        # Verify ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Prepare update data
        update_data = agent_data.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        
        await db.voice_agents.update_one(
            {"_id": ObjectId(agent_id)},
            {"$set": update_data}
        )
        
        # Fetch updated agent
        updated_agent = await db.voice_agents.find_one({"_id": ObjectId(agent_id)})
        updated_agent["_id"] = str(updated_agent["_id"])
        updated_agent["user_id"] = str(updated_agent["user_id"])
        
        logger.info(f"✅ Voice agent updated: {agent_id}")
        
        return {
            "success": True,
            "agent": updated_agent,
            "message": "Voice agent updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error updating agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update agent: {str(e)}"
        )


@router.delete("/agents/{agent_id}")
async def delete_voice_agent(
    agent_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Delete a voice agent"""
    try:
        user_id = str(current_user["_id"])
        
        # Verify ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Delete agent
        await db.voice_agents.delete_one({"_id": ObjectId(agent_id)})
        
        # Delete associated documents
        await db.agent_documents.delete_many({"agent_id": agent_id})
        await db.agent_embeddings.delete_many({"agent_id": agent_id})
        
        logger.info(f"✅ Voice agent deleted: {agent_id}")
        
        return {
            "success": True,
            "message": "Voice agent deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting agent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete agent: {str(e)}"
        )


# ============================================
# DOCUMENT TRAINING ENDPOINTS
# ============================================

@router.post("/agents/{agent_id}/upload-training-doc")
async def upload_training_document(
    agent_id: str,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Upload training document for RAG"""
    try:
        from app.services.rag_service import rag_service
        
        user_id = str(current_user["_id"])
        
        # Verify agent ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Process document with RAG service
        result = await rag_service.upload_and_process_document(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type,
            agent_id=agent_id,
            user_id=user_id,
            db=db
        )
        
        if result.get("success"):
            # Update agent to mark it has training docs
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {"$set": {
                    "has_training_docs": True,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            return {
                "success": True,
                "document": result.get("document"),
                "message": "Training document uploaded and processed successfully"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.get("error", "Failed to process document")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error uploading training document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}"
        )


@router.get("/agents/{agent_id}/training-docs")
async def get_training_documents(
    agent_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Get all training documents for an agent"""
    try:
        user_id = str(current_user["_id"])
        
        # Verify agent ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Get documents
        cursor = db.agent_documents.find({"agent_id": agent_id}).sort("created_at", -1)
        documents = await cursor.to_list(length=100)
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "documents": documents,
            "total": len(documents)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error fetching training documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch documents: {str(e)}"
        )


@router.delete("/agents/{agent_id}/training-docs/{doc_id}")
async def delete_training_document(
    agent_id: str,
    doc_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """Delete a training document"""
    try:
        user_id = str(current_user["_id"])
        
        # Verify agent ownership
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # Delete document and embeddings
        await db.agent_documents.delete_one({"_id": ObjectId(doc_id)})
        await db.agent_embeddings.delete_many({"document_id": doc_id})
        
        # Check if agent still has documents
        remaining_docs = await db.agent_documents.count_documents({
            "agent_id": agent_id,
            "status": "processed"
        })
        
        if remaining_docs == 0:
            await db.voice_agents.update_one(
                {"_id": ObjectId(agent_id)},
                {"$set": {"has_training_docs": False}}
            )
        
        return {
            "success": True,
            "message": "Training document deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error deleting training document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )


# ============================================
# BULK CAMPAIGN EXECUTION - ✅ COMPLETE FIX
# ============================================

@router.post("/agents/{agent_id}/execute-campaign")
async def execute_bulk_campaign(
    agent_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """
    Execute bulk calling campaign
    Gets recipients from agent's contacts array
    """
    try:
        from app.services.twilio import twilio_service
        import os
        
        user_id = str(current_user["_id"])
        
        logger.info(f"\n{'='*80}")
        logger.info(f"🚀 BULK CAMPAIGN EXECUTION")
        logger.info(f"{'='*80}")
        logger.info(f"   Agent ID: {agent_id}")
        logger.info(f"   User ID: {user_id}")
        logger.info(f"{'='*80}\n")
        
        # ✅ STEP 1: Get agent from database
        agent = await db.voice_agents.find_one({
            "_id": ObjectId(agent_id),
            "user_id": user_id
        })
        
        if not agent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Agent not found"
            )
        
        # ✅ STEP 2: Get contacts from agent
        contacts = agent.get("contacts", [])
        
        if not contacts or len(contacts) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Agent has no contacts configured"
            )
        
        logger.info(f"📋 Found {len(contacts)} contacts in agent")
        
        # ✅ STEP 3: Create campaign record
        campaign_doc = {
            "user_id": user_id,
            "agent_id": agent_id,
            "total_recipients": len(contacts),
            "completed": 0,
            "failed": 0,
            "status": "in-progress",
            "started_at": datetime.utcnow(),
            "created_at": datetime.utcnow()
        }
        
        campaign_result = await db.campaigns.insert_one(campaign_doc)
        campaign_id = str(campaign_result.inserted_id)
        
        logger.info(f"✅ Campaign created: {campaign_id}")
        
        # ✅ STEP 4: Execute calls for each contact
        call_results = []
        twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        for i, contact in enumerate(contacts, 1):
            try:
                phone_number = contact.get("phone")
                contact_name = contact.get("name", "Unknown")
                
                if not phone_number:
                    logger.warning(f"⚠️ Contact {i} has no phone number, skipping")
                    continue
                
                logger.info(f"📞 Call {i}/{len(contacts)}: {contact_name} - {phone_number}")
                
                # Create call record
                call_doc = {
                    "user_id": user_id,
                    "agent_id": agent_id,
                    "campaign_id": campaign_id,
                    "to_number": phone_number,
                    "from_number": twilio_phone,
                    "contact_name": contact_name,
                    "status": "initiated",
                    "direction": "outbound",
                    "created_at": datetime.utcnow()
                }
                
                call_result = await db.calls.insert_one(call_doc)
                call_id = str(call_result.inserted_id)
                
                # Make Twilio call
                twilio_result = twilio_service.make_call(
                    to_number=phone_number,
                    from_number=twilio_phone
                )
                
                if twilio_result.get("success"):
                    # Update call with Twilio SID
                    await db.calls.update_one(
                        {"_id": ObjectId(call_id)},
                        {"$set": {
                            "twilio_call_sid": twilio_result["call_sid"],
                            "status": twilio_result["status"]
                        }}
                    )
                    
                    call_results.append({
                        "name": contact_name,
                        "phone": phone_number,
                        "status": "success",
                        "call_sid": twilio_result["call_sid"]
                    })
                    
                    # Update campaign completed count
                    await db.campaigns.update_one(
                        {"_id": ObjectId(campaign_id)},
                        {"$inc": {"completed": 1}}
                    )
                    
                    logger.info(f"✅ Call initiated: {twilio_result['call_sid']}")
                    
                else:
                    call_results.append({
                        "name": contact_name,
                        "phone": phone_number,
                        "status": "failed",
                        "error": twilio_result.get("error")
                    })
                    
                    # Update campaign failed count
                    await db.campaigns.update_one(
                        {"_id": ObjectId(campaign_id)},
                        {"$inc": {"failed": 1}}
                    )
                    
                    logger.error(f"❌ Call failed: {twilio_result.get('error')}")
                
                # Small delay between calls (1 second)
                await asyncio.sleep(1)
                
            except Exception as call_error:
                logger.error(f"❌ Error calling {contact.get('name')}: {call_error}")
                call_results.append({
                    "name": contact.get("name", "Unknown"),
                    "phone": contact.get("phone", "Unknown"),
                    "status": "failed",
                    "error": str(call_error)
                })
                
                # Update failed count
                await db.campaigns.update_one(
                    {"_id": ObjectId(campaign_id)},
                    {"$inc": {"failed": 1}}
                )
        
        # ✅ STEP 5: Update campaign status to completed
        await db.campaigns.update_one(
            {"_id": ObjectId(campaign_id)},
            {"$set": {
                "status": "completed",
                "completed_at": datetime.utcnow()
            }}
        )
        
        # Calculate summary
        successful = len([r for r in call_results if r["status"] == "success"])
        failed = len([r for r in call_results if r["status"] == "failed"])
        
        logger.info(f"\n{'='*80}")
        logger.info(f"✅ BULK CAMPAIGN COMPLETED")
        logger.info(f"{'='*80}")
        logger.info(f"   Campaign ID: {campaign_id}")
        logger.info(f"   Total Contacts: {len(contacts)}")
        logger.info(f"   Successful: {successful}")
        logger.info(f"   Failed: {failed}")
        logger.info(f"{'='*80}\n")
        
        return {
            "success": True,
            "campaign_id": campaign_id,
            "total": len(contacts),
            "successful": successful,
            "failed": failed,
            "results": call_results,
            "message": f"Campaign executed: {successful} calls initiated, {failed} failed"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error executing campaign: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute campaign: {str(e)}"
        )