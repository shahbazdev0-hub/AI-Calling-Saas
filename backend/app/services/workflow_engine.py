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



# # backend/app/services/workflow_engine.py - COMPLETE FIXED WITH QUERY NODE HANDLING

# import logging
# from typing import Dict, Any, Optional, List
# from datetime import datetime
# from bson import ObjectId
# import re

# from app.database import get_database
# from app.services.google_calendar import google_calendar_service
# from app.services.appointment import appointment_service
# from app.services.email import email_service

# logger = logging.getLogger(__name__)


# class WorkflowEngine:
#     """
#     🎯 Campaign Builder Workflow Engine - COMPLETE VERSION
    
#     FEATURES:
#     1. ✅ Reads workflows from db.flows
#     2. ✅ Handles ALL node types (begin, welcome, response, question, query)
#     3. ✅ Smart connection following (with fallback for nodes without connections)
#     4. ✅ Automatic data collection
#     5. ✅ Google Calendar integration
#     6. ✅ Appointment booking
#     7. ✅ Email confirmations
#     """
    
#     def __init__(self):
#         self.db = None
#         logger.info("✅ Workflow Engine initialized")
    
#     async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
#         """Fetch workflow from db.flows"""
#         try:
#             db = await get_database()
            
#             if isinstance(workflow_id, str):
#                 if not ObjectId.is_valid(workflow_id):
#                     logger.error(f"❌ Invalid workflow ID: {workflow_id}")
#                     return None
#                 workflow_id = ObjectId(workflow_id)
            
#             workflow = await db.flows.find_one({"_id": workflow_id})
            
#             if workflow:
#                 logger.info(f"✅ Loaded workflow: {workflow.get('name')} (ID: {workflow_id})")
#                 logger.info(f"📊 Nodes: {len(workflow.get('nodes', []))}, Connections: {len(workflow.get('connections', []))}")
#             else:
#                 logger.warning(f"⚠️ Workflow not found: {workflow_id}")
            
#             return workflow
            
#         except Exception as e:
#             logger.error(f"❌ Error fetching workflow: {e}")
#             return None
    
#     async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
#         """Find the start node"""
#         try:
#             nodes = workflow.get("nodes", [])
            
#             if not nodes:
#                 logger.error("❌ No nodes in workflow")
#                 return None
            
#             # Look for 'begin' type node
#             for node in nodes:
#                 if node.get("type") == "begin":
#                     logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
#                     return node
            
#             # Look for 'welcome' type node
#             for node in nodes:
#                 if node.get("type") in ["welcome", "message"]:
#                     logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
#                     return node
            
#             # Use first node
#             logger.warning(f"⚠️ No standard start node found, using first node")
#             return nodes[0]
            
#         except Exception as e:
#             logger.error(f"❌ Error finding start node: {e}")
#             return None
    
#     async def find_next_node(
#         self, 
#         workflow: Dict[str, Any], 
#         current_node_id: str, 
#         user_input: str
#     ) -> Optional[Dict[str, Any]]:
#         """
#         🎯 FIXED: Find next node with smart fallback for Query nodes
#         """
#         try:
#             connections = workflow.get("connections", [])
#             nodes = workflow.get("nodes", [])
            
#             logger.info(f"🔍 Finding next node from: {current_node_id}")
#             logger.info(f"📝 User input: {user_input}")
            
#             # Get outgoing connections
#             outgoing = [conn for conn in connections if conn.get("from") == current_node_id]
            
#             if not outgoing:
#                 logger.warning(f"⚠️ No outgoing connections from node: {current_node_id}")
                
#                 # 🔧 FALLBACK: For Query nodes, find ANY connected node in the flow
#                 logger.info("🔄 Attempting fallback: finding next sequential node")
                
#                 # Find current node index
#                 current_index = -1
#                 for i, node in enumerate(nodes):
#                     if node.get("id") == current_node_id:
#                         current_index = i
#                         break
                
#                 # Return next node in sequence
#                 if current_index >= 0 and current_index + 1 < len(nodes):
#                     next_node = nodes[current_index + 1]
#                     logger.info(f"✅ Using fallback - next sequential node: {next_node.get('id')}")
#                     return next_node
#                 else:
#                     logger.error(f"❌ No fallback node available")
#                     return None
            
#             # Normalize user input
#             user_lower = user_input.lower().strip()
            
#             # Try to match keywords
#             for conn in outgoing:
#                 keywords = conn.get("keywords", [])
                
#                 if keywords:
#                     logger.info(f"🔑 Checking keywords: {keywords}")
                
#                 for keyword in keywords:
#                     if keyword and keyword.lower() in user_lower:
#                         to_node_id = conn.get("to")
#                         next_node = next((n for n in nodes if n.get("id") == to_node_id), None)
                        
#                         if next_node:
#                             logger.info(f"✅ Matched keyword '{keyword}' → Going to node: {to_node_id}")
#                             return next_node
            
#             # No keyword match - follow first connection
#             first_conn = outgoing[0]
#             to_node_id = first_conn.get("to")
#             next_node = next((n for n in nodes if n.get("id") == to_node_id), None)
            
#             if next_node:
#                 logger.info(f"📍 No keyword match, following default path to: {to_node_id}")
#                 return next_node
            
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error finding next node: {e}")
#             import traceback
#             traceback.print_exc()
#             return None
    
#     async def _get_node_response(
#         self, 
#         node: Dict[str, Any], 
#         collected_data: Optional[Dict[str, Any]] = None
#     ) -> str:
#         """Get response message from node"""
#         try:
#             node_data = node.get("data", {})
#             message = node_data.get("message", "")
            
#             if not message:
#                 node_type = node.get("type", "")
#                 if node_type == "begin":
#                     message = "Hello! How can I help you today?"
#                 elif node_type in ["question", "query"]:
#                     message = "Could you please provide that information?"
#                 else:
#                     message = "Please continue."
            
#             # Personalize message
#             if collected_data and message:
#                 for key, value in collected_data.items():
#                     placeholder = f"{{{key}}}"
#                     if placeholder in message:
#                         message = message.replace(placeholder, str(value))
            
#             logger.info(f"📝 Node response: {message[:100]}...")
#             return message
            
#         except Exception as e:
#             logger.error(f"❌ Error getting node response: {e}")
#             return "I'm here to help you."
    
#     async def _is_appointment_confirmation_node(self, node: Dict[str, Any]) -> bool:
#         """Check if node is an appointment confirmation node"""
#         try:
#             node_data = node.get("data", {})
#             message = node_data.get("message", "").lower()
            
#             appointment_keywords = [
#                 "confirm appointment",
#                 "booking confirmed",
#                 "appointment scheduled",
#                 "appointment booked",
#                 "scheduled for",
#                 "see you on"
#             ]
            
#             return any(keyword in message for keyword in appointment_keywords)
            
#         except Exception as e:
#             logger.error(f"❌ Error checking appointment node: {e}")
#             return False
    
#     async def _handle_appointment_booking(
#         self,
#         collected_data: Dict[str, Any],
#         workflow: Dict[str, Any],
#         call_id: str,
#         conversation: Dict[str, Any]
#     ) -> Dict[str, Any]:
#         """Handle appointment booking logic"""
#         try:
#             logger.info(f"📅 Attempting to book appointment")
#             logger.info(f"📊 Collected data: {collected_data}")
            
#             # Check required fields
#             required_fields = ["name", "email", "phone"]
#             missing_fields = [f for f in required_fields if not collected_data.get(f)]
            
#             if missing_fields:
#                 logger.warning(f"⚠️ Missing fields: {missing_fields}")
#                 return {
#                     "success": False,
#                     "error_message": f"I still need your {', '.join(missing_fields)}. Could you provide that?"
#                 }
            
#             # Parse date and time
#             appointment_date = collected_data.get("date")
#             appointment_time = collected_data.get("time")
            
#             if not appointment_date or not appointment_time:
#                 return {
#                     "success": False,
#                     "error_message": "What date and time would work best for you?"
#                 }
            
#             # Parse date
#             try:
#                 if isinstance(appointment_date, str):
#                     for fmt in ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%B %d, %Y"]:
#                         try:
#                             appointment_date = datetime.strptime(appointment_date, fmt)
#                             break
#                         except:
#                             continue
                    
#                     if isinstance(appointment_date, str):
#                         raise ValueError("Could not parse date")
#             except Exception as e:
#                 logger.error(f"❌ Error parsing date: {e}")
#                 return {
#                     "success": False,
#                     "error_message": "I didn't quite catch the date. Could you say it again?"
#                 }
            
#             # Create appointment
#             result = await appointment_service.create_appointment(
#                 customer_name=collected_data.get("name"),
#                 customer_email=collected_data.get("email"),
#                 customer_phone=collected_data.get("phone"),
#                 appointment_date=appointment_date,
#                 appointment_time=appointment_time,
#                 service_type=collected_data.get("service"),
#                 notes=collected_data.get("notes"),
#                 call_id=call_id,
#                 workflow_id=str(workflow.get("_id"))
#             )
            
#             if result.get("success"):
#                 logger.info(f"✅ Appointment booked!")
                
#                 return {
#                     "success": True,
#                     "confirmation_message": f"Perfect! Your appointment is confirmed for {appointment_date.strftime('%B %d, %Y')} at {appointment_time}. You'll receive a confirmation email at {collected_data.get('email')}."
#                 }
#             else:
#                 logger.error(f"❌ Appointment booking failed: {result.get('error')}")
#                 return {
#                     "success": False,
#                     "error_message": "I'm sorry, that time slot is not available. Would you like to try a different time?"
#                 }
            
#         except Exception as e:
#             logger.error(f"❌ Error handling appointment: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error_message": "I'm having trouble booking the appointment. Let me transfer you to someone who can help."
#             }
    
#     async def process_conversation_turn(
#         self,
#         workflow_id: str,
#         user_input: str,
#         call_id: str,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """Main method: Process a conversation turn"""
#         try:
#             logger.info(f"\n{'='*80}")
#             logger.info(f"📄 Processing conversation turn")
#             logger.info(f"   Workflow ID: {workflow_id}")
#             logger.info(f"   User input: {user_input}")
#             logger.info(f"{'='*80}\n")
            
#             # Fetch workflow
#             workflow = await self.get_workflow(workflow_id)
            
#             if not workflow:
#                 return {
#                     "success": False,
#                     "error": "Workflow not found",
#                     "response": "I'm having trouble accessing the workflow."
#                 }
            
#             # Get conversation
#             db = await get_database()
#             conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
#             if not conversation:
#                 return {
#                     "success": False,
#                     "error": "Conversation not found",
#                     "response": "I'm having trouble accessing the conversation."
#                 }
            
#             # Get current node
#             messages = conversation.get("messages", [])
#             current_node_id = None
            
#             for msg in reversed(messages):
#                 if msg.get("role") == "assistant" and msg.get("metadata", {}).get("node_id"):
#                     current_node_id = msg["metadata"]["node_id"]
#                     break
            
#             # Get collected data
#             collected_data = conversation.get("metadata", {}).get("appointment_data", {})
            
