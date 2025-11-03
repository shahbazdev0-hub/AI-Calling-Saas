# # backend/app/services/call_handler.py - COMPLETE FIXED VERSION workflow 

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
#                 "phone_number": to_number,
#                 "status": "initiated",
#                 "call_sid": call_result["call_sid"],
#                 "agent_id": ObjectId(agent_id) if agent_id else None,
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
#                 "user_id": user_id,
#                 "agent_id": ObjectId(agent_id) if agent_id else None,
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
#                 "phone_number": from_number,
#                 "status": "initiated",
#                 "call_sid": call_sid,
#                 "started_at": datetime.utcnow(),
#                 "created_at": datetime.utcnow(),
#                 "updated_at": datetime.utcnow()
#             }
            
#             result = await self.db.calls.insert_one(call_data)
#             call_data["_id"] = result.inserted_id
            
#             return call_data
            
#         except Exception as e:
#             print(f"Error handling incoming call: {e}")
#             import traceback
#             traceback.print_exc()
#             return {}

#     async def update_call_status(
#         self,
#         call_sid: str,
#         status: str,
#         duration: Optional[int] = None
#     ) -> bool:
#         """Update call status in database"""
#         try:
#             print(f"Updating call status:")
#             print(f"   Call SID: {call_sid}")
#             print(f"   New Status: {status}")
#             print(f"   Duration: {duration} seconds")
            
#             update_data = {
#                 "status": status,
#                 "updated_at": datetime.utcnow()
#             }
            
#             if duration is not None:
#                 update_data["duration"] = duration
            
#             if status == "completed":
#                 update_data["ended_at"] = datetime.utcnow()
                
#                 # Also update conversation status
#                 call = await self.db.calls.find_one({"call_sid": call_sid})
#                 if call:
#                     conv_result = await self.db.conversations.update_one(
#                         {"call_id": call["_id"]},
#                         {
#                             "$set": {
#                                 "ended_at": datetime.utcnow(),
#                                 "updated_at": datetime.utcnow()
#                             }
#                         }
#                     )
#                     print(f"Conversation ended (matched: {conv_result.matched_count})")
            
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
#         """
#         âš ï¸ DEPRECATED: This method should NOT be called from voice.py
#         Messages are saved internally by ai_agent_service
#         This method is kept for backwards compatibility only
#         """
#         # DO NOTHING - ai_agent_service already saves messages
#         print(f"âš ï¸ WARNING: save_conversation_turn called but messages already saved by ai_agent")
#         return True

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


# def get_call_handler(db: AsyncIOMotorDatabase) -> CallHandlerService:
#     """Factory function to create CallHandlerService instance"""
#     return CallHandlerService(db)
# backend/app/services/call_handler.py - COMPLETE FIXED VERSION

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
            
            return call_data
            
        except Exception as e:
            print(f"Error handling incoming call: {e}")
            import traceback
            traceback.print_exc()
            return {}

    async def process_user_input(
        self,
        call_sid: str,
        user_input: str,
        conversation_id: str,
        agent_config: dict
    ) -> str:
        """
        Process user speech input and generate AI response
        
        Args:
            call_sid: Twilio call SID
            user_input: User's speech text
            conversation_id: Conversation ID
            agent_config: Agent configuration with workflow settings
            
        Returns:
            AI-generated response text
        """
        try:
            print(f"🎤 Processing user input: '{user_input}'")
            print(f"📋 Conversation ID: {conversation_id}")
            print(f"🤖 Agent: {agent_config.get('name', 'Unknown')}")
            
            # Get the call record to get call_id
            call_record = await self.db.calls.find_one({"call_sid": call_sid})
            if not call_record:
                return "I apologize, but I'm having trouble accessing call information."

            call_id = str(call_record["_id"])
            
            # ✅ FIXED: Use the existing process_message method that handles both workflow and non-workflow cases
            response = await self.ai_agent.process_message(
                user_input=user_input,
                call_id=call_id,
                agent_config=agent_config
            )
            
            print(f"✅ Generated response: {response[:100]}...")
            return response
            
        except Exception as e:
            print(f"❌ Error processing user input: {e}")
            import traceback
            traceback.print_exc()
            return "I apologize, but I'm having trouble understanding. Could you please rephrase that?"

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

    async def save_conversation_turn(
        self,
        call_id: str,
        role: str,
        content: str
    ) -> bool:
        """
        ⚠️ DEPRECATED: This method should NOT be called from voice.py
        Messages are saved internally by ai_agent_service
        This method is kept for backwards compatibility only
        """
        # DO NOTHING - ai_agent_service already saves messages
        print(f"⚠️ WARNING: save_conversation_turn called but messages already saved by ai_agent")
        return True

    async def get_conversation(self, call_id: str) -> Optional[Dict]:
        """Get conversation record"""
        try:
            if not ObjectId.is_valid(call_id):
                return None
            
            conversation = await self.db.conversations.find_one({
                "call_id": ObjectId(call_id)
            })
            
            return conversation
            
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return None


def get_call_handler(db: AsyncIOMotorDatabase) -> CallHandlerService:
    """Factory function to create CallHandlerService instance"""
    return CallHandlerService(db)