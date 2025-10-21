# # backend/app/services/call_handler.py pervious call run without appointment 
# """
# Call Handler Service - Manages call lifecycle and conversation flow
# """
# import os
# from datetime import datetime
# from typing import Dict, Optional, List
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from bson import ObjectId

# from .twilio import twilio_service
# from .ai_agent import ai_agent_service


# class CallHandlerService:
#     def __init__(self, db: AsyncIOMotorDatabase):
#         self.db = db
#         self.twilio = twilio_service
#         self.ai_agent = ai_agent_service

#     async def initiate_call(
#         self,
#         user_id: str,
#         to_number: str,
#         from_number: Optional[str] = None,
#         agent_id: Optional[str] = None
#     ) -> Dict:
#         """Initiate a new outbound call with Twilio integration"""
#         try:
#             print(f"CallHandler: Initiating call to {to_number}...")
#             print(f"User ID: {user_id}")
#             print(f"Agent ID: {agent_id}")
            
#             # Make the call via Twilio
#             call_result = self.twilio.make_call(
#                 to_number=to_number,
#                 from_number=from_number
#             )
            
#             print(f"Twilio API response: {call_result}")
            
#             if not call_result["success"]:
#                 print(f"Twilio call failed: {call_result.get('error')}")
#                 return call_result
            
#             # Create call record in database
#             call_data = {
#                 "user_id": user_id,
#                 "direction": "outbound",
#                 "from_number": from_number or self.twilio.phone_number,
#                 "to_number": to_number,
#                 "status": "initiated",
#                 "call_sid": call_result["call_sid"],
#                 "agent_id": agent_id,
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
            
#             result = await self.db.calls.insert_one(call_data)
#             call_id = str(result.inserted_id)
            
#             print(f"Call record created in database: {call_id}")
            
#             # Create conversation record
#             conversation_data = {
#                 "call_id": result.inserted_id,
#                 "agent_id": agent_id,
#                 "messages": [],
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
            
#             conv_result = await self.db.conversations.insert_one(conversation_data)
#             print(f"Conversation record created for call: {call_id}")
            
#             return {
#                 "success": True,
#                 "call_id": call_id,
#                 "call_sid": call_result["call_sid"],
#                 "status": call_result["status"]
#             }
            
#         except Exception as e:
#             print(f"Error initiating call: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def handle_incoming_call(
#         self,
#         call_sid: str,
#         from_number: str,
#         to_number: str
#     ) -> Dict:
#         """Handle incoming call and create/update call record"""
#         try:
#             print(f"Handling incoming call: {call_sid} from {from_number}")
            
#             # Check if call already exists
#             existing_call = await self.db.calls.find_one({"call_sid": call_sid})
            
#             if existing_call:
#                 print(f"Found existing call record: {existing_call['_id']}")
#                 return existing_call
            
#             # Create new call record
#             call_data = {
#                 "direction": "inbound",
#                 "from_number": from_number,
#                 "to_number": to_number,
#                 "status": "initiated",
#                 "call_sid": call_sid,
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
            
#             result = await self.db.calls.insert_one(call_data)
#             call_data["_id"] = result.inserted_id
            
#             # Create conversation record
#             conversation_data = {
#                 "call_id": result.inserted_id,
#                 "messages": [],
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow()
#             }
            
#             await self.db.conversations.insert_one(conversation_data)
            
#             print(f"Created call record: {result.inserted_id}")
            
#             return call_data
            
#         except Exception as e:
#             print(f"Error handling incoming call: {e}")
#             import traceback
#             traceback.print_exc()
#             raise

#     async def get_call_by_id(self, call_id: str) -> Optional[Dict]:
#         """Get call record by MongoDB ID"""
#         try:
#             if not ObjectId.is_valid(call_id):
#                 return None
            
#             call = await self.db.calls.find_one({"_id": ObjectId(call_id)})
#             return call
#         except Exception as e:
#             print(f"Error getting call by ID: {e}")
#             return None

#     async def get_call_by_sid(self, call_sid: str) -> Optional[Dict]:
#         """Get call record by Twilio Call SID"""
#         try:
#             call = await self.db.calls.find_one({"call_sid": call_sid})
#             return call
#         except Exception as e:
#             print(f"Error getting call by SID: {e}")
#             return None