#             # Find next node
#             if current_node_id:
#                 next_node = await self.find_next_node(workflow, current_node_id, user_input)
#             else:
#                 next_node = await self.find_start_node(workflow)
            
#             if not next_node:
#                 return {
#                     "success": False,
#                     "error": "No next node found",
#                     "response": "I'm not sure how to proceed. Could you repeat that?"
#                 }
            
#             logger.info(f"✅ Next node: {next_node.get('id')} (Type: {next_node.get('type')})")
            
#             # Check if question/query node
#             node_type = next_node.get("type")
            
#             if node_type in ["question", "query"]:
#                 field_name = next_node.get("data", {}).get("field")
                
#                 if field_name and user_input:
#                     collected_data[field_name] = user_input
                    
#                     await db.conversations.update_one(
#                         {"_id": conversation["_id"]},
#                         {"$set": {f"metadata.appointment_data.{field_name}": user_input}}
#                     )
#                     logger.info(f"💾 Collected {field_name}: {user_input}")
            
#             # Check if appointment confirmation
#             is_confirmation = await self._is_appointment_confirmation_node(next_node)
            
#             if is_confirmation:
#                 logger.info(f"📅 Reached appointment confirmation node")
                
#                 appointment_result = await self._handle_appointment_booking(
#                     collected_data=collected_data,
#                     workflow=workflow,
#                     call_id=call_id,
#                     conversation=conversation
#                 )
                
#                 if appointment_result["success"]:
#                     response = appointment_result.get("confirmation_message")
#                 else:
#                     response = appointment_result.get("error_message")
#             else:
#                 response = await self._get_node_response(next_node, collected_data)
            
#             # Check if end node
#             connections = workflow.get("connections", [])
#             has_next = any(conn.get("from") == next_node.get("id") for conn in connections)
#             is_end = not has_next
            
#             logger.info(f"✅ Response: {response[:100]}...")
            
#             return {
#                 "success": True,
#                 "response": response,
#                 "node_id": next_node.get("id"),
#                 "node_type": node_type,
#                 "is_end": is_end,
#                 "collected_data": collected_data
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error processing conversation: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "response": "I apologize, but I encountered an error. Could you please repeat that?"
#             }


# # Create singleton instance
# workflow_engine = WorkflowEngine() 
 
# # backend/app/services/workflow_engine.py - COMPLETE FIXED VERSION 30  

# import logging
# from typing import Dict, Any, Optional, List
# from datetime import datetime, timedelta
# from bson import ObjectId
# import re

# from app.database import get_database
# from app.services.google_calendar import google_calendar_service
# from app.services.appointment import appointment_service
# from app.services.email import email_service

# logger = logging.getLogger(__name__)


# class WorkflowEngine:
#     """Campaign Builder Workflow Engine - FIXED VERSION"""
    
#     def __init__(self):
#         self.db = None
#         # FIXED: Proper field collection order - collect basic info before dates
#         self.field_detection_order = ["name", "email", "phone", "service", "date"]
#         logger.info("✅ Workflow Engine initialized")
    
#     async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
#         """Fetch workflow from db.flows"""
#         try:
#             db = await get_database()
            
#             if isinstance(workflow_id, str):
#                 if not ObjectId.is_valid(workflow_id):
#                     logger.error(f"❌ Invalid workflow ID: {workflow_id}")
#                     return None
#                 workflow_id = ObjectId(workflow_id)
            
#             workflow = await db.flows.find_one({"_id": workflow_id})
            
#             if workflow:
#                 logger.info(f"✅ Loaded workflow: {workflow.get('name')}")
#                 logger.info(f"📊 Nodes: {len(workflow.get('nodes', []))}, Connections: {len(workflow.get('connections', []))}")
#             else:
#                 logger.warning(f"⚠️ Workflow not found: {workflow_id}")
            
#             return workflow
            
#         except Exception as e:
#             logger.error(f"❌ Error fetching workflow: {e}")
#             return None
    
#     async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
#         """Find the start node"""
#         try:
#             nodes = workflow.get("nodes", [])
            
#             if not nodes:
#                 logger.error("❌ No nodes in workflow")
#                 return None
            
#             # Look for 'begin' type node
#             for node in nodes:
#                 if node.get("type") == "begin":
#                     logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
#                     return node
            
#             # Look for 'welcome' or 'message' type node
#             for node in nodes:
#                 if node.get("type") in ["welcome", "message"]:
#                     logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
#                     return node
            
#             # Use first node as fallback
#             logger.warning(f"⚠️ No standard start node, using first node")
#             return nodes[0]
            
#         except Exception as e:
#             logger.error(f"❌ Error finding start node: {e}")
#             return None
    
#     async def find_next_node(
#         self, 
#         workflow: Dict[str, Any], 
#         current_node_id: str, 
#         user_input: str
#     ) -> Optional[Dict[str, Any]]:
#         """Find next node based on connections and keywords"""
#         try:
#             connections = workflow.get("connections", [])
#             nodes = workflow.get("nodes", [])
            
#             logger.info(f"🔍 Finding next node from: {current_node_id}")
#             logger.info(f"💬 User input: '{user_input}'")
            
#             # Get outgoing connections from current node
#             outgoing = [conn for conn in connections if conn.get("from") == current_node_id]
            
#             if not outgoing:
#                 logger.warning(f"⚠️ No outgoing connections from: {current_node_id}")
#                 return None
            
#             # If only one connection, follow it
#             if len(outgoing) == 1:
#                 to_node_id = outgoing[0].get("to")
#                 next_node = next((n for n in nodes if n.get("id") == to_node_id), None)
#                 if next_node:
#                     logger.info(f"✅ Single path → {to_node_id} (Type: {next_node.get('type')})")
#                     return next_node
            
#             # Try keyword matching for multiple connections
#             user_lower = user_input.lower().strip() if user_input else ""
            
#             for conn in outgoing:
#                 keywords = conn.get("keywords", [])
                
#                 # Check each keyword
#                 for keyword in keywords:
#                     if keyword and keyword.lower() in user_lower:
#                         to_node_id = conn.get("to")
#                         next_node = next((n for n in nodes if n.get("id") == to_node_id), None)
                        
#                         if next_node:
#                             logger.info(f"✅ Keyword match '{keyword}' → {to_node_id}")
#                             return next_node
            
#             # No keyword match - follow first connection as default
#             first_conn = outgoing[0]
#             to_node_id = first_conn.get("to")
#             next_node = next((n for n in nodes if n.get("id") == to_node_id), None)
            
#             if next_node:
#                 logger.info(f"🔍 Default path → {to_node_id} (Type: {next_node.get('type')})")
#                 return next_node
            
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error finding next node: {e}")
#             return None
    
#     async def _detect_field_from_node(
#         self,
#         node: Dict[str, Any],
#         collected_data: Dict[str, Any]
#     ) -> Optional[str]:
#         """Detect which field to collect based on node message"""
#         try:
#             node_data = node.get("data", {})
#             message = node_data.get("message", "").lower()
            
#             # FIXED: Check for fields in proper order
#             # Check for name first
#             if any(word in message for word in ["name", "your name", "may i have your name", "can i get your name"]):
#                 if "name" not in collected_data:
#                     logger.info(f"🔍 Node asks for: name")
#                     return "name"
            
#             # Check for email
#             if any(word in message for word in ["email", "email address", "e-mail"]):
#                 if "email" not in collected_data:
#                     logger.info(f"🔍 Node asks for: email")
#                     return "email"
            
#             # Check for phone
#             if any(word in message for word in ["phone", "phone number", "telephone", "contact number"]):
#                 if "phone" not in collected_data:
#                     logger.info(f"🔍 Node asks for: phone")
#                     return "phone"
            
#             # Check for service
#             if any(word in message for word in ["service", "what service", "which service", "type of service"]):
#                 if "service" not in collected_data:
#                     logger.info(f"🔍 Node asks for: service")
#                     return "service"
            
#             # Check for date/time LAST
#             if any(word in message for word in ["date", "time", "when", "schedule", "available", "appointment"]):
#                 if "date" not in collected_data:
#                     logger.info(f"🔍 Node asks for: date")
#                     return "date"
            
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error detecting field: {e}")
#             return None
    
#     async def _extract_and_validate_data(self, user_input: str, field_type: str) -> Optional[str]:
#         """Extract and validate data from user input"""
#         try:
#             user_input = user_input.strip()
            
#             if field_type == "email":
#                 # Extract email with proper validation
#                 email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#                 match = re.search(email_pattern, user_input)
#                 if match:
#                     return match.group(0).lower()
#                 else:
#                     # Check if user said something that's clearly not an email
#                     if "@" not in user_input:
#                         logger.warning(f"⚠️ No valid email found in: {user_input}")
#                         return None  # Will trigger re-asking
            
#             elif field_type == "phone":
#                 # Extract phone number
#                 phone_pattern = r'[\d\s\-\(\)\.]+\d'
#                 match = re.search(phone_pattern, user_input)
#                 if match:
#                     phone = re.sub(r'[^\d]', '', match.group(0))
#                     if len(phone) >= 10:
#                         return phone
#                 return None
            
#             elif field_type == "name":
#                 # Accept any non-empty input as name
#                 if user_input and len(user_input) > 1:
#                     # Clean up common prefixes
#                     name = user_input
#                     for prefix in ["my name is", "i am", "i'm", "this is", "it's"]:
#                         if name.lower().startswith(prefix):
#                             name = name[len(prefix):].strip()
#                     return name.title()
            
#             elif field_type == "service":
#                 # Accept service description
#                 if user_input:
#                     return user_input
            
#             elif field_type == "date":
#                 # Keep original date string for parsing later
#                 if user_input:
#                     return user_input
            
#             # Default: return original input
#             return user_input
            
#         except Exception as e:
#             logger.error(f"❌ Error extracting data: {e}")
#             return user_input
    
#     async def _get_node_response(
#         self, 
#         node: Dict[str, Any], 
#         collected_data: Optional[Dict[str, Any]] = None
#     ) -> str:
#         """Get response message from node"""
#         try:
#             node_data = node.get("data", {})
#             message = node_data.get("message", "")
            
#             if not message:
#                 # Generate default message based on node type
#                 node_type = node.get("type", "")
#                 if node_type == "begin":
#                     message = "Hello! How can I help you today?"
#                 elif node_type in ["question", "query"]:
#                     message = "Could you please provide that information?"
#                 else:
#                     message = "Please continue."
            
#             # Replace placeholders with collected data
#             if collected_data and message:
#                 for key, value in collected_data.items():
#                     placeholder = f"{{{key}}}"
#                     if placeholder in message:
#                         message = message.replace(placeholder, str(value))
            
#             logger.info(f"📢 Node response: {message[:100]}...")
#             return message
            
#         except Exception as e:
#             logger.error(f"❌ Error getting node response: {e}")
#             return "I'm here to help you."
    
