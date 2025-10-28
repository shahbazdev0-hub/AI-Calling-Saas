# # backend/app/services/workflow_engine.py - OPTIMIZED FOR SPEED

# import logging
# from typing import Optional, Dict, Any, List
# from bson import ObjectId
# from app.database import get_database

# logger = logging.getLogger(__name__)


# class WorkflowEngine:
#     """Engine to execute AI Campaign Builder workflows during calls"""
    
#     def __init__(self):
#         """Initialize Workflow Engine"""
#         self.openai_client = None
#         logger.info("✅ Workflow Engine initialized")
    
#     def _initialize_openai(self):
#         """Lazy initialization of OpenAI client for hybrid mode fallback"""
#         if not self.openai_client:
#             try:
#                 from openai import AsyncOpenAI
#                 import os
#                 api_key = os.getenv("OPENAI_API_KEY")
#                 if api_key:
#                     self.openai_client = AsyncOpenAI(api_key=api_key)
#                     logger.info("✅ OpenAI client initialized for hybrid mode")
#                 else:
#                     logger.warning("⚠️ OpenAI API key not found for hybrid mode")
#             except Exception as e:
#                 logger.error(f"❌ Failed to initialize OpenAI for hybrid mode: {e}")
    
#     async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
#         """Fetch workflow from database"""
#         try:
#             if not ObjectId.is_valid(workflow_id):
#                 logger.error(f"❌ Invalid workflow ID: {workflow_id}")
#                 return None
            
#             db = await get_database()
#             workflow = await db.flows.find_one({"_id": ObjectId(workflow_id)})
            
#             if workflow:
#                 logger.info(f"✅ Loaded workflow: {workflow.get('name')} (ID: {workflow_id})")
#             else:
#                 logger.warning(f"⚠️ Workflow not found: {workflow_id}")
            
#             return workflow
            
#         except Exception as e:
#             logger.error(f"❌ Error fetching workflow: {e}")
#             return None
    
#     async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
#         """Find the start node in workflow"""
#         try:
#             nodes = workflow.get("nodes", [])
            
#             # First, look for 'begin' type node
#             for node in nodes:
#                 if node.get("type") == "begin":
#                     logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
#                     return node
            
#             # If no 'begin', look for first 'welcome' node
#             for node in nodes:
#                 if node.get("type") == "welcome":
#                     logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
#                     return node
            
#             # Fallback: return first node
#             if nodes:
#                 logger.warning(f"⚠️ No standard start node found, using first node")
#                 return nodes[0]
            
#             logger.error("❌ No nodes found in workflow")
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error finding start node: {e}")
#             return None
    
#     async def find_next_node(
#         self, 
#         workflow: Dict[str, Any], 
#         current_node_id: str, 
#         user_input: str
#     ) -> Optional[Dict[str, Any]]:
#         """Find the next node based on current node and user input"""
#         try:
#             connections = workflow.get("connections", [])
#             nodes = workflow.get("nodes", [])
            
#             # Find current node
#             current_node = None
#             for node in nodes:
#                 if node.get("id") == current_node_id:
#                     current_node = node
#                     break
            
#             if not current_node:
#                 logger.error(f"❌ Current node not found: {current_node_id}")
#                 return None
            
#             # Get transitions/keywords from current node
#             transitions = current_node.get("data", {}).get("transitions", [])
            
#             # Check if user input matches any transition keyword
#             user_input_lower = user_input.lower()
            
#             for connection in connections:
#                 if connection.get("from") == current_node_id:
#                     transition_keyword = connection.get("transition", "").lower()
                    
#                     # Match keyword in user input
#                     if transition_keyword and transition_keyword in user_input_lower:
#                         # Find target node
#                         target_node_id = connection.get("to")
#                         for node in nodes:
#                             if node.get("id") == target_node_id:
#                                 logger.info(f"✅ Matched keyword '{transition_keyword}' -> Node: {target_node_id}")
#                                 return node
            
#             # No match found - return None to trigger hybrid mode
#             logger.warning(f"⚠️ No keyword match found for input: '{user_input[:50]}'")
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error finding next node: {e}")
#             return None
    
#     async def handle_undefined_input(
#         self,
#         user_input: str,
#         current_node_id: str,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """
#         ⚡ OPTIMIZED: Handle undefined input with GPT-3.5-Turbo (FAST)
#         """
#         try:
#             logger.info(f"🤖 HYBRID MODE: Using OpenAI GPT-3.5-Turbo for undefined input: '{user_input[:50]}'")
            