#     async def update_call_status(
#         self,
#         call_sid: str,
#         status: str,
#         duration: Optional[int] = None
#     ) -> bool:
#         """Update call status"""
#         try:
#             print(f"Updating call status:")
#             print(f"   Call SID: {call_sid}")
#             print(f"   New Status: {status}")
#             print(f"   Duration: {duration} seconds" if duration else "   Duration: None seconds")
            
#             update_data = {
#                 "status": status,
#                 "updated_at": datetime.utcnow()
#             }
            
#             if duration is not None:
#                 update_data["duration"] = duration
            
#             if status == "completed":
#                 update_data["ended_at"] = datetime.utcnow()
                
#                 # End conversation
#                 call = await self.get_call_by_sid(call_sid)
#                 if call:
#                     await self.db.conversations.update_one(
#                         {"call_id": call["_id"]},
#                         {
#                             "$set": {
#                                 "ended_at": datetime.utcnow(),
#                                 "updated_at": datetime.utcnow()
#                             }
#                         }
#                     )
#                     print(f"Conversation ended (matched: 1)")
            
#             result = await self.db.calls.update_one(
#                 {"call_sid": call_sid},
#                 {"$set": update_data}
#             )
            
#             print(f"Call status updated (matched: {result.matched_count})")
            
#             return result.matched_count > 0
            
#         except Exception as e:
#             print(f"Error updating call status: {e}")
#             return False

#     async def save_conversation_turn(
#         self,
#         call_id: str,
#         role: str,
#         content: str
#     ) -> bool:
#         """Save a conversation message"""
#         try:
#             message = {
#                 "role": role,
#                 "content": content,
#                 "timestamp": datetime.utcnow()
#             }
            
#             result = await self.db.conversations.update_one(
#                 {"call_id": ObjectId(call_id)},
#                 {
#                     "$push": {"messages": message},
#                     "$set": {"updated_at": datetime.utcnow()}
#                 }
#             )
            
#             print(f"Saved {role} message to conversation")
#             return result.modified_count > 0
            
#         except Exception as e:
#             print(f"Error saving conversation turn: {e}")
#             return False

#     async def get_conversation(self, call_id: str) -> Optional[Dict]:
#         """Get conversation record"""
#         try:
#             if not ObjectId.is_valid(call_id):
#                 return None
            
#             conversation = await self.db.conversations.find_one({
#                 "call_id": ObjectId(call_id)
#             })
            
#             return conversation
            
#         except Exception as e:
#             print(f"Error getting conversation: {e}")
#             return None

#     async def generate_call_log(self, call_sid: str) -> Dict:
#         """Generate comprehensive call log after call completion"""
#         try:
#             print(f"Generating call log for call SID: {call_sid}")
            
#             # Find call by call_sid, not _id
#             call = await self.db.calls.find_one({"call_sid": call_sid})
            
#             if not call:
#                 print(f"Call not found with SID: {call_sid}")
#                 return {
#                     "success": False,
#                     "error": "Call not found"
#                 }
            
#             call_id = str(call["_id"])
#             print(f"Found call record with ID: {call_id}")
            
#             # Get conversation record
#             conversation = await self.db.conversations.find_one({
#                 "call_id": ObjectId(call_id)
#             })
            
#             if not conversation:
#                 print(f"No conversation found for call: {call_id}")
#                 # Create minimal call log
#                 call_log_data = {
#                     "call_id": ObjectId(call_id),
#                     "user_id": call.get("user_id"),
#                     "summary": "Call completed with no conversation recorded",
#                     "outcome": "no_answer",
#                     "sentiment": "neutral",
#                     "key_points": [],
#                     "transcript": "",
#                     "duration": call.get("duration", 0),
#                     "created_at": datetime.utcnow()
#                 }
                
#                 result = await self.db.call_logs.insert_one(call_log_data)
#                 print(f"Call log generated successfully: {str(result.inserted_id)}")
                
#                 return {
#                     "success": True,
#                     "call_log_id": str(result.inserted_id),
#                     "call_log": call_log_data
#                 }
            
#             # Get messages from conversation
#             messages = conversation.get("messages", [])
            