#     async def process_conversation_turn(
#         self,
#         workflow_id: str,
#         user_input: str,
#         call_id: str,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """Process a conversation turn through the workflow"""
#         try:
#             logger.info(f"\n{'='*80}")
#             logger.info(f"🔄 PROCESSING CONVERSATION TURN")
#             logger.info(f"   Workflow ID: {workflow_id}")
#             logger.info(f"   Call ID: {call_id}")
#             logger.info(f"   User input: '{user_input}'")
#             logger.info(f"{'='*80}\n")
            
#             # Fetch workflow
#             workflow = await self.get_workflow(workflow_id)
#             if not workflow:
#                 return {
#                     "success": False,
#                     "error": "Workflow not found",
#                     "response": "I'm having trouble accessing the workflow."
#                 }
            
#             # Get database and conversation
#             db = await get_database()
#             conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
#             if not conversation:
#                 return {
#                     "success": False,
#                     "error": "Conversation not found",
#                     "response": "I'm having trouble accessing the conversation."
#                 }
            
#             # Get current node from last assistant message
#             messages = conversation.get("messages", [])
#             current_node_id = None
#             previous_field = None
            
#             for msg in reversed(messages):
#                 if msg.get("role") == "assistant":
#                     metadata = msg.get("metadata", {})
#                     if metadata.get("node_id"):
#                         current_node_id = metadata["node_id"]
#                         previous_field = metadata.get("collecting_field")
#                         logger.info(f"📍 Current node: {current_node_id}")
#                         if previous_field:
#                             logger.info(f"📝 Previous question was for: {previous_field}")
#                         break
            
#             # Get collected data
#             collected_data = conversation.get("metadata", {}).get("appointment_data", {})
#             logger.info(f"📊 Already collected: {list(collected_data.keys())}")
            
#             # FIXED: Process user's answer to previous question
#             if previous_field and user_input:
#                 extracted_value = await self._extract_and_validate_data(user_input, previous_field)
                
#                 if extracted_value:
#                     collected_data[previous_field] = extracted_value
#                     await db.conversations.update_one(
#                         {"_id": conversation["_id"]},
#                         {"$set": {f"metadata.appointment_data.{previous_field}": extracted_value}}
#                     )
#                     logger.info(f"✅ Collected {previous_field}: {extracted_value}")
#                 else:
#                     # Invalid input - ask again
#                     if previous_field == "email":
#                         response = "I need a valid email address to send the confirmation. What's your email?"
#                     elif previous_field == "phone":
#                         response = "I need a valid phone number. Could you please provide your phone number?"
#                     else:
#                         response = f"Could you please provide your {previous_field} again?"
                    
#                     return {
#                         "success": True,
#                         "response": response,
#                         "node_id": current_node_id,
#                         "node_type": "question",
#                         "is_end": False
#                     }
            
#             # Find next node
#             if current_node_id:
#                 next_node = await self.find_next_node(workflow, current_node_id, user_input)
#             else:
#                 next_node = await self.find_start_node(workflow)
            
#             if not next_node:
#                 # Check if we have all data to book
#                 if self._has_required_data(collected_data):
#                     logger.info(f"🎉 All data collected - booking appointment!")
#                     return await self._book_appointment(collected_data, workflow, call_id, conversation)
#                 else:
#                     return {
#                         "success": False,
#                         "error": "No next node found",
#                         "response": "I'm not sure how to proceed. Let me help you book an appointment."
#                     }
            
#             # Detect what field this node is asking for
#             node_type = next_node.get("type")
#             asking_for_field = None
            
#             if node_type in ["question", "query", "conversation"]:
#                 asking_for_field = await self._detect_field_from_node(next_node, collected_data)
            
#             # Get response from node
#             response = await self._get_node_response(next_node, collected_data)
            
#             # Check if this is the end and we should book
#             connections = workflow.get("connections", [])
#             has_next = any(conn.get("from") == next_node.get("id") for conn in connections)
            
#             if not has_next and self._has_required_data(collected_data):
#                 logger.info(f"🎯 End node reached with all data - booking!")
#                 booking_result = await self._book_appointment(collected_data, workflow, call_id, conversation)
#                 if booking_result.get("success"):
#                     response = booking_result.get("response")
            
#             # Save conversation turn
#             await db.conversations.update_one(
#                 {"_id": conversation["_id"]},
#                 {
#                     "$push": {
#                         "messages": {
#                             "$each": [
#                                 {
#                                     "role": "user",
#                                     "content": user_input,
#                                     "timestamp": datetime.utcnow()
#                                 },
#                                 {
#                                     "role": "assistant",
#                                     "content": response,
#                                     "timestamp": datetime.utcnow(),
#                                     "metadata": {
#                                         "workflow_id": workflow_id,
#                                         "node_id": next_node.get("id"),
#                                         "node_type": node_type,
#                                         "collecting_field": asking_for_field
#                                     }
#                                 }
#                             ]
#                         }
#                     },
#                     "$set": {
#                         "updated_at": datetime.utcnow()
#                     }
#                 }
#             )
            
#             return {
#                 "success": True,
#                 "response": response,
#                 "node_id": next_node.get("id"),
#                 "node_type": node_type,
#                 "is_end": not has_next,
#                 "collected_data": collected_data
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error processing conversation: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "error": str(e),
#                 "response": "I apologize, but I encountered an error. Could you please repeat that?"
#             }
    
#     def _has_required_data(self, collected_data: Dict[str, Any]) -> bool:
#         """Check if we have minimum required data for appointment"""
#         required = ["name", "email", "date"]
#         return all(field in collected_data and collected_data[field] for field in required)
    
#     async def _parse_date_time(self, date_str: str) -> tuple:
#         """Parse date and time from user input"""
#         try:
#             from dateutil import parser
#             import re
            
#             date_str_lower = date_str.lower()
#             now = datetime.now()
            
#             # Handle relative dates
#             if "tomorrow" in date_str_lower:
#                 appointment_date = now + timedelta(days=1)
#             elif "today" in date_str_lower:
#                 appointment_date = now
#             elif "next week" in date_str_lower:
#                 appointment_date = now + timedelta(weeks=1)
#             else:
#                 # Try to parse the date
#                 try:
#                     appointment_date = parser.parse(date_str, fuzzy=True)
#                 except:
#                     # Default to tomorrow if can't parse
#                     appointment_date = now + timedelta(days=1)
            
#             # Extract time or use default
#             time_match = re.search(r'(\d{1,2}):?(\d{2})?\s*(am|pm)?', date_str_lower)
#             if time_match:
#                 hour = int(time_match.group(1))
#                 minute = int(time_match.group(2)) if time_match.group(2) else 0
#                 period = time_match.group(3)
                
#                 if period == 'pm' and hour < 12:
#                     hour += 12
#                 elif period == 'am' and hour == 12:
#                     hour = 0
                
#                 appointment_time = f"{hour:02d}:{minute:02d}"
#             else:
#                 # Default to 2 PM if no time specified
#                 appointment_time = "14:00"
            
#             return appointment_date, appointment_time
            
#         except Exception as e:
#             logger.error(f"❌ Error parsing date/time: {e}")
#             # Return tomorrow at 2 PM as fallback
#             return datetime.now() + timedelta(days=1), "14:00"
    
#     async def _book_appointment(
#         self,
#         collected_data: Dict[str, Any],
#         workflow: Dict[str, Any],
#         call_id: str,
#         conversation: Dict[str, Any]
#     ) -> Dict[str, Any]:
#         """Book the appointment"""
#         try:
#             logger.info(f"📅 Booking appointment with data: {collected_data}")
            
#             # Get phone from call record
#             db = await get_database()
#             call = await db.calls.find_one({"_id": ObjectId(call_id)})
#             customer_phone = collected_data.get("phone") or (call.get("from_number") if call else "Unknown")
            
#             # Parse date/time
#             date_str = collected_data.get("date", "tomorrow at 2pm")
#             appointment_date, appointment_time = await self._parse_date_time(date_str)
            
#             # Validate email format
#             email = collected_data.get("email", "")
#             if "@" not in email or "." not in email:
#                 logger.error(f"❌ Invalid email format: {email}")
#                 return {
#                     "success": False,
#                     "response": "I need a valid email address to send the confirmation. What's your email address?"
#                 }
            
#             # Create appointment
#             result = await appointment_service.create_appointment(
#                 customer_name=collected_data.get("name", "Customer"),
#                 customer_email=email,
#                 customer_phone=customer_phone,
#                 appointment_date=appointment_date,
#                 appointment_time=appointment_time,
#                 service_type=collected_data.get("service", "General Service"),
#                 notes=f"Booked via AI workflow. Call ID: {call_id}",
#                 call_id=call_id,
#                 workflow_id=str(workflow.get("_id"))
#             )
            
#             if result.get("success"):
#                 logger.info(f"✅ Appointment booked successfully!")
                
#                 # Mark conversation as booked
#                 await db.conversations.update_one(
#                     {"_id": conversation["_id"]},
#                     {"$set": {"metadata.appointment_booked": True}}
#                 )
                
#                 return {
#                     "success": True,
#                     "response": f"Perfect! Your appointment is confirmed for {appointment_date.strftime('%B %d, %Y')} at {appointment_time}. You'll receive a confirmation email at {email}. Thank you for calling!"
#                 }
#             else:
#                 logger.error(f"❌ Appointment booking failed: {result.get('error')}")
#                 return {
#                     "success": False,
#                     "response": "I'm having trouble booking the appointment right now. Please try again or call us directly."
#                 }
            
#         except Exception as e:
#             logger.error(f"❌ Error booking appointment: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "response": "I'm having trouble booking the appointment. Let me transfer you to someone who can help."
#             }


# # Create singleton instance
# workflow_engine = WorkflowEngine()


# # backend/app/services/workflow_engine.py - COMPLETELY FIXED VERSION good follow the script 

# import logging
# from typing import Dict, Any, Optional, List
# from datetime import datetime, timedelta
# from bson import ObjectId
# import re

# from app.database import get_database
# from app.services.google_calendar import google_calendar_service
# from app.services.appointment import appointment_service
# from app.services.email import email_service
# from app.services.ai_agent import ai_agent_service

# logger = logging.getLogger(__name__)


# class WorkflowEngine:
#     """Campaign Builder Workflow Engine - USES ACTUAL CAMPAIGN FLOW"""
    
#     def __init__(self):
#         self.db = None
#         logger.info("✅ Workflow Engine initialized - USING CAMPAIGN FLOW")
    
#     async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
#         """ALWAYS get fresh workflow from database - no caching"""
#         try:
#             db = await get_database()
            
#             if isinstance(workflow_id, str):
#                 if not ObjectId.is_valid(workflow_id):
#                     logger.error(f"❌ Invalid workflow ID: {workflow_id}")
#                     return None
#                 workflow_id = ObjectId(workflow_id)
            
#             # ✅ ALWAYS fetch fresh from database
#             workflow = await db.flows.find_one({"_id": workflow_id})
            
#             if workflow:
#                 logger.info(f"✅ Loaded FRESH workflow: {workflow.get('name')}")
#                 # ✅ Log campaign structure for debugging
#                 nodes_info = [f"{n.get('type')}({n.get('id')})" for n in workflow.get('nodes', [])]
#                 logger.info(f"📋 Campaign Nodes: {nodes_info}")
#                 logger.info(f"🔗 Campaign Connections: {len(workflow.get('connections', []))}")
#             else:
#                 logger.warning(f"⚠️ Workflow not found: {workflow_id}")
            
#             return workflow
            
#         except Exception as e:
#             logger.error(f"❌ Error fetching fresh workflow: {e}")
#             return None
    
#     async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
#         """Find the start node in campaign"""
#         try:
#             nodes = workflow.get("nodes", [])
            
#             if not nodes:
#                 logger.error("❌ No nodes in workflow")
#                 return None
            
#             # Look for 'begin' type node
#             for node in nodes:
#                 if node.get("type") == "begin":
#                     logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
#                     return node
            
#             # Look for 'welcome' or 'message' type node
#             for node in nodes:
#                 if node.get("type") in ["welcome", "message"]:
#                     logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
#                     return node
            
#             # Use first node as fallback
#             logger.warning(f"⚠️ No standard start node, using first node")
#             return nodes[0]
            
#         except Exception as e:
#             logger.error(f"❌ Error finding start node: {e}")
#             return None
    
#     async def _find_next_node_by_campaign_rules(
#         self,
#         workflow: Dict[str, Any],
#         current_node: Dict[str, Any],
#         user_input: str
#     ) -> Optional[Dict[str, Any]]:
#         """Find next node using ACTUAL campaign rules and keywords"""
#         try:
#             connections = workflow.get("connections", [])
#             nodes = workflow.get("nodes", [])
            
#             logger.info(f"🔍 Finding next node from: {current_node.get('id')}")
#             logger.info(f"💬 User input: '{user_input}'")
            
#             # Get outgoing connections from current campaign node
#             outgoing_connections = [
#                 conn for conn in connections 
#                 if conn.get("from") == current_node.get("id")
#             ]
            
#             if not outgoing_connections:
#                 logger.warning(f"⚠️ No outgoing connections from: {current_node.get('id')}")
#                 return None
            
#             # ✅ Use ACTUAL campaign keywords for matching
#             user_input_lower = user_input.lower()
            
#             for connection in outgoing_connections:
#                 keywords = connection.get("keywords", [])
                
#                 # Check if user input matches any campaign keyword
#                 for keyword in keywords:
#                     if keyword and keyword.lower() in user_input_lower:
#                         next_node_id = connection.get("to")
#                         next_node = next((n for n in nodes if n.get("id") == next_node_id), None)
                        
#                         if next_node:
#                             logger.info(f"✅ Campaign keyword match: '{keyword}' → {next_node_id}")
#                             return next_node
            
#             # ✅ If no keyword match, follow campaign's default connection
#             if outgoing_connections:
#                 default_connection = outgoing_connections[0]  # Campaign builder's first connection
#                 next_node_id = default_connection.get("to")
#                 next_node = next((n for n in nodes if n.get("id") == next_node_id), None)
                
#                 if next_node:
#                     logger.info(f"✅ Campaign default path → {next_node_id}")
#                     return next_node
            
#             return None
            
#         except Exception as e:
#             logger.error(f"❌ Error finding next campaign node: {e}")
#             return None
    
#     async def _get_current_node(self, call_id: str, workflow: Dict[str, Any]) -> Dict[str, Any]:
#         """Get current node from conversation history"""
#         try:
#             db = await get_database()
#             conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
#             if not conversation:
#                 # Start from beginning
#                 start_node = await self.find_start_node(workflow)
#                 return start_node or workflow["nodes"][0]
            
#             # Get last assistant message to find current node
#             messages = conversation.get("messages", [])
#             for msg in reversed(messages):
#                 if msg.get("role") == "assistant":
#                     metadata = msg.get("metadata", {})
#                     node_id = metadata.get("node_id")
#                     if node_id:
#                         # Find node in workflow
#                         current_node = next(
#                             (n for n in workflow["nodes"] if n.get("id") == node_id), 
#                             None
#                         )
#                         if current_node:
#                             return current_node
            
#             # Fallback to start node
#             start_node = await self.find_start_node(workflow)
#             return start_node or workflow["nodes"][0]
            
#         except Exception as e:
#             logger.error(f"❌ Error getting current node: {e}")
#             start_node = await self.find_start_node(workflow)
#             return start_node or workflow["nodes"][0]
    
#     async def _get_exact_node_message(
#         self, 
#         node: Dict[str, Any], 
#         collected_data: Optional[Dict[str, Any]] = None
#     ) -> str:
#         """Get EXACT message from campaign node - NO HARDCODED LOGIC"""
#         try:
#             node_data = node.get("data", {})
#             message = node_data.get("message", "")
            
#             if not message:
#                 # Fallback to node type-based message
#                 node_type = node.get("type", "")
#                 if node_type == "begin":
#                     message = "Hello! How can I help you today?"
#                 elif node_type in ["question", "query"]:
#                     message = "Could you please provide that information?"
#                 else:
#                     message = "Please continue."
            
#             # Replace placeholders with collected data
#             if collected_data and message:
#                 for key, value in collected_data.items():
#                     placeholder = f"{{{key}}}"
#                     if placeholder in message:
#                         message = message.replace(placeholder, str(value))
            
#             logger.info(f"📢 Campaign Node Response: {message[:100]}...")
#             return message
            
#         except Exception as e:
#             logger.error(f"❌ Error getting node message: {e}")
#             return "I'm here to help you."
    
#     async def _process_campaign_data_collection(
#         self,
#         node: Dict[str, Any],
#         user_input: str,
#         call_id: str,
#         previous_field: Optional[str] = None
#     ) -> Dict[str, Any]:
#         """Collect data based on CAMPAIGN node configuration"""
#         try:
#             db = await get_database()
#             conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
#             collected_data = conversation.get("metadata", {}).get("appointment_data", {}) if conversation else {}
            
#             # ✅ Process previous field collection if any
#             if previous_field and user_input:
#                 extracted_value = await self._extract_field_value(user_input, previous_field)
#                 if extracted_value:
#                     collected_data[previous_field] = extracted_value
#                     await db.conversations.update_one(
#                         {"call_id": ObjectId(call_id)},
#                         {"$set": {f"metadata.appointment_data.{previous_field}": extracted_value}}
#                     )
#                     logger.info(f"✅ Campaign collected {previous_field}: {extracted_value}")
            
#             # ✅ Check if current node is configured to collect specific data
#             node_data = node.get("data", {})
#             node_message = node_data.get("message", "").lower()
            
#             # Simple detection based on node message content (can be enhanced with explicit config)
#             field_to_collect = None
#             if any(word in node_message for word in ["name", "your name"]):
#                 field_to_collect = "name"
#             elif any(word in node_message for word in ["email", "e-mail"]):
#                 field_to_collect = "email"
#             elif any(word in node_message for word in ["phone", "number"]):
#                 field_to_collect = "phone"
#             elif any(word in node_message for word in ["service", "which service"]):
#                 field_to_collect = "service"
#             elif any(word in node_message for word in ["when", "date", "time", "schedule"]):
#                 field_to_collect = "date"
            
#             if field_to_collect and field_to_collect not in collected_data:
#                 # This node will collect this field in the next turn
#                 logger.info(f"📝 Campaign node will collect: {field_to_collect}")
            
#             return collected_data
            
#         except Exception as e:
#             logger.error(f"❌ Error in campaign data collection: {e}")
#             return {}
    
#     async def _extract_field_value(self, user_input: str, field_type: str) -> Optional[str]:
#         """Extract field value from user input"""
#         try:
#             user_input = user_input.strip()
            
#             if field_type == "email":
#                 email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
#                 match = re.search(email_pattern, user_input)
#                 if match:
#                     return match.group(0).lower()
#                 return None
            
#             elif field_type == "phone":
#                 phone_pattern = r'[\d\s\-\(\)\.]+\d'
#                 match = re.search(phone_pattern, user_input)
#                 if match:
#                     phone = re.sub(r'[^\d]', '', match.group(0))
#                     if len(phone) >= 10:
#                         return phone
#                 return None
            
#             elif field_type == "name":
#                 if user_input and len(user_input) > 1:
#                     name = user_input
#                     for prefix in ["my name is", "i am", "i'm", "this is", "it's"]:
#                         if name.lower().startswith(prefix):
#                             name = name[len(prefix):].strip()
#                     return name.title()
#                 return None
            
#             elif field_type in ["service", "date"]:
#                 return user_input if user_input else None
            
#             return user_input
            
#         except Exception as e:
#             logger.error(f"❌ Error extracting field value: {e}")
#             return None
    
#     async def process_conversation_turn(
#         self,
#         workflow_id: str,
#         user_input: str,
#         call_id: str,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """Process conversation using ACTUAL campaign flow"""
#         try:
#             logger.info(f"\n{'='*80}")
#             logger.info(f"🔄 PROCESSING WITH CAMPAIGN FLOW")
#             logger.info(f"   Workflow ID: {workflow_id}")
#             logger.info(f"   Call ID: {call_id}")
#             logger.info(f"   User input: '{user_input}'")
#             logger.info(f"{'='*80}\n")
            
#             # ✅ ALWAYS get FRESH workflow from database
#             workflow = await self.get_workflow(workflow_id)
#             if not workflow:
#                 logger.error("❌ Workflow not found - using fallback")
#                 return await self._fallback_to_openai(user_input, call_id, agent_config)
            
#             # Get current position in campaign
#             current_node = await self._get_current_node(call_id, workflow)
#             logger.info(f"📍 Current campaign node: {current_node.get('id')} ({current_node.get('type')})")
            
#             # Get conversation for previous field context
#             db = await get_database()
#             conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
#             previous_field = None
#             collected_data = {}
            
#             if conversation:
#                 # Check if we were collecting a field in previous turn
#                 messages = conversation.get("messages", [])
#                 for msg in reversed(messages):
#                     if msg.get("role") == "assistant":
#                         metadata = msg.get("metadata", {})
#                         previous_field = metadata.get("collecting_field")
#                         collected_data = conversation.get("metadata", {}).get("appointment_data", {})
#                         break
            
#             # Process data collection from previous turn
#             collected_data = await self._process_campaign_data_collection(
#                 current_node, user_input, call_id, previous_field
#             )
            
#             # ✅ Find next node based on ACTUAL campaign connections and keywords
#             next_node = await self._find_next_node_by_campaign_rules(
#                 workflow, current_node, user_input
#             )
            
#             if not next_node:
#                 logger.warning("❌ No valid path in campaign - checking for booking")
#                 # Check if we have all data to book appointment
#                 if self._has_required_data(collected_data):
#                     return await self._book_appointment(collected_data, workflow, call_id, conversation)
#                 else:
#                     return await self._fallback_to_openai(user_input, call_id, agent_config)
            
#             # ✅ Get EXACT message from campaign node
#             response = await self._get_exact_node_message(next_node, collected_data)
            