#             # Initialize OpenAI if needed
#             self._initialize_openai()
            
#             if not self.openai_client:
#                 return {
#                     "success": True,
#                     "response": "I understand your question. Let's continue with what we were discussing. How can I help you with that?",
#                     "node_id": current_node_id,
#                     "is_openai_fallback": True,
#                     "is_end": False
#                 }
            
#             # Get system prompt from agent
#             system_prompt = "You are a helpful AI assistant. Answer the user's question concisely in 2-3 sentences, then guide them back to the main conversation."
            
#             if agent_config and agent_config.get("system_prompt"):
#                 system_prompt = agent_config["system_prompt"]
            
#             # Call OpenAI
#             messages = [
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_input}
#             ]
            
#             # ⚡ OPTIMIZED: Use GPT-3.5-Turbo for SPEED
#             response = await self.openai_client.chat.completions.create(
#                 model="gpt-3.5-turbo",  # ⚡ CHANGED FROM gpt-4
#                 messages=messages,
#                 max_tokens=150,
#                 temperature=0.7,
#                 timeout=5.0  # ⚡ ADDED: Force fast response
#             )
            
#             openai_answer = response.choices[0].message.content.strip()
            
#             # Add guidance back to workflow
#             full_response = f"{openai_answer} Now, let's continue where we left off."
            
#             logger.info(f"✅ OpenAI hybrid response generated (GPT-3.5-Turbo)")
            
#             return {
#                 "success": True,
#                 "response": full_response,
#                 "node_id": current_node_id,
#                 "is_openai_fallback": True,
#                 "is_end": False
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error in hybrid mode OpenAI call: {e}")
            
#             # Fallback response
#             return {
#                 "success": True,
#                 "response": "I understand. Let's continue with your request. What else can I help you with?",
#                 "node_id": current_node_id,
#                 "is_openai_fallback": True,
#                 "is_end": False
#             }
    
#     async def get_node_response(self, node: Dict[str, Any]) -> str:
#         """Get the response text from a node"""
#         try:
#             data = node.get("data", {})
#             message = data.get("message", "")
            
#             if not message:
#                 # Fallback messages based on node type
#                 node_type = node.get("type", "conversation")
#                 if node_type == "welcome":
#                     message = "Hello! How can I help you today?"
#                 elif node_type == "conversation":
#                     message = "I'm here to assist you."
#                 else:
#                     message = "Please continue."
            
#             logger.info(f"✅ Node response: {message[:50]}...")
#             return message
            
#         except Exception as e:
#             logger.error(f"❌ Error getting node response: {e}")
#             return "I'm here to help you."
    
#     async def detect_appointment_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
#         """Detect if workflow has appointment booking nodes and extract rules"""
#         try:
#             nodes = workflow.get("nodes", [])
            
#             appointment_keywords = ["appointment", "booking", "schedule", "book", "reservation", "meeting"]
            
#             for node in nodes:
#                 node_type = node.get("type", "").lower()
#                 node_message = node.get("data", {}).get("message", "").lower()
#                 node_title = node.get("data", {}).get("title", "").lower()
                
#                 # Check if this is an appointment node
#                 if node_type == "appointment" or any(keyword in node_message or keyword in node_title for keyword in appointment_keywords):
#                     logger.info(f"✅ Found appointment node: {node.get('id')}")
                    
#                     # Extract appointment rules from node data
#                     node_data = node.get("data", {})
#                     appointment_rules = {
#                         "node_id": node.get("id"),
#                         "required_fields": node_data.get("required_fields", ["name", "phone", "email", "date", "time"]),
#                         "allowed_times": node_data.get("allowed_times", []),
#                         "service_types": node_data.get("service_types", []),
#                         "special_instructions": node_data.get("message", ""),
#                         "booking_message": node_data.get("booking_message", "")
#                     }
                    
#                     return appointment_rules
            
#             logger.info("ℹ️ No appointment node found in workflow")
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error detecting appointment node: {e}")
#             return None
    
#     async def execute_workflow_step(
#         self,
#         workflow_id: str,
#         user_input: Optional[str] = None,
#         current_node_id: Optional[str] = None,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """Execute one step of workflow with hybrid mode support"""
#         try:
#             # Get workflow
#             workflow = await self.get_workflow(workflow_id)
            