#             if not messages or len(messages) == 0:
#                 print(f"No messages in conversation for call: {call_id}")
#                 # Create minimal call log
#                 call_log_data = {
#                     "call_id": ObjectId(call_id),
#                     "user_id": call.get("user_id"),
#                     "summary": "Call completed with no conversation",
#                     "outcome": "no_answer",
#                     "sentiment": "neutral",
#                     "key_points": [],
#                     "transcript": "",
#                     "duration": call.get("duration", 0),
#                     "created_at": datetime.utcnow()
#                 }
                
#                 result = await self.db.call_logs.insert_one(call_log_data)
#                 print(f"Call log generated successfully: {str(result.inserted_id)}")
                
#                 return {
#                     "success": True,
#                     "call_log_id": str(result.inserted_id),
#                     "call_log": call_log_data
#                 }
            
#             print(f"Analyzing conversation with {len(messages)} messages")
            
#             # Analyze conversation with AI
#             analysis = await self.ai_agent.analyze_call(call_id, messages)
            
#             # Generate transcript
#             transcript = await self.ai_agent.generate_transcript(messages)
            
#             # Create call log
#             call_log_data = {
#                 "call_id": ObjectId(call_id),
#                 "user_id": call.get("user_id"),
#                 "summary": analysis.get("summary", "Call completed"),
#                 "outcome": analysis.get("outcome", "unknown"),
#                 "sentiment": analysis.get("sentiment", "neutral"),
#                 "key_points": analysis.get("key_points", []),
#                 "transcript": transcript,
#                 "duration": call.get("duration", 0),
#                 "created_at": datetime.utcnow()
#             }
            
#             result = await self.db.call_logs.insert_one(call_log_data)
#             call_log_id = str(result.inserted_id)
            
#             print(f"Call log generated successfully: {call_log_id}")
#             print(f"   Summary: {analysis.get('summary', 'N/A')}")
#             print(f"   Outcome: {analysis.get('outcome', 'N/A')}")
#             print(f"   Sentiment: {analysis.get('sentiment', 'N/A')}")
            
#             return {
#                 "success": True,
#                 "call_log_id": call_log_id,
#                 "call_log": call_log_data
#             }
            
#         except Exception as e:
#             print(f"Error generating call log: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def get_call_transcript(self, call_id: str) -> Dict:
#         """Get formatted transcript for a call"""
#         try:
#             conversation = await self.db.conversations.find_one({
#                 "call_id": ObjectId(call_id)
#             })
            
#             if not conversation:
#                 return {
#                     "success": False,
#                     "error": "Conversation not found"
#                 }
            
#             messages = conversation.get("messages", [])
#             transcript_lines = []
            
#             for msg in messages:
#                 role = msg.get("role", "unknown").upper()
#                 content = msg.get("content", "")
#                 timestamp = msg.get("timestamp", datetime.utcnow())
#                 transcript_lines.append({
#                     "timestamp": timestamp.isoformat(),
#                     "role": role,
#                     "content": content
#                 })
            
#             return {
#                 "success": True,
#                 "transcript": transcript_lines,
#                 "message_count": len(messages)
#             }
            
#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#     async def get_call_statistics(self, user_id: str) -> Dict:
#         """Get call statistics for a user"""
#         try:
#             pipeline = [
#                 {"$match": {"user_id": user_id}},
#                 {
#                     "$group": {
#                         "_id": None,
#                         "total_calls": {"$sum": 1},
#                         "completed_calls": {
#                             "$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}
#                         },
#                         "failed_calls": {
#                             "$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}
#                         },
#                         "total_duration": {"$sum": "$duration"},
#                         "avg_duration": {"$avg": "$duration"}
#                     }
#                 }
#             ]
            
#             result = await self.db.calls.aggregate(pipeline).to_list(1)
            
#             if result:
#                 stats = result[0]
#                 return {
#                     "success": True,
#                     "total_calls": stats.get("total_calls", 0),
#                     "completed_calls": stats.get("completed_calls", 0),
#                     "failed_calls": stats.get("failed_calls", 0),
#                     "total_duration": stats.get("total_duration", 0),
#                     "average_duration": stats.get("avg_duration", 0)
#                 }
            
#             return {
#                 "success": True,
#                 "total_calls": 0,
#                 "completed_calls": 0,
#                 "failed_calls": 0,
#                 "total_duration": 0,
#                 "average_duration": 0
#             }
            