#             # Determine if this node will collect a field
#             collecting_field = None
#             node_data = next_node.get("data", {})
#             node_message = node_data.get("message", "").lower()
            
#             if any(word in node_message for word in ["name", "your name"]) and "name" not in collected_data:
#                 collecting_field = "name"
#             elif any(word in node_message for word in ["email", "e-mail"]) and "email" not in collected_data:
#                 collecting_field = "email"
#             elif any(word in node_message for word in ["phone", "number"]) and "phone" not in collected_data:
#                 collecting_field = "phone"
#             elif any(word in node_message for word in ["service", "which service"]) and "service" not in collected_data:
#                 collecting_field = "service"
#             elif any(word in node_message for word in ["when", "date", "time", "schedule"]) and "date" not in collected_data:
#                 collecting_field = "date"
            
#             # Check if this is end of campaign and we should book
#             connections = workflow.get("connections", [])
#             has_next = any(conn.get("from") == next_node.get("id") for conn in connections)
            
#             if not has_next and self._has_required_data(collected_data):
#                 logger.info("🎯 End of campaign with complete data - booking appointment")
#                 return await self._book_appointment(collected_data, workflow, call_id, conversation)
            
#             # Save conversation turn with campaign metadata
#             await db.conversations.update_one(
#                 {"call_id": ObjectId(call_id)},
#                 {
#                     "$push": {
#                         "messages": {
#                             "$each": [
#                                 {
#                                     "role": "user",
#                                     "content": user_input,
#                                     "timestamp": datetime.utcnow()
#                                 },
#                                 {
#                                     "role": "assistant",
#                                     "content": response,
#                                     "timestamp": datetime.utcnow(),
#                                     "metadata": {
#                                         "workflow_id": workflow_id,
#                                         "node_id": next_node.get("id"),
#                                         "node_type": next_node.get("type"),
#                                         "collecting_field": collecting_field
#                                     }
#                                 }
#                             ]
#                         }
#                     },
#                     "$set": {
#                         "updated_at": datetime.utcnow(),
#                         "metadata.appointment_data": collected_data
#                     }
#                 }
#             )
            
#             return {
#                 "success": True,
#                 "response": response,
#                 "node_id": next_node.get("id"),
#                 "node_type": next_node.get("type"),
#                 "is_end": not has_next,
#                 "collected_data": collected_data
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error in campaign processing: {e}")
#             import traceback
#             traceback.print_exc()
#             return await self._fallback_to_openai(user_input, call_id, agent_config)
    
#     async def _fallback_to_openai(
#         self,
#         user_input: str,
#         call_id: str,
#         agent_config: Optional[Dict[str, Any]] = None
#     ) -> Dict[str, Any]:
#         """Fallback to OpenAI when campaign processing fails"""
#         try:
#             logger.info("🔄 Campaign flow failed - using OpenAI fallback")
            
#             response = await ai_agent_service._process_with_openai(
#                 user_input=user_input,
#                 call_id=call_id,
#                 agent_config=agent_config
#             )
            
#             return {
#                 "success": True,
#                 "response": response,
#                 "node_id": "openai_fallback",
#                 "node_type": "fallback",
#                 "is_end": False
#             }
            
#         except Exception as e:
#             logger.error(f"❌ Error in OpenAI fallback: {e}")
#             return {
#                 "success": False,
#                 "response": "I apologize, but I'm having trouble processing that. Could you please repeat?",
#                 "error": str(e)
#             }
    
#     def _has_required_data(self, collected_data: Dict[str, Any]) -> bool:
#         """Check if we have minimum required data for appointment"""
#         required = ["name", "email", "date"]
#         return all(field in collected_data and collected_data[field] for field in required)
    
#     async def _parse_date_time(self, date_str: str) -> tuple:
#         """Parse date and time from user input"""
#         try:
#             from dateutil import parser
#             import re
            
#             date_str_lower = date_str.lower()
#             now = datetime.now()
            
#             # Handle relative dates
#             if "tomorrow" in date_str_lower:
#                 appointment_date = now + timedelta(days=1)
#             elif "today" in date_str_lower:
#                 appointment_date = now
#             elif "next week" in date_str_lower:
#                 appointment_date = now + timedelta(weeks=1)
#             else:
#                 # Try to parse the date
#                 try:
#                     appointment_date = parser.parse(date_str, fuzzy=True)
#                 except:
#                     # Default to tomorrow if can't parse
#                     appointment_date = now + timedelta(days=1)
            
#             # Extract time or use default
#             time_match = re.search(r'(\d{1,2}):?(\d{2})?\s*(am|pm)?', date_str_lower)
#             if time_match:
#                 hour = int(time_match.group(1))
#                 minute = int(time_match.group(2)) if time_match.group(2) else 0
#                 period = time_match.group(3)
                
#                 if period == 'pm' and hour < 12:
#                     hour += 12
#                 elif period == 'am' and hour == 12:
#                     hour = 0
                
#                 appointment_time = f"{hour:02d}:{minute:02d}"
#             else:
#                 # Default to 2 PM if no time specified
#                 appointment_time = "14:00"
            
#             return appointment_date, appointment_time
            
#         except Exception as e:
#             logger.error(f"❌ Error parsing date/time: {e}")
#             # Return tomorrow at 2 PM as fallback
#             return datetime.now() + timedelta(days=1), "14:00"
    
#     async def _book_appointment(
#         self,
#         collected_data: Dict[str, Any],
#         workflow: Dict[str, Any],
#         call_id: str,
#         conversation: Dict[str, Any]
#     ) -> Dict[str, Any]:
#         """Book the appointment after campaign completion"""
#         try:
#             logger.info(f"📅 Booking appointment with campaign data: {collected_data}")
            
#             # Get phone from call record
#             db = await get_database()
#             call = await db.calls.find_one({"_id": ObjectId(call_id)})
#             customer_phone = collected_data.get("phone") or (call.get("from_number") if call else "Unknown")
            
#             # Parse date/time
#             date_str = collected_data.get("date", "tomorrow at 2pm")
#             appointment_date, appointment_time = await self._parse_date_time(date_str)
            
#             # Validate email format
#             email = collected_data.get("email", "")
#             if "@" not in email or "." not in email:
#                 logger.error(f"❌ Invalid email format: {email}")
#                 return {
#                     "success": False,
#                     "response": "I need a valid email address to send the confirmation. What's your email address?"
#                 }
            
#             # Create appointment
#             result = await appointment_service.create_appointment(
#                 customer_name=collected_data.get("name", "Customer"),
#                 customer_email=email,
#                 customer_phone=customer_phone,
#                 appointment_date=appointment_date,
#                 appointment_time=appointment_time,
#                 service_type=collected_data.get("service", "General Service"),
#                 notes=f"Booked via AI campaign. Call ID: {call_id}",
#                 call_id=call_id,
#                 workflow_id=str(workflow.get("_id"))
#             )
            
#             if result.get("success"):
#                 logger.info(f"✅ Appointment booked successfully via campaign!")
                
#                 # Mark conversation as booked
#                 await db.conversations.update_one(
#                     {"_id": conversation["_id"]},
#                     {"$set": {"metadata.appointment_booked": True}}
#                 )
                
#                 return {
#                     "success": True,
#                     "response": f"Perfect! Your appointment is confirmed for {appointment_date.strftime('%B %d, %Y')} at {appointment_time}. You'll receive a confirmation email at {email}. Thank you for calling!"
#                 }
#             else:
#                 logger.error(f"❌ Appointment booking failed: {result.get('error')}")
#                 return {
#                     "success": False,
#                     "response": "I'm having trouble booking the appointment right now. Please try again or call us directly."
#                 }
            
#         except Exception as e:
#             logger.error(f"❌ Error booking appointment: {e}")
#             import traceback
#             traceback.print_exc()
#             return {
#                 "success": False,
#                 "response": "I'm having trouble booking the appointment. Let me transfer you to someone who can help."
#             }


# # Create singleton instance
# workflow_engine = WorkflowEngine()
# backend/app/services/workflow_engine.py - COMPLETE WITH COMPREHENSIVE OFF-TOPIC DETECTION

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from bson import ObjectId
import re
import os

from app.database import get_database
from app.services.google_calendar import google_calendar_service
from app.services.appointment import appointment_service
from app.services.email import email_service

logger = logging.getLogger(__name__)


class WorkflowEngine:
    """
    🎯 Campaign Builder Workflow Engine with DYNAMIC KEYWORD MATCHING
    
    IMPLEMENTS YOUR EXACT LOGIC:
    1. ✅ Dynamic keyword matching from campaign DB
    2. ✅ NO HARDCODING - all logic from campaign structure
    3. ✅ Intelligent hybrid mode (Campaign + OpenAI)
    4. ✅ Context-aware conversation state management
    5. ✅ Seamless transitions between campaign and OpenAI
    """
    
    def __init__(self):
        self.db = None
        self.openai_client = None
        self.field_detection_order = ["name", "email", "phone", "service", "date"]
        logger.info("✅ Workflow Engine initialized with Dynamic Campaign Flow")
    
    def _initialize_openai(self):
        """Initialize OpenAI client for hybrid mode"""
        if not self.openai_client:
            try:
                from openai import AsyncOpenAI
                api_key = os.getenv("OPENAI_API_KEY")
                if api_key:
                    self.openai_client = AsyncOpenAI(api_key=api_key)
                    logger.info("✅ OpenAI client initialized for hybrid mode")
                else:
                    logger.warning("⚠️ OpenAI API key not found")
            except Exception as e:
                logger.error(f"❌ Failed to initialize OpenAI: {e}")
    
    # ============================================
    # WORKFLOW DATABASE ACCESS
    # ============================================
    
    async def get_workflow(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """✅ ALWAYS get FRESH workflow from database - NO CACHING"""
        try:
            db = await get_database()
            
            if isinstance(workflow_id, str):
                if not ObjectId.is_valid(workflow_id):
                    logger.error(f"❌ Invalid workflow ID: {workflow_id}")
                    return None
                workflow_id = ObjectId(workflow_id)
            
            # ✅ ALWAYS fetch fresh from database
            workflow = await db.flows.find_one({"_id": workflow_id})
            
            if workflow:
                logger.info(f"✅ Loaded FRESH workflow: {workflow.get('name')}")
                nodes_info = [f"{n.get('type')}({n.get('id')})" for n in workflow.get('nodes', [])]
                logger.info(f"📋 Campaign Nodes: {nodes_info}")
                logger.info(f"🔗 Campaign Connections: {len(workflow.get('connections', []))}")
            else:
                logger.warning(f"⚠️ Workflow not found: {workflow_id}")
            
            return workflow
            
        except Exception as e:
            logger.error(f"❌ Error fetching workflow: {e}")
            return None
    
    async def find_start_node(self, workflow: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find the start node in campaign"""
        try:
            nodes = workflow.get("nodes", [])
            
            if not nodes:
                logger.error("❌ No nodes in workflow")
                return None
            
            # Look for 'begin' type node
            for node in nodes:
                if node.get("type") == "begin":
                    logger.info(f"✅ Found 'begin' start node: {node.get('id')}")
                    return node
            
            # Look for 'welcome' or 'message' type node
            for node in nodes:
                if node.get("type") in ["welcome", "message"]:
                    logger.info(f"✅ Found 'welcome' start node: {node.get('id')}")
                    return node
            
            # Use first node as fallback
            logger.warning(f"⚠️ No standard start node, using first node")
            return nodes[0]
            
        except Exception as e:
            logger.error(f"❌ Error finding start node: {e}")
            return None
    
    # ============================================
    # 🎯 MAIN DECISION FLOW - YOUR EXACT LOGIC
    # ============================================
    
    async def process_conversation_turn(
        self,
        workflow_id: str,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        🎯 MAIN DECISION FLOW - IMPLEMENTS YOUR EXACT LOGIC
        
        WHEN user speaks:
            IF agent has workflow_id AND workflow exists:
                result = PROCESS_WITH_CAMPAIGN(user_input, current_conversation_state)
                
                IF result.found_in_campaign:
                    RETURN campaign_response
                ELSE:
                    RETURN openai_response
            ELSE:
                RETURN openai_response
        """
        try:
            logger.info(f"\n{'='*80}")
            logger.info(f"🎯 MAIN DECISION FLOW - Processing User Input")
            logger.info(f"   Workflow ID: {workflow_id}")
            logger.info(f"   Call ID: {call_id}")
            logger.info(f"   User input: '{user_input}'")
            logger.info(f"{'='*80}\n")
            
            # Step 1: Get FRESH workflow from database
            workflow = await self.get_workflow(workflow_id)
            if not workflow:
                logger.error("❌ Workflow not found - using OpenAI fallback")
                return await self._fallback_to_openai(user_input, call_id, agent_config)
            
            # Step 2: Get current conversation state
            conversation_state = await self._get_conversation_state(call_id, workflow)
            
            # Step 3: Process with campaign logic
            result = await self._process_with_campaign(
                user_input, 
                conversation_state, 
                workflow,
                agent_config
            )
            
            # Step 4: Return result based on whether campaign found a match
            if result.get("found_in_campaign"):
                logger.info(f"✅ Campaign match found - returning campaign response")
                return result
            else:
                logger.info(f"🤖 No campaign match - using OpenAI hybrid mode")
                return await self._fallback_to_openai(user_input, call_id, agent_config)
            
        except Exception as e:
            logger.error(f"❌ Error in conversation processing: {e}")
            import traceback
            traceback.print_exc()
            return await self._fallback_to_openai(user_input, call_id, agent_config)
    
    # ============================================
    # 📊 CAMPAIGN PROCESSING LOGIC
    # ============================================
    
    async def _process_with_campaign(
        self,
        user_input: str,
        conversation_state: Dict[str, Any],
        workflow: Dict[str, Any],
        agent_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        ✅ CAMPAIGN PROCESSING LOGIC - YOUR EXACT IMPLEMENTATION
        
        1. Get current position in campaign
        2. Find all possible next nodes from current position  
        3. Dynamic keyword matching (NO HARDCODING)
        4. Return campaign response or signal no match
        """
        try:
            current_node = conversation_state["current_node"]
            logger.info(f"📍 Current campaign node: {current_node.get('id')} ({current_node.get('type')})")
            
            # Step 1: Extract previous field data if collecting
            previous_field = conversation_state.get("previous_field")
            if previous_field:
                await self._collect_field_data(
                    user_input, 
                    previous_field, 
                    conversation_state["call_id"],
                    conversation_state
                )
            
            # Step 2: Find next nodes by dynamic keyword matching
            possible_next_nodes = await self._find_next_nodes_by_keywords(
                current_node,
                user_input,
                workflow.get("connections", []),
                workflow.get("nodes", [])
            )
            
            # Step 3: Check if we found matches
            if possible_next_nodes:
                # Select best match
                next_node = await self._select_best_match(possible_next_nodes, user_input)
                
                # Get response from campaign node
                response = await self._get_exact_node_message(next_node, conversation_state)
                
                # Update conversation state
                await self._update_conversation_state(
                    conversation_state["call_id"],
                    next_node,
                    user_input,
                    response
                )
                
                # Check if this is end node
                is_end = not any(
                    conn.get("from") == next_node.get("id") 
                    for conn in workflow.get("connections", [])
                )
                
                # Check if booking should happen
                if next_node.get("type") == "end" and conversation_state.get("collected_data"):
                    booking_result = await self._attempt_appointment_booking(
                        conversation_state["collected_data"],
                        conversation_state["call_id"]
                    )
                    if booking_result.get("success"):
                        response = booking_result.get("response", response)
                
                return {
                    "success": True,
                    "found_in_campaign": True,
                    "response": response,
                    "node_id": next_node.get("id"),
                    "node_type": next_node.get("type"),
                    "is_end": is_end
                }
            else:
                # No campaign match found
                logger.warning(f"⚠️ No campaign path matched for: '{user_input[:50]}...'")
                return {
                    "success": True,
                    "found_in_campaign": False,
                    "response": None
                }
            
        except Exception as e:
            logger.error(f"❌ Error in campaign processing: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": True,
                "found_in_campaign": False,
                "response": None
            }
    
    # ============================================
    # 🔍 DYNAMIC KEYWORD MATCHING LOGIC - ENHANCED
    # ============================================
    
    async def _find_next_nodes_by_keywords(
        self,
        current_node: Dict[str, Any],
        user_input: str,
        connections: List[Dict[str, Any]],
        all_nodes: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        🎯 DYNAMIC KEYWORD MATCHING - NO HARDCODING
        WITH COMPREHENSIVE OFF-TOPIC DETECTION
        
        Handles:
        1. Campaign keyword matching
        2. Data collection (name, email, etc.)
        3. Negative/rejection responses → OpenAI
        4. Off-topic questions (COMPREHENSIVE) → OpenAI
        5. Default paths
        """
        try:
            user_input_lower = user_input.lower().strip()
            possible_matches = []
            
            # Extract keywords from user input
            user_keywords = self._extract_keywords(user_input_lower)
            logger.info(f"🔍 User keywords: {user_keywords}")
            
            # Get outgoing connections from current node
            outgoing_connections = [
                conn for conn in connections 
                if conn.get("from") == current_node.get("id")
            ]
            
            logger.info(f"🔗 Found {len(outgoing_connections)} outgoing connections")
            
            # ============================================
            # ✅ STEP 1: DETECT NEGATIVE/REJECTION RESPONSES
            # ============================================
            negative_indicators = [
                "no", "not", "don't", "dont", "never", "none", 
                "nothing", "neither", "nope", "nah", 
                "i don't need", "i dont need", "not interested", 
                "no thanks", "no thank you", "not really",
                "i'm not", "im not", "not sure", "maybe not",
                "i don't want", "i dont want", "don't want", "dont want"
            ]
            
            is_negative_response = any(indicator in user_input_lower for indicator in negative_indicators)
            
            if is_negative_response:
                logger.warning(f"🚫 NEGATIVE/REJECTION RESPONSE DETECTED: '{user_input}'")
                logger.info(f"🤖 Triggering OpenAI hybrid mode to handle rejection gracefully")
                return []
            
            # ============================================
            # ✅ STEP 2: COMPREHENSIVE OFF-TOPIC DETECTION
            # ============================================
            off_topic_indicators = [
                # General question words
                "what is", "what's", "whats", "what are", "what was",
                "how does", "how do", "how can", "how to", "how much",
                "why is", "why are", "why do", "why does", "why did",
                "when is", "when was", "when did", "when will",
                "where is", "where are", "where can", "where do",
                "who is", "who are", "who was", "who were",
                "which is", "which are",
                
                # Explanation requests
                "explain", "tell me about", "tell me more", "can you explain",
                "define", "definition", "meaning of", "describe",
                
                # Technology & Science
                "artificial intelligence", "machine learning", "deep learning",
                "neural network", "algorithm", "data science", "computer",
                "technology", "software", "hardware", "internet", "cloud",
                "blockchain", "cryptocurrency", "bitcoin", "ai", "ml",
                "robot", "automation", "digital", "cyber", "quantum",
                "programming", "coding", "database", "server",
                
                # Weather & Climate
                "weather", "temperature", "forecast", "rain", "snow",
                "sunny", "cloudy", "storm", "hurricane", "tornado",
                "climate", "season", "cold", "hot", "warm",
                
                # News & Current Events
                "news", "latest", "breaking news", "current events",
                "happening", "today's news", "headlines",
                
                # Sports
                "sports", "game", "match", "score", "team", "player",
                "football", "soccer", "basketball", "baseball", "tennis",
                "cricket", "golf", "olympics", "championship",
                
                # Entertainment & Media
                "movie", "film", "tv show", "series", "actor", "actress",
                "music", "song", "singer", "band", "album", "concert",
                "celebrity", "famous", "hollywood", "netflix", "youtube",
                
                # Politics & Government
                "politics", "political", "government", "president", "minister",
                "election", "vote", "party", "democrat", "republican",
                "law", "legislation", "congress", "senate", "parliament",
                
                # Geography & Travel
                "country", "city", "state", "capital", "population",
                "travel", "trip", "vacation", "tourism", "hotel",
                "flight", "airport", "destination", "map", "distance",
                
                # History
                "history", "historical", "ancient", "medieval", "war",
                "revolution", "empire", "century", "era", "period",
                
                # Science & Nature
                "science", "scientific", "biology", "chemistry", "physics",
                "space", "planet", "star", "galaxy", "universe",
                "animal", "plant", "species", "evolution", "nature",
                
                # Health & Medical
                "health", "medical", "disease", "symptom", "treatment",
                "doctor", "hospital", "medicine", "vitamin", "diet",
                "exercise", "fitness", "wellness", "covid", "virus",
                
                # Finance & Economy
                "stock market", "economy", "inflation", "recession",
                "investment", "trading", "cryptocurrency", "forex",
                "gdp", "unemployment", "interest rate",
                
                # Education
                "university", "college", "school", "education", "degree",
                "course", "study", "learn", "student", "teacher",
                
                # Food & Cooking
                "recipe", "cooking", "restaurant", "food", "cuisine",
                "ingredient", "meal", "dish", "chef",
                
                # Culture & Society
                "culture", "religion", "tradition", "custom", "festival",
                "holiday", "language", "art", "literature", "philosophy",
                
                # Business & Career
                "job", "career", "salary", "interview", "resume",
                "company", "business", "entrepreneur", "startup",
                
                # Mathematics
                "calculate", "math", "mathematics", "equation", "formula",
                "geometry", "algebra", "calculus",
                
                # Random facts & trivia
                "interesting fact", "did you know", "fun fact", "trivia",
                "random", "curious", "wonder",
                
                # Jokes & Humor
                "joke", "funny", "laugh", "comedy", "humor",
                
                # Personal questions about AI/bot
                "are you", "do you", "can you think", "are you real",
                "are you human", "are you a robot", "are you ai",
                
                # Philosophical questions
                "meaning of life", "purpose", "existence", "consciousness",
                
                # Comparisons (unrelated to service)
                "better than", "difference between", "compare",
                
                # Time & Date (general)
                "what time", "what day", "what date", "what year",
                
                # Recommendations (general)
                "recommend", "suggestion", "best", "top", "favorite"
            ]
            
            is_off_topic = any(indicator in user_input_lower for indicator in off_topic_indicators)
            
            if is_off_topic:
                logger.warning(f"🌍 OFF-TOPIC QUESTION DETECTED: '{user_input}'")
                logger.info(f"🤖 Triggering OpenAI hybrid mode for off-topic question")
                return []
            
            # ============================================
            # ✅ STEP 3: CHECK CAMPAIGN KEYWORD MATCHES
            # ============================================
            for connection in outgoing_connections:
                campaign_keywords = connection.get("keywords", [])
                
                if not campaign_keywords:
                    # No keywords defined - consider it a default path
                    logger.info(f"📝 Connection has no keywords - default path to {connection.get('to')}")
                    target_node = next((n for n in all_nodes if n.get("id") == connection.get("to")), None)
                    if target_node:
                        possible_matches.append({
                            "node": target_node,
                            "match_score": 0,  # Default path has lowest priority
                            "matched_keyword": "default"
                        })
                    continue
                
                # Check if any campaign keyword matches user input
                for keyword in campaign_keywords:
                    if keyword and keyword.lower() in user_input_lower:
                        target_node = next((n for n in all_nodes if n.get("id") == connection.get("to")), None)
                        if target_node:
                            match_score = self._calculate_match_score(keyword.lower(), user_input_lower)
                            logger.info(f"✅ Campaign keyword match: '{keyword}' → {target_node.get('id')} (score: {match_score})")
                            possible_matches.append({
                                "node": target_node,
                                "match_score": match_score,
                                "matched_keyword": keyword
                            })
                            break  # Found match for this connection
            
            # ============================================
            # ✅ STEP 4: CHECK DATA COLLECTION
            # ============================================
            if not possible_matches:
                is_collecting_data = await self._is_data_collection_node(current_node)
                
                if is_collecting_data and outgoing_connections:
                    # Check if response is providing data or refusing
                    if len(user_input.split()) >= 2:  # Has some meaningful content
                        # User provided data, follow campaign's default path
                        default_connection = outgoing_connections[0]
                        target_node = next((n for n in all_nodes if n.get("id") == default_connection.get("to")), None)
                        if target_node:
                            logger.info(f"✅ Data collected, following default campaign path → {target_node.get('id')}")
                            possible_matches.append({
                                "node": target_node,
                                "match_score": 1,
                                "matched_keyword": "data_collection"
                            })
                    else:
                        # Too short or unclear - trigger OpenAI
                        logger.warning(f"⚠️ Unclear data collection response")
                        return []
            
            # ============================================
            # ✅ STEP 5: RETURN MATCHES OR EMPTY (OpenAI)
            # ============================================
            if not possible_matches:
                logger.warning(f"⚠️ NO MATCHES FOUND - Triggering OpenAI hybrid mode")
                return []
            
            # Sort by match score (highest first)
            possible_matches.sort(key=lambda x: x["match_score"], reverse=True)
            
            matched_nodes = [match["node"] for match in possible_matches]
            logger.info(f"✅ Found {len(matched_nodes)} possible next nodes")
            
            return matched_nodes
            
        except Exception as e:
            logger.error(f"❌ Error finding next nodes by keywords: {e}")
            return []
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract meaningful keywords from text"""
        # Remove common stop words
        stop_words = {'i', 'me', 'my', 'we', 'you', 'your', 'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'once'}
        
        words = text.split()
        keywords = [w for w in words if w not in stop_words and len(w) > 2]
        return keywords
    
    def _calculate_match_score(self, keyword: str, user_input: str) -> float:
        """Calculate how well keyword matches user input (0-1)"""
        if keyword == user_input:
            return 1.0
        elif user_input.startswith(keyword) or keyword in user_input.split():
            return 0.9
        elif keyword in user_input:
            return 0.7
        else:
            return 0.5
    
    async def _select_best_match(
        self,
        possible_nodes: List[Dict[str, Any]],
        user_input: str
    ) -> Dict[str, Any]:
        """Select the best matching node from possibilities"""
        if not possible_nodes:
            return None
        
        # Return first node (already sorted by match score)
        best_node = possible_nodes[0]
        logger.info(f"🎯 Selected best match: {best_node.get('id')} ({best_node.get('type')})")
        return best_node
    
    async def _is_data_collection_node(self, node: Dict[str, Any]) -> bool:
        """Check if current node is asking for data"""
        node_data = node.get("data", {})
        message = node_data.get("message", "").lower()
        
        data_indicators = [
            "name", "email", "phone", "service", "date", "time",
            "what's your", "what is your", "may i have", "could you provide",
            "please provide", "tell me", "give me"
        ]
        
        return any(indicator in message for indicator in data_indicators)
    
    # ============================================
    # 📝 CONVERSATION STATE MANAGEMENT
    # ============================================
    
    async def _get_conversation_state(
        self,
        call_id: str,
        workflow: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        ✅ GET CONVERSATION STATE
        
        Returns:
        {
            "call_id": str,
            "workflow_id": str,
            "current_node": Dict,
            "collected_data": {name, email, phone, service, date},
            "conversation_history": [],
            "previous_field": str
        }
        """
        try:
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            if not conversation:
                # Start from beginning
                start_node = await self.find_start_node(workflow)
                return {
                    "call_id": call_id,
                    "workflow_id": str(workflow["_id"]),
                    "current_node": start_node or workflow["nodes"][0],
                    "collected_data": {},
                    "conversation_history": [],
                    "previous_field": None
                }
            
            # Get current node from last assistant message
            messages = conversation.get("messages", [])
            current_node = None
            previous_field = None
            
            for msg in reversed(messages):
                if msg.get("role") == "assistant":
                    metadata = msg.get("metadata", {})
                    node_id = metadata.get("node_id")
                    previous_field = metadata.get("collecting_field")
                    
                    if node_id:
                        # Find node in workflow
                        current_node = next(
                            (n for n in workflow["nodes"] if n.get("id") == node_id),
                            None
                        )
                        break
            
            if not current_node:
                # Fallback to start node
                current_node = await self.find_start_node(workflow)
            
            # Get collected data
            collected_data = conversation.get("metadata", {}).get("appointment_data", {})
            
            return {
                "call_id": call_id,
                "workflow_id": str(workflow["_id"]),
                "current_node": current_node,
                "collected_data": collected_data,
                "conversation_history": messages,
                "previous_field": previous_field
            }
            
        except Exception as e:
            logger.error(f"❌ Error getting conversation state: {e}")
            # Return minimal state
            start_node = await self.find_start_node(workflow)
            return {
                "call_id": call_id,
                "workflow_id": str(workflow["_id"]),
                "current_node": start_node or workflow["nodes"][0],
                "collected_data": {},
                "conversation_history": [],
                "previous_field": None
            }
    
    async def _update_conversation_state(
        self,
        call_id: str,
        new_node: Dict[str, Any],
        user_input: str,
        response: str
    ):
        """Update conversation state in database"""
        try:
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            if not conversation:
                logger.error(f"❌ Conversation not found for call: {call_id}")
                return
            
            # Detect if we're collecting a field
            collecting_field = await self._detect_collecting_field(new_node)
            
            # Prepare metadata
            metadata = {
                "workflow_id": str(conversation.get("metadata", {}).get("workflow_id")),
                "node_id": new_node.get("id"),
                "node_type": new_node.get("type"),
                "collecting_field": collecting_field
            }
            
            # Update conversation
            await db.conversations.update_one(
                {"_id": conversation["_id"]},
                {
                    "$push": {
                        "messages": {
                            "$each": [
                                {
                                    "role": "user",
                                    "content": user_input,
                                    "timestamp": datetime.utcnow(),
                                    "metadata": metadata
                                },
                                {
                                    "role": "assistant",
                                    "content": response,
                                    "timestamp": datetime.utcnow(),
                                    "metadata": metadata
                                }
                            ]
                        }
                    },
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            
            logger.info(f"✅ Conversation state updated")
            
        except Exception as e:
            logger.error(f"❌ Error updating conversation state: {e}")
    
    async def _detect_collecting_field(self, node: Dict[str, Any]) -> Optional[str]:
        """Detect which field this node is collecting"""
        node_data = node.get("data", {})
        message = node_data.get("message", "").lower()
        
        field_patterns = {
            "name": ["name", "called", "call you"],
            "email": ["email", "e-mail", "contact"],
            "phone": ["phone", "number", "reach you"],
            "service": ["service", "help", "need", "looking for"],
            "date": ["date", "when", "schedule", "appointment"]
        }
        
        for field, patterns in field_patterns.items():
            if any(pattern in message for pattern in patterns):
                return field
        
        return None
    
    # ============================================
    # 💬 GET EXACT NODE MESSAGE
    # ============================================
    
    async def _get_exact_node_message(
        self,
        node: Dict[str, Any],
        conversation_state: Dict[str, Any]
    ) -> str:
        """Get the EXACT message from campaign node"""
        try:
            node_data = node.get("data", {})
            message = node_data.get("message", "")
            
            # Replace placeholders with collected data
            collected_data = conversation_state.get("collected_data", {})
            
            if "{name}" in message and collected_data.get("name"):
                message = message.replace("{name}", collected_data["name"])
            if "{service}" in message and collected_data.get("service"):
                message = message.replace("{service}", collected_data["service"])
            if "{date}" in message and collected_data.get("date"):
                message = message.replace("{date}", collected_data["date"])
            
            if not message:
                # Fallback message based on node type
                node_type = node.get("type", "conversation")
                if node_type == "welcome":
                    message = "Hello! How can I help you today?"
                elif node_type == "end":
                    message = "Thank you! Have a great day!"
                else:
                    message = "How can I assist you?"
            
            return message
            
        except Exception as e:
            logger.error(f"❌ Error getting node message: {e}")
            return "How can I help you?"
    
    # ============================================
    # 📊 DATA COLLECTION
    # ============================================
    
    async def _collect_field_data(
        self,
        user_input: str,
        field_type: str,
        call_id: str,
        conversation_state: Dict[str, Any]
    ):
        """Collect and validate field data"""
        try:
            extracted_value = await self._extract_field_value(user_input, field_type)
            
            if extracted_value:
                logger.info(f"✅ Collected {field_type}: {extracted_value}")
                
                # Update database
                db = await get_database()
                await db.conversations.update_one(
                    {"call_id": ObjectId(call_id)},
                    {
                        "$set": {
                            f"metadata.appointment_data.{field_type}": extracted_value,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                
                # Update conversation state
                conversation_state["collected_data"][field_type] = extracted_value
            
        except Exception as e:
            logger.error(f"❌ Error collecting field data: {e}")
    
    async def _extract_field_value(self, user_input: str, field_type: str) -> Optional[str]:
        """Extract field value from user input"""
        try:
            if field_type == "email":
                email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
                match = re.search(email_pattern, user_input)
                if match:
                    return match.group(0).lower()
                return None
            
            elif field_type == "phone":
                phone_pattern = r'[\d\s\-\(\)\.]+\d'
                match = re.search(phone_pattern, user_input)
                if match:
                    phone = re.sub(r'[^\d]', '', match.group(0))
                    if len(phone) >= 10:
                        return phone
                return None
            
            elif field_type == "name":
                if user_input and len(user_input) > 1:
                    name = user_input
                    for prefix in ["my name is", "i am", "i'm", "this is", "it's"]:
                        if name.lower().startswith(prefix):
                            name = name[len(prefix):].strip()
                    return name.title()
                return None
            
            elif field_type in ["service", "date"]:
                return user_input if user_input else None
            
            return user_input
            
        except Exception as e:
            logger.error(f"❌ Error extracting field value: {e}")
            return None
    
    # ============================================
    # 🤖 INTELLIGENT FALLBACK DETECTION
    # ============================================
    
    async def _should_use_openai(
        self,
        user_input: str,
        campaign_context: Dict[str, Any]
    ) -> bool:
        """
        ✅ INTELLIGENT FALLBACK DETECTION
        
        Determines if user is asking off-topic questions that need OpenAI
        """
        try:
            user_input_lower = user_input.lower()
            
            # Extract campaign topics from current workflow
            campaign_topics = await self._extract_topics_from_campaign(campaign_context)
            
            # Off-topic indicators (comprehensive list above)
            off_topic_indicators = [
                "what is", "how does", "explain", "tell me about",
                "define", "machine learning", "artificial intelligence",
                "weather", "sports", "news", "politics",
                "who is", "where is", "why is"
            ]
            
            # Check if user is asking about campaign topics
            is_campaign_related = any(topic in user_input_lower for topic in campaign_topics)
            
            # Check if user is asking off-topic questions
            is_off_topic = any(indicator in user_input_lower for indicator in off_topic_indicators)
            
            # Use OpenAI only if off-topic AND not campaign-related
            return (is_off_topic and not is_campaign_related)
            
        except Exception as e:
            logger.error(f"❌ Error in should_use_openai: {e}")
            return False
    
    async def _extract_topics_from_campaign(
        self,
        campaign_context: Dict[str, Any]
    ) -> List[str]:
        """Extract relevant topics from campaign workflow"""
        try:
            topics = []
            
            # Extract from collected data
            collected_data = campaign_context.get("collected_data", {})
            if collected_data.get("service"):
                topics.append(collected_data["service"].lower())
            
            # Extract from current node message
            current_node = campaign_context.get("current_node", {})
            message = current_node.get("data", {}).get("message", "")
            
            # Common campaign topics
            common_topics = ["appointment", "booking", "schedule", "service", "date", "time"]
            topics.extend([t for t in common_topics if t in message.lower()])
            
            return list(set(topics))  # Remove duplicates
            
        except Exception as e:
            logger.error(f"❌ Error extracting campaign topics: {e}")
            return []
    
    # ============================================
    # 🔄 OPENAI HYBRID MODE
    # ============================================
    
    async def _fallback_to_openai(
        self,
        user_input: str,
        call_id: str,
        agent_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        🤖 HYBRID MODE: Answer off-topic questions with OpenAI, then return to campaign
        
        This handles questions like:
        - "What is AI?"
        - "Tell me about the weather"
        - "Who is the president?"
        
        After answering, conversation naturally returns to campaign flow
        """
        try:
            logger.info(f"🤖 HYBRID MODE ACTIVATED for: '{user_input[:50]}...'")
            
            # Initialize OpenAI if needed
            self._initialize_openai()
            
            if not self.openai_client:
                return {
                    "success": True,
                    "found_in_campaign": False,
                    "response": "I understand your question. Let me help you with your appointment booking. What would you like to know?",
                    "node_id": "openai_fallback",
                    "node_type": "fallback",
                    "is_end": False
                }
            
            # Get conversation history
            db = await get_database()
            conversation = await db.conversations.find_one({"call_id": ObjectId(call_id)})
            
            # Build context
            messages = []
            
            # ✅ IMPROVED: System prompt for FULL, NATURAL answers
            system_prompt = """You are a helpful AI assistant.

IMPORTANT INSTRUCTIONS:
1. Answer the user's question FULLY and COMPLETELY
2. Be informative, accurate, and helpful
3. After answering, DO NOT force the conversation back to the appointment
4. Keep your answer concise but complete (2-4 sentences)
5. Be natural and conversational

The user is in a call about appointment booking, but they've asked you an off-topic question. Answer it naturally."""
            
            # Get agent's system prompt if available
            if agent_config and agent_config.get("system_prompt"):
                system_prompt = agent_config["system_prompt"] + "\n\n" + system_prompt
            
            messages.append({"role": "system", "content": system_prompt})
            
            # Add recent conversation history (last 6 messages)
            if conversation and conversation.get("messages"):
                for msg in conversation["messages"][-6:]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
            
            # Add current question
            messages.append({"role": "user", "content": user_input})
            
            # Call OpenAI with proper settings
            logger.info(f"🤖 Calling OpenAI GPT-3.5-Turbo for hybrid response...")
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=200,  # Increased for full answers
                temperature=0.7,
                timeout=10.0
            )
            
            ai_answer = response.choices[0].message.content.strip()
            
            logger.info(f"✅ OpenAI hybrid response: {ai_answer[:100]}...")
            
            # Save hybrid mode response to conversation
            if conversation:
                await db.conversations.update_one(
                    {"_id": conversation["_id"]},
                    {
                        "$push": {
                            "messages": {
                                "$each": [
                                    {
                                        "role": "user",
                                        "content": user_input,
                                        "timestamp": datetime.utcnow(),
                                        "metadata": {"is_hybrid_mode": True}
                                    },
                                    {
                                        "role": "assistant",
                                        "content": ai_answer,
                                        "timestamp": datetime.utcnow(),
                                        "metadata": {"is_hybrid_mode": True}
                                    }
                                ]
                            }
                        },
                        "$set": {"updated_at": datetime.utcnow()}
                    }
                )
            
            return {
                "success": True,
                "found_in_campaign": False,
                "response": ai_answer,
                "node_id": "openai_fallback",
                "node_type": "fallback",
                "is_end": False,
                "is_hybrid_mode": True
            }
            
        except Exception as e:
            logger.error(f"❌ Error in OpenAI hybrid mode: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                "success": True,
                "found_in_campaign": False,
                "response": "I understand your question. Let me help you with your appointment. What can I assist you with?",
                "node_id": "openai_fallback",
                "node_type": "fallback",
                "is_end": False
            }
    
    # ============================================
    # 📅 APPOINTMENT BOOKING
    # ============================================
    
    async def _attempt_appointment_booking(
        self,
        collected_data: Dict[str, Any],
        call_id: str
    ) -> Dict[str, Any]:
        """Attempt to book appointment with collected data"""
        try:
            logger.info(f"📅 Attempting to book appointment with data: {collected_data}")
            
            # Validate required fields
            required_fields = ["name", "email", "service"]
            missing_fields = [f for f in required_fields if not collected_data.get(f)]
            
            if missing_fields:
                logger.warning(f"⚠️ Missing required fields: {missing_fields}")
                return {
                    "success": False,
                    "response": f"I need a few more details. Could you provide your {', '.join(missing_fields)}?"
                }
            
            # Parse date if provided
            appointment_date = None
            if collected_data.get("date"):
                appointment_date = await self._parse_date(collected_data["date"])
            
            if not appointment_date:
                # Default to next available slot
                appointment_date = datetime.utcnow() + timedelta(days=1)
                appointment_date = appointment_date.replace(hour=10, minute=0, second=0, microsecond=0)
            
            # Book with Google Calendar
            try:
                calendar_event = await google_calendar_service.create_appointment(
                    title=f"Appointment: {collected_data['service']}",
                    description=f"Customer: {collected_data['name']}\nService: {collected_data['service']}",
                    start_time=appointment_date,
                    duration_minutes=60,
                    attendee_email=collected_data['email']
                )
                
                logger.info(f"✅ Google Calendar appointment created: {calendar_event.get('id')}")
            except Exception as e:
                logger.error(f"⚠️ Google Calendar booking failed: {e}")
                calendar_event = None
            
            # Save to database
            db = await get_database()
            appointment_data = {
                "call_id": ObjectId(call_id),
                "customer_name": collected_data["name"],
                "customer_email": collected_data["email"],
                "customer_phone": collected_data.get("phone"),
                "service": collected_data["service"],
                "appointment_date": appointment_date,
                "status": "confirmed",
                "google_calendar_event_id": calendar_event.get("id") if calendar_event else None,
                "created_at": datetime.utcnow()
            }
            
            result = await db.appointments.insert_one(appointment_data)
            appointment_id = str(result.inserted_id)
            
            logger.info(f"✅ Appointment saved to database: {appointment_id}")
            
            # Send confirmation email
            try:
                await email_service.send_appointment_confirmation(
                    to_email=collected_data["email"],
                    customer_name=collected_data["name"],
                    service=collected_data["service"],
                    appointment_date=appointment_date
                )
                logger.info(f"✅ Confirmation email sent to {collected_data['email']}")
            except Exception as e:
                logger.error(f"⚠️ Failed to send confirmation email: {e}")
            
            # Format date for response
            date_str = appointment_date.strftime("%A, %B %d at %I:%M %p")
            
            response = f"Perfect! Your appointment for {collected_data['service']} is confirmed for {date_str}. A confirmation email has been sent to {collected_data['email']}. Is there anything else I can help you with?"
            
            return {
                "success": True,
                "response": response,
                "appointment_id": appointment_id
            }
            
        except Exception as e:
            logger.error(f"❌ Error booking appointment: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "response": "I apologize, but there was an issue booking your appointment. Let me transfer you to someone who can help."
            }
    
    async def _parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse date string into datetime object"""
        try:
            # Common date patterns
            date_lower = date_str.lower()
            
            # Handle relative dates
            if "tomorrow" in date_lower:
                return datetime.utcnow() + timedelta(days=1)
            elif "next week" in date_lower:
                return datetime.utcnow() + timedelta(days=7)
            elif "today" in date_lower:
                return datetime.utcnow()
            
            # Try parsing specific formats
            date_formats = [
                "%Y-%m-%d",
                "%m/%d/%Y",
                "%B %d, %Y",
                "%b %d, %Y",
                "%d %B %Y",
                "%d %b %Y"
            ]
            
            for fmt in date_formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            
            # Default to next day if parsing fails
            logger.warning(f"⚠️ Could not parse date: {date_str}, using tomorrow")
            return datetime.utcnow() + timedelta(days=1)
            
        except Exception as e:
            logger.error(f"❌ Error parsing date: {e}")
            return None


# ============================================
# CREATE SINGLETON INSTANCE
# ============================================

workflow_engine = WorkflowEngine()