#             if not workflow:
#                 return {
#                     "success": False,
#                     "error": "Workflow not found",
#                     "response": None,
#                     "node_id": None,
#                     "is_end": True
#                 }
            
#             # If no current node, find start node
#             if not current_node_id:
#                 node = await self.find_start_node(workflow)
#                 if not node:
#                     return {
#                         "success": False,
#                         "error": "No start node found",
#                         "response": None,
#                         "node_id": None,
#                         "is_end": True
#                     }
#             else:
#                 # Find next node based on user input
#                 if user_input:
#                     node = await self.find_next_node(workflow, current_node_id, user_input)
                    
#                     if not node:
#                         # HYBRID MODE: No workflow match, use OpenAI
#                         logger.info(f"🔄 Switching to hybrid mode for input: '{user_input[:50]}'")
#                         return await self.handle_undefined_input(
#                             user_input=user_input,
#                             current_node_id=current_node_id,
#                             agent_config=agent_config
#                         )
#                 else:
#                     # Get current node without transition
#                     nodes = workflow.get("nodes", [])
#                     node = None
#                     for n in nodes:
#                         if n.get("id") == current_node_id:
#                             node = n
#                             break
                    
#                     if not node:
#                         return {
#                             "success": False,
#                             "error": "Node not found",
#                             "response": None,
#                             "node_id": None,
#                             "is_end": True
#                         }
            
#             # Get response from node
#             response = await self.get_node_response(node)
            
#             # Check if this is end node (no outgoing connections)
#             connections = workflow.get("connections", [])
#             has_next = any(conn.get("from") == node.get("id") for conn in connections)
            
#             return {
#                 "success": True,
#                 "response": response,
#                 "node_id": node.get("id"),
#                 "node_type": node.get("type"),
#                 "is_end": not has_next,
#                 "is_openai_fallback": False
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error executing workflow step: {e}")
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "response": None,
#                 "node_id": None,
#                 "is_end": True
#             }
    
#     async def should_use_workflow(self, agent_config: Optional[Dict[str, Any]]) -> bool:
#         """Check if agent has a workflow configured"""
#         if not agent_config:
#             return False
        
#         workflow_id = agent_config.get("workflow_id")
        
#         if not workflow_id:
#             return False
        
#         # Verify workflow exists and is active
#         workflow = await self.get_workflow(workflow_id)
        
#         if not workflow:
#             return False
        
#         if not workflow.get("active", True):
#             logger.warning(f"⚠️ Workflow {workflow_id} is inactive")
#             return False
        
#         return True


# # Create singleton instance
# workflow_engine = WorkflowEngine()




# backend/app/services/workflow_engine.py - COMPLETE VERSION WITH FULL APPOINTMENT LOGIC

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from bson import ObjectId
import re

from app.database import get_database
from app.services.google_calendar import google_calendar_service
from app.services.appointment import appointment_service
from app.services.email import email_service

logger = logging.getLogger(__name__)


class WorkflowEngine:
    """
    🎯 Campaign Builder Workflow Engine
    
    FEATURES:
    1. Strict script following - Voice agent speaks exact messages from nodes
    2. Keyword-based navigation - Follows connections based on user input
    3. Automatic data collection - Extracts customer info (name, email, phone, date, time)
    4. Calendar integration - Checks Google Calendar availability in real-time
    5. Smart appointment booking - Books only if slot available, suggests alternatives
    6. Email confirmation - Sends beautiful confirmation emails
    7. Calendar sync - Adds appointment to Google Calendar
    """
    
    def __init__(self):
        self.db = None
    
    # backend/app/services/workflow_engine.py - LINE ~45

async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch workflow from database
    """
    try:
        db = await get_database()
        # ✅ FIXED: Check flows collection, not workflows
        workflow = await db.flows.find_one({"_id": ObjectId(workflow_id)})  # ✅ CHANGED FROM db.workflows
        
        if workflow:
            logger.info(f"✅ Loaded workflow: {workflow.get('name')} (ID: {workflow_id})")
            logger.info(f"📊 Nodes: {len(workflow.get('nodes', []))}, Connections: {len(workflow.get('connections', []))}")
        else:
            logger.warning(f"⚠️ Workflow not found: {workflow_id}")
        
        return workflow
        
    except Exception as e:
        logger.error(f"❌ Error fetching workflow: {e}")
        return None
    
    async def process_conversation_turn(
        self,
        workflow_id: str,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        🎯 MAIN METHOD: Process a conversation turn through workflow
        
        This is where the magic happens:
        1. Gets current position in workflow (which node we're on)
        2. Finds next node based on user input and keywords
        3. Extracts data if it's a question node
        4. Checks calendar and books appointment if it's confirmation node
        5. Returns the exact script message from the node
        
        Args:
            workflow_id: Workflow ID
            user_input: User's spoken message
            call_id: Current call ID
            agent_config: Agent configuration
        
        Returns:
            Response dict with success, response text, node info
        """
        try:
            logger.info(f"🔄 Processing conversation turn for workflow: {workflow_id}")
            logger.info(f"💬 User input: {user_input}")
            
            # Get workflow
            workflow = await self.get_workflow(workflow_id)
            if not workflow:
                return {
                    "success": False,
                    "error": "Workflow not found",
                    "response": "I apologize, but I'm having technical difficulties."
                }
            
            # Get current conversation state
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            current_node_id = None
            collected_data = {}
            
            if conversation:
                messages = conversation.get("messages", [])
                
                # Find last workflow node from metadata
                for msg in reversed(messages):
                    metadata = msg.get("metadata", {})
                    if metadata.get("node_id"):
                        current_node_id = metadata["node_id"]
                        logger.info(f"📍 Current node: {current_node_id}")
                        break
                
                # Extract collected appointment data from conversation
                collected_data = await self._extract_collected_data(messages)
                if collected_data:
                    logger.info(f"💾 Collected data so far: {list(collected_data.keys())}")
            
            # If no current node, start from beginning
            if not current_node_id:
                logger.info(f"🚀 Starting workflow from beginning")
                start_node = await self.find_start_node(workflow)
                if not start_node:
                    return {
                        "success": False,
                        "error": "No start node found",
                        "response": "I apologize, but the workflow is not configured correctly."
                    }
                current_node_id = start_node.get("id")
                logger.info(f"✅ Start node: {current_node_id}")
            
            # Find next node based on user input
            next_node = await self.find_next_node(workflow, current_node_id, user_input)
            
            if not next_node:
                # No matching transition - stay on current node
                logger.warning(f"⚠️ No next node found for input: {user_input}")
                return {
                    "success": True,
                    "response": "I didn't quite understand that. Could you please rephrase?",
                    "node_id": current_node_id,
                    "is_end": False
                }
            
            logger.info(f"➡️ Next node: {next_node.get('id')} (Type: {next_node.get('type')})")
            
            # 🎯 CHECK IF THIS IS A QUESTION NODE (collecting data)
            node_type = next_node.get("type", "")
            if node_type == "question":
                # Detect what field this question is asking for
                field_name = await self._detect_field_from_node(next_node)
                if field_name:
                    collected_data[field_name] = user_input
                    
                    # Update conversation with collected data
                    await db.conversations.update_one(
                        {"_id": conversation["_id"]},
                        {"$set": {f"metadata.appointment_data.{field_name}": user_input}}
                    )
                    logger.info(f"💾 Collected {field_name}: {user_input}")
            
            # 🎯 CHECK IF THIS IS AN APPOINTMENT CONFIRMATION NODE
            is_confirmation = await self._is_appointment_confirmation_node(next_node)
            
            if is_confirmation:
                logger.info(f"📅 Reached appointment confirmation node")
                
                # Handle appointment booking logic
                appointment_result = await self._handle_appointment_booking(
                    collected_data=collected_data,
                    workflow=workflow,
                    call_id=call_id,
                    conversation=conversation
                )
                
                if appointment_result["success"]:
                    # Appointment booked successfully
                    response = appointment_result.get("confirmation_message")
                    logger.info(f"✅ Appointment booked successfully")
                else:
                    # Missing data or booking failed
                    response = appointment_result.get("error_message")
                    logger.warning(f"⚠️ Appointment booking issue: {response}")
            else:
                # 📝 NORMAL NODE: Return the exact script message from workflow
                response = await self._get_node_response(next_node, collected_data)
            
            # Check if this is the end node (no outgoing connections)
            connections = workflow.get("connections", [])
            has_next = any(conn.get("from") == next_node.get("id") for conn in connections)
            
            is_end = not has_next
            if is_end:
                logger.info(f"🏁 Reached end of workflow")
            
            return {
                "success": True,
                "response": response,
                "node_id": next_node.get("id"),
                "node_type": next_node.get("type"),
                "is_end": is_end,
                "collected_data": collected_data
            }
            
        except Exception as e:
            logger.error(f"❌ Error processing conversation: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error": str(e),
                "response": "I apologize, but I encountered an error. Could you please repeat that?"
            }
    
    async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Find the start node (Begin node) of the workflow
        
        Args:
            workflow: Workflow document
        
        Returns:
            Start node or None
        """
        try:
            nodes = workflow.get("nodes", [])
            
            # Priority 1: Look for 'begin' type node
            for node in nodes:
                if node.get("type") == "begin":
                    logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
                    return node
            
            # Priority 2: Look for 'welcome' type node
            for node in nodes:
                if node.get("type") == "welcome":
                    logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
                    return node
            
            # Priority 3: First node in list
            if nodes:
                logger.warning(f"⚠️ No standard start node found, using first node")
                return nodes[0]
            
            logger.error(f"❌ No nodes found in workflow")
            return None
            
        except Exception as e:
            logger.error(f"❌ Error finding start node: {e}")
            return None
    
    async def find_next_node(
        self, 
        workflow: Dict[str, Any], 
        current_node_id: str, 
        user_input: str
    ) -> Optional[Dict[str, Any]]:
        """
        🎯 Find next node based on keyword matching
        
        This is how the workflow follows your script:
        1. Gets all connections going OUT from current node
        2. Checks if user input contains any transition keywords
        3. If keyword match found → follows that connection
        4. If no match → follows first connection (default path)
        
        Args:
            workflow: Workflow document
            current_node_id: Current node ID
            user_input: User's message
        
        Returns:
            Next node or None
        """
        try:
            connections = workflow.get("connections", [])
            nodes = workflow.get("nodes", [])
            
            # Find all outgoing connections from current node
            outgoing_connections = [
                conn for conn in connections 
                if conn.get("from") == current_node_id
            ]
            
            if not outgoing_connections:
                logger.warning(f"⚠️ No outgoing connections from node: {current_node_id}")
                return None
            
            logger.info(f"📊 Found {len(outgoing_connections)} outgoing connections")
            
            # 🎯 KEYWORD MATCHING: Check if user input matches any transition keyword
            user_input_lower = user_input.lower().strip()
            
            for connection in outgoing_connections:
                transition = connection.get("transition", "").lower().strip()
                
                if transition and transition in user_input_lower:
                    # Found matching keyword!
                    target_node_id = connection.get("to")
                    target_node = next((n for n in nodes if n.get("id") == target_node_id), None)
                    
                    if target_node:
                        logger.info(f"✅ Keyword match! '{transition}' → Node: {target_node.get('data', {}).get('title', 'Unknown')}")
                        return target_node
            
            # 🎯 NO KEYWORD MATCH: Take first connection (default path)
            logger.info(f"📍 No keyword match, using default path (first connection)")
            default_connection = outgoing_connections[0]
            target_node_id = default_connection.get("to")
            target_node = next((n for n in nodes if n.get("id") == target_node_id), None)
            
            if target_node:
                logger.info(f"✅ Following default path → Node: {target_node.get('data', {}).get('title', 'Unknown')}")
                return target_node
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error finding next node: {e}")
            return None
    
    async def _get_node_response(
        self, 
        node: Dict[str, Any],
        collected_data: Dict[str, Any] = None
    ) -> str:
        """
        📝 Get the exact response message from workflow node
        
        This ensures voice agent speaks EXACTLY what's in your Campaign Builder
        
        Args:
            node: Current workflow node
            collected_data: Collected customer data for personalization
        
        Returns:
            Message to speak to customer
        """
        try:
            node_data = node.get("data", {})
            node_type = node.get("type", "")
            
            # 🎯 Get message from node (exact script from Campaign Builder)
            message = node_data.get("message", "")
            
            # If no message configured, provide sensible defaults
            if not message:
                if node_type == "welcome":
                    message = "Hello! How can I help you today?"
                elif node_type == "question":
                    message = "Could you please provide more information?"
                elif node_type == "response":
                    message = "Thank you for that information."
                else:
                    message = "How can I assist you further?"
            
            # 🎯 PERSONALIZATION: Replace placeholders with collected data
            if collected_data:
                for key, value in collected_data.items():
                    # Support {name}, {email}, etc. placeholders
                    placeholder = f"{{{key}}}"
                    if placeholder in message:
                        message = message.replace(placeholder, str(value))
                        logger.info(f"✅ Personalized message with {key}")
            
            logger.info(f"📝 Node response ({node_type}): {message[:100]}...")
            return message
            
        except Exception as e:
            logger.error(f"❌ Error getting node response: {e}")
            return "How can I help you?"
    
    async def _extract_collected_data(self, messages: List[Dict]) -> Dict[str, Any]:
        """
        Extract appointment data from conversation history
        
        Uses regex patterns to find:
        - Name (e.g., "My name is John Smith")
        - Email (e.g., "john@example.com")
        - Phone (e.g., "+1-555-123-4567")
        - Date (e.g., "January 15th" or "01/15/2025")
        - Time (e.g., "2pm" or "14:00")
        
        Args:
            messages: Conversation message history
        
        Returns:
            Dict with extracted data
        """
        try:
            collected = {}
            
            # Regex patterns for each field
            patterns = {
                "name": r"(?:name is|i'm|i am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
                "email": r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})",
                "phone": r"(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})",
                "date": r"(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?)",
                "time": r"(\d{1,2}:\d{2}\s*(?:am|pm)?|\d{1,2}\s*(?:am|pm))"
            }
            
            # Search through user messages only
            for msg in messages:
                if msg.get("role") == "user":
                    content = msg.get("content", "")
                    
                    for field, pattern in patterns.items():
                        if field not in collected:
                            match = re.search(pattern, content, re.IGNORECASE)
                            if match:
                                collected[field] = match.group(1).strip()
                                logger.info(f"💾 Extracted {field}: {collected[field]}")
            
            return collected
            
        except Exception as e:
            logger.error(f"❌ Error extracting data: {e}")
            return {}
    
    async def _detect_field_from_node(self, node: Dict[str, Any]) -> Optional[str]:
        """
        Detect what field a question node is asking for
        
        Based on keywords in the question message:
        - "name" → name field
        - "email" → email field
        - "phone" or "number" → phone field
        - "date" or "day" → date field
        - "time" → time field
        
        Args:
            node: Question node
        
        Returns:
            Field name or None
        """
        try:
            message = node.get("data", {}).get("message", "").lower()
            
            # Detect field based on question content
            if any(word in message for word in ["name", "called", "your name"]):
                return "name"
            elif any(word in message for word in ["email", "e-mail", "mail address"]):
                return "email"
            elif any(word in message for word in ["phone", "number", "contact", "telephone"]):
                return "phone"
            elif any(word in message for word in ["date", "day", "when"]):
                return "date"
            elif any(word in message for word in ["time", "what time", "clock"]):
                return "time"
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Error detecting field: {e}")
            return None
    
    async def _is_appointment_confirmation_node(self, node: Dict[str, Any]) -> bool:
        """
        Check if this node is for appointment confirmation
        
        Looks for keywords like:
        - "confirm your appointment"
        - "booking confirmed"
        - "appointment is scheduled"
        - "confirmation email"
        
        Args:
            node: Workflow node
        
        Returns:
            True if confirmation node
        """
        try:
            message = node.get("data", {}).get("message", "").lower()
            node_type = node.get("type", "").lower()
            title = node.get("data", {}).get("title", "").lower()
            
            # Check if message or title contains confirmation keywords
            confirmation_keywords = [
                "confirm your appointment",
                "booking confirmed",
                "appointment is scheduled",
                "appointment confirmed",
                "confirmation email",
                "receive a confirmation",
                "you will receive",
                "successfully scheduled"
            ]
            
            is_confirmation = (
                node_type == "appointment" or
                any(keyword in message for keyword in confirmation_keywords) or
                any(keyword in title for keyword in confirmation_keywords)
            )
            
            if is_confirmation:
                logger.info(f"✅ This is an appointment confirmation node")
            
            return is_confirmation
            
        except Exception as e:
            logger.error(f"❌ Error checking confirmation node: {e}")
            return False
    
    async def _handle_appointment_booking(
        self,
        collected_data: Dict[str, Any],
        workflow: Dict[str, Any],
        call_id: str,
        conversation: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        🎯 APPOINTMENT BOOKING LOGIC
        
        This is where appointments get booked:
        1. Validates all required fields are collected
        2. Parses date and time into proper formats
        3. Checks Google Calendar for availability
        4. Books appointment if slot is available
        5. Sends confirmation email
        6. Adds to Google Calendar
        
        Args:
            collected_data: Customer info collected from conversation
            workflow: Workflow document
            call_id: Current call ID
            conversation: Conversation document
        
        Returns:
            Result dict with success status and messages
        """
        try:
            logger.info(f"📅 Starting appointment booking process for call: {call_id}")
            logger.info(f"💾 Collected data: {list(collected_data.keys())}")
            
            # Required fields for booking
            required_fields = ["name", "email", "phone", "date", "time"]
            missing_fields = [field for field in required_fields if field not in collected_data or not collected_data[field]]
            
            if missing_fields:
                logger.warning(f"⚠️ Missing required fields: {missing_fields}")
                
                # Generate helpful message
                missing_str = ", ".join(missing_fields)
                return {
                    "success": False,
                    "error_message": f"I still need your {missing_str}. Could you provide that information?"
                }
            
            # Parse date and time
            logger.info(f"📅 Parsing date: {collected_data['date']}")
            logger.info(f"🕐 Parsing time: {collected_data['time']}")
            
            appointment_date = self._parse_date(collected_data["date"])
            appointment_time = self._parse_time(collected_data["time"])
            
            if not appointment_date:
                logger.error(f"❌ Could not parse date: {collected_data['date']}")
                return {
                    "success": False,
                    "error_message": "I couldn't understand the date. Could you please provide it in a format like 'January 15th' or '01/15/2025'?"
                }
            
            if not appointment_time:
                logger.error(f"❌ Could not parse time: {collected_data['time']}")
                return {
                    "success": False,
                    "error_message": "I couldn't understand the time. Could you please provide it like '2pm' or '14:00'?"
                }
            
            logger.info(f"✅ Parsed date: {appointment_date.date()}")
            logger.info(f"✅ Parsed time: {appointment_time}")
            
            # 🎯 CHECK GOOGLE CALENDAR AVAILABILITY
            logger.info(f"📆 Checking Google Calendar availability...")
            
            if not google_calendar_service.is_configured():
                logger.warning(f"⚠️ Google Calendar not configured, proceeding without availability check")
            else:
                availability = await google_calendar_service.check_availability(
                    date=appointment_date,
                    duration_minutes=60,
                    working_hours=workflow.get("working_hours")
                )
                
                if not availability.get("success"):
                    logger.error(f"❌ Failed to check calendar availability: {availability.get('error')}")
                    return {
                        "success": False,
                        "error_message": "I'm having trouble checking availability. Please try again in a moment."
                    }
                
                available_slots = availability.get("available_slots", [])
                logger.info(f"📊 Available slots: {len(available_slots)}")
                
                if appointment_time not in available_slots:
                    logger.warning(f"⚠️ Requested time {appointment_time} is not available")
                    
                    # Suggest alternative slots
                    if available_slots:
                        suggested_slots = ", ".join(available_slots[:3])
                        return {
                            "success": False,
                            "error_message": f"Unfortunately, {appointment_time} is not available on {appointment_date.strftime('%B %d')}. How about {suggested_slots}?"
                        }
                    else:
                        return {
                            "success": False,
                            "error_message": f"I'm sorry, but we don't have any available slots on {appointment_date.strftime('%B %d')}. Would you like to try a different date?"
                        }
            
            # 🎯 BOOK APPOINTMENT
            logger.info(f"✅ Time slot is available, proceeding with booking...")
            
            booking_result = await appointment_service.create_appointment(
                customer_name=collected_data["name"],
                customer_email=collected_data["email"],
                customer_phone=collected_data["phone"],
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                service_type=collected_data.get("service_type", "General Consultation"),
                notes=f"Booked via AI Voice Agent - Call ID: {call_id}",
                call_id=call_id,
                workflow_id=str(workflow["_id"])
            )
            
            if not booking_result.get("success"):
                logger.error(f"❌ Failed to book appointment: {booking_result.get('error')}")
                return {
                    "success": False,
                    "error_message": "I encountered an error while booking your appointment. Please try again."
                }
            
            logger.info(f"✅ Appointment booked successfully! ID: {booking_result.get('appointment_id')}")
            
            # 🎯 SEND CONFIRMATION EMAIL
            logger.info(f"📧 Sending confirmation email to {collected_data['email']}...")
            
            email_sent = await email_service.send_appointment_confirmation(
                to_email=collected_data["email"],
                customer_name=collected_data["name"],
                appointment_date=appointment_date.strftime("%B %d, %Y"),
                appointment_time=appointment_time,
                service_type=collected_data.get("service_type", "General Consultation")
            )
            
            if email_sent:
                logger.info(f"✅ Confirmation email sent successfully")
            else:
                logger.warning(f"⚠️ Failed to send confirmation email")
            
            # Build success message
            confirmation_message = (
                f"Perfect! Your appointment is confirmed for {appointment_date.strftime('%B %d')} "
                f"at {appointment_time}. "
            )
            
            if email_sent:
                confirmation_message += f"You'll receive a confirmation email at {collected_data['email']} shortly. "
            
            confirmation_message += "Is there anything else I can help you with?"
            
            logger.info(f"🎉 Appointment booking completed successfully!")
            
            return {
                "success": True,
                "confirmation_message": confirmation_message,
                "appointment_id": booking_result.get("appointment_id"),
                "google_event_id": booking_result.get("google_event_id")
            }
            
        except Exception as e:
            logger.error(f"❌ Error in appointment booking: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "error_message": "I encountered an error while booking your appointment. Please try again."
            }
    
    def _parse_date(self, date_str: str) -> Optional[datetime]:
        """
        Parse date string into datetime object
        
        Supports formats:
        - "January 15" or "January 15th"
        - "01/15/2025"
        - "2025-01-15"
        - "15-01-2025"
        
        Args:
            date_str: Date string from user
        
        Returns:
            datetime object or None
        """
        try:
            # Try using dateutil parser first (handles most formats)
            try:
                from dateutil import parser
                parsed = parser.parse(date_str, fuzzy=True)
                
                # If year not specified, assume current year or next year
                if parsed.year == datetime.now().year and parsed < datetime.now():
                    parsed = parsed.replace(year=datetime.now().year + 1)
                
                return parsed
            except ImportError:
                pass
            
            # Fallback: Try common formats manually
            formats = [
                "%m/%d/%Y",
                "%m-%d-%Y",
                "%Y-%m-%d",
                "%d/%m/%Y",
                "%d-%m-%Y",
                "%B %d, %Y",
                "%B %d",
                "%b %d, %Y",
                "%b %d"
            ]
            
            for fmt in formats:
                try:
                    parsed = datetime.strptime(date_str, fmt)
                    
                    # If no year in format, add current year
                    if "%Y" not in fmt:
                        current_year = datetime.now().year
                        parsed = parsed.replace(year=current_year)
                        
                        # If date is in the past, use next year
                        if parsed < datetime.now():
                            parsed = parsed.replace(year=current_year + 1)
                    
                    return parsed
                except ValueError:
                    continue
            
            logger.error(f"❌ Could not parse date: {date_str}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Error parsing date: {e}")
            return None
    
    def _parse_time(self, time_str: str) -> Optional[str]:
        """
        Parse time string into HH:MM format (24-hour)
        
        Supports formats:
        - "2pm" or "2 pm"
        - "14:00"
        - "2:30 PM"
        - "14:30"
        
        Args:
            time_str: Time string from user
        
        Returns:
            Time in "HH:MM" format or None
        """
        try:
            time_str = time_str.lower().strip()
            
            # Handle 12-hour format with AM/PM
            if "pm" in time_str or "am" in time_str:
                # Extract hour and minute
                hour_match = re.search(r'(\d+)', time_str)
                if not hour_match:
                    return None
                
                hour = int(hour_match.group(1))
                minute = 0
                
                # Check for minutes
                if ":" in time_str:
                    parts = time_str.split(":")
                    minute_match = re.search(r'(\d+)', parts[1])
                    if minute_match:
                        minute = int(minute_match.group(1))
                
                # Convert to 24-hour format
                if "pm" in time_str and hour != 12:
                    hour += 12
                elif "am" in time_str and hour == 12:
                    hour = 0
                
                return f"{hour:02d}:{minute:02d}"
            
            # Handle 24-hour format
            elif ":" in time_str:
                parts = time_str.split(":")
                hour = int(parts[0])
                minute = int(parts[1]) if len(parts) > 1 else 0
                
                if 0 <= hour <= 23 and 0 <= minute <= 59:
                    return f"{hour:02d}:{minute:02d}"
            
            # Handle simple hour number (assume PM for business hours)
            else:
                hour = int(time_str)
                if 1 <= hour <= 12:
                    # Assume PM for afternoon hours
                    if hour < 8:  # Before 8 means PM
                        hour += 12
                    return f"{hour:02d}:00"
            
            logger.error(f"❌ Could not parse time: {time_str}")
            return None
            
        except Exception as e:
            logger.error(f"❌ Error parsing time: {e}")
            return None


# Create singleton instance
workflow_engine = WorkflowEngine()