#         except Exception as e:
#             print(f"Error getting call statistics: {e}")
#             return {
#                 "success": False,
#                 "error": str(e)
#             }


# def get_call_handler(db: AsyncIOMotorDatabase) -> CallHandlerService:
#     """Factory function to get CallHandlerService instance"""
#     return CallHandlerService(db)



# backend/app/services/call_handler.py - COMPLETE FIXED VERSION
"""
Call Handler Service - Manages call lifecycle and conversation flow
"""
import os
from datetime import datetime
from typing import Dict, Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from .twilio import twilio_service
from .ai_agent import ai_agent_service


class CallHandlerService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.twilio = twilio_service
        self.ai_agent = ai_agent_service

    async def initiate_call(
        self,
        user_id: str,
        to_number: str,
        from_number: Optional[str] = None,
        agent_id: Optional[str] = None
    ) -> Dict:
        """Initiate a new outbound call with Twilio integration"""
        try:
            print(f"CallHandler: Initiating call to {to_number}...")
            print(f"User ID: {user_id}")
            print(f"Agent ID: {agent_id}")
            
            # Make the call via Twilio
            call_result = self.twilio.make_call(
                to_number=to_number,
                from_number=from_number
            )
            
            print(f"Twilio API response: {call_result}")
            
            if not call_result["success"]:
                print(f"Twilio call failed: {call_result.get('error')}")
                return call_result
            
            # Create call record in database
            call_data = {
                "user_id": user_id,
                "direction": "outbound",
                "from_number": from_number or self.twilio.phone_number,
                "to_number": to_number,
                "phone_number": to_number,
                "status": "initiated",
                "call_sid": call_result["call_sid"],
                "agent_id": ObjectId(agent_id) if agent_id else None,
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.db.calls.insert_one(call_data)
            call_id = str(result.inserted_id)
            
            print(f"Call record created in database: {call_id}")
            
            # Create conversation record
            conversation_data = {
                "call_id": result.inserted_id,
                "user_id": user_id,
                "agent_id": ObjectId(agent_id) if agent_id else None,
                "messages": [],
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            conv_result = await self.db.conversations.insert_one(conversation_data)
            print(f"Conversation record created for call: {call_id}")
            
            return {
                "success": True,
                "call_id": call_id,
                "call_sid": call_result["call_sid"],
                "status": call_result["status"]
            }
            
        except Exception as e:
            print(f"Error initiating call: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e)
            }

    async def handle_incoming_call(
        self,
        call_sid: str,
        from_number: str,
        to_number: str
    ) -> Dict:
        """Handle incoming call and create/update call record"""
        try:
            print(f"Handling incoming call: {call_sid} from {from_number}")
            
            # Check if call already exists
            existing_call = await self.db.calls.find_one({"call_sid": call_sid})
            
            if existing_call:
                print(f"Found existing call record: {existing_call['_id']}")
                return existing_call
            
            # Create new call record
            call_data = {
                "direction": "inbound",
                "from_number": from_number,
                "to_number": to_number,
                "phone_number": from_number,
                "status": "initiated",
                "call_sid": call_sid,
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.db.calls.insert_one(call_data)
            call_data["_id"] = result.inserted_id
            
            # Create conversation record
            conversation_data = {
                "call_id": result.inserted_id,
                "messages": [],
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow()
            }
            
            await self.db.conversations.insert_one(conversation_data)
            
            return call_data
            
        except Exception as e:
            print(f"Error handling incoming call: {e}")
            import traceback
            traceback.print_exc()
            return {}

    async def update_call_status(
        self,
        call_sid: str,
        status: str,
        duration: Optional[int] = None
    ) -> bool:
        """Update call status in database"""
        try:
            print(f"Updating call status:")
            print(f"   Call SID: {call_sid}")
            print(f"   New Status: {status}")
            print(f"   Duration: {duration} seconds")
            
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if duration is not None:
                update_data["duration"] = duration
            
            if status == "completed":
                update_data["ended_at"] = datetime.utcnow()
                
                # Also update conversation status
                call = await self.db.calls.find_one({"call_sid": call_sid})
                if call:
                    conv_result = await self.db.conversations.update_one(
                        {"call_id": call["_id"]},
                        {
                            "$set": {
                                "ended_at": datetime.utcnow(),
                                "updated_at": datetime.utcnow()
                            }
                        }
                    )
                    print(f"Conversation ended (matched: {conv_result.matched_count})")
            
            result = await self.db.calls.update_one(
                {"call_sid": call_sid},
                {"$set": update_data}
            )
            
            print(f"Call status updated (matched: {result.matched_count})")
            return result.matched_count > 0
            
        except Exception as e:
            print(f"Error updating call status: {e}")
            return False

    async def add_message_to_conversation(
        self,
        call_id: str,
        role: str,
        content: str
    ) -> bool:
        """Add a message to the conversation"""
        try:
            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow()
            }
            
            result = await self.db.conversations.update_one(
                {"call_id": ObjectId(call_id)},
                {
                    "$push": {"messages": message},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            if result.matched_count > 0:
                print(f"Saved {role} message to conversation")
            
            return result.matched_count > 0
            
        except Exception as e:
            print(f"Error adding message to conversation: {e}")
            return False

    async def save_conversation_turn(
        self,
        call_id: str,
        role: str,
        content: str
    ) -> bool:
        """Save a conversation turn (alias for add_message_to_conversation)"""
        return await self.add_message_to_conversation(call_id, role, content)

    async def get_conversation(self, call_id: str) -> Optional[Dict]:
        """Get conversation for a call"""
        try:
            conversation = await self.db.conversations.find_one({
                "call_id": ObjectId(call_id)
            })
            return conversation
            
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None

    async def get_call_by_sid(self, call_sid: str) -> Optional[Dict]:
        """Get call record by Twilio Call SID"""
        try:
            call = await self.db.calls.find_one({"call_sid": call_sid})
            return call
            
        except Exception as e:
            print(f"Error getting call by SID: {e}")
            return None

    async def generate_call_log(self, call_sid: str) -> Dict:
        """Generate call log after call completion"""
        try:
            print(f"🔄 Starting call log generation for call: {call_sid}")
            
            # Get call record
            call = await self.db.calls.find_one({"call_sid": call_sid})
            
            if not call:
                print(f"❌ Call not found for SID: {call_sid}")
                return {
                    "success": False,
                    "error": "Call not found"
                }
            
            call_id = str(call["_id"])
            print(f"✅ Found call record with ID: {call_id}")
            
            # Get conversation record
            conversation = await self.db.conversations.find_one({
                "call_id": ObjectId(call_id)
            })
            
            if not conversation:
                print(f"⚠️ No conversation found for call: {call_id}")
                # Create minimal call log
                call_log_data = {
                    "call_id": ObjectId(call_id),
                    "call_sid": call_sid,
                    "user_id": call.get("user_id"),
                    "summary": "Call completed with no conversation recorded",
                    "outcome": "no_answer",
                    "sentiment": "neutral",
                    "key_points": [],
                    "transcript": "",
                    "duration": call.get("duration", 0),
                    "created_at": datetime.utcnow()
                }
                
                result = await self.db.call_logs.insert_one(call_log_data)
                print(f"✅ Minimal call log generated: {str(result.inserted_id)}")
                
                return {
                    "success": True,
                    "call_log_id": str(result.inserted_id),
                    "call_log": call_log_data
                }
            
            # Get messages from conversation
            messages = conversation.get("messages", [])
            
            if not messages or len(messages) == 0:
                print(f"⚠️ No messages in conversation for call: {call_id}")
                # Create minimal call log
                call_log_data = {
                    "call_id": ObjectId(call_id),
                    "call_sid": call_sid,
                    "user_id": call.get("user_id"),
                    "summary": "Call completed with no conversation",
                    "outcome": "no_answer",
                    "sentiment": "neutral",
                    "key_points": [],
                    "transcript": "",
                    "duration": call.get("duration", 0),
                    "created_at": datetime.utcnow()
                }
                
                result = await self.db.call_logs.insert_one(call_log_data)
                print(f"✅ Minimal call log generated: {str(result.inserted_id)}")
                
                return {
                    "success": True,
                    "call_log_id": str(result.inserted_id),
                    "call_log": call_log_data
                }
            
            print(f"📝 Analyzing conversation with {len(messages)} messages")
            
            # Analyze conversation with AI
            analysis = await self.ai_agent.analyze_call(call_id, messages)
            
            # Generate transcript
            transcript = await self.ai_agent.generate_transcript(messages)
            
            # Create call log
            call_log_data = {
                "call_id": ObjectId(call_id),
                "call_sid": call_sid,
                "user_id": call.get("user_id"),
                "summary": analysis.get("summary", "Call completed"),
                "outcome": analysis.get("outcome", "unknown"),
                "sentiment": analysis.get("sentiment", "neutral"),
                "key_points": analysis.get("key_points", []),
                "transcript": transcript,
                "duration": call.get("duration", 0),
                "created_at": datetime.utcnow()
            }
            
            result = await self.db.call_logs.insert_one(call_log_data)
            call_log_id = str(result.inserted_id)
            
            print(f"✅ Call log generated successfully: {call_log_id}")
            print(f"   Summary: {analysis.get('summary', 'N/A')}")
            print(f"   Outcome: {analysis.get('outcome', 'N/A')}")
            print(f"   Sentiment: {analysis.get('sentiment', 'N/A')}")
            
            return {
                "success": True,
                "call_log_id": call_log_id,
                "call_log": call_log_data
            }
            
        except Exception as e:
            print(f"❌ Error generating call log: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e)
            }

    async def get_call_transcript(self, call_id: str) -> Dict:
        """Get formatted transcript for a call"""
        try:
            conversation = await self.db.conversations.find_one({
                "call_id": ObjectId(call_id)
            })
            
            if not conversation:
                return {
                    "success": False,
                    "error": "Conversation not found"
                }
            
            messages = conversation.get("messages", [])
            
            if not messages:
                return {
                    "success": True,
                    "transcript": "No conversation recorded"
                }
            
            # Generate transcript
            transcript = await self.ai_agent.generate_transcript(messages)
            
            return {
                "success": True,
                "transcript": transcript
            }
            
        except Exception as e:
            print(f"Error getting call transcript: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def generate_call_summary(self, call_id: str) -> Dict:
        """Generate a summary of the call using AI"""
        try:
            # Get conversation
            conversation = await self.get_conversation(call_id)
            
            if not conversation or not conversation.get("messages"):
                return {
                    "success": False,
                    "error": "No conversation found"
                }
            
            # Generate summary using AI agent
            summary = await self.ai_agent.generate_summary(
                conversation["messages"]
            )
            
            # Extract booking details if applicable
            booking_details = await self.ai_agent.extract_booking_details(
                conversation["messages"]
            )
            
            return {
                "success": True,
                "summary": summary,
                "booking_details": booking_details.get("booking_details") if booking_details.get("success") else None
            }
            
        except Exception as e:
            print(f"Error generating call summary: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def end_call(self, call_sid: str) -> bool:
        """End an active call"""
        try:
            # Update call status
            success = await self.update_call_status(
                call_sid=call_sid,
                status="completed"
            )
            
            # You could also use Twilio API to actually end the call
            # self.twilio.end_call(call_sid)
            
            return success
            
        except Exception as e:
            print(f"Error ending call: {e}")
            return False

    async def get_call_statistics(self, user_id: str) -> Dict:
        """Get call statistics for a user"""
        try:
            # Get all calls for user
            calls = await self.db.calls.find({"user_id": user_id}).to_list(length=None)
            
            if not calls:
                return {
                    "success": True,
                    "total_calls": 0,
                    "completed_calls": 0,
                    "failed_calls": 0,
                    "total_duration": 0,
                    "average_duration": 0
                }
            
            total_calls = len(calls)
            completed_calls = len([c for c in calls if c.get("status") == "completed"])
            failed_calls = len([c for c in calls if c.get("status") == "failed"])
            
            durations = [c.get("duration", 0) for c in calls if c.get("duration")]
            total_duration = sum(durations)
            average_duration = total_duration / len(durations) if durations else 0
            
            return {
                "success": True,
                "total_calls": total_calls,
                "completed_calls": completed_calls,
                "failed_calls": failed_calls,
                "total_duration": total_duration,
                "average_duration": round(average_duration, 2)
            }
            
        except Exception as e:
            print(f"Error getting call statistics: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Helper function to get CallHandlerService instance
def get_call_handler(db: AsyncIOMotorDatabase) -> CallHandlerService:
    """Get CallHandlerService instance"""
    return CallHandlerService(